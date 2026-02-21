'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import type { FamilyChartDatum } from '@/lib/transforms/family-chart-transform';

interface UseTreeDragDropOptions {
  data: FamilyChartDatum[];
  containerRef: React.RefObject<HTMLDivElement | null>;
  onDrop: (sourceId: string, targetId: string) => void;
  enabled: boolean;
}

/**
 * BFS to check if targetId is a descendant of ancestorId.
 * Prevents creating cycles when re-parenting.
 */
function isDescendant(
  ancestorId: string,
  targetId: string,
  dataMap: Map<string, FamilyChartDatum>,
): boolean {
  const visited = new Set<string>();
  const queue = [ancestorId];
  while (queue.length > 0) {
    const id = queue.shift()!;
    if (visited.has(id)) continue;
    visited.add(id);
    const person = dataMap.get(id);
    if (!person) continue;
    for (const childId of person.rels.children) {
      if (childId === targetId) return true;
      queue.push(childId);
    }
  }
  return false;
}

function findPersonCard(target: EventTarget | null, container: HTMLElement): HTMLElement | null {
  let node = target as HTMLElement | null;
  while (node && node !== container) {
    if (node.classList?.contains('f3-vn-card')) return node;
    node = node.parentElement;
  }
  return null;
}

const DRAG_THRESHOLD_PX = 5;

/**
 * Custom mouse-based drag-and-drop for re-parenting tree cards.
 *
 * Uses Alt+drag to disambiguate from family-chart's pan/zoom which also
 * listens on mousedown→mousemove. Without Alt held, mouse events pass
 * through to the library's pan handler as normal.
 */
export function useTreeDragDrop({ data, containerRef, onDrop, enabled }: UseTreeDragDropOptions) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragPersonId, setDragPersonId] = useState<string | null>(null);
  const dataMapRef = useRef(new Map<string, FamilyChartDatum>());

  // Mutable refs for drag state (avoids re-renders during drag)
  const sourceIdRef = useRef<string | null>(null);
  const sourceCardRef = useRef<HTMLElement | null>(null);
  const lastDropTargetRef = useRef<HTMLElement | null>(null);
  const ghostRef = useRef<HTMLElement | null>(null);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const dragActiveRef = useRef(false);

  useEffect(() => {
    dataMapRef.current = new Map(data.map((d) => [d.id, d]));
  }, [data]);

  const clearDropTargetHighlight = useCallback(() => {
    if (lastDropTargetRef.current) {
      lastDropTargetRef.current.classList.remove('f3-card-drop-target', 'f3-card-drop-invalid');
      lastDropTargetRef.current = null;
    }
  }, []);

  const removeGhost = useCallback(() => {
    if (ghostRef.current) {
      ghostRef.current.remove();
      ghostRef.current = null;
    }
  }, []);

  const cleanup = useCallback(() => {
    sourceCardRef.current?.classList.remove('f3-card-dragging');
    clearDropTargetHighlight();
    removeGhost();
    sourceIdRef.current = null;
    sourceCardRef.current = null;
    startPosRef.current = null;
    dragActiveRef.current = false;
    setDragPersonId(null);
    setIsDragging(false);
  }, [clearDropTargetHighlight, removeGhost]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !enabled) return;

    function handleMouseDown(e: MouseEvent) {
      // Only activate when Alt key is held — lets library handle normal pan
      if (!e.altKey || e.button !== 0) return;

      const card = findPersonCard(e.target, el!);
      if (!card) return;
      const pid = card.getAttribute('data-person-id');
      if (!pid) return;

      // Prevent library from starting pan when we're about to drag
      e.preventDefault();
      e.stopPropagation();

      sourceIdRef.current = pid;
      sourceCardRef.current = card;
      startPosRef.current = { x: e.clientX, y: e.clientY };
      dragActiveRef.current = false;
    }

    function handleMouseMove(e: MouseEvent) {
      if (!sourceIdRef.current || !startPosRef.current) return;

      const dx = e.clientX - startPosRef.current.x;
      const dy = e.clientY - startPosRef.current.y;

      // Wait for threshold before starting visual drag
      if (!dragActiveRef.current) {
        if (Math.abs(dx) < DRAG_THRESHOLD_PX && Math.abs(dy) < DRAG_THRESHOLD_PX) return;
        dragActiveRef.current = true;
        setIsDragging(true);
        setDragPersonId(sourceIdRef.current);
        sourceCardRef.current?.classList.add('f3-card-dragging');

        const card = sourceCardRef.current;
        if (card) {
          const ghost = card.cloneNode(true) as HTMLElement;
          ghost.classList.add('f3-card-ghost');
          ghost.style.position = 'fixed';
          ghost.style.pointerEvents = 'none';
          ghost.style.zIndex = '10000';
          ghost.style.opacity = '0.7';
          ghost.style.width = `${card.offsetWidth}px`;
          ghost.style.transform = 'rotate(2deg)';
          document.body.appendChild(ghost);
          ghostRef.current = ghost;
        }
      }

      e.preventDefault();
      e.stopPropagation();

      if (ghostRef.current) {
        ghostRef.current.style.left = `${e.clientX - 40}px`;
        ghostRef.current.style.top = `${e.clientY - 20}px`;
      }

      const elemUnder = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      const card = elemUnder ? findPersonCard(elemUnder, el!) : null;
      const targetId = card?.getAttribute('data-person-id') ?? null;

      if (!card || !targetId || targetId === sourceIdRef.current) {
        clearDropTargetHighlight();
        return;
      }

      if (lastDropTargetRef.current !== card) {
        clearDropTargetHighlight();
        lastDropTargetRef.current = card;

        const dataMap = dataMapRef.current;
        const targetPerson = dataMap.get(targetId);
        const isAlreadyChild = targetPerson?.rels.children.includes(sourceIdRef.current!);
        const wouldCycle = isDescendant(sourceIdRef.current!, targetId, dataMap);

        if (isAlreadyChild || wouldCycle) {
          card.classList.add('f3-card-drop-invalid');
        } else {
          card.classList.add('f3-card-drop-target');
        }
      }
    }

    function handleMouseUp(e: MouseEvent) {
      if (!sourceIdRef.current) return;

      if (dragActiveRef.current) {
        e.preventDefault();
        e.stopPropagation();

        const elemUnder = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
        const card = elemUnder ? findPersonCard(elemUnder, el!) : null;
        const targetId = card?.getAttribute('data-person-id') ?? null;
        const sourceId = sourceIdRef.current;

        if (targetId && sourceId && targetId !== sourceId) {
          const dataMap = dataMapRef.current;
          const targetPerson = dataMap.get(targetId);
          const isAlreadyChild = targetPerson?.rels.children.includes(sourceId);
          const wouldCycle = isDescendant(sourceId, targetId, dataMap);

          if (!isAlreadyChild && !wouldCycle) {
            onDrop(sourceId, targetId);
          }
        }
      }

      cleanup();
    }

    function handleKeyUp(e: KeyboardEvent) {
      if (e.key === 'Alt' && sourceIdRef.current) {
        cleanup();
      }
    }

    // Use capture phase so we intercept before library's handlers
    el.addEventListener('mousedown', handleMouseDown, true);
    window.addEventListener('mousemove', handleMouseMove, true);
    window.addEventListener('mouseup', handleMouseUp, true);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      el.removeEventListener('mousedown', handleMouseDown, true);
      window.removeEventListener('mousemove', handleMouseMove, true);
      window.removeEventListener('mouseup', handleMouseUp, true);
      window.removeEventListener('keyup', handleKeyUp);
      cleanup();
    };
  }, [enabled, containerRef, onDrop, clearDropTargetHighlight, removeGhost, cleanup]);

  return { isDragging, dragPersonId };
}

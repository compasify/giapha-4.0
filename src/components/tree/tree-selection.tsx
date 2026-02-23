'use client';

import { useCallback, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { FamilyChartDatum } from '@/lib/transforms/family-chart-transform';

// ── Types ────────────────────────────────────────────────────────────────────

export type SelectionMode = 'individual' | 'subtree';

export interface TreeSelectionProps {
  /** Chart container element to attach event delegation to */
  chartContainer: HTMLElement | null;
  /** Full chart data for subtree traversal */
  data: FamilyChartDatum[];
  /** Currently selected person IDs */
  selectedIds: Set<string>;
  /** Callback when selection changes */
  onSelectionChange: (ids: Set<string>) => void;
  /** Selection mode */
  mode: SelectionMode;
  /** Callback to toggle mode */
  onModeChange: (mode: SelectionMode) => void;
}

// ── Subtree utility ──────────────────────────────────────────────────────────

/**
 * BFS to collect a person and all their descendants.
 * Returns a Set of person IDs in the subtree.
 */
export function getSubtreeIds(rootId: string, data: FamilyChartDatum[]): Set<string> {
  const childrenMap = new Map<string, string[]>();
  for (const datum of data) {
    childrenMap.set(datum.id, datum.rels.children);
  }

  const result = new Set<string>();
  const queue = [rootId];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (result.has(current)) continue;
    result.add(current);

    const children = childrenMap.get(current) ?? [];
    for (const child of children) {
      if (!result.has(child)) queue.push(child);
    }
  }

  return result;
}

// ── Selection CSS class management ────────────────────────────────────────────

const SELECTED_CLASS = 'f3-vn-card-selected';

function applySelectionVisuals(container: HTMLElement, selectedIds: Set<string>) {
  const cards = container.querySelectorAll('.f3-vn-card[data-person-id]');
  for (const card of cards) {
    const personId = (card as HTMLElement).dataset.personId;
    if (personId && selectedIds.has(personId)) {
      card.classList.add(SELECTED_CLASS);
    } else {
      card.classList.remove(SELECTED_CLASS);
    }
  }
}

// ── Component ───────────────────────────────────────────────────────────────

export function TreeSelectionOverlay({
  chartContainer,
  data,
  selectedIds,
  onSelectionChange,
  mode,
  onModeChange,
}: TreeSelectionProps) {
  const modeRef = useRef(mode);
  const dataRef = useRef(data);
  const selectedRef = useRef(selectedIds);
  const onChangeRef = useRef(onSelectionChange);
  useEffect(() => {
    modeRef.current = mode;
    dataRef.current = data;
    selectedRef.current = selectedIds;
    onChangeRef.current = onSelectionChange;
  });

  const handleCardClick = useCallback((e: MouseEvent) => {
    const card = (e.target as HTMLElement).closest('.f3-vn-card[data-person-id]');
    if (!card) return;

    const personId = (card as HTMLElement).dataset.personId;
    if (!personId) return;

    // Prevent chart from processing this click when in selection mode
    e.stopPropagation();

    const next = new Set(selectedRef.current);

    if (modeRef.current === 'subtree') {
      const subtreeIds = getSubtreeIds(personId, dataRef.current);
      const allSelected = [...subtreeIds].every((id) => next.has(id));

      if (allSelected) {
        for (const id of subtreeIds) next.delete(id);
      } else {
        for (const id of subtreeIds) next.add(id);
      }
    } else {
      if (next.has(personId)) {
        next.delete(personId);
      } else {
        next.add(personId);
      }
    }

    onChangeRef.current(next);
  }, []);

  // Attach click handler via event delegation on chart container
  useEffect(() => {
    if (!chartContainer) return;
    chartContainer.addEventListener('click', handleCardClick, { capture: true });
    return () => chartContainer.removeEventListener('click', handleCardClick, { capture: true });
  }, [chartContainer, handleCardClick]);

  // Sync visual highlights whenever selection changes
  useEffect(() => {
    if (!chartContainer) return;
    applySelectionVisuals(chartContainer, selectedIds);
  }, [chartContainer, selectedIds]);

  const count = selectedIds.size;

  return (
    <div className="flex items-center gap-2 p-2 bg-background/80 backdrop-blur-sm rounded-lg border shadow-sm">
      <Badge variant={count > 0 ? 'default' : 'secondary'}>
        {count} người đã chọn
      </Badge>

      <div className="flex gap-1">
        <Button
          variant={mode === 'individual' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onModeChange('individual')}
        >
          Chọn từng người
        </Button>
        <Button
          variant={mode === 'subtree' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onModeChange('subtree')}
        >
          Chọn nhánh
        </Button>
      </div>

      {count > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSelectionChange(new Set())}
        >
          Xóa chọn
        </Button>
      )}
    </div>
  );
}
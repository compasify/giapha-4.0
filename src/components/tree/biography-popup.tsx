'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { FamilyChartDatum } from '@/lib/transforms/family-chart-transform';

interface BiographyPopupProps {
  container: HTMLElement | null;
  data: FamilyChartDatum[];
}

interface PopupState {
  personId: string;
  x: number;
  y: number;
}

const HOVER_DELAY = 500;

export function BiographyPopup({ container, data }: BiographyPopupProps) {
  const [popup, setPopup] = useState<PopupState | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const clearTimer = useCallback(() => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  }, []);

  useEffect(() => {
    if (!container) return;

    function findCardElement(target: EventTarget | null): HTMLElement | null {
      let el = target as HTMLElement | null;
      while (el && el !== container) {
        if (el.classList?.contains('f3-vn-card')) return el;
        el = el.parentElement;
      }
      return null;
    }

    function handleMouseOver(e: MouseEvent) {
      const card = findCardElement(e.target);
      if (!card) return;

      const personId = card.getAttribute('data-person-id');
      if (!personId) return;

      clearTimer();
      hoverTimer.current = setTimeout(() => {
        const rect = card.getBoundingClientRect();
        const containerRect = container!.getBoundingClientRect();
        setPopup({
          personId,
          x: rect.right - containerRect.left + 8,
          y: rect.top - containerRect.top,
        });
      }, HOVER_DELAY);
    }

    function handleMouseOut(e: MouseEvent) {
      const card = findCardElement(e.target);
      const related = findCardElement(e.relatedTarget);
      if (card && !related) {
        clearTimer();
        setPopup((prev) => {
          if (!prev) return null;
          const popupEl = popupRef.current;
          if (popupEl?.contains(e.relatedTarget as Node)) return prev;
          return null;
        });
      }
    }

    container.addEventListener('mouseover', handleMouseOver);
    container.addEventListener('mouseout', handleMouseOut);

    return () => {
      container.removeEventListener('mouseover', handleMouseOver);
      container.removeEventListener('mouseout', handleMouseOut);
      clearTimer();
    };
  }, [container, clearTimer]);

  if (!popup) return null;

  const person = data.find((d) => d.id === popup.personId);
  if (!person) return null;

  const { biography, notes, birth_place, death_place } = person.data;
  const hasContent = biography || notes || birth_place || death_place;
  if (!hasContent) return null;

  const fullName = [person.data.ho, person.data.ten_dem, person.data.ten]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={popupRef}
      className="absolute z-50 w-64 rounded-lg border bg-popover p-3 shadow-lg text-popover-foreground text-sm"
      style={{ left: popup.x, top: popup.y }}
      onMouseLeave={() => setPopup(null)}
    >
      <p className="font-semibold text-xs mb-2">{fullName}</p>

      {biography && (
        <div className="mb-2">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-0.5">
            Tiểu sử
          </p>
          <p className="text-xs leading-relaxed line-clamp-4">{biography}</p>
        </div>
      )}

      {notes && (
        <div className="mb-2">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-0.5">
            Ghi chú
          </p>
          <p className="text-xs leading-relaxed line-clamp-3">{notes}</p>
        </div>
      )}

      {(birth_place || death_place) && (
        <div className="text-[10px] text-muted-foreground space-y-0.5">
          {birth_place && <p>Nơi sinh: {birth_place}</p>}
          {death_place && <p>Nơi mất: {death_place}</p>}
        </div>
      )}
    </div>
  );
}

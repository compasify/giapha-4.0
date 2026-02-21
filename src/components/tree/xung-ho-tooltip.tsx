'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { X, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { FamilyChartDatum } from '@/lib/transforms/family-chart-transform';
import { calculateKinship, type KinshipResult } from '@/lib/xung-ho';

interface XungHoTooltipProps {
  data: FamilyChartDatum[];
  container: HTMLElement | null;
  selectedPersonId: string | null;
}

export function XungHoTooltip({ data, container, selectedPersonId }: XungHoTooltipProps) {
  const [result, setResult] = useState<KinshipResult | null>(null);
  const [personAId, setPersonAId] = useState<string | null>(null);
  const [personBId, setPersonBId] = useState<string | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  const dismiss = useCallback(() => {
    setResult(null);
    setPersonAId(null);
    setPersonBId(null);
  }, []);

  useEffect(() => {
    const el = container;
    if (!el) return;

    function findPersonId(target: EventTarget | null): string | null {
      let node = target as HTMLElement | null;
      while (node && node !== el) {
        if (node.classList?.contains('f3-vn-card')) return node.getAttribute('data-person-id');
        node = node.parentElement;
      }
      return null;
    }

    function handleClick(e: MouseEvent) {
      if (!e.shiftKey) return;
      const pid = findPersonId(e.target);
      if (!pid || !selectedPersonId || pid === selectedPersonId) return;

      e.preventDefault();
      e.stopPropagation();

      const kinship = calculateKinship(selectedPersonId, pid, data);
      if (kinship) {
        setPersonAId(selectedPersonId);
        setPersonBId(pid);
        setResult(kinship);
        setPosition({ x: e.clientX, y: e.clientY });
      }
    }

    el.addEventListener('click', handleClick, { capture: true });
    return () => el.removeEventListener('click', handleClick, { capture: true });
  }, [container, data, selectedPersonId]);

  useEffect(() => {
    if (!result) return;
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') dismiss();
    }
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [result, dismiss]);

  if (!result || !personAId || !personBId) return null;

  const personA = data.find((d) => d.id === personAId);
  const personB = data.find((d) => d.id === personBId);
  if (!personA || !personB) return null;

  const nameA = personA.data.full_name || personA.data.ten;
  const nameB = personB.data.full_name || personB.data.ten;

  return (
    <div
      ref={tooltipRef}
      className="fixed z-50 max-w-xs rounded-lg border bg-popover p-3 shadow-lg animate-in fade-in-0 zoom-in-95"
      style={{
        left: `${Math.min(position.x, window.innerWidth - 300)}px`,
        top: `${Math.min(position.y + 10, window.innerHeight - 120)}px`,
      }}
      role="tooltip"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          Xưng hô
        </div>
        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={dismiss}>
          <X className="h-3 w-3" />
        </Button>
      </div>
      <div className="mt-1.5 space-y-1">
        <p className="text-sm font-semibold text-foreground">{result.term}</p>
        <p className="text-xs text-muted-foreground">{result.description}</p>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground/70">
          <span className="truncate max-w-[100px]">{nameA}</span>
          <span>→</span>
          <span className="truncate max-w-[100px]">{nameB}</span>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { X, Users, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { FamilyChartDatum } from '@/lib/transforms/family-chart-transform';
import { calculateKinship, type KinshipResult } from '@/lib/xung-ho';

interface XungHoPanelProps {
  data: FamilyChartDatum[];
  container: HTMLElement | null;
}

export function XungHoPanel({ data, container }: XungHoPanelProps) {
  const [personAId, setPersonAId] = useState<string | null>(null);
  const [personBId, setPersonBId] = useState<string | null>(null);
  const [activeSlot, setActiveSlot] = useState<'A' | 'B' | null>(null);
  const [result, setResult] = useState<KinshipResult | null>(null);
  const [isOpen, setIsOpen] = useState(true);

  // Reset when data changes (e.g. tree switches)
  useEffect(() => {
    setPersonAId(null);
    setPersonBId(null);
    setActiveSlot(null);
    setResult(null);
  }, [data]);

  // Auto-calculate when both slots are filled
  useEffect(() => {
    if (personAId && personBId) {
      const kinship = calculateKinship(personAId, personBId, data);
      setResult(kinship);
    } else {
      setResult(null);
    }
  }, [personAId, personBId, data]);

  // Click handler: only active when a slot is being selected
  useEffect(() => {
    const el = container;
    if (!el || activeSlot === null) return;

    function findPersonId(target: EventTarget | null): string | null {
      let node = target as HTMLElement | null;
      while (node && node !== el) {
        if (node.classList?.contains('f3-vn-card')) return node.getAttribute('data-person-id');
        node = node.parentElement;
      }
      return null;
    }

    function handleClick(e: MouseEvent) {
      const pid = findPersonId(e.target);
      if (!pid) return;
      e.preventDefault();
      e.stopPropagation();

      if (activeSlot === 'A') {
        if (pid === personBId) return; // prevent A === B
        setPersonAId(pid);
        setActiveSlot('B'); // auto-advance to slot B
      } else if (activeSlot === 'B') {
        if (pid === personAId) return; // prevent A === B
        setPersonBId(pid);
        setActiveSlot(null); // done selecting
      }
    }

    el.addEventListener('click', handleClick, { capture: true });
    return () => el.removeEventListener('click', handleClick, { capture: true });
  }, [container, activeSlot, personAId, personBId]);

  const personA = personAId ? data.find((d) => d.id === personAId) : null;
  const personB = personBId ? data.find((d) => d.id === personBId) : null;
  const nameA = personA ? (personA.data.full_name || personA.data.ten || personAId) : null;
  const nameB = personB ? (personB.data.full_name || personB.data.ten || personBId) : null;

  const dismiss = () => {
    setPersonAId(null);
    setPersonBId(null);
    setActiveSlot(null);
    setResult(null);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-50 flex items-center gap-1.5 rounded-full bg-background border shadow-md px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <Users className="h-3.5 w-3.5" />
        Xưng hô
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-4 left-4 z-50 w-64 rounded-lg border bg-popover shadow-lg"
      role="complementary"
      aria-label="Xưng hô"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <Users className="h-3.5 w-3.5 text-muted-foreground" />
          Xưng hô
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5 -mr-1"
          onClick={() => { dismiss(); setIsOpen(false); }}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>

      {/* Body */}
      <div className="p-3 space-y-2">
        {/* Slot A */}
        <button
          className={`w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors border ${
            activeSlot === 'A'
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-transparent bg-muted/50 hover:bg-muted text-foreground'
          }`}
          onClick={() => setActiveSlot('A')}
          title="Nhấn để chọn người A"
        >
          <Badge variant="outline" className="shrink-0 h-4 px-1 text-[10px]">A</Badge>
          <span className={`truncate flex-1 ${!nameA ? 'text-muted-foreground' : ''}`}>
            {activeSlot === 'A' ? 'Đang chọn...' : (nameA ?? 'Click để chọn')}
          </span>
          {nameA && activeSlot !== 'A' && (
            <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground" />
          )}
        </button>

        <div className="flex justify-center text-muted-foreground/50 text-xs">↕</div>

        {/* Slot B */}
        <button
          className={`w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors border ${
            activeSlot === 'B'
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-transparent bg-muted/50 hover:bg-muted text-foreground'
          }`}
          onClick={() => setActiveSlot('B')}
          title="Nhấn để chọn người B"
        >
          <Badge variant="outline" className="shrink-0 h-4 px-1 text-[10px]">B</Badge>
          <span className={`truncate flex-1 ${!nameB ? 'text-muted-foreground' : ''}`}>
            {activeSlot === 'B' ? 'Đang chọn...' : (nameB ?? 'Click để chọn')}
          </span>
          {nameB && activeSlot !== 'B' && (
            <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground" />
          )}
        </button>

        {/* Start button when both slots empty */}
        {!personAId && !personBId && activeSlot === null && (
          <Button
            size="sm"
            variant="outline"
            className="w-full h-7 text-xs mt-1"
            onClick={() => setActiveSlot('A')}
          >
            Bắt đầu chọn
          </Button>
        )}

        {/* Result */}
        {result && personAId && personBId && (
          <div className="mt-1 pt-2 border-t space-y-1">
            <p className="text-[10px] text-muted-foreground">
              {nameA} gọi {nameB} là:
            </p>
            <p className="text-base font-bold text-foreground">{result.term}</p>
          </div>
        )}

        {/* No result found */}
        {personAId && personBId && !result && activeSlot === null && (
          <div className="mt-1 pt-2 border-t">
            <p className="text-[10px] text-muted-foreground italic">Không tìm thấy quan hệ</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Backward compatibility alias so tree-view.tsx still compiles without changes
export { XungHoPanel as XungHoTooltip };

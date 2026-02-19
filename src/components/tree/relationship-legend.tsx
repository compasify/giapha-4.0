'use client';

import { useState } from 'react';
import { Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LEGEND_ITEMS = [
  { label: 'Ruột', className: 'link-biological', color: 'var(--tree-link-default)', dash: 'none' },
  { label: 'Con nuôi', className: 'link-adoptive', color: 'var(--tree-link-adoptive)', dash: '8,4' },
  { label: 'Con riêng', className: 'link-step', color: 'var(--tree-link-step)', dash: '12,4' },
  { label: 'Kết nghĩa', className: 'link-sworn', color: 'var(--tree-link-sworn)', dash: '2,4' },
  { label: 'Hôn nhân', className: 'link-spouse', color: 'var(--tree-link-spouse)', dash: 'none' },
] as const;

export function RelationshipLegend() {
  const [expanded, setExpanded] = useState(false);

  if (!expanded) {
    return (
      <div className="absolute bottom-4 left-4 z-10">
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => setExpanded(true)}
          title="Chú thích đường nối"
          className="bg-background/80 backdrop-blur-sm"
        >
          <Info className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="absolute bottom-4 left-4 z-10 rounded-lg border bg-background/90 backdrop-blur-sm p-3 shadow-md min-w-[160px]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-foreground">Chú thích</span>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setExpanded(false)}
          className="h-5 w-5"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
      <div className="flex flex-col gap-1.5">
        {LEGEND_ITEMS.map((item) => (
          <div key={item.className} className="flex items-center gap-2">
            <svg width="28" height="8" className="flex-shrink-0">
              <line
                x1="0" y1="4" x2="28" y2="4"
                stroke={item.color}
                strokeWidth={item.className === 'link-spouse' ? 2 : 1.5}
                strokeDasharray={item.dash}
              />
            </svg>
            <span className="text-[10px] text-muted-foreground leading-none">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

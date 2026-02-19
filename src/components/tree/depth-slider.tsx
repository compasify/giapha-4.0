'use client';

import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';
import type { FamilyChartDatum } from '@/lib/transforms/family-chart-transform';

interface DepthSliderProps {
  value: number;
  max: number;
  onChange: (depth: number) => void;
}

const MIN_DEPTH = 1;

export function DepthSlider({ value, max, onChange }: DepthSliderProps) {
  if (max <= 1) return null;

  const displayMax = Math.min(max, 20);

  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-muted-foreground whitespace-nowrap">Đời:</span>
      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => onChange(Math.max(MIN_DEPTH, value - 1))}
        disabled={value <= MIN_DEPTH}
      >
        <Minus className="h-3 w-3" />
      </Button>
      <span className="text-xs font-medium w-6 text-center tabular-nums">
        {value >= displayMax ? '∞' : value}
      </span>
      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => onChange(Math.min(displayMax, value + 1))}
        disabled={value >= displayMax}
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
}

export function getMaxGeneration(data: FamilyChartDatum[]): number {
  let maxGen = 0;
  for (const d of data) {
    const gen = d.data.generation_number;
    if (gen != null && gen > maxGen) maxGen = gen;
  }
  return maxGen || 1;
}

export function filterByDepth(data: FamilyChartDatum[], maxDepth: number): FamilyChartDatum[] {
  const maxGen = getMaxGeneration(data);
  if (maxDepth >= maxGen) return data;

  return data.filter((d) => {
    const gen = d.data.generation_number;
    if (gen == null) return true;
    return gen <= maxDepth;
  });
}

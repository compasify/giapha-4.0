'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import type { LineageSource } from '@/lib/transforms/merge-lineages';

interface CombinedLegendProps {
  sources: LineageSource[];
}

export function CombinedLegend({ sources }: CombinedLegendProps) {
  const [visible, setVisible] = useState(true);

  if (sources.length === 0) return null;

  return (
    <div className="absolute bottom-4 left-4 z-10">
      <Button
        variant="outline"
        size="icon"
        className="h-7 w-7 mb-1"
        onClick={() => setVisible((v) => !v)}
        title={visible ? 'Ẩn chú thích' : 'Hiện chú thích'}
      >
        {visible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
      </Button>

      {visible && (
        <div className="bg-background/90 backdrop-blur-sm border rounded-lg p-2 shadow-sm space-y-1">
          {sources.map((s) => (
            <div key={s.lineageId} className="flex items-center gap-2 text-xs">
              <span
                className="h-3 w-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: s.color }}
              />
              <span className="truncate max-w-[120px]">{s.lineageName}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

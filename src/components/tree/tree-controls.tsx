'use client';

import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { FamilyChartInstance } from './family-tree';

interface TreeControlsProps {
  chart: FamilyChartInstance | null;
}

function getZoomBehavior(svg: SVGElement) {
  const d3Module = import('d3-selection');
  const d3Zoom = import('d3-zoom');
  return Promise.all([d3Module, d3Zoom]).then(([d3sel, d3z]) => {
    const sel = d3sel.select(svg);
    const currentTransform = d3z.zoomTransform(svg);
    return { sel, d3z, currentTransform };
  });
}

export function handleZoom(chart: FamilyChartInstance | null, scaleFactor: number) {
  if (!chart) return;
  getZoomBehavior(chart.svg).then(({ sel, d3z, currentTransform }) => {
    const zoom = d3z.zoom();
    const newTransform = currentTransform.scale(scaleFactor);
    sel.transition().duration(300).call(zoom.transform as never, newTransform);
  });
}

function handleFit(chart: FamilyChartInstance | null) {
  if (!chart) return;
  chart.updateTree({ tree_position: 'fit' });
}

export function TreeControls({ chart }: TreeControlsProps) {
  return (
    <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-1">
      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => handleZoom(chart, 1.3)}
        title="Phóng to"
        className="bg-background/80 backdrop-blur-sm"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => handleZoom(chart, 0.7)}
        title="Thu nhỏ"
        className="bg-background/80 backdrop-blur-sm"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => handleFit(chart)}
        title="Vừa khung hình"
        className="bg-background/80 backdrop-blur-sm"
      >
        <Maximize className="h-4 w-4" />
      </Button>
    </div>
  );
}

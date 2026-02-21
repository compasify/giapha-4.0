'use client';

import { useState } from 'react';
import { ZoomIn, ZoomOut, Maximize, Keyboard, Map as MapIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MiniMapPanel } from './mini-map';
import type { FamilyChartInstance } from './family-tree';

interface TreeControlsProps {
  chart: FamilyChartInstance | null;
  onShowShortcuts?: () => void;
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

const BTN = 'bg-background/80 backdrop-blur-sm';

export function TreeControls({ chart, onShowShortcuts }: TreeControlsProps) {
  const [miniMapOpen, setMiniMapOpen] = useState(false);

  return (
    <div className="absolute bottom-4 right-4 z-10 flex flex-col items-end gap-1">
      {miniMapOpen && (
        <MiniMapPanel chart={chart} onClose={() => setMiniMapOpen(false)} />
      )}
      <div className="flex flex-col gap-1">
        <Button variant="outline" size="icon-sm" onClick={() => setMiniMapOpen((p) => !p)} title="Bản đồ thu nhỏ" className={BTN}>
          <MapIcon className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon-sm" onClick={() => handleZoom(chart, 1.3)} title="Phóng to" className={BTN}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon-sm" onClick={() => handleZoom(chart, 0.7)} title="Thu nhỏ" className={BTN}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon-sm" onClick={() => handleFit(chart)} title="Vừa khung hình" className={BTN}>
          <Maximize className="h-4 w-4" />
        </Button>
        {onShowShortcuts && (
          <Button variant="outline" size="icon-sm" onClick={onShowShortcuts} title="Phím tắt (?)" className={BTN}>
            <Keyboard className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

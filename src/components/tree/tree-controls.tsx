'use client';

import { useState } from 'react';
import { ZoomIn, ZoomOut, Maximize, Keyboard, Map as MapIcon, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MiniMapPanel } from './mini-map';
import type { FamilyChartInstance } from './family-tree';

interface TreeControlsProps {
  chart: FamilyChartInstance | null;
  onShowShortcuts?: () => void;
  xungHoOpen?: boolean;
  onToggleXungHo?: () => void;
}

/**
 * Get the library's own zoom behavior from the f3Canvas element.
 * family-chart attaches zoom to #f3Canvas (svg.parentNode), not the SVG itself.
 */
export function getChartZoom(svg: SVGElement) {
  const zoomEl = (svg as unknown as { __zoomObj?: unknown }).__zoomObj
    ? svg
    : (svg.parentNode as HTMLElement);
  const zoomObj = (zoomEl as unknown as { __zoomObj: unknown }).__zoomObj;
  if (!zoomObj) return null;
  return { zoomEl, zoomObj };
}

export function handleZoom(chart: FamilyChartInstance | null, scaleFactor: number) {
  if (!chart) return;
  const z = getChartZoom(chart.svg);
  if (!z) return;

  import('d3-selection').then((d3sel) => {
    const sel = d3sel.select(z.zoomEl);
    sel.transition().duration(300).call((z.zoomObj as { scaleBy: never }).scaleBy, scaleFactor);
  });
}

function handleFit(chart: FamilyChartInstance | null) {
  if (!chart) return;
  chart.updateTree({ tree_position: 'fit' });
}

const BTN = 'bg-background/80 backdrop-blur-sm';

export function TreeControls({ chart, onShowShortcuts, xungHoOpen, onToggleXungHo }: TreeControlsProps) {
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
        {onToggleXungHo && (
          <Button variant="outline" size="icon-sm" onClick={onToggleXungHo} title="Xưng hô" className={`${BTN} ${xungHoOpen ? 'bg-primary/10 border-primary text-primary' : ''}`}>
            <Users className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

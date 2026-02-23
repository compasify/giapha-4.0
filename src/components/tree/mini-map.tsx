'use client';

import { useRef, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { FamilyChartInstance } from './family-tree';
import { getChartZoom } from './tree-controls';

interface MiniMapPanelProps {
  chart: FamilyChartInstance | null;
  onClose: () => void;
}

const MAP_WIDTH = 200;
const MAP_HEIGHT = 150;

export function MiniMapPanel({ chart, onClose }: MiniMapPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);

  /** Update viewport rect position only (lightweight, for animation frames) */
  const updateViewportRect = useCallback(() => {
    if (!chart?.svg || !viewportRef.current) return;

    const svg = chart.svg;
    const svgRect = svg.getBoundingClientRect();
    const gView = (svg.querySelector('g.view') || svg.querySelector('g')) as SVGGraphicsElement | null;
    if (!gView) return;

    const bbox = gView.getBBox();
    if (bbox.width === 0 || bbox.height === 0) return;

    const padding = 20;
    const contentWidth = bbox.width + padding * 2;
    const contentHeight = bbox.height + padding * 2;

    // Read current zoom transform from the d3 zoom element synchronously
    const z = getChartZoom(svg);
    let tx = 0, ty = 0, sc = 1;

    if (z) {
      // d3 stores __zoom on the zoom element — read it synchronously
      const stored = (z.zoomEl as unknown as { __zoom?: { x: number; y: number; k: number } }).__zoom;
      if (stored) {
        tx = stored.x;
        ty = stored.y;
        sc = stored.k;
      }
    }

    // Fallback: parse from SVG g.view transform attribute
    if (sc === 1 && tx === 0 && ty === 0) {
      const transform = gView.getAttribute('transform') || '';
      const translateMatch = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
      const scaleMatch = transform.match(/scale\(([^)]+)\)/);
      tx = translateMatch ? parseFloat(translateMatch[1]) : 0;
      ty = translateMatch ? parseFloat(translateMatch[2]) : 0;
      sc = scaleMatch ? parseFloat(scaleMatch[1]) : 1;
    }

    const vp = viewportRef.current;
    const vpWidth = (svgRect.width / sc / contentWidth) * MAP_WIDTH;
    const vpHeight = (svgRect.height / sc / contentHeight) * MAP_HEIGHT;
    const vpX = ((-tx / sc - bbox.x + padding) / contentWidth) * MAP_WIDTH;
    const vpY = ((-ty / sc - bbox.y + padding) / contentHeight) * MAP_HEIGHT;

    vp.style.left = `${Math.max(0, vpX)}px`;
    vp.style.top = `${Math.max(0, vpY)}px`;
    vp.style.width = `${Math.min(vpWidth, MAP_WIDTH)}px`;
    vp.style.height = `${Math.min(vpHeight, MAP_HEIGHT)}px`;
  }, [chart]);

  /** Full redraw: canvas cards/links + viewport rect */
  const updateMiniMap = useCallback(() => {
    if (!chart?.svg || !canvasRef.current || !viewportRef.current) return;

    const svg = chart.svg;
    const gView = (svg.querySelector('g.view') || svg.querySelector('g')) as SVGGraphicsElement | null;
    if (!gView) return;

    const bbox = gView.getBBox();
    if (bbox.width === 0 || bbox.height === 0) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const padding = 20;
    const contentWidth = bbox.width + padding * 2;
    const contentHeight = bbox.height + padding * 2;
    const scaleX = MAP_WIDTH / contentWidth;
    const scaleY = MAP_HEIGHT / contentHeight;
    const mapScale = Math.min(scaleX, scaleY);

    ctx.clearRect(0, 0, MAP_WIDTH, MAP_HEIGHT);

    // Draw cards — check both SVG and HTML containers
    const svgCards = svg.querySelectorAll('.card_cont');
    const f3Canvas = svg.parentElement;
    const htmlCards = f3Canvas?.querySelectorAll('#htmlSvg .card_cont');
    const cards = svgCards.length > 0 ? svgCards : (htmlCards ?? []);

    cards.forEach((card) => {
      let cx = 0, cy = 0, cw = 0, ch = 0;

      // SVG card: has rect child
      const cardRect = card.querySelector('rect');
      if (cardRect) {
        cx = parseFloat(cardRect.getAttribute('x') || '0');
        cy = parseFloat(cardRect.getAttribute('y') || '0');
        cw = parseFloat(cardRect.getAttribute('width') || '0');
        ch = parseFloat(cardRect.getAttribute('height') || '0');
      }

      // Read card position from transform attribute (SVG) or CSS transform (HTML)
      const parentTransform = card.getAttribute('transform') || '';
      const parentTranslate = parentTransform.match(/translate\(([^,]+),\s*([^)]+)\)/);
      let px = parentTranslate ? parseFloat(parentTranslate[1]) : 0;
      let py = parentTranslate ? parseFloat(parentTranslate[2]) : 0;

      // HTML card_cont uses CSS transform: translate(Xpx, Ypx)
      if (!parentTranslate && card instanceof HTMLElement) {
        const style = card.style.transform || '';
        const cssMatch = style.match(/translate\(([^p]+)px,\s*([^p]+)px\)/);
        if (cssMatch) {
          px = parseFloat(cssMatch[1]);
          py = parseFloat(cssMatch[2]);
        }
        // HTML cards have their own width/height
        const inner = card.querySelector('.card, .f3-vn-card') as HTMLElement | null;
        if (inner) {
          cw = cw || inner.offsetWidth || 220;
          ch = ch || inner.offsetHeight || 70;
          // HTML cards are centered: translate(-50%, -50%)
          cx = -cw / 2;
          cy = -ch / 2;
        }
      }

      if (cw === 0 || ch === 0) return;

      const drawX = (px + cx - bbox.x + padding) * mapScale;
      const drawY = (py + cy - bbox.y + padding) * mapScale;
      const drawW = Math.max(cw * mapScale, 2);
      const drawH = Math.max(ch * mapScale, 1.5);

      const isFemale = card.querySelector('.f3-card-female');
      ctx.fillStyle = isFemale ? '#ec4899' : '#3b82f6';
      ctx.globalAlpha = 0.7;
      ctx.fillRect(drawX, drawY, drawW, drawH);
    });
    ctx.globalAlpha = 1;

    const links = svg.querySelectorAll('path.link');
    if (links.length > 0) {
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = 0.4;
      links.forEach((link) => {
        const d = link.getAttribute('d');
        if (!d) return;
        const nums = d.match(/-?[\d.]+/g);
        if (!nums || nums.length < 4) return;
        const x1 = (parseFloat(nums[0]) - bbox.x + padding) * mapScale;
        const y1 = (parseFloat(nums[1]) - bbox.y + padding) * mapScale;
        const x2 = (parseFloat(nums[nums.length - 2]) - bbox.x + padding) * mapScale;
        const y2 = (parseFloat(nums[nums.length - 1]) - bbox.y + padding) * mapScale;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
    }

    // Also update viewport rect
    updateViewportRect();
  }, [chart, updateViewportRect]);

  useEffect(() => {
    if (!chart?.svg) return;

    updateMiniMap();

    // Schedule viewport-only updates via rAF for smooth tracking
    const scheduleViewportUpdate = () => {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = requestAnimationFrame(updateViewportRect);
    };

    // Observe SVG for structural changes (card add/remove, link redraw)
    const observer = new MutationObserver((mutations) => {
      const hasStructuralChange = mutations.some(
        (m) => m.type === 'childList' || (m.type === 'attributes' && m.attributeName !== 'transform'),
      );
      if (hasStructuralChange) {
        updateMiniMap();
      } else {
        // transform-only change → just move the viewport rect
        scheduleViewportUpdate();
      }
    });

    observer.observe(chart.svg, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ['transform'],
    });

    // Also observe #f3Canvas (zoom element) for transform changes from d3 zoom
    const f3Canvas = chart.svg.parentElement;
    let f3Observer: MutationObserver | null = null;
    if (f3Canvas) {
      f3Observer = new MutationObserver(scheduleViewportUpdate);
      f3Observer.observe(f3Canvas, {
        attributes: true,
        subtree: true,
        attributeFilter: ['transform', 'style'],
      });
    }

    return () => {
      observer.disconnect();
      f3Observer?.disconnect();
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [chart, updateMiniMap, updateViewportRect]);

  function handleMiniMapClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!chart?.svg) return;

    const z = getChartZoom(chart.svg);
    if (!z) return;

    const domRect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - domRect.left;
    const clickY = e.clientY - domRect.top;

    const gElement = (chart.svg.querySelector('g.view') || chart.svg.querySelector('g')) as SVGGraphicsElement | null;
    if (!gElement) return;

    const bbox = gElement.getBBox();
    const padding = 20;
    const contentWidth = bbox.width + padding * 2;
    const contentHeight = bbox.height + padding * 2;

    const svgRect = chart.svg.getBoundingClientRect();
    // Read current scale from the zoom element
    const stored = (z.zoomEl as unknown as { __zoom?: { k: number } }).__zoom;
    const sc = stored?.k ?? 1;

    const targetX = (clickX / MAP_WIDTH) * contentWidth + bbox.x - padding;
    const targetY = (clickY / MAP_HEIGHT) * contentHeight + bbox.y - padding;

    const newTx = -targetX * sc + svgRect.width / 2;
    const newTy = -targetY * sc + svgRect.height / 2;

    Promise.all([import('d3-selection'), import('d3-zoom')]).then(([d3sel, d3z]) => {
      const sel = d3sel.select(z.zoomEl);
      const newTransform = d3z.zoomIdentity.translate(newTx, newTy).scale(sc);
      sel.transition().duration(300).call((z.zoomObj as { transform: never }).transform, newTransform);
    });
  }

  return (
    <div className="rounded-lg border bg-background/90 backdrop-blur-sm shadow-md overflow-hidden mb-1">
      <div className="flex items-center justify-between px-2 py-1 border-b">
        <span className="text-[10px] font-medium text-muted-foreground">Bản đồ</span>
        <Button variant="ghost" size="icon-sm" onClick={onClose} className="h-5 w-5">
          <X className="h-3 w-3" />
        </Button>
      </div>
      <div
        className="relative cursor-crosshair"
        style={{ width: MAP_WIDTH, height: MAP_HEIGHT }}
        onClick={handleMiniMapClick}
      >
        <canvas ref={canvasRef} width={MAP_WIDTH} height={MAP_HEIGHT} className="block" />
        <div
          ref={viewportRef}
          className="absolute border-2 border-blue-500/60 bg-blue-500/10 pointer-events-none rounded-sm"
        />
      </div>
    </div>
  );
}

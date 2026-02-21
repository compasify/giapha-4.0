'use client';

import { useRef, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { FamilyChartInstance } from './family-tree';

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

  const updateMiniMap = useCallback(() => {
    if (!chart?.svg || !canvasRef.current || !viewportRef.current) return;

    const svg = chart.svg;
    const svgRect = svg.getBoundingClientRect();
    const gElement = svg.querySelector('g');
    if (!gElement) return;

    const bbox = gElement.getBBox();
    if (bbox.width === 0 || bbox.height === 0) return;

    const transform = gElement.getAttribute('transform') || '';
    const translateMatch = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
    const scaleMatch = transform.match(/scale\(([^)]+)\)/);

    const tx = translateMatch ? parseFloat(translateMatch[1]) : 0;
    const ty = translateMatch ? parseFloat(translateMatch[2]) : 0;
    const sc = scaleMatch ? parseFloat(scaleMatch[1]) : 1;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const padding = 20;
    const contentWidth = bbox.width + padding * 2;
    const contentHeight = bbox.height + padding * 2;
    const scaleX = MAP_WIDTH / contentWidth;
    const scaleY = MAP_HEIGHT / contentHeight;
    const mapScale = Math.min(scaleX, scaleY);

    ctx.clearRect(0, 0, MAP_WIDTH, MAP_HEIGHT);

    const cards = svg.querySelectorAll('.card_cont');
    cards.forEach((card) => {
      const cardRect = card.querySelector('rect');
      if (!cardRect) return;

      const cardX = parseFloat(cardRect.getAttribute('x') || '0');
      const cardY = parseFloat(cardRect.getAttribute('y') || '0');
      const cardW = parseFloat(cardRect.getAttribute('width') || '0');
      const cardH = parseFloat(cardRect.getAttribute('height') || '0');

      const parentTransform = card.getAttribute('transform') || '';
      const parentTranslate = parentTransform.match(/translate\(([^,]+),\s*([^)]+)\)/);
      const px = parentTranslate ? parseFloat(parentTranslate[1]) : 0;
      const py = parentTranslate ? parseFloat(parentTranslate[2]) : 0;

      const drawX = (px + cardX - bbox.x + padding) * mapScale;
      const drawY = (py + cardY - bbox.y + padding) * mapScale;
      const drawW = Math.max(cardW * mapScale, 2);
      const drawH = Math.max(cardH * mapScale, 1.5);

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

    const vpWidth = (svgRect.width / sc / contentWidth) * MAP_WIDTH;
    const vpHeight = (svgRect.height / sc / contentHeight) * MAP_HEIGHT;
    const vpX = ((-tx / sc - bbox.x + padding) / contentWidth) * MAP_WIDTH;
    const vpY = ((-ty / sc - bbox.y + padding) / contentHeight) * MAP_HEIGHT;

    const vp = viewportRef.current;
    vp.style.left = `${Math.max(0, vpX)}px`;
    vp.style.top = `${Math.max(0, vpY)}px`;
    vp.style.width = `${Math.min(vpWidth, MAP_WIDTH)}px`;
    vp.style.height = `${Math.min(vpHeight, MAP_HEIGHT)}px`;
  }, [chart]);

  useEffect(() => {
    if (!chart?.svg) return;

    updateMiniMap();

    const observer = new MutationObserver(() => {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = requestAnimationFrame(updateMiniMap);
    });

    observer.observe(chart.svg, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ['transform'],
    });

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [chart, updateMiniMap]);

  function handleMiniMapClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!chart?.svg) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const gElement = chart.svg.querySelector('g');
    if (!gElement) return;

    const bbox = gElement.getBBox();
    const padding = 20;
    const contentWidth = bbox.width + padding * 2;
    const contentHeight = bbox.height + padding * 2;

    const svgRect = chart.svg.getBoundingClientRect();
    const transform = gElement.getAttribute('transform') || '';
    const scaleMatch = transform.match(/scale\(([^)]+)\)/);
    const sc = scaleMatch ? parseFloat(scaleMatch[1]) : 1;

    const targetX = (clickX / MAP_WIDTH) * contentWidth + bbox.x - padding;
    const targetY = (clickY / MAP_HEIGHT) * contentHeight + bbox.y - padding;

    const newTx = -targetX * sc + svgRect.width / 2;
    const newTy = -targetY * sc + svgRect.height / 2;

    Promise.all([import('d3-selection'), import('d3-zoom')]).then(([d3sel, d3z]) => {
      const sel = d3sel.select(chart.svg);
      const zoom = d3z.zoom();
      const newTransform = d3z.zoomIdentity.translate(newTx, newTy).scale(sc);
      sel.transition().duration(300).call(zoom.transform as never, newTransform);
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

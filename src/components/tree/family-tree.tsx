'use client';

import { useRef, useEffect } from 'react';
import type { FamilyChartDatum, LinkCategory } from '@/lib/transforms/family-chart-transform';
import { observeLinkStyles } from '@/lib/utils/apply-link-styles';
import { vietnameseCardHtml } from './tree-card-template';
import { initEditTree, type EditTreeInstance } from './tree-edit-integration';

interface FamilyTreeProps {
  data: FamilyChartDatum[];
  linkMap?: Map<string, LinkCategory>;
  onPersonClick?: (personId: number) => void;
  onPersonDoubleClick?: (personId: number) => void;
  onChartReady?: (chart: FamilyChartInstance) => void;
  onEditReady?: (editTree: EditTreeInstance) => void;
}

export interface FamilyChartInstance {
  updateMainId: (id: string) => void;
  updateTree: (props?: { initial?: boolean; tree_position?: string }) => void;
  setOrientationHorizontal: () => FamilyChartInstance;
  setOrientationVertical: () => FamilyChartInstance;
  setPersonDropdown: (
    getLabel: (d: { data: { data: FamilyChartDatum['data'] } }) => string,
    config?: { cont?: HTMLElement; onSelect?: (id: string) => void; placeholder?: string }
  ) => FamilyChartInstance;
  svg: SVGElement;
  cont: HTMLElement;
}

interface F3Card {
  setCardInnerHtmlCreator: (fn: (d: unknown) => string) => F3Card;
  setStyle: (s: string) => F3Card;
  setOnCardClick: (fn: (e: Event, d: unknown) => void) => F3Card;
}

interface F3Chart extends FamilyChartInstance {
  setCardHtml: () => F3Card;
  setSingleParentEmptyCard: (show: boolean) => F3Chart;
  editTree: () => unknown;
}

interface F3Module {
  createChart: (el: HTMLElement, data: FamilyChartDatum[]) => F3Chart;
  default?: F3Module;
}

export function FamilyTree({ data, linkMap, onPersonClick, onPersonDoubleClick, onChartReady, onEditReady }: FamilyTreeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<FamilyChartInstance | null>(null);
  const linkObserverCleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!containerRef.current || chartRef.current) return;
    if (!data || data.length === 0) return;

    let cancelled = false;
    let editTreeInstance: EditTreeInstance | null = null;

    import('family-chart').then((mod) => {
      if (cancelled || !containerRef.current || chartRef.current) return;

      const f3 = (mod as F3Module).default ?? (mod as F3Module);
      const chart = f3.createChart(containerRef.current!, data);
      chart.setSingleParentEmptyCard(false);
      chartRef.current = chart;

      const card = chart.setCardHtml();
      card.setCardInnerHtmlCreator((d: unknown) =>
        vietnameseCardHtml(d as Parameters<typeof vietnameseCardHtml>[0])
      );
      card.setStyle('image-rect');

      let lastClickId = '';
      let lastClickTime = 0;
      card.setOnCardClick((_e: Event, d: unknown) => {
        const datum = d as { data: { id: string } };
        const id = datum.data.id;
        const now = Date.now();

        if (id === lastClickId && now - lastClickTime < 400) {
          onPersonDoubleClick?.(Number(id));
          lastClickId = '';
          lastClickTime = 0;
          return;
        }

        lastClickId = id;
        lastClickTime = now;
        chart.updateMainId(id);
        chart.updateTree({ tree_position: 'main_to_middle' });
        onPersonClick?.(Number(id));
      });

      chart.updateTree({ initial: true });
      onChartReady?.(chart);

      linkObserverCleanupRef.current = observeLinkStyles(chart.svg, linkMap ?? new Map());

      if (onEditReady) {
        editTreeInstance = initEditTree(chart as unknown as { editTree: () => EditTreeInstance });
        onEditReady(editTreeInstance);
      }
    });

    return () => {
      cancelled = true;
      linkObserverCleanupRef.current?.();
      linkObserverCleanupRef.current = null;
      editTreeInstance?.destroy();
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      chartRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div
      ref={containerRef}
      className="f3"
      style={{ width: '100%', height: '100%' }}
    />
  );
}

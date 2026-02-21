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
  updateData: (data: FamilyChartDatum[]) => FamilyChartInstance;
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
  setSortChildrenFunction: (fn: (a: { data: Record<string, unknown> }, b: { data: Record<string, unknown> }) => number) => F3Chart;
  editTree: () => unknown;
}

interface F3Module {
  createChart: (el: HTMLElement, data: FamilyChartDatum[]) => F3Chart;
  default?: F3Module;
}

function sortByBirthOrder(a: { data: Record<string, unknown> }, b: { data: Record<string, unknown> }): number {
  const orderA = (a.data.birth_order as number) ?? 0;
  const orderB = (b.data.birth_order as number) ?? 0;
  return orderA - orderB;
}

export function FamilyTree({ data, linkMap, onPersonClick, onPersonDoubleClick, onChartReady, onEditReady }: FamilyTreeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<FamilyChartInstance | null>(null);
  const linkObserverCleanupRef = useRef<(() => void) | null>(null);
  const f3ModuleRef = useRef<F3Module | null>(null);
  const editTreeRef = useRef<EditTreeInstance | null>(null);

  const onPersonClickRef = useRef(onPersonClick);
  onPersonClickRef.current = onPersonClick;
  const onPersonDoubleClickRef = useRef(onPersonDoubleClick);
  onPersonDoubleClickRef.current = onPersonDoubleClick;
  const onChartReadyRef = useRef(onChartReady);
  onChartReadyRef.current = onChartReady;
  const onEditReadyRef = useRef(onEditReady);
  onEditReadyRef.current = onEditReady;
  const linkMapRef = useRef(linkMap);
  linkMapRef.current = linkMap;

  useEffect(() => {
    if (!data || data.length === 0) return;

    if (chartRef.current) {
      chartRef.current.updateData(data);
      chartRef.current.updateTree({ tree_position: 'inherit' });
      return;
    }

    if (!containerRef.current) return;
    const container = containerRef.current;

    if (f3ModuleRef.current) {
      createChart(f3ModuleRef.current, container, data);
      return;
    }

    let cancelled = false;
    import('family-chart').then((mod) => {
      if (cancelled) return;
      const f3 = (mod as F3Module).default ?? (mod as F3Module);
      f3ModuleRef.current = f3;
      if (!chartRef.current && containerRef.current) {
        createChart(f3, containerRef.current, data);
      }
    });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  function createChart(f3: F3Module, container: HTMLElement, chartData: FamilyChartDatum[]) {
    const chart = f3.createChart(container, chartData);
    chart.setSingleParentEmptyCard(false);
    chart.setSortChildrenFunction(sortByBirthOrder);
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
        onPersonDoubleClickRef.current?.(Number(id));
        lastClickId = '';
        lastClickTime = 0;
        return;
      }

      lastClickId = id;
      lastClickTime = now;
      chart.updateMainId(id);
      chart.updateTree({ tree_position: 'main_to_middle' });
      onPersonClickRef.current?.(Number(id));
    });

    chart.updateTree({ initial: true });
    onChartReadyRef.current?.(chart);

    linkObserverCleanupRef.current = observeLinkStyles(chart.svg, linkMapRef.current ?? new Map());

    if (onEditReadyRef.current) {
      const et = initEditTree(chart as unknown as { editTree: () => EditTreeInstance });
      editTreeRef.current = et;
      onEditReadyRef.current(et);
    }
  }

  useEffect(() => {
    return () => {
      linkObserverCleanupRef.current?.();
      linkObserverCleanupRef.current = null;
      editTreeRef.current?.destroy();
      editTreeRef.current = null;
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      chartRef.current = null;
      f3ModuleRef.current = null;
    };
  }, []);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    linkObserverCleanupRef.current?.();
    linkObserverCleanupRef.current = observeLinkStyles(chart.svg, linkMap ?? new Map());

    return () => {
      linkObserverCleanupRef.current?.();
      linkObserverCleanupRef.current = null;
    };
  }, [linkMap]);

  return (
    <div
      ref={containerRef}
      className="f3"
      style={{ width: '100%', height: '100%' }}
      role="tree"
      aria-label="Cây gia phả"
    />
  );
}

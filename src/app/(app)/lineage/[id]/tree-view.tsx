'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { FamilyTree, FamilyChartInstance } from '@/components/tree/family-tree';
import { TreeToolbar } from '@/components/tree/tree-toolbar';
import { TreeControls, handleZoom } from '@/components/tree/tree-controls';
import { RelationshipLegend } from '@/components/tree/relationship-legend';

import { ExportDialog } from '@/components/tree/export-dialog';
import { ShareDialog } from '@/components/tree/share-dialog';
import { XungHoTooltip } from '@/components/tree/xung-ho-tooltip';
import { useStarredStore } from '@/stores/starred-store';
import { setStarredIds, setCollapsedState } from '@/components/tree/tree-card-template';
import { EditSidebar, EditSidebarPerson } from '@/components/tree/edit-sidebar';
import { TreeContextMenu, type ContextMenuAction } from '@/components/tree/tree-context-menu';
import { filterByCollapsed } from '@/lib/utils/filter-collapsed-tree';
import { BiographyPopup } from '@/components/tree/biography-popup';
import { BranchFilter, filterByBranch } from '@/components/tree/branch-filter';
import { DepthSlider, getMaxGeneration, filterByDepth } from '@/components/tree/depth-slider';
import type { FamilyChartDatum, RelationshipInfo } from '@/lib/transforms/family-chart-transform';
import { KeyboardShortcutsHelp } from '@/components/tree/keyboard-shortcuts-help';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Focus, Download, Share2, Settings, Scissors, X } from 'lucide-react';
import Link from 'next/link';
import { useFamilyTreeData } from '@/hooks/use-family-tree-data';
import { useLineage } from '@/hooks/use-lineages';
import type { EditTreeInstance } from '@/components/tree/tree-edit-integration';
import { useTreeCrud, useAddAncestor, useReorderChildren, useReparent, useCreateRootPerson, useSetParent, useRemoveParent } from './tree-view-helpers';
import { EmptyTreeState } from '@/components/tree/empty-tree-state';
import { useTreeDragDrop } from '@/hooks/use-tree-drag-drop';
import { ReparentConfirmDialog } from '@/components/tree/reparent-confirm-dialog';
import type { ParentRelationType } from '@/components/tree/edit-sidebar';
import { useSearchParams } from 'next/navigation';
import { TreeSelectionOverlay, getSubtreeIds, type SelectionMode } from '@/components/tree/tree-selection';
import { SplitPreviewPanel } from '@/components/tree/split-preview-panel';
import { SplitNameDialog } from '@/components/tree/split-name-dialog';
import { useSplitLineage } from '@/hooks/use-split-lineage';
import { ShareBranchDialog } from '@/components/tree/share-branch-dialog';

function findSiblings(personId: string, data: FamilyChartDatum[]): string[] {
  const dataMap = new Map(data.map((d) => [d.id, d]));
  const person = dataMap.get(personId);
  if (!person) return [personId];

  const parentId = person.rels.parents[0];
  if (!parentId) return [personId];

  const parent = dataMap.get(parentId);
  if (!parent) return [personId];

  return parent.rels.children.filter((cid) => dataMap.has(cid));
}

interface TreeViewProps {
  lineageId: number;
}

export function TreeView({ lineageId }: TreeViewProps) {
  const { data: lineage } = useLineage(lineageId);
  const { data: transformResult, isLoading, error } = useFamilyTreeData(lineageId);
  const treeData = useMemo(() => transformResult?.data ?? [], [transformResult]);
  const linkMap = useMemo(() => transformResult?.linkMap ?? new Map(), [transformResult]);
  const relationshipMap = useMemo(() => transformResult?.relationshipMap ?? new Map(), [transformResult]);
  const { handleSave, handleDelete, handleAddRelative, handleLinkExistingSpouse } = useTreeCrud(lineageId);
  const handleAddAncestor = useAddAncestor(lineageId);
  const handleReorderChildren = useReorderChildren(lineageId);
  const handleReparent = useReparent(lineageId);
  const handleCreateRoot = useCreateRootPerson(lineageId);
  const handleSetParent = useSetParent(lineageId);
  const handleRemoveParent = useRemoveParent(lineageId);
  const [chart, setChart] = useState<FamilyChartInstance | null>(null);
  const [editTree, setEditTree] = useState<EditTreeInstance | null>(null);
  const editTreeRef = useRef<EditTreeInstance | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarPerson, setSidebarPerson] = useState<EditSidebarPerson | null>(null);
  const [sidebarMode, setSidebarMode] = useState<'edit' | 'new'>('edit');
  const [sidebarRelativeType, setSidebarRelativeType] = useState<'father' | 'mother' | 'spouse' | 'son' | 'daughter' | undefined>(undefined);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const [branchFilter, setBranchFilter] = useState('all');
  const [focusPersonId, setFocusPersonId] = useState<string | null>(null);
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());
  const [contextMenu, setContextMenu] = useState<{
    personId: string;
    x: number;
    y: number;
  } | null>(null);
  const [reparentPending, setReparentPending] = useState<{
    sourceId: string;
    targetId: string;
  } | null>(null);

  // ── Split mode state ────────────────────────────────────────────────────
  const searchParams = useSearchParams();
  const [splitMode, setSplitMode] = useState(searchParams.get('mode') === 'split');
  const [splitSelectedIds, setSplitSelectedIds] = useState<Set<string>>(new Set());
  const [splitSelectionMode, setSplitSelectionMode] = useState<SelectionMode>('subtree');
  const [showSplitPreview, setShowSplitPreview] = useState(false);
  const [showSplitNameDialog, setShowSplitNameDialog] = useState(false);
  const [showShareBranch, setShowShareBranch] = useState(false);
  const [xungHoOpen, setXungHoOpen] = useState(false);
  const splitMutation = useSplitLineage(lineageId);

  const starredIds = useStarredStore((s) => s.starredIds);
  const toggleStarred = useStarredStore((s) => s.toggle);

  useEffect(() => {
    setStarredIds(new Set(starredIds));
  }, [starredIds]);

  const maxGen = useMemo(() => (treeData.length > 0 ? getMaxGeneration(treeData) : 1), [treeData]);
  const [depthLimit, setDepthLimit] = useState(maxGen);

  useEffect(() => { setDepthLimit(maxGen); }, [maxGen]);

  const { filteredData, hiddenCounts } = useMemo(() => {
    if (treeData.length === 0) return { filteredData: [], hiddenCounts: new Map<string, number>() };
    let result = filterByBranch(treeData, branchFilter);
    result = filterByDepth(result, depthLimit);

    if (focusPersonId) {
      const dataMap = new Map(result.map((d) => [d.id, d]));
      const included = new Set<string>();

      function collectRelatives(id: string, depth: number, direction: 'up' | 'down') {
        if (depth < 0 || included.has(id)) return;
        included.add(id);
        const person = dataMap.get(id);
        if (!person) return;
        for (const spouseId of person.rels.spouses) included.add(spouseId);
        if (direction === 'up' || direction === 'down') {
          const nextIds = direction === 'up' ? person.rels.parents : person.rels.children;
          for (const nextId of nextIds) collectRelatives(nextId, depth - 1, direction);
        }
      }

      included.add(focusPersonId);
      const focal = dataMap.get(focusPersonId);
      if (focal) {
        for (const spouseId of focal.rels.spouses) included.add(spouseId);
        for (const parentId of focal.rels.parents) collectRelatives(parentId, 1, 'up');
        for (const childId of focal.rels.children) collectRelatives(childId, 1, 'down');
      }
      result = result.filter((d) => included.has(d.id));
    }

    const { filtered, hiddenCounts } = filterByCollapsed(result, collapsedIds);
    return { filteredData: filtered, hiddenCounts };
  }, [treeData, branchFilter, depthLimit, focusPersonId, collapsedIds]);

  useEffect(() => {
    setCollapsedState(collapsedIds, hiddenCounts);
  }, [collapsedIds, hiddenCounts]);

  const handleTreeDrop = useCallback((sourceId: string, targetId: string) => {
    setReparentPending({ sourceId, targetId });
  }, []);

  useTreeDragDrop({
    data: treeData,
    containerRef,
    onDrop: handleTreeDrop,
    enabled: treeData.length > 0,
  });

  const handleReparentConfirm = useCallback(async (relType: ParentRelationType) => {
    if (!reparentPending) return;
    const { sourceId, targetId } = reparentPending;

    const rels = relationshipMap.get(sourceId) ?? [];
    const sourcePerson = treeData.find((d) => d.id === sourceId);
    const parentRel = rels.find(
      (r: RelationshipInfo) => r.toId === sourceId && sourcePerson?.rels.parents.includes(r.fromId)
    );

    if (parentRel) {
      await handleReparent(sourceId, targetId, relType, parentRel.id);
    }
    setReparentPending(null);
  }, [reparentPending, relationshipMap, treeData, handleReparent]);

  const selectedPersonIdRef = useRef<string | null>(null);

  useEffect(() => { editTreeRef.current = editTree; }, [editTree]);

  useEffect(() => {
    if (sidebarPerson) selectedPersonIdRef.current = sidebarPerson.id;
  }, [sidebarPerson]);

  const navigateTo = useCallback((id: string) => {
    if (!chart) return;
    chart.updateMainId(id);
    chart.updateTree({ tree_position: 'main_to_middle' });
    selectedPersonIdRef.current = id;
    const datum = treeData.find((d) => d.id === id);
    if (datum) {
      setSidebarPerson({ id: datum.id, data: datum.data });
      setSidebarMode('edit');
      setSidebarRelativeType(undefined);
      setSidebarOpen(true);
    }
  }, [chart, treeData]);

  const searchSelectRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      const isInput = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';

      if (e.key === 'Escape') {
        if (contextMenu) { setContextMenu(null); e.preventDefault(); return; }
        if (splitMode) { setSplitMode(false); setSplitSelectedIds(new Set()); e.preventDefault(); return; }
        if (sidebarOpen) { setSidebarOpen(false); e.preventDefault(); return; }
        if (focusPersonId) { setFocusPersonId(null); e.preventDefault(); return; }
        return;
      }

      if (isInput) return;

      if (e.key === 'z' && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
        e.preventDefault();
        editTreeRef.current?.history.canBack() && editTreeRef.current.history.back();
        return;
      }
      if (e.key === 'z' && (e.ctrlKey || e.metaKey) && e.shiftKey) {
        e.preventDefault();
        editTreeRef.current?.history.canForward() && editTreeRef.current.history.forward();
        return;
      }
      if (e.key === 'f' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        searchSelectRef.current?.click();
        return;
      }

      if (e.key === '=' || e.key === '+') { handleZoom(chart, 1.2); return; }
      if (e.key === '-') { handleZoom(chart, 0.8); return; }
      if (e.key === 'f' || e.key === 'F') {
        chart?.updateTree({ tree_position: 'fit' });
        return;
      }
      if (e.key === '?') { setShowShortcutsHelp((p) => !p); return; }

      const currentId = selectedPersonIdRef.current;
      if (!currentId) return;
      const dataMap = new Map(filteredData.map((d) => [d.id, d]));
      const current = dataMap.get(currentId);
      if (!current) return;

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const parentId = current.rels.parents[0];
        if (parentId && dataMap.has(parentId)) navigateTo(parentId);
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const childId = current.rels.children[0];
        if (childId && dataMap.has(childId)) navigateTo(childId);
        return;
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const siblings = findSiblings(currentId, filteredData);
        if (siblings.length <= 1) return;
        const idx = siblings.indexOf(currentId);
        const next = e.key === 'ArrowRight'
          ? siblings[(idx + 1) % siblings.length]
          : siblings[(idx - 1 + siblings.length) % siblings.length];
        if (next) navigateTo(next);
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        const datum = treeData.find((d) => d.id === currentId);
        if (datum) {
          setSidebarPerson({ id: datum.id, data: datum.data });
          setSidebarMode('edit');
          setSidebarRelativeType(undefined);
          setSidebarOpen(true);
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusPersonId, chart, filteredData, treeData, navigateTo, sidebarOpen]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    function findPersonIdFromTarget(target: EventTarget | null): string | null {
      let node = target as HTMLElement | null;
      while (node && node !== el) {
        if (node.classList?.contains('f3-vn-card')) return node.getAttribute('data-person-id');
        node = node.parentElement;
      }
      return null;
    }

    function handleContextMenu(e: MouseEvent) {
      const pid = findPersonIdFromTarget(e.target);
      if (!pid) return;
      e.preventDefault();
      setContextMenu({ personId: pid, x: e.clientX, y: e.clientY });
    }

    el.addEventListener('contextmenu', handleContextMenu);
    return () => el.removeEventListener('contextmenu', handleContextMenu);
  }, [treeData]);

  const chartRef = useRef(chart);
  chartRef.current = chart;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    function handleActionClick(e: MouseEvent) {
      const btn = (e.target as HTMLElement).closest('.f3-vn-action-btn') as HTMLElement | null;
      if (!btn) return;

      e.stopPropagation();
      e.preventDefault();

      const action = btn.getAttribute('data-action');
      const card = btn.closest('.f3-vn-card') as HTMLElement | null;
      const personId = card?.getAttribute('data-person-id');
      if (!personId || !action) return;

      const datum = treeData.find((d) => d.id === personId);
      if (!datum) return;

      if (chartRef.current) {
        chartRef.current.updateMainId(personId);
        chartRef.current.updateTree({ tree_position: 'main_to_middle' });
      }

      setSidebarPerson({ id: datum.id, data: datum.data });
      const isNew = action === 'add';
      setSidebarMode(isNew ? 'new' : 'edit');
      setSidebarRelativeType(isNew ? 'son' : undefined);
      setSidebarOpen(true);
    }

    el.addEventListener('click', handleActionClick, true);
    return () => el.removeEventListener('click', handleActionClick, true);
  }, [treeData]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let longPressTimer: ReturnType<typeof setTimeout> | null = null;
    let lastTapTime = 0;
    let lastTapId = '';

    function isActionBtn(target: EventTarget | null): boolean {
      return !!(target as HTMLElement)?.closest?.('.f3-vn-action-btn');
    }

    function findPersonId(target: EventTarget | null): string | null {
      let node = target as HTMLElement | null;
      while (node && node !== el) {
        if (node.classList?.contains('f3-vn-card')) return node.getAttribute('data-person-id');
        node = node.parentElement;
      }
      return null;
    }

    function handleTouchStart(e: TouchEvent) {
      if (e.touches.length !== 1) return;
      if (isActionBtn(e.target)) return;
      const pid = findPersonId(e.target);
      if (!pid) return;

      longPressTimer = setTimeout(() => {
        longPressTimer = null;
        const datum = treeData.find((d) => d.id === pid);
        if (datum) {
          setSidebarPerson({ id: datum.id, data: datum.data });
          setSidebarMode('edit');
          setSidebarRelativeType(undefined);
          setSidebarOpen(true);
        }
      }, 500);
    }

    function handleTouchEnd(e: TouchEvent) {
      if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null; }
      if (isActionBtn(e.target)) return;

      const pid = findPersonId(e.target);
      if (!pid) return;

      const now = Date.now();
      if (pid === lastTapId && now - lastTapTime < 400) {
        handlePersonDoubleClick(Number(pid));
        lastTapId = '';
        lastTapTime = 0;
      } else {
        lastTapId = pid;
        lastTapTime = now;
      }
    }

    function handleTouchMove() {
      if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null; }
    }

    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });
    el.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchend', handleTouchEnd);
      el.removeEventListener('touchmove', handleTouchMove);
      if (longPressTimer) clearTimeout(longPressTimer);
    };
  }, [treeData]);

  const handleContextMenuAction = useCallback(
    (personId: string, action: ContextMenuAction) => {
      const datum = treeData.find((d) => d.id === personId);
      if (!datum) return;

      switch (action.type) {
        case 'add-child':
          setSidebarPerson({ id: datum.id, data: datum.data });
          setSidebarMode('new');
          setSidebarRelativeType('son');
          setSidebarOpen(true);
          break;
        case 'add-spouse':
          setSidebarPerson({ id: datum.id, data: datum.data });
          setSidebarMode('new');
          setSidebarRelativeType('spouse');
          setSidebarOpen(true);
          break;
        case 'add-parent': {
          const rootIds = new Set(treeData.filter((d) => d.rels.parents.length === 0).map((d) => d.id));
          if (rootIds.has(personId)) {
            handleAddAncestor(personId);
          }
          break;
        }
        case 'edit':
          setSidebarPerson({ id: datum.id, data: datum.data });
          setSidebarMode('edit');
          setSidebarRelativeType(undefined);
          setSidebarOpen(true);
          break;
        case 'delete':
          handleDelete(personId);
          break;
        case 'toggle-collapse':
          setCollapsedIds((prev) => {
            const next = new Set(prev);
            if (next.has(personId)) {
              next.delete(personId);
            } else {
              next.add(personId);
            }
            return next;
          });
          break;
        case 'focus':
          setFocusPersonId((prev) => (prev === personId ? null : personId));
          break;
        case 'view-kinship':
          navigateTo(personId);
          break;
        case 'split-from-here': {
          const subtreeIds = getSubtreeIds(personId, treeData);
          setSplitSelectedIds(subtreeIds);
          setSplitSelectionMode('subtree');
          setSplitMode(true);
          break;
        }
      }
    },
    [treeData, handleDelete, handleAddAncestor, navigateTo],
  );
  function handlePersonClick(personId: number) {
    if (treeData.length === 0) return;
    const datum = treeData.find((d) => d.id === String(personId));
    if (!datum) return;
    setSidebarPerson({ id: datum.id, data: datum.data });
    setSidebarMode('edit');
    setSidebarRelativeType(undefined);
    setSidebarOpen(true);
  }

  const sidebarChildrenInfo = useMemo(() => {
    if (!sidebarPerson || sidebarMode !== 'edit') return [];
    const person = treeData.find((d) => d.id === sidebarPerson.id);
    if (!person || person.rels.children.length < 2) return [];
    return person.rels.children
      .map((cid) => {
        const child = treeData.find((d) => d.id === cid);
        if (!child) return null;
        return {
          id: child.id,
          name: child.data.full_name || '(Không rõ)',
          birthOrder: child.data.birth_order,
        };
      })
      .filter((c): c is NonNullable<typeof c> => c !== null);
  }, [sidebarPerson, sidebarMode, treeData]);

  function handlePersonDoubleClick(personId: number) {
    const id = String(personId);
    setFocusPersonId((prev) => (prev === id ? null : id));
  }

  if (isLoading) {
    return (
      <div className="-m-4 md:-m-6 flex flex-col gap-2 p-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-[calc(100vh-180px)] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center text-destructive">
        Lỗi tải dữ liệu: {error.message}
      </div>
    );
  }

  if (treeData.length === 0) {
    return <EmptyTreeState onCreateRoot={handleCreateRoot} />;
  }

  const toolbarExtras = (
    <>
      <BranchFilter data={treeData} value={branchFilter} onChange={setBranchFilter} />
      <DepthSlider value={depthLimit} max={maxGen} onChange={setDepthLimit} />
      {focusPersonId && (
        <Button
          variant="secondary"
          size="sm"
          className="gap-1 text-xs"
          onClick={() => setFocusPersonId(null)}
        >
          <Focus className="h-3 w-3" />
          Thoát focus
        </Button>
      )}
      {splitMode ? (
        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            className="gap-1"
            disabled={splitSelectedIds.size === 0}
            onClick={() => setShowSplitPreview(true)}
          >
            <Scissors className="h-3.5 w-3.5" />
            Xem preview ({splitSelectedIds.size})
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            disabled={splitSelectedIds.size === 0}
            onClick={() => setShowShareBranch(true)}
          >
            <Share2 className="h-3.5 w-3.5" />
            Chia sẻ nhánh
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1"
            onClick={() => { setSplitMode(false); setSplitSelectedIds(new Set()); }}
          >
            <X className="h-3.5 w-3.5" />
            Thoát tách
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={() => { setSplitMode(true); setSplitSelectedIds(new Set()); setSplitSelectionMode('subtree'); }}
        >
          <Scissors className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Tách nhánh</span>
        </Button>
      )}
      <div className="flex items-center gap-1 ml-auto">
        <Button variant="outline" size="sm" className="gap-1" onClick={() => setShowExport(true)}>
          <Download className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Xuất</span>
        </Button>
        <Button variant="outline" size="sm" className="gap-1" onClick={() => setShowShare(true)}>
          <Share2 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Chia sẻ</span>
        </Button>
        <Button asChild variant="outline" size="sm" className="gap-1">
          <Link href={`/lineage/${lineageId}/settings`}>
            <Settings className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Cài đặt</span>
          </Link>
        </Button>
      </div>
    </>
  );

  return (
    <div className="-m-4 md:-m-6 flex flex-col h-[calc(100dvh-3.5rem)]">
      <div className="px-4 md:px-6 border-b flex-shrink-0">
        <TreeToolbar chart={chart} data={treeData} editTree={editTree} extraControls={toolbarExtras} searchSelectRef={searchSelectRef} />
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="relative flex-1 min-w-0" ref={containerRef}>
          <FamilyTree
            data={filteredData}
            linkMap={linkMap}
            onPersonClick={handlePersonClick}
            onPersonDoubleClick={handlePersonDoubleClick}
            onChartReady={setChart}
            onEditReady={(et) => {
              setEditTree(et);
              editTreeRef.current = et;
            }}
          />
          <BiographyPopup container={containerRef.current} data={treeData} />
          <RelationshipLegend />
          <TreeControls chart={chart} onShowShortcuts={() => setShowShortcutsHelp(true)} xungHoOpen={xungHoOpen} onToggleXungHo={() => setXungHoOpen((p) => !p)} />
          <XungHoTooltip
            data={treeData}
            container={containerRef.current}
            isOpen={xungHoOpen}
            onClose={() => setXungHoOpen(false)}
          />
          {splitMode && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40">
              <TreeSelectionOverlay
                chartContainer={containerRef.current}
                data={treeData}
                selectedIds={splitSelectedIds}
                onSelectionChange={setSplitSelectedIds}
                mode={splitSelectionMode}
                onModeChange={setSplitSelectionMode}
              />
            </div>
          )}
          {contextMenu && (() => {
            const datum = treeData.find((d) => d.id === contextMenu.personId);
            if (!datum) return null;
            const fullName = [datum.data.ho, datum.data.ten_dem, datum.data.ten].filter(Boolean).join(' ') || '(Không rõ)';
            const rootIds = new Set(treeData.filter((d) => d.rels.parents.length === 0).map((d) => d.id));
            return (
              <TreeContextMenu
                personName={fullName}
                position={{ x: contextMenu.x, y: contextMenu.y }}
                isCollapsed={collapsedIds.has(contextMenu.personId)}
                hasChildren={datum.rels.children.length > 0}
                isRoot={rootIds.has(contextMenu.personId)}
                onClose={() => setContextMenu(null)}
                onAction={(action) => handleContextMenuAction(contextMenu.personId, action)}
              />
            );
          })()}
          <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
            {sidebarPerson ? `Đã chọn: ${treeData.find((d) => d.id === sidebarPerson.id)?.data.full_name ?? ''}` : ''}
          </div>
        </div>
        <EditSidebar
          open={sidebarOpen}
          onOpenChange={setSidebarOpen}
          person={sidebarPerson}
          mode={sidebarMode}
          relativeType={sidebarRelativeType}
          isStarred={sidebarPerson ? starredIds.includes(sidebarPerson.id) : false}
          onToggleStar={toggleStarred}
          onSave={handleSave}
          onDelete={handleDelete}
          onAddRelative={handleAddRelative}
          onAddRelativeClick={() => { setSidebarMode('new'); setSidebarRelativeType('son'); }}
          childrenOfPerson={sidebarChildrenInfo}
          onReorderChildren={handleReorderChildren}
          onLinkExistingSpouse={handleLinkExistingSpouse}
          treeData={treeData}
          relationshipMap={relationshipMap}
          onSetParent={handleSetParent}
          onRemoveParent={handleRemoveParent}
        />
      </div>
      <KeyboardShortcutsHelp open={showShortcutsHelp} onOpenChange={setShowShortcutsHelp} />
      <ExportDialog open={showExport} onOpenChange={setShowExport} chart={chart} />
      <ShareDialog open={showShare} onOpenChange={setShowShare} lineageId={lineageId} accessCodeRequired={lineage?.privacy_level === 2} />
      <SplitPreviewPanel
        open={showSplitPreview}
        onOpenChange={setShowSplitPreview}
        selectedIds={splitSelectedIds}
        data={treeData}
        relationshipMap={relationshipMap}
        onConfirm={() => {
          setShowSplitPreview(false);
          setShowSplitNameDialog(true);
        }}
      />
      <SplitNameDialog
        open={showSplitNameDialog}
        onOpenChange={setShowSplitNameDialog}
        sourceLineageName={lineage?.name ?? ''}
        suggestedName={`${lineage?.name ?? 'Gia phả'} - Nhánh tách`}
        isPending={splitMutation.isPending}
        onConfirm={(name, mode, createSnapshot) => {
          splitMutation.mutate({
            newName: name,
            personIds: [...splitSelectedIds].map(Number),
            splitMode: mode,
            createSnapshot,
            sourceLineageName: lineage?.name ?? '',
          });
        }}
      />
      {reparentPending && (() => {
        const source = treeData.find((d) => d.id === reparentPending.sourceId);
        const target = treeData.find((d) => d.id === reparentPending.targetId);
        if (!source || !target) return null;
        return (
          <ReparentConfirmDialog
            open={true}
            onOpenChange={(open) => { if (!open) setReparentPending(null); }}
            childName={source.data.full_name || '(Không rõ)'}
            newParentName={target.data.full_name || '(Không rõ)'}
            onConfirm={handleReparentConfirm}
          />
        );
      })()}
      <ShareBranchDialog
        open={showShareBranch}
        onOpenChange={setShowShareBranch}
        selectedIds={splitSelectedIds}
        lineageId={lineageId}
        lineageName={lineage?.name ?? 'Gia phả'}
        chart={chart}
        chartContainer={containerRef.current}
      />
    </div>
  );
}
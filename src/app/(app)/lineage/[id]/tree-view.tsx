'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { FamilyTree, FamilyChartInstance } from '@/components/tree/family-tree';
import { TreeToolbar } from '@/components/tree/tree-toolbar';
import { TreeControls, handleZoom } from '@/components/tree/tree-controls';
import { RelationshipLegend } from '@/components/tree/relationship-legend';
import { MiniMap } from '@/components/tree/mini-map';
import { useStarredStore } from '@/stores/starred-store';
import { setStarredIds } from '@/components/tree/tree-card-template';
import { EditSidebar, EditSidebarPerson } from '@/components/tree/edit-sidebar';
import { BiographyPopup } from '@/components/tree/biography-popup';
import { BranchFilter, filterByBranch } from '@/components/tree/branch-filter';
import { DepthSlider, getMaxGeneration, filterByDepth } from '@/components/tree/depth-slider';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Focus } from 'lucide-react';
import { useFamilyTreeData } from '@/hooks/use-family-tree-data';
import type { EditTreeInstance } from '@/components/tree/tree-edit-integration';
import { useTreeCrud } from './tree-view-helpers';

interface TreeViewProps {
  lineageId: number;
}

export function TreeView({ lineageId }: TreeViewProps) {
  const { data: transformResult, isLoading, error } = useFamilyTreeData(lineageId);
  const treeData = useMemo(() => transformResult?.data ?? [], [transformResult]);
  const linkMap = useMemo(() => transformResult?.linkMap ?? new Map(), [transformResult]);
  const { handleSave, handleDelete, handleAddRelative } = useTreeCrud(lineageId);
  const [chart, setChart] = useState<FamilyChartInstance | null>(null);
  const [editTree, setEditTree] = useState<EditTreeInstance | null>(null);
  const editTreeRef = useRef<EditTreeInstance | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarPerson, setSidebarPerson] = useState<EditSidebarPerson | null>(null);
  const [sidebarMode, setSidebarMode] = useState<'edit' | 'new'>('edit');

  const [branchFilter, setBranchFilter] = useState('all');
  const [focusPersonId, setFocusPersonId] = useState<string | null>(null);

  const starredIds = useStarredStore((s) => s.starredIds);
  const toggleStarred = useStarredStore((s) => s.toggle);

  useEffect(() => {
    setStarredIds(new Set(starredIds));
  }, [starredIds]);

  const maxGen = useMemo(() => (treeData.length > 0 ? getMaxGeneration(treeData) : 1), [treeData]);
  const [depthLimit, setDepthLimit] = useState(maxGen);

  useEffect(() => { setDepthLimit(maxGen); }, [maxGen]);

  const filteredData = useMemo(() => {
    if (treeData.length === 0) return [];
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

    return result;
  }, [treeData, branchFilter, depthLimit, focusPersonId]);

  useEffect(() => { editTreeRef.current = editTree; }, [editTree]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (e.key === 'z' && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
        e.preventDefault();
        editTreeRef.current?.history.canBack() && editTreeRef.current.history.back();
      }
      if (e.key === 'z' && (e.ctrlKey || e.metaKey) && e.shiftKey) {
        e.preventDefault();
        editTreeRef.current?.history.canForward() && editTreeRef.current.history.forward();
      }
      if (e.key === 'Escape' && focusPersonId) {
        setFocusPersonId(null);
      }
      if (e.key === '=' || e.key === '+') {
        handleZoom(chart, 1.2);
      }
      if (e.key === '-') {
        handleZoom(chart, 0.8);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusPersonId, chart]);

  function handlePersonClick(personId: number) {
    if (treeData.length === 0) return;
    const datum = treeData.find((d) => d.id === String(personId));
    if (!datum) return;
    setSidebarPerson({ id: datum.id, data: datum.data });
    setSidebarMode('edit');
    setSidebarOpen(true);
  }

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
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        Dòng họ chưa có thành viên nào.
      </div>
    );
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
    </>
  );

  return (
    <div className="-m-4 md:-m-6 flex flex-col h-[calc(100dvh-3.5rem)]">
      <div className="px-4 md:px-6 border-b flex-shrink-0">
        <TreeToolbar chart={chart} data={treeData} editTree={editTree} extraControls={toolbarExtras} />
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
          <MiniMap chart={chart} />
          <TreeControls chart={chart} />
        </div>
        <EditSidebar
          open={sidebarOpen}
          onOpenChange={setSidebarOpen}
          person={sidebarPerson}
          mode={sidebarMode}
          isStarred={sidebarPerson ? starredIds.includes(sidebarPerson.id) : false}
          onToggleStar={toggleStarred}
          onSave={handleSave}
          onDelete={handleDelete}
          onAddRelative={handleAddRelative}
          onAddRelativeClick={() => setSidebarMode('new')}
        />
      </div>
    </div>
  );
}
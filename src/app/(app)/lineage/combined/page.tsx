'use client';
import { Suspense, useState, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, GitMerge, Download } from 'lucide-react';
import Link from 'next/link';
import { useCombinedTreeData } from '@/hooks/use-combined-tree-data';
import { mergeLineages, type MergedTransformResult } from '@/lib/transforms/merge-lineages';
import { PersonMatchingWizard } from '@/components/tree/person-matching-wizard';
import { CombinedLegend } from '@/components/tree/combined-legend';
import { CloneCombinedDialog } from '@/components/tree/clone-combined-dialog';
import { ExportDialog } from '@/components/tree/export-dialog';
import { FamilyTree } from '@/components/tree/family-tree';
import { TreeControls } from '@/components/tree/tree-controls';
import { useCombinedMappings } from '@/hooks/use-combined-mappings';
import type { PersonMappings } from '@/lib/transforms/person-matching';
import type { Person } from '@/types/person';
import type { FamilyChartInstance } from '@/components/tree/family-tree';
import { getMaxCombinedLineages } from '@/config/feature-limits';

function parseIds(raw: string | null): number[] {
  if (!raw) return [];
  return raw
    .split(',')
    .map((s) => Number(s.trim()))
    .filter((n) => Number.isFinite(n) && n > 0);
}

function CombinedViewPageInner() {
  const searchParams = useSearchParams();

  const rawIds = searchParams.get('ids');
  const lineageIds = useMemo(() => parseIds(rawIds), [rawIds]);

  const maxLineages = getMaxCombinedLineages('free');

  if (lineageIds.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-muted-foreground">
        <p>Cần ít nhất 2 gia phả để xem kết hợp.</p>
        <Button asChild variant="outline">
          <Link href="/lineage">← Quay lại danh sách</Link>
        </Button>
      </div>
    );
  }

  if (lineageIds.length > maxLineages) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-muted-foreground">
        <p>Tối đa {maxLineages} gia phả cho gói miễn phí.</p>
        <Button asChild variant="outline">
          <Link href="/lineage">← Quay lại danh sách</Link>
        </Button>
      </div>
    );
  }

  return <CombinedViewContent lineageIds={lineageIds} />;
}

export default function CombinedViewPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col gap-2 p-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-[calc(100vh-200px)] w-full" />
        </div>
      }
    >
      <CombinedViewPageInner />
    </Suspense>
  );
}

function CombinedViewContent({ lineageIds }: { lineageIds: number[] }) {
  const router = useRouter();
  const { sources, isLoading, errors } = useCombinedTreeData(lineageIds);
  const { mappings: storedMappings, saveMappings, isLoadingMappings } = useCombinedMappings(lineageIds);

  const [showWizard, setShowWizard] = useState(false);
  const [showCloneDialog, setShowCloneDialog] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [chart, setChart] = useState<FamilyChartInstance | null>(null);
  // Derive personMappings from storedMappings (no effect needed)
  const personMappings = useMemo(
    () => (storedMappings && Object.keys(storedMappings).length > 0 ? storedMappings : {}),
    [storedMappings],
  );

  // Show wizard when no stored mappings and data is ready
  const shouldShowWizard = !isLoadingMappings && sources.length >= 2 && Object.keys(personMappings).length === 0;
  const wizardVisible = showWizard || shouldShowWizard;

  const personsMap = useMemo(() => {
    const map = new Map<number, Person[]>();
    for (const source of sources) {
      const persons: Person[] = source.result.data.map((datum) => ({
        id: Number(datum.id),
        lineage_id: source.lineageId,
        full_name: datum.data.full_name,
        ho: datum.data.ho,
        ten_dem: datum.data.ten_dem,
        ten: datum.data.ten,
        gender: datum.data.gender === 'F' ? 'female' : 'male',
        is_alive: datum.data.is_alive,
        birth_date: datum.data.birth_year ? {
          id: datum.data.birth_date_id ?? 0,
          date_type: 'birth',
          solar_year: datum.data.birth_year,
          solar_month: datum.data.birth_month,
          solar_day: datum.data.birth_day,
          lunar_year: datum.data.birth_lunar_year,
          lunar_month: datum.data.birth_lunar_month,
          lunar_day: datum.data.birth_lunar_day,
          lunar_leap_month: datum.data.birth_lunar_leap_month,
          date_precision: 0,
          date_qualifier: '',
          range_year_start: null,
          range_year_end: null,
          date_note: null,
          calendar_type: datum.data.birth_calendar_type,
          display_string: '',
        } : null,
        death_date: null,
        branch_id: null,
        ten_thuong_goi: null,
        ten_huy: null,
        ten_thuy: null,
        ten_hieu: null,
        han_nom_name: null,
        generation_number: datum.data.generation_number,
        biography: datum.data.biography,
        avatar: datum.data.avatar,
        created_at: '',
        updated_at: '',
        notes: datum.data.notes,
        phone: null,
        email: null,
        address: null,
        birth_place: datum.data.birth_place,
        death_place: datum.data.death_place,
        burial_place: null,
        burial_latitude: null,
        burial_longitude: null,
        cover_photo: null,
        privacy_level: null,
        birth_order: datum.data.birth_order,
        parents_count: datum.rels.parents.length,
        children_count: datum.rels.children.length,
        spouses_count: datum.rels.spouses.length,
      }));
      map.set(source.lineageId, persons);
    }
    return map;
  }, [sources]);

  const merged: MergedTransformResult | null = useMemo(() => {
    if (sources.length < 2) return null;
    return mergeLineages(sources, { personMappings });
  }, [sources, personMappings]);

  const handleWizardComplete = useCallback(
    (mappings: PersonMappings) => {
      setShowWizard(false);
      saveMappings(mappings);
    },
    [saveMappings],
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 p-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-[calc(100vh-200px)] w-full" />
      </div>
    );
  }

  const activeErrors = errors.filter(Boolean);
  if (activeErrors.length > 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-destructive">
        <p>Lỗi tải dữ liệu: {activeErrors.map((e) => e?.message).join(', ')}</p>
        <Button asChild variant="outline">
          <Link href="/lineage">← Quay lại</Link>
        </Button>
      </div>
    );
  }

  if (wizardVisible) {
    return (
      <div className="p-4 md:p-6">
        <PersonMatchingWizard
          sources={sources}
          personsMap={personsMap}
          initialMappings={storedMappings ?? undefined}
          onComplete={handleWizardComplete}
          onCancel={() => router.push('/lineage')}
        />
      </div>
    );
  }

  if (!merged) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Đang xử lý dữ liệu...
      </div>
    );
  }

  return (
    <div className="-m-4 md:-m-6 flex flex-col h-[calc(100dvh-3.5rem)]">
      <div className="px-4 md:px-6 py-2 border-b flex items-center gap-3 flex-shrink-0">
        <Button asChild variant="ghost" size="sm">
          <Link href="/lineage">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Quay lại
          </Link>
        </Button>
        <h1 className="text-sm font-medium truncate">
          Xem kết hợp ({sources.map((s) => s.lineageName).join(' + ')})
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowWizard(true)}>
            <GitMerge className="h-3.5 w-3.5 mr-1" />
            Ghép nối lại
          </Button>
          <Button variant="default" size="sm" onClick={() => setShowCloneDialog(true)}>
            Lưu thành gia phả mới
          </Button>
          <Button variant="outline" size="sm" className="gap-1" onClick={() => setShowExport(true)}>
            <Download className="h-3.5 w-3.5" />
            Xuất
          </Button>
        </div>
      </div>

      <div className="relative flex-1 min-w-0">
        <FamilyTree
          data={merged.data}
          linkMap={merged.linkMap}
          onPersonClick={() => {}}
          onPersonDoubleClick={() => {}}
          onChartReady={setChart}
          onEditReady={() => {}}
        />
        <CombinedLegend sources={sources} />
        <TreeControls chart={chart} />
      </div>

      <CloneCombinedDialog
        open={showCloneDialog}
        onOpenChange={setShowCloneDialog}
        primaryLineageId={lineageIds[0]}
        mergedData={merged.data}
      />
      <ExportDialog
        open={showExport}
        onOpenChange={setShowExport}
        chart={chart}
        lineageName={`Kết hợp - ${sources.map((s) => s.lineageName).join(' + ')}`}
      />
    </div>
  );
}

'use client';

import { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQueries } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { proxyFetch } from '@/app/(app)/lineage/[id]/tree-view-helpers';
import type { ApiResponse } from '@/types/api';
import type { Person } from '@/types/person';
import type { Lineage } from '@/types/lineage';
import type { MatchResult, PersonMappings } from '@/lib/transforms/person-matching';
import type { ConflictItem, ResolvableField } from '@/components/tree/conflict-resolution-ui';

import { RESOLVABLE_FIELDS, ConflictResolutionUI } from '@/components/tree/conflict-resolution-ui';
import { PersonMatchingWizard } from '@/components/tree/person-matching-wizard';
import { LineageCompareView } from '@/components/lineage/lineage-compare-view';
import { MergeTargetSelector, type MergeTargetConfig } from '@/components/lineage/merge-target-selector';
import { MergeConfirmStep } from '@/components/lineage/merge-confirm-step';
import { useMergeLineages, buildFieldResolutions, type MergeProgress } from '@/hooks/use-merge-lineages';
import { parseNamespacedId } from '@/lib/transforms/person-matching';


type MergeStep = 'compare' | 'match' | 'resolve' | 'target' | 'confirm';

const STEPS: MergeStep[] = ['compare', 'match', 'resolve', 'target', 'confirm'];
const STEP_LABELS: Record<MergeStep, string> = {
  compare: 'So sánh',
  match: 'Ghép nối',
  resolve: 'Xung đột',
  target: 'Đích đến',
  confirm: 'Xác nhận',
};

function parseIds(raw: string | null): number[] {
  if (!raw) return [];
  return raw
    .split(',')
    .map((s) => Number(s.trim()))
    .filter((n) => Number.isFinite(n) && n > 0);
}

async function fetchPersons(lineageId: number): Promise<{ lineageId: number; persons: Person[] }> {
  const res = await proxyFetch<ApiResponse<Person[]>>(
    `/lineages/${lineageId}/persons?per_page=500`,
  );
  return { lineageId, persons: res.data };
}

export default function MergeWizardPage() {
  const searchParams = useSearchParams();
  const lineageIds = useMemo(() => parseIds(searchParams.get('ids')), [searchParams]);

  if (lineageIds.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-muted-foreground">
        <p>Cần ít nhất 2 gia phả để gộp.</p>
        <Button asChild variant="outline">
          <Link href="/lineage">← Quay lại danh sách</Link>
        </Button>
      </div>
    );
  }

  return <MergeWizardContent lineageIds={lineageIds} />;
}

function MergeWizardContent({ lineageIds }: { lineageIds: number[] }) {
  const [step, setStep] = useState<MergeStep>('compare');
  const stepIndex = STEPS.indexOf(step);

  const [autoMatches, setAutoMatches] = useState<MatchResult[]>([]);
  const [personMappings, setPersonMappings] = useState<PersonMappings>({});
  const [conflicts, setConflicts] = useState<ConflictItem[]>([]);
  const [targetConfig, setTargetConfig] = useState<MergeTargetConfig | null>(null);
  const [mergeProgress, setMergeProgress] = useState<MergeProgress>('idle');

  const personsQueries = useQueries({
    queries: lineageIds.map((id) => ({
      queryKey: ['merge-persons', id] as const,
      queryFn: () => fetchPersons(id),
    })),
  });

  const isLoadingPersons = personsQueries.some((q) => q.isLoading);

  const personsMap = useMemo(() => {
    const map = new Map<number, Person[]>();
    for (const query of personsQueries) {
      if (query.data) {
        map.set(query.data.lineageId, query.data.persons);
      }
    }
    return map;
  }, [personsQueries]);

  const sources = useMemo(() => {
    return lineageIds.map((id) => ({ lineageId: id }));
  }, [lineageIds]);

  const mergeMutation = useMergeLineages(setMergeProgress);

  const handleCompareComplete = useCallback((matches: MatchResult[]) => {
    setAutoMatches(matches);
    setStep('match');
  }, []);

  const handleMatchComplete = useCallback((mappings: PersonMappings) => {
    setPersonMappings(mappings);

    const newConflicts: ConflictItem[] = [];
    for (const [sourceId, targetId] of Object.entries(mappings)) {
      if (typeof targetId !== 'string' || targetId === 'new' || targetId === 'skip') continue;

      const { lineageId: srcLineageId, personId: srcPersonId } = parseNamespacedId(sourceId);
      const { lineageId: tgtLineageId, personId: tgtPersonId } = parseNamespacedId(targetId);

      const srcPerson = personsMap.get(srcLineageId)?.find((p) => p.id === srcPersonId);
      const tgtPerson = personsMap.get(tgtLineageId)?.find((p) => p.id === tgtPersonId);

      if (!srcPerson || !tgtPerson) continue;

      const hasDiffs = RESOLVABLE_FIELDS.some((f) => {
        const sv = srcPerson[f];
        const tv = tgtPerson[f];
        return sv !== tv && (sv != null || tv != null);
      });

      if (hasDiffs) {
        const resolution = Object.fromEntries(
          RESOLVABLE_FIELDS.map((f) => [f, 'target' as const]),
        ) as Record<ResolvableField, 'source' | 'target'>;

        newConflicts.push({
          personId: sourceId,
          sourcePerson: srcPerson,
          targetPerson: tgtPerson,
          resolution,
        });
      }
    }

    setConflicts(newConflicts);
    setStep(newConflicts.length > 0 ? 'resolve' : 'target');
  }, [personsMap]);

  const handleResolveConfirm = useCallback(() => {
    setStep('target');
  }, []);

  const handleTargetContinue = useCallback(() => {
    setStep('confirm');
  }, []);

  const handleConfirm = useCallback(() => {
    if (!targetConfig) return;

    const totalPersons = Array.from(personsMap.values()).reduce((sum, p) => sum + p.length, 0);
    const confirmedDups = Object.values(personMappings).filter(
      (v) => typeof v === 'string' && v !== 'new' && v !== 'skip',
    ).length;

    mergeMutation.mutate({
      sourceIds: lineageIds,
      target: targetConfig.target,
      personMappings,
      fieldResolutions: buildFieldResolutions(conflicts),
      deleteSources: targetConfig.deleteSources,
    });
  }, [targetConfig, lineageIds, personMappings, conflicts, personsMap, mergeMutation]);

  const lineageNames = useLineageNames(lineageIds);

  const totalPersons = useMemo(
    () => Array.from(personsMap.values()).reduce((sum, p) => sum + p.length, 0),
    [personsMap],
  );

  const confirmedDups = useMemo(
    () => Object.values(personMappings).filter(
      (v) => typeof v === 'string' && v !== 'new' && v !== 'skip',
    ).length,
    [personMappings],
  );

  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/lineage">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Quay lại
          </Link>
        </Button>
        <h1 className="text-xl font-bold">Gộp gia phả</h1>
      </div>

      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-1">
            <Badge variant={i <= stepIndex ? 'default' : 'outline'} className="text-xs">
              {i + 1}. {STEP_LABELS[s]}
            </Badge>
            {i < STEPS.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
          </div>
        ))}
      </div>
      <Progress value={progress} className="h-1" />

      {step === 'compare' && (
        <LineageCompareView
          lineageIds={lineageIds}
          personsMap={personsMap}
          isLoading={isLoadingPersons}
          onContinue={handleCompareComplete}
        />
      )}

      {step === 'match' && (
        <PersonMatchingWizard
          sources={sources}
          personsMap={personsMap}
          onComplete={handleMatchComplete}
          onCancel={() => setStep('compare')}
        />
      )}

      {step === 'resolve' && (
        <ConflictResolutionUI
          conflicts={conflicts}
          onChange={setConflicts}
          onConfirm={handleResolveConfirm}
        />
      )}

      {step === 'target' && (
        <MergeTargetSelector
          sourceIds={lineageIds}
          onChange={setTargetConfig}
          onContinue={handleTargetContinue}
        />
      )}

      {step === 'confirm' && targetConfig && (
        <MergeConfirmStep
          summary={{
            sourceCount: lineageIds.length,
            sourceNames: lineageNames,
            totalPersons,
            duplicatesResolved: confirmedDups,
            uniquePersons: totalPersons - confirmedDups,
            targetName: targetConfig.target.type === 'new' ? targetConfig.target.name : `Gia phả #${targetConfig.target.lineageId}`,
            deleteSources: targetConfig.deleteSources,
          }}
          progress={mergeProgress}
          onConfirm={handleConfirm}
          isLoading={mergeMutation.isPending}
        />
      )}
    </div>
  );
}

function useLineageNames(lineageIds: number[]): string[] {
  const queries = useQueries({
    queries: lineageIds.map((id) => ({
      queryKey: ['lineage', id] as const,
      queryFn: async () => {
        const res = await proxyFetch<ApiResponse<Lineage>>(`/lineages/${id}`);
        return res.data;
      },
    })),
  });

  return queries.map((q) => q.data?.name ?? `Gia phả #${lineageIds[queries.indexOf(q)]}`);
}

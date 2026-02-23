import { useQueries } from '@tanstack/react-query';
import type { Person } from '@/types/person';
import type { Relationship } from '@/types/relationship';
import type { Lineage } from '@/types/lineage';
import type { ApiResponse } from '@/types/api';
import { transformToFamilyChart, type TransformResult } from '@/lib/transforms/family-chart-transform';
import type { LineageSource } from '@/lib/transforms/merge-lineages';
import { LINEAGE_COLORS } from '@/config/feature-limits';

const PROXY = '/api/proxy';

async function proxyFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${PROXY}${path}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error || `L\u1ed7i ${res.status}`);
  }
  return res.json();
}

interface LineageData {
  lineage: Lineage;
  result: TransformResult;
}

async function fetchLineageData(lineageId: number): Promise<LineageData> {
  const [lineageRes, personsRes, relsRes] = await Promise.all([
    proxyFetch<ApiResponse<Lineage>>(`/lineages/${lineageId}`),
    proxyFetch<ApiResponse<Person[]>>(`/lineages/${lineageId}/persons?per_page=500`),
    proxyFetch<ApiResponse<Relationship[]>>(`/lineages/${lineageId}/relationships?per_page=500`),
  ]);
  return {
    lineage: lineageRes.data,
    result: transformToFamilyChart(personsRes.data, relsRes.data),
  };
}

export interface CombinedTreeResult {
  sources: LineageSource[];
  isLoading: boolean;
  errors: (Error | null)[];
}

export function useCombinedTreeData(lineageIds: number[]): CombinedTreeResult {
  const queries = useQueries({
    queries: lineageIds.map((id) => ({
      queryKey: ['combined-tree', id] as const,
      queryFn: () => fetchLineageData(id),
      enabled: id > 0,
      staleTime: 5 * 60 * 1000,
      structuralSharing: false as const,
    })),
  });

  const sources: LineageSource[] = queries
    .map((q, i) => {
      if (!q.data) return null;
      return {
        lineageId: lineageIds[i],
        lineageName: q.data.lineage.name,
        color: LINEAGE_COLORS[i % LINEAGE_COLORS.length],
        result: q.data.result,
      };
    })
    .filter((s): s is LineageSource => s !== null);

  return {
    sources,
    isLoading: queries.some((q) => q.isLoading),
    errors: queries.map((q) => q.error),
  };
}
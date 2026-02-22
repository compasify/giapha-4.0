import { useQuery } from '@tanstack/react-query';
import { Person } from '@/types/person';
import { Relationship } from '@/types/relationship';
import { ApiResponse } from '@/types/api';
import { transformToFamilyChart, type TransformResult } from '@/lib/transforms/family-chart-transform';

const PROXY = '/api/proxy';

async function proxyFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${PROXY}${path}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error || `Lỗi ${res.status}`);
  }
  return res.json();
}

export function useFamilyTreeData(lineageId: number) {
  return useQuery<TransformResult>({
    queryKey: ['family-tree', lineageId],
    queryFn: async () => {
      const [personsRes, relsRes] = await Promise.all([
        proxyFetch<ApiResponse<Person[]>>(`/lineages/${lineageId}/persons?per_page=500`),
        proxyFetch<ApiResponse<Relationship[]>>(`/lineages/${lineageId}/relationships?per_page=500`),
      ]);
      return transformToFamilyChart(personsRes.data, relsRes.data);
    },
    enabled: lineageId > 0,
    // TransformResult contains Map which breaks replaceEqualDeep —
    // disable structural sharing so invalidation always produces a new reference
    structuralSharing: false,
  });
}

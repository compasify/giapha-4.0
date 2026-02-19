import { useQuery } from '@tanstack/react-query';
import { Lineage } from '@/types/lineage';
import { ApiResponse } from '@/types/api';

async function proxyFetch<T>(path: string): Promise<T> {
  const res = await fetch(`/api/proxy${path}`);
  if (!res.ok) throw new Error(`Lỗi ${res.status}`);
  return res.json();
}

export function useLineages() {
  return useQuery<Lineage[]>({
    queryKey: ['lineages'],
    queryFn: () =>
      proxyFetch<ApiResponse<Lineage[]>>('/lineages').then((res) => res.data),
  });
}

export function useLineage(id: number) {
  return useQuery<Lineage>({
    queryKey: ['lineage', id],
    queryFn: () =>
      proxyFetch<ApiResponse<Lineage>>(`/lineages/${id}`).then((res) => res.data),
    enabled: id > 0,
  });
}

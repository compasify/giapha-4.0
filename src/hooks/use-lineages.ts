import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Lineage, LineageFormPayload } from '@/types/lineage';
import type { ApiResponse } from '@/types/api';

async function proxyFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/proxy${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error || `Lỗi ${res.status}`);
  }
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

export function useCreateLineage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LineageFormPayload) =>
      proxyFetch<ApiResponse<Lineage>>('/lineages', {
        method: 'POST',
        body: JSON.stringify({ lineage: payload }),
      }).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lineages'] });
    },
  });
}

export function useUpdateLineage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<LineageFormPayload> }) =>
      proxyFetch<ApiResponse<Lineage>>(`/lineages/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ lineage: payload }),
      }).then((res) => res.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['lineages'] });
      queryClient.invalidateQueries({ queryKey: ['lineage', data.id] });
    },
  });
}

export function useDeleteLineage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      proxyFetch(`/lineages/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lineages'] });
    },
  });
}

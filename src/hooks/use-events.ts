import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { GenealogyEvent, GenealogyEventSummary, EventType } from '@/types/event';
import type { ApiResponse, PaginationMeta } from '@/types/api';

const PROXY = '/api/proxy';

async function proxyFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${PROXY}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error || `Lỗi ${res.status}`);
  }
  return res.json();
}

interface EventsParams {
  page?: number;
  per_page?: number;
}

interface EventsResponse {
  data: GenealogyEventSummary[];
  meta: PaginationMeta;
}

export function useEvents(lineageId: number, params?: EventsParams) {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.per_page) query.set('per_page', String(params.per_page));
  const qs = query.toString() ? `?${query.toString()}` : '';

  return useQuery<EventsResponse>({
    queryKey: ['events', lineageId, params],
    queryFn: () =>
      proxyFetch<{ data: GenealogyEventSummary[]; meta: PaginationMeta }>(
        `/lineages/${lineageId}/events${qs}`
      ).then((res) => ({ data: res.data, meta: res.meta })),
    enabled: lineageId > 0,
  });
}

export function useEvent(eventId: number) {
  return useQuery<GenealogyEvent>({
    queryKey: ['event', eventId],
    queryFn: () =>
      proxyFetch<ApiResponse<GenealogyEvent>>(`/events/${eventId}`).then((res) => res.data),
    enabled: eventId > 0,
  });
}

export interface EventFormPayload {
  title: string;
  event_type: EventType;
  event_subtype?: string;
  description?: string;
  notes?: string;
  location?: string;
  is_recurring?: boolean;
  recurrence_type?: string;
  reminder_enabled?: boolean;
  reminder_days_before?: number;
  privacy_level?: number;
  participant_ids?: number[];
  flexible_dates_attributes?: Record<string, unknown>[];
}

export function useCreateEvent(lineageId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: EventFormPayload) =>
      proxyFetch<ApiResponse<GenealogyEvent>>(`/lineages/${lineageId}/events`, {
        method: 'POST',
        body: JSON.stringify({ event: payload }),
      }).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<EventFormPayload> }) =>
      proxyFetch<ApiResponse<GenealogyEvent>>(`/events/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ event: payload }),
      }).then((res) => res.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', data.id] });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      proxyFetch(`/events/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

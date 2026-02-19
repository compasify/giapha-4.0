import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Person } from '@/types/person';
import { ApiResponse, PaginationMeta } from '@/types/api';
import { PersonFormValues } from '@/lib/validations/person-schema';
import { parseFlexibleDateForApi } from '@/lib/utils/flexible-date-utils';

const PROXY = '/api/proxy';

async function proxyFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${PROXY}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error || `Lỗi ${res.status}`);
  }
  return res.json();
}

interface PersonsParams {
  name?: string;
  gender?: string;
  page?: number;
  per_page?: number;
}

interface PersonsResponse {
  data: Person[];
  meta: PaginationMeta;
}

function buildPersonPayload(values: PersonFormValues): Record<string, unknown> {
  const birthDatePayload = parseFlexibleDateForApi(values.birth_date, 'birth');
  const deathDatePayload = values.is_deceased
    ? parseFlexibleDateForApi(values.death_date, 'death')
    : null;

  return {
    person: {
      ho: values.ho,
      ten_dem: values.ten_dem || null,
      ten: values.ten,
      gender: values.gender,
      branch_id: values.branch_id ? parseInt(values.branch_id, 10) : null,
      generation_number: values.generation_number ? parseInt(values.generation_number, 10) : null,
      ten_thuong_goi: values.ten_thuong_goi || null,
      ten_huy: values.ten_huy || null,
      ten_thuy: values.ten_thuy || null,
      ten_hieu: values.ten_hieu || null,
      han_nom_name: values.han_nom_name || null,
      is_alive: !values.is_deceased,
      birth_place: values.birth_place || null,
      death_place: values.is_deceased ? (values.death_place || null) : null,
      biography: values.biography || null,
      notes: values.notes || null,
      address: values.address || null,
      phone: values.phone || null,
      email: values.email || null,
      ...(birthDatePayload ? { birth_date_attributes: birthDatePayload } : {}),
      ...(deathDatePayload ? { death_date_attributes: deathDatePayload } : {}),
    },
  };
}

export function usePersons(lineageId: number, params?: PersonsParams) {
  const query = new URLSearchParams();
  if (params?.name) query.set('q[full_name_cont]', params.name);
  if (params?.gender) query.set('q[gender_eq]', params.gender);
  if (params?.page) query.set('page', String(params.page));
  if (params?.per_page) query.set('per_page', String(params.per_page));
  const qs = query.toString() ? `?${query.toString()}` : '';

  return useQuery<PersonsResponse>({
    queryKey: ['persons', lineageId, params],
    queryFn: () =>
      proxyFetch<ApiResponse<Person[]>>(`/lineages/${lineageId}/persons${qs}`).then((res) => ({
        data: res.data,
        meta: res.meta as PaginationMeta,
      })),
    enabled: lineageId > 0,
  });
}

export function usePerson(id: number) {
  return useQuery<Person>({
    queryKey: ['person', id],
    queryFn: () =>
      proxyFetch<ApiResponse<Person>>(`/persons/${id}`).then((res) => res.data),
    enabled: id > 0,
  });
}

export function useCreatePerson(lineageId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: PersonFormValues) =>
      proxyFetch<ApiResponse<Person>>(`/lineages/${lineageId}/persons`, {
        method: 'POST',
        body: JSON.stringify(buildPersonPayload(values)),
      }).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['persons'] });
    },
  });
}

export function useUpdatePerson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: number; values: PersonFormValues }) =>
      proxyFetch<ApiResponse<Person>>(`/persons/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(buildPersonPayload(values)),
      }).then((res) => res.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['persons'] });
      queryClient.invalidateQueries({ queryKey: ['person', data.id] });
    },
  });
}

export function useDeletePerson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      proxyFetch(`/persons/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['persons'] });
    },
  });
}

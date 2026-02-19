import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { EditSidebarFormValues, AddRelativePayload } from '@/components/tree/edit-sidebar';

const PROXY = '/api/proxy';

export async function proxyFetch<T>(path: string, init?: RequestInit): Promise<T> {
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

function buildFlexDateEntry(
  dateType: 'birth' | 'death',
  year: string,
  month: string,
  day: string,
  existingId: number | null,
) {
  const hasValue = year || month || day;
  if (!hasValue && existingId) {
    return { id: existingId, _destroy: true };
  }
  if (!hasValue) return null;

  return {
    ...(existingId ? { id: existingId } : {}),
    date_type: dateType,
    solar_year: year ? parseInt(year, 10) : null,
    solar_month: month ? parseInt(month, 10) : null,
    solar_day: day ? parseInt(day, 10) : null,
    calendar_type: 'solar',
    date_qualifier: 'exact',
  };
}

function personPayload(values: EditSidebarFormValues) {
  const flexDates: Record<string, unknown>[] = [];

  const birthEntry = buildFlexDateEntry(
    'birth', values.birth_year, values.birth_month, values.birth_day, values.birth_date_id,
  );
  if (birthEntry) flexDates.push(birthEntry);

  if (!values.is_alive) {
    const deathEntry = buildFlexDateEntry(
      'death', values.death_year, values.death_month, values.death_day, values.death_date_id,
    );
    if (deathEntry) flexDates.push(deathEntry);
  }

  return {
    person: {
      ho: values.ho || null,
      ten_dem: values.ten_dem || null,
      ten: values.ten,
      gender: values.gender === 'M' ? 'male' : 'female',
      is_alive: values.is_alive,
      ...(flexDates.length > 0 ? { flexible_dates_attributes: flexDates } : {}),
    },
  };
}

export function useTreeCrud(lineageId: number) {
  const queryClient = useQueryClient();

  const invalidateTree = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['family-tree', lineageId] });
  }, [queryClient, lineageId]);

  const handleSave = useCallback(async (personId: string, values: EditSidebarFormValues) => {
    await proxyFetch(`/persons/${personId}`, {
      method: 'PATCH',
      body: JSON.stringify(personPayload(values)),
    });
    invalidateTree();
  }, [invalidateTree]);

  const handleDelete = useCallback(async (personId: string) => {
    await proxyFetch(`/persons/${personId}`, { method: 'DELETE' });
    invalidateTree();
  }, [invalidateTree]);

  const handleAddRelative = useCallback(async (payload: AddRelativePayload) => {
    const { personId, relativeType, spouseRelationType, values } = payload;

    const newPersonRes = await proxyFetch<{ data: { id: number } }>(
      `/lineages/${lineageId}/persons`,
      { method: 'POST', body: JSON.stringify(personPayload(values)) }
    );
    const newId = String(newPersonRes.data.id);

    let fromId: string, toId: string, relationshipType: string;

    if (relativeType === 'father' || relativeType === 'mother') {
      fromId = newId; toId = personId; relationshipType = 'biological_parent';
    } else if (relativeType === 'son' || relativeType === 'daughter') {
      fromId = personId; toId = newId; relationshipType = 'biological_parent';
    } else {
      fromId = personId; toId = newId; relationshipType = spouseRelationType ?? 'spouse_married';
    }

    await proxyFetch(`/lineages/${lineageId}/relationships`, {
      method: 'POST',
      body: JSON.stringify({
        relationship: {
          from_person_id: parseInt(fromId, 10),
          to_person_id: parseInt(toId, 10),
          relationship_type: relationshipType,
          lineage_id: lineageId,
        },
      }),
    });

    invalidateTree();
  }, [lineageId, invalidateTree]);

  return { handleSave, handleDelete, handleAddRelative };
}

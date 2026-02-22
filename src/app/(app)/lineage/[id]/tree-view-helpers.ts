import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { EditSidebarFormValues, AddRelativePayload, ParentRelationType, SpouseRelationType, CalendarType } from '@/components/tree/edit-sidebar';
import type { SetParentPayload, RemoveParentPayload } from '@/components/tree/parents-section';

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

interface FlexDateInput {
  dateType: 'birth' | 'death';
  solarYear: string;
  solarMonth: string;
  solarDay: string;
  lunarYear: string;
  lunarMonth: string;
  lunarDay: string;
  lunarLeapMonth: boolean;
  calendarType: CalendarType;
  existingId: number | null;
}

function buildFlexDateEntry(input: FlexDateInput) {
  const { dateType, solarYear, solarMonth, solarDay, lunarYear, lunarMonth, lunarDay, lunarLeapMonth, calendarType, existingId } = input;
  const hasSolar = solarYear || solarMonth || solarDay;
  const hasLunar = lunarYear || lunarMonth || lunarDay;
  const hasValue = hasSolar || hasLunar;

  if (!hasValue && existingId) {
    return { id: existingId, _destroy: true };
  }
  if (!hasValue) return null;

  return {
    ...(existingId ? { id: existingId } : {}),
    date_type: dateType,
    solar_year: solarYear ? parseInt(solarYear, 10) : null,
    solar_month: solarMonth ? parseInt(solarMonth, 10) : null,
    solar_day: solarDay ? parseInt(solarDay, 10) : null,
    lunar_year: lunarYear ? parseInt(lunarYear, 10) : null,
    lunar_month: lunarMonth ? parseInt(lunarMonth, 10) : null,
    lunar_day: lunarDay ? parseInt(lunarDay, 10) : null,
    lunar_leap_month: lunarLeapMonth,
    calendar_type: calendarType,
    date_qualifier: 'exact',
  };
}

function personPayload(values: EditSidebarFormValues) {
  const flexDates: Record<string, unknown>[] = [];

  const birthEntry = buildFlexDateEntry({
    dateType: 'birth',
    solarYear: values.birth_year,
    solarMonth: values.birth_month,
    solarDay: values.birth_day,
    lunarYear: values.birth_lunar_year,
    lunarMonth: values.birth_lunar_month,
    lunarDay: values.birth_lunar_day,
    lunarLeapMonth: values.birth_lunar_leap_month,
    calendarType: values.birth_calendar_type,
    existingId: values.birth_date_id,
  });
  if (birthEntry) flexDates.push(birthEntry);

  if (!values.is_alive) {
    const deathEntry = buildFlexDateEntry({
      dateType: 'death',
      solarYear: values.death_year,
      solarMonth: values.death_month,
      solarDay: values.death_day,
      lunarYear: values.death_lunar_year,
      lunarMonth: values.death_lunar_month,
      lunarDay: values.death_lunar_day,
      lunarLeapMonth: values.death_lunar_leap_month,
      calendarType: values.death_calendar_type,
      existingId: values.death_date_id,
    });
    if (deathEntry) flexDates.push(deathEntry);
  }

  return {
    person: {
      ho: values.ho || null,
      ten_dem: values.ten_dem || null,
      ten: values.ten,
      gender: values.gender === 'M' ? 'male' : 'female',
      is_alive: values.is_alive,
      ...(values.avatar !== undefined ? { avatar: values.avatar } : {}),
      ...(flexDates.length > 0 ? { flexible_dates_attributes: flexDates } : {}),
    },
  };
}

export interface LinkExistingSpousePayload {
  personId: string;
  existingSpouseId: string;
  spouseRelationType: SpouseRelationType;
}

export function useTreeCrud(lineageId: number) {
  const queryClient = useQueryClient();

  const invalidateTree = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['family-tree', lineageId] });
  }, [queryClient, lineageId]);

  const handleSave = useCallback(async (personId: string, values: EditSidebarFormValues) => {
    await proxyFetch(`/persons/${personId}`, {
      method: 'PATCH',
      body: JSON.stringify(personPayload(values)),
    });
    await invalidateTree();
  }, [invalidateTree]);

  const handleDelete = useCallback(async (personId: string) => {
    await proxyFetch(`/persons/${personId}`, { method: 'DELETE' });
    await invalidateTree();
  }, [invalidateTree]);

  const handleAddRelative = useCallback(async (payload: AddRelativePayload) => {
    const { personId, relativeType, spouseRelationType, parentRelationType, coParentId, sharedChildIds, values } = payload;

    const newPersonRes = await proxyFetch<{ data: { id: number } }>(
      `/lineages/${lineageId}/persons`,
      { method: 'POST', body: JSON.stringify(personPayload(values)) }
    );
    const newId = String(newPersonRes.data.id);

    let fromId: string, toId: string, relationshipType: string;

    if (relativeType === 'father' || relativeType === 'mother') {
      fromId = newId; toId = personId; relationshipType = parentRelationType ?? 'biological_parent';
    } else if (relativeType === 'son' || relativeType === 'daughter') {
      fromId = personId; toId = newId; relationshipType = parentRelationType ?? 'biological_parent';
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

    // Auto-link child to co-parent (spouse) when adding son/daughter
    if ((relativeType === 'son' || relativeType === 'daughter') && coParentId) {
      await proxyFetch(`/lineages/${lineageId}/relationships`, {
        method: 'POST',
        body: JSON.stringify({
          relationship: {
            from_person_id: parseInt(coParentId, 10),
            to_person_id: parseInt(newId, 10),
            relationship_type: parentRelationType ?? 'biological_parent',
            lineage_id: lineageId,
          },
        }),
      });
    }

    // Link existing children as shared children of the new spouse
    if (relativeType === 'spouse' && sharedChildIds && sharedChildIds.length > 0) {
      await Promise.all(
        sharedChildIds.map((childId) =>
          proxyFetch(`/lineages/${lineageId}/relationships`, {
            method: 'POST',
            body: JSON.stringify({
              relationship: {
                from_person_id: parseInt(newId, 10),
                to_person_id: parseInt(childId, 10),
                relationship_type: 'biological_parent',
                lineage_id: lineageId,
              },
            }),
          })
        )
      );
    }

    await invalidateTree();
  }, [lineageId, invalidateTree]);

  const handleLinkExistingSpouse = useCallback(async (payload: LinkExistingSpousePayload) => {
    const { personId, existingSpouseId, spouseRelationType } = payload;

    await proxyFetch(`/lineages/${lineageId}/relationships`, {
      method: 'POST',
      body: JSON.stringify({
        relationship: {
          from_person_id: parseInt(personId, 10),
          to_person_id: parseInt(existingSpouseId, 10),
          relationship_type: spouseRelationType,
          lineage_id: lineageId,
        },
      }),
    });

    await invalidateTree();
  }, [lineageId, invalidateTree]);

  return { handleSave, handleDelete, handleAddRelative, handleLinkExistingSpouse };
}

export function useReorderChildren(lineageId: number) {
  const queryClient = useQueryClient();

  return useCallback(async (orderedChildIds: string[]) => {
    await Promise.all(
      orderedChildIds.map((id, index) =>
        proxyFetch(`/persons/${id}`, {
          method: 'PATCH',
          body: JSON.stringify({ person: { birth_order: index + 1 } }),
        })
      )
    );
    await queryClient.refetchQueries({ queryKey: ['family-tree', lineageId] });
  }, [lineageId, queryClient]);
}

export function useReparent(lineageId: number) {
  const queryClient = useQueryClient();

  return useCallback(async (
    childId: string,
    newParentId: string,
    relationshipType: ParentRelationType,
    oldRelationshipId: number,
  ) => {
    await proxyFetch(`/relationships/${oldRelationshipId}`, { method: 'DELETE' });
    await proxyFetch(`/lineages/${lineageId}/relationships`, {
      method: 'POST',
      body: JSON.stringify({
        relationship: {
          from_person_id: parseInt(newParentId, 10),
          to_person_id: parseInt(childId, 10),
          relationship_type: relationshipType,
          lineage_id: lineageId,
        },
      }),
    });
    await queryClient.invalidateQueries({ queryKey: ['family-tree', lineageId] });
  }, [lineageId, queryClient]);
}

export interface RootPersonPayload {
  ho: string;
  ten_dem: string;
  ten: string;
  gender: 'male' | 'female';
}

export function useCreateRootPerson(lineageId: number) {
  const queryClient = useQueryClient();

  return useCallback(async (payload: RootPersonPayload) => {
    await proxyFetch(`/lineages/${lineageId}/persons`, {
      method: 'POST',
      body: JSON.stringify({
        person: {
          ho: payload.ho || null,
          ten_dem: payload.ten_dem || null,
          ten: payload.ten,
          gender: payload.gender,
          is_alive: false,
        },
      }),
    });
    await queryClient.invalidateQueries({ queryKey: ['family-tree', lineageId] });
  }, [lineageId, queryClient]);
}

export function useSetParent(lineageId: number) {
  const queryClient = useQueryClient();

  return useCallback(async (payload: SetParentPayload) => {
    await proxyFetch(`/lineages/${lineageId}/relationships`, {
      method: 'POST',
      body: JSON.stringify({
        relationship: {
          from_person_id: parseInt(payload.parentId, 10),
          to_person_id: parseInt(payload.childId, 10),
          relationship_type: payload.relationType,
          lineage_id: lineageId,
        },
      }),
    });
    await queryClient.invalidateQueries({ queryKey: ['family-tree', lineageId] });
  }, [lineageId, queryClient]);
}

export function useRemoveParent(lineageId: number) {
  const queryClient = useQueryClient();

  return useCallback(async (payload: RemoveParentPayload) => {
    await proxyFetch(`/relationships/${payload.relationshipId}`, { method: 'DELETE' });
    await queryClient.invalidateQueries({ queryKey: ['family-tree', lineageId] });
  }, [lineageId, queryClient]);
}

export function useAddAncestor(lineageId: number) {
  const queryClient = useQueryClient();

  return useCallback(async (childPersonId: string) => {
    const newPersonRes = await proxyFetch<{ data: { id: number } }>(
      `/lineages/${lineageId}/persons`,
      {
        method: 'POST',
        body: JSON.stringify({
          person: { ho: null, ten_dem: null, ten: '(Chưa rõ)', gender: 'male', is_alive: false },
        }),
      },
    );
    const newId = newPersonRes.data.id;

    await proxyFetch(`/lineages/${lineageId}/relationships`, {
      method: 'POST',
      body: JSON.stringify({
        relationship: {
          from_person_id: newId,
          to_person_id: parseInt(childPersonId, 10),
          relationship_type: 'biological_parent',
          lineage_id: lineageId,
        },
      }),
    });

    await queryClient.invalidateQueries({ queryKey: ['family-tree', lineageId] });
  }, [lineageId, queryClient]);
}

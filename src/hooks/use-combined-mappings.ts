import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { PersonMappings } from '@/lib/transforms/person-matching';
import type { ApiResponse } from '@/types/api';
import type { Lineage } from '@/types/lineage';

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

function mappingsKey(lineageIds: number[]): string {
  return [...lineageIds].sort((a, b) => a - b).join('_');
}

interface StoredMappings {
  version: 1;
  lineageIds: number[];
  createdAt: string;
  updatedAt: string;
  mappings: PersonMappings;
}

export function useCombinedMappings(lineageIds: number[]) {
  const queryClient = useQueryClient();
  const primaryId = lineageIds[0];
  const key = mappingsKey(lineageIds);

  const { data: storedMappings, isLoading: isLoadingMappings } = useQuery<PersonMappings | null>({
    queryKey: ['combined-mappings', key],
    queryFn: async () => {
      try {
        const res = await proxyFetch<ApiResponse<Lineage>>(`/lineages/${primaryId}`);
        const settings = res.data.settings as Record<string, unknown>;
        const allMappings = settings?.combined_mappings as Record<string, StoredMappings> | undefined;
        if (!allMappings?.[key]) return null;
        return allMappings[key].mappings;
      } catch {
        return tryLocalStorage(key);
      }
    },
    enabled: primaryId > 0 && lineageIds.length >= 2,
  });

  const { mutate: saveMappings } = useMutation({
    mutationFn: async (mappings: PersonMappings) => {
      const stored: StoredMappings = {
        version: 1,
        lineageIds,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        mappings,
      };

      try {
        await proxyFetch(`/lineages/${primaryId}`, {
          method: 'PATCH',
          body: JSON.stringify({
            lineage: {
              settings: {
                combined_mappings: { [key]: stored },
              },
            },
          }),
        });
      } catch {
        saveToLocalStorage(key, stored);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['combined-mappings', key] });
    },
  });

  return {
    mappings: storedMappings ?? null,
    isLoadingMappings,
    saveMappings,
  };
}

const LS_PREFIX = 'amlich_combined_mappings_';

function tryLocalStorage(key: string): PersonMappings | null {
  try {
    const raw = localStorage.getItem(`${LS_PREFIX}${key}`);
    if (!raw) return null;
    const stored = JSON.parse(raw) as StoredMappings;
    return stored.mappings;
  } catch {
    return null;
  }
}

function saveToLocalStorage(key: string, stored: StoredMappings): void {
  try {
    localStorage.setItem(`${LS_PREFIX}${key}`, JSON.stringify(stored));
  } catch {
    // localStorage full or unavailable — silently skip
  }
}

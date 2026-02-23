'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { proxyFetch } from '@/app/(app)/lineage/[id]/tree-view-helpers';
import type { ApiResponse } from '@/types/api';
import type { PersonMappings } from '@/lib/transforms/person-matching';
import type { ConflictItem, ResolvableField } from '@/components/tree/conflict-resolution-ui';

// ── Types ────────────────────────────────────────────────────────────────────

export type MergeTarget =
  | { type: 'new'; name: string }
  | { type: 'existing'; lineageId: number };

export interface MergeParams {
  sourceIds: number[];
  target: MergeTarget;
  personMappings: PersonMappings;
  fieldResolutions: Record<string, Record<ResolvableField, 'source' | 'target'>>;
  deleteSources: boolean;
}

interface MergeApiResponse {
  lineage: { id: number; name: string };
  stats: { persons_merged: number; rels_merged: number; duplicates_resolved: number };
  sources_deleted: boolean;
}

interface CloneResponse {
  lineage: { id: number; name: string };
}

// ── Progress tracking ────────────────────────────────────────────────────────

export type MergeProgress = 'idle' | 'snapshotting' | 'merging' | 'done';

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useMergeLineages(onProgress?: (progress: MergeProgress) => void) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (params: MergeParams) => {
      // Step 1: Snapshot all source lineages (auto-backup)
      onProgress?.('snapshotting');
      await Promise.all(
        params.sourceIds.map((id) =>
          proxyFetch<ApiResponse<CloneResponse>>(
            `/lineages/${id}/clone`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: `[Backup trước gộp] ${new Date().toLocaleDateString('vi-VN')}`,
              }),
            },
          ),
        ),
      );

      // Step 2: Call merge API
      onProgress?.('merging');
      const body: Record<string, unknown> = {
        source_ids: params.sourceIds,
        person_mappings: params.personMappings,
        field_resolutions: params.fieldResolutions,
        delete_sources: params.deleteSources,
      };

      if (params.target.type === 'new') {
        body.target_name = params.target.name;
      } else {
        body.target_id = params.target.lineageId;
      }

      const response = await proxyFetch<ApiResponse<MergeApiResponse>>(
        '/lineages/merge',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        },
      );

      onProgress?.('done');
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['lineages'] });
      toast.success(`Đã gộp thành công! ${data.stats.persons_merged} thành viên, ${data.stats.rels_merged} quan hệ.`);
      router.push(`/lineage/${data.lineage.id}`);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Lỗi khi gộp gia phả');
    },
  });
}

// ── Helper: build field resolutions from ConflictItem[] ──────────────────────

export function buildFieldResolutions(
  conflicts: ConflictItem[],
): Record<string, Record<ResolvableField, 'source' | 'target'>> {
  const resolutions: Record<string, Record<ResolvableField, 'source' | 'target'>> = {};
  for (const conflict of conflicts) {
    resolutions[conflict.personId] = conflict.resolution;
  }
  return resolutions;
}

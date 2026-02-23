'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { proxyFetch } from '@/app/(app)/lineage/[id]/tree-view-helpers';
import type { ApiResponse } from '@/types/api';
import type { SplitMode } from '@/components/tree/split-name-dialog';

export interface SplitLineageParams {
  newName: string;
  personIds: number[];
  splitMode: SplitMode;
  createSnapshot: boolean;
  sourceLineageName: string;
}

interface CloneResponse {
  lineage: {
    id: number;
    name: string;
  };
}

export function useSplitLineage(lineageId: number) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (params: SplitLineageParams) => {
      if (params.splitMode === 'move' && params.createSnapshot) {
        const snapshotName = `[Backup] ${params.sourceLineageName} - ${new Date().toLocaleDateString('vi-VN')}`;
        await proxyFetch<ApiResponse<CloneResponse>>(
          `/lineages/${lineageId}/clone`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: snapshotName }),
          }
        );
      }

      const response = await proxyFetch<ApiResponse<CloneResponse>>(
        `/lineages/${lineageId}/clone`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: params.newName,
            person_ids: params.personIds,
            remove_from_source: params.splitMode === 'move',
          }),
        }
      );

      return response.data.lineage;
    },
    onSuccess: (data, params) => {
      queryClient.invalidateQueries({ queryKey: ['lineages'] });
      queryClient.invalidateQueries({ queryKey: ['family-tree', lineageId] });
      const msg = params.splitMode === 'copy' ? 'Đã sao chép nhánh thành công!' : 'Đã tách nhánh thành công!';
      toast.success(msg);
      router.push(`/lineage/${data.id}`);
    },
    onError: () => {
      toast.error('Lỗi khi tách nhánh');
    },
  });
}

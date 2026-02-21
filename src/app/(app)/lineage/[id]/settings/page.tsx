'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { LineageForm } from '@/components/lineage/lineage-form';
import { PrivacySettingsSection } from '@/components/lineage/privacy-settings-section';
import { useLineage, useUpdateLineage, useDeleteLineage } from '@/hooks/use-lineages';

export default function LineageSettingsPage() {
  const { id } = useParams<{ id: string }>();
  const lineageId = parseInt(id, 10);
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data: lineage, isLoading } = useLineage(lineageId);
  const updateMutation = useUpdateLineage();
  const deleteMutation = useDeleteLineage();

  async function handleDelete() {
    try {
      await deleteMutation.mutateAsync(lineageId);
      toast.success('Đã xóa gia phả');
      router.push('/lineage');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không thể xóa gia phả');
    }
    setDeleteOpen(false);
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!lineage) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Không tìm thấy gia phả.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-10">
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">Cài đặt gia phả</h1>
        <LineageForm lineage={lineage} onSuccess={() => router.refresh()} />
      </section>

      <PrivacySettingsSection
        lineageId={lineageId}
        currentLevel={lineage.privacy_level}
        onUpdate={async (level) => {
          await updateMutation.mutateAsync({ id: lineageId, payload: { privacy_level: level } });
        }}
      />

      <section className="space-y-4 border border-destructive/30 rounded-lg p-6">
        <div>
          <h2 className="text-lg font-semibold text-destructive">Khu vực nguy hiểm</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Những thao tác này không thể hoàn tác. Hãy cẩn thận.
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">Xóa gia phả này</p>
            <p className="text-xs text-muted-foreground">
              Toàn bộ dữ liệu thành viên, sự kiện sẽ bị xóa vĩnh viễn.
            </p>
          </div>

          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa gia phả
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Xác nhận xóa gia phả</DialogTitle>
                <DialogDescription>
                  Bạn có chắc muốn xóa <strong>{lineage.name}</strong>? Thao tác này không thể
                  hoàn tác và toàn bộ dữ liệu sẽ bị mất.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                  Hủy
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? 'Đang xóa...' : 'Xóa vĩnh viễn'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </div>
  );
}

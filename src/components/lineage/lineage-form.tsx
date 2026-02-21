'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateLineage, useUpdateLineage } from '@/hooks/use-lineages';
import type { Lineage, LineageFormPayload } from '@/types/lineage';

interface LineageFormProps {
  lineage?: Lineage;
  onSuccess?: () => void;
}

export function LineageForm({ lineage, onSuccess }: LineageFormProps) {
  const router = useRouter();
  const isEdit = !!lineage;

  const [name, setName] = useState(lineage?.name ?? '');
  const [description, setDescription] = useState(lineage?.description ?? '');
  const [originStory, setOriginStory] = useState(lineage?.origin_story ?? '');
  const [originLocation, setOriginLocation] = useState(lineage?.origin_location ?? '');

  const createMutation = useCreateLineage();
  const updateMutation = useUpdateLineage();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    const payload: LineageFormPayload = {
      name: name.trim(),
      description: description.trim() || undefined,
      origin_story: originStory.trim() || undefined,
      origin_location: originLocation.trim() || undefined,
    };

    try {
      if (isEdit && lineage) {
        await updateMutation.mutateAsync({ id: lineage.id, payload });
        toast.success('Cập nhật gia phả thành công');
        onSuccess?.();
      } else {
        const created = await createMutation.mutateAsync(payload);
        toast.success('Tạo gia phả thành công');
        router.push(`/lineage/${created.id}`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <Label htmlFor="name">Tên gia phả *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ví dụ: Gia phả họ Nguyễn"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Mô tả</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Mô tả ngắn về gia phả..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="origin-location">Quê gốc / Địa danh xuất phát</Label>
        <Input
          id="origin-location"
          value={originLocation}
          onChange={(e) => setOriginLocation(e.target.value)}
          placeholder="Ví dụ: Làng Vạn Phúc, Hà Đông, Hà Nội"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="origin-story">Câu chuyện nguồn gốc</Label>
        <Textarea
          id="origin-story"
          value={originStory}
          onChange={(e) => setOriginStory(e.target.value)}
          placeholder="Kể ngắn gọn nguồn gốc của dòng họ..."
          rows={5}
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Tạo gia phả'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Hủy
        </Button>
      </div>
    </form>
  );
}

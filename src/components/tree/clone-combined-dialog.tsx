'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import type { FamilyChartDatum } from '@/lib/transforms/family-chart-transform';
import { parseNamespacedId } from '@/lib/transforms/person-matching';
import type { ApiResponse } from '@/types/api';
import type { Lineage } from '@/types/lineage';

interface CloneCombinedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  primaryLineageId: number;
  mergedData: FamilyChartDatum[];
}

export function CloneCombinedDialog({
  open,
  onOpenChange,
  primaryLineageId,
  mergedData,
}: CloneCombinedDialogProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [isCloning, setIsCloning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClone = useCallback(async () => {
    if (!name.trim()) return;
    setIsCloning(true);
    setError(null);

    try {
      const personIds = mergedData.map((d) => {
        try {
          return parseNamespacedId(d.id).personId;
        } catch {
          return Number(d.id);
        }
      });

      const res = await fetch(`/api/proxy/lineages/${primaryLineageId}/clone`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), person_ids: personIds }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `Lỗi ${res.status}`);
      }

      const data = (await res.json()) as ApiResponse<Lineage>;
      onOpenChange(false);
      router.push(`/lineage/${data.data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tạo bản sao');
    } finally {
      setIsCloning(false);
    }
  }, [name, mergedData, primaryLineageId, onOpenChange, router]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Lưu thành gia phả mới</DialogTitle>
          <DialogDescription>
            Tạo một gia phả mới từ {mergedData.length} thành viên trong cây kết hợp.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="clone-name">Tên gia phả mới</Label>
            <Input
              id="clone-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Gia phả họ Nguyễn (gộp)"
              onKeyDown={(e) => e.key === 'Enter' && handleClone()}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isCloning}>
            Hủy
          </Button>
          <Button onClick={handleClone} disabled={!name.trim() || isCloning}>
            {isCloning && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
            Tạo bản sao
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

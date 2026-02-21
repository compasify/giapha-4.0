'use client';

import { useState } from 'react';
import { TreePine, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { RootPersonPayload } from '@/app/(app)/lineage/[id]/tree-view-helpers';

interface EmptyTreeStateProps {
  onCreateRoot: (payload: RootPersonPayload) => Promise<void>;
}

export function EmptyTreeState({ onCreateRoot }: EmptyTreeStateProps) {
  const [open, setOpen] = useState(false);
  const [ho, setHo] = useState('');
  const [ten, setTen] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ten.trim()) return;

    setIsSubmitting(true);
    try {
      await onCreateRoot({ ho: ho.trim(), ten: ten.trim(), gender });
      toast.success('Đã thêm tổ tiên đầu tiên');
      setOpen(false);
      setHo('');
      setTen('');
      setGender('male');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4 text-muted-foreground">
      <TreePine className="h-16 w-16 opacity-20" />
      <div className="text-center">
        <p className="text-lg font-medium">Dòng họ chưa có thành viên nào</p>
        <p className="text-sm mt-1">Bắt đầu bằng cách thêm tổ tiên đầu tiên (ông tổ / bà tổ).</p>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Thêm tổ tiên đầu tiên
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Thêm tổ tiên đầu tiên</DialogTitle>
              <DialogDescription>
                Người này sẽ là gốc của cây gia phả. Bạn có thể bổ sung thông tin chi tiết sau.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="root-ho">Họ</Label>
                <Input
                  id="root-ho"
                  value={ho}
                  onChange={(e) => setHo(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="root-ten">Tên *</Label>
                <Input
                  id="root-ten"
                  value={ten}
                  onChange={(e) => setTen(e.target.value)}
                  placeholder="Ví dụ: Tổ"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Giới tính</Label>
                <Select value={gender} onValueChange={(v) => setGender(v as 'male' | 'female')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Nam</SelectItem>
                    <SelectItem value="female">Nữ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Đang tạo...' : 'Thêm tổ tiên'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import type { ParentRelationType } from '@/components/tree/edit-sidebar';

interface ReparentConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  childName: string;
  newParentName: string;
  onConfirm: (relationshipType: ParentRelationType) => void;
}

export function ReparentConfirmDialog({
  open,
  onOpenChange,
  childName,
  newParentName,
  onConfirm,
}: ReparentConfirmDialogProps) {
  const [relType, setRelType] = useState<ParentRelationType>('biological_parent');

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Di chuyển thành viên</AlertDialogTitle>
          <AlertDialogDescription>
            Di chuyển <strong>{childName}</strong> thành con của <strong>{newParentName}</strong>?
            Quan hệ với cha/mẹ cũ sẽ bị xóa.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2 py-2">
          <Label className="text-sm">Loại quan hệ mới</Label>
          <Select value={relType} onValueChange={(v) => setRelType(v as ParentRelationType)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="biological_parent">Con ruột</SelectItem>
              <SelectItem value="adoptive_parent">Con nuôi</SelectItem>
              <SelectItem value="informal_adoptive">Con nuôi (không chính thức)</SelectItem>
              <SelectItem value="step_parent">Con riêng</SelectItem>
              <SelectItem value="foster_parent">Con nuôi tạm</SelectItem>
              <SelectItem value="godparent">Kết nghĩa (cha/mẹ đỡ đầu)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={() => onConfirm(relType)}>Xác nhận</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

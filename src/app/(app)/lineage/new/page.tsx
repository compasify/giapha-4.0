'use client';

import { LineageForm } from '@/components/lineage/lineage-form';

export default function LineageNewPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tạo gia phả mới</h1>
        <p className="text-muted-foreground mt-1">
          Điền thông tin để khởi tạo gia phả. Bạn sẽ là tộc trưởng của gia phả này.
        </p>
      </div>
      <LineageForm />
    </div>
  );
}

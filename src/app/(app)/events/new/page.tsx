'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { EventForm } from '@/components/events/event-form';

function EventNewContent() {
  const searchParams = useSearchParams();
  const lineageId = parseInt(searchParams.get('lineage_id') ?? '0', 10);

  if (!lineageId) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Thiếu thông tin dòng họ. Vui lòng quay lại và chọn dòng họ.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Tạo sự kiện mới</h1>
      <EventForm lineageId={lineageId} />
    </div>
  );
}

export default function EventNewPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full max-w-2xl mx-auto" />}>
      <EventNewContent />
    </Suspense>
  );
}

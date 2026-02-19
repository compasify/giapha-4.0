'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { PersonForm } from '@/components/person/person-form';
import { useCreatePerson } from '@/hooks/use-persons';
import { PersonFormValues } from '@/lib/validations/person-schema';

function PersonNewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lineageId = parseInt(searchParams.get('lineage_id') ?? '0', 10);

  const createPerson = useCreatePerson(lineageId);

  async function handleSubmit(values: PersonFormValues) {
    const person = await createPerson.mutateAsync(values);
    toast.success('Tạo thành viên thành công');
    router.push(`/person/${person.id}`);
  }

  if (!lineageId) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Thiếu thông tin dòng họ. Vui lòng quay lại và chọn dòng họ.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Thêm thành viên mới</h1>
      <PersonForm
        mode="create"
        onSubmit={handleSubmit}
        isSubmitting={createPerson.isPending}
      />
    </div>
  );
}

export default function PersonNewPage() {
  return (
    <Suspense>
      <PersonNewContent />
    </Suspense>
  );
}

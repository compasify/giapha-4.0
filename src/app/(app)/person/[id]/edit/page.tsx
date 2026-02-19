'use client';

import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { usePerson, useUpdatePerson } from '@/hooks/use-persons';
import { PersonForm } from '@/components/person/person-form';
import { PersonFormValues } from '@/lib/validations/person-schema';

export default function PersonEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string, 10);

  const { data: person, isLoading, isError } = usePerson(id);
  const updatePerson = useUpdatePerson();

  async function handleSubmit(values: PersonFormValues) {
    await updatePerson.mutateAsync({ id, values });
    toast.success('Cập nhật thành công');
    router.push(`/person/${id}`);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        Đang tải...
      </div>
    );
  }

  if (isError || !person) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        Không tìm thấy thành viên.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Chỉnh sửa thông tin</h1>
      <PersonForm
        mode="edit"
        initialData={person}
        onSubmit={handleSubmit}
        isSubmitting={updatePerson.isPending}
      />
    </div>
  );
}

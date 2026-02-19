'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { usePerson, useDeletePerson } from '@/hooks/use-persons';
import { PersonProfile } from '@/components/person/person-profile';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function PersonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string, 10);

  const { data: person, isLoading, isError } = usePerson(id);
  const deletePerson = useDeletePerson();

  async function handleDelete() {
    await deletePerson.mutateAsync(id);
    toast.success('Đã xóa thành viên');
    router.push('/person');
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
      <div className="flex flex-col items-center gap-4 py-12 text-muted-foreground">
        <p>Không tìm thấy thành viên.</p>
        <Button variant="outline" asChild>
          <Link href="/person">Quay lại danh sách</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href="/person">← Danh sách</Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/person/${id}/edit`}>Chỉnh sửa</Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">Xóa</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                <AlertDialogDescription>
                  Bạn có chắc muốn xóa <strong>{person.full_name}</strong>?
                  Hành động này không thể hoàn tác.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deletePerson.isPending ? 'Đang xóa...' : 'Xóa'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <PersonProfile person={person} />
    </div>
  );
}

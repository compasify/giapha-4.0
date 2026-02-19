'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { PersonCard } from '@/components/person/person-card';
import { usePersons } from '@/hooks/use-persons';

interface PersonListProps {
  lineageId: number;
}

const GENDER_OPTIONS = [
  { value: '', label: 'Tất cả giới tính' },
  { value: 'male', label: 'Nam' },
  { value: 'female', label: 'Nữ' },
  { value: 'other', label: 'Khác' },
];

const PER_PAGE = 20;

export function PersonList({ lineageId }: PersonListProps) {
  const [search, setSearch] = useState('');
  const [gender, setGender] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = usePersons(lineageId, {
    name: search || undefined,
    gender: gender || undefined,
    page,
    per_page: PER_PAGE,
  });

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    setPage(1);
  }

  function handleGenderChange(value: string) {
    setGender(value === 'all' ? '' : value);
    setPage(1);
  }

  const totalPages = data?.meta?.total_pages ?? 1;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Tìm kiếm theo tên..."
          value={search}
          onChange={handleSearchChange}
          className="max-w-xs"
        />
        <Select value={gender || 'all'} onValueChange={handleGenderChange}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {GENDER_OPTIONS.map((opt) => (
              <SelectItem key={opt.value || 'all'} value={opt.value || 'all'}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Link href={`/person/new?lineage_id=${lineageId}`} className="ml-auto">
          <Button>Thêm thành viên</Button>
        </Link>
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-lg" />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-destructive">Không thể tải danh sách thành viên.</p>
      )}

      {data && data.data.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>Chưa có thành viên nào.</p>
          <Link href={`/person/new?lineage_id=${lineageId}`}>
            <Button variant="outline" className="mt-3">
              Thêm thành viên đầu tiên
            </Button>
          </Link>
        </div>
      )}

      {data && data.data.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {data.data.map((person) => (
              <PersonCard key={person.id} person={person} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                Trước
              </Button>
              <span className="flex items-center text-sm text-muted-foreground px-2">
                Trang {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Sau
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

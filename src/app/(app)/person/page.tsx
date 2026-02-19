'use client';

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { PersonList } from '@/components/person/person-list';
import { useLineages } from '@/hooks/use-lineages';

export default function PersonsPage() {
  const [selectedLineageId, setSelectedLineageId] = useState<number>(0);
  const { data: lineages, isLoading } = useLineages();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Thành viên gia phả</h1>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground">Dòng họ:</span>
        {isLoading ? (
          <Skeleton className="h-9 w-56" />
        ) : (
          <Select
            value={selectedLineageId > 0 ? String(selectedLineageId) : ''}
            onValueChange={(v) => setSelectedLineageId(parseInt(v, 10))}
          >
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Chọn dòng họ" />
            </SelectTrigger>
            <SelectContent>
              {lineages?.map((l) => (
                <SelectItem key={l.id} value={String(l.id)}>
                  {l.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {selectedLineageId > 0 ? (
        <PersonList lineageId={selectedLineageId} />
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <p>Vui lòng chọn dòng họ để xem danh sách thành viên.</p>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, TreePine, GitMerge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { useLineages } from '@/hooks/use-lineages';

export default function LineagesPage() {
  const { data: lineages, isLoading, error } = useLineages();
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const toggleSelection = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleMerge = useCallback(() => {
    const ids = Array.from(selectedIds).join(',');
    router.push(`/lineage/merge?ids=${ids}`);
  }, [selectedIds, router]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gia phả</h1>
        <div className="flex items-center gap-2">
          {selectedIds.size >= 2 && (
            <Button variant="outline" onClick={handleMerge}>
              <GitMerge className="h-4 w-4 mr-2" />
              Gộp {selectedIds.size} gia phả
            </Button>
          )}
          <Button asChild>
            <Link href="/lineage/new">
              <Plus className="h-4 w-4 mr-2" />
              Tạo gia phả mới
            </Link>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16 text-destructive">
          <p>Không thể tải danh sách gia phả.</p>
        </div>
      ) : lineages && lineages.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lineages.map((lineage) => (
            <div key={lineage.id} className="relative group">
              <div
                className="absolute top-3 left-3 z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <Checkbox
                  checked={selectedIds.has(lineage.id)}
                  onCheckedChange={() => toggleSelection(lineage.id)}
                  aria-label={`Chọn ${lineage.name}`}
                />
              </div>
              <Link href={`/lineage/${lineage.id}`}>
                <Card className={`hover:border-primary/50 hover:shadow-md transition-all cursor-pointer ${selectedIds.has(lineage.id) ? 'border-primary ring-1 ring-primary/30' : ''}`}>
                  <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2 pl-10">
                    <TreePine className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{lineage.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-10">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {lineage.description || 'Nhấn để xem cây gia phả'}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <TreePine className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">Chưa có gia phả nào</p>
          <p className="text-sm mt-1">Hãy tạo gia phả đầu tiên để bắt đầu.</p>
          <Button asChild className="mt-4">
            <Link href="/lineage/new">
              <Plus className="h-4 w-4 mr-2" />
              Tạo gia phả mới
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}

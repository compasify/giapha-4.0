'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, TreePine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useLineages } from '@/hooks/use-lineages';

export default function LineagesPage() {
  const { data: lineages, isLoading, error } = useLineages();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gia phả</h1>
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
            <Link key={lineage.id} href={`/lineage/${lineage.id}`}>
              <Card className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer">
                <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
                  <TreePine className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{lineage.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {lineage.description || 'Nhấn để xem cây gia phả'}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <p>Chưa có gia phả nào. Hãy tạo gia phả đầu tiên.</p>
        </div>
      )}
    </div>
  );
}

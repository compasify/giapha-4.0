'use client';

import { BookOpen, Calendar, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useLineages } from '@/hooks/use-lineages';
import { useEvents } from '@/hooks/use-events';

function StatCard({
  title,
  icon,
  value,
}: {
  title: string;
  icon: React.ReactNode;
  value: number | null;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {value === null ? (
          <Skeleton className="h-7 w-16" />
        ) : (
          <p className="text-2xl font-bold">{value.toLocaleString('vi-VN')}</p>
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardStats() {
  const { data: lineages, isLoading: lineagesLoading } = useLineages();

  const firstLineageId = lineages?.[0]?.id ?? 0;

  const { data: eventsData, isLoading: eventsLoading } = useEvents(
    firstLineageId,
    { per_page: 1 }
  );

  const lineagesCount = lineagesLoading ? null : (lineages?.length ?? 0);
  const personsCount = lineagesLoading
    ? null
    : (lineages?.reduce((sum, l) => sum + (l.persons_count ?? 0), 0) ?? 0);
  const eventsCount =
    firstLineageId === 0
      ? lineagesLoading
        ? null
        : 0
      : eventsLoading
        ? null
        : (eventsData?.meta?.total_entries ?? 0);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="Số dòng họ"
        icon={<BookOpen className="h-4 w-4 text-muted-foreground" />}
        value={lineagesCount}
      />
      <StatCard
        title="Số thành viên"
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
        value={personsCount}
      />
      <StatCard
        title="Sự kiện sắp tới"
        icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
        value={eventsCount}
      />
    </div>
  );
}

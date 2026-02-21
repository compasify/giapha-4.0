'use client';

import Link from 'next/link';
import { CalendarDays } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useLineages } from '@/hooks/use-lineages';
import { useEvents } from '@/hooks/use-events';
import { EVENT_TYPE_MAP } from '@/lib/constants/event-types';
import type { EventType } from '@/types/event';

export function UpcomingEventsWidget() {
  const { data: lineages } = useLineages();
  const firstLineageId = lineages?.[0]?.id ?? 0;
  const { data: eventsData, isLoading } = useEvents(firstLineageId, { per_page: 5 });

  const events = eventsData?.data ?? [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Sự kiện gần đây</CardTitle>
        <CalendarDays className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <p className="text-sm text-muted-foreground">Chưa có sự kiện nào</p>
        ) : (
          <div className="space-y-2">
            {events.map((ev) => {
              const typeInfo = EVENT_TYPE_MAP[ev.event_type as EventType];
              return (
                <div key={ev.id} className="flex items-center gap-2 text-sm">
                  <span role="img" aria-hidden="true">{typeInfo?.icon ?? '📎'}</span>
                  <span className="truncate flex-1">{ev.title || typeInfo?.label || ev.event_type}</span>
                </div>
              );
            })}
            <Link href="/events" className="text-xs text-primary hover:underline mt-1 inline-block">
              Xem tất cả →
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

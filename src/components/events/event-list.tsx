'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CalendarDays, MapPin, Users, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useEvents } from '@/hooks/use-events';
import { EVENT_TYPE_MAP, EVENT_CATEGORIES, type EventCategory } from '@/lib/constants/event-types';
import type { GenealogyEventSummary, EventType } from '@/types/event';

interface EventListProps {
  lineageId: number;
}

function EventCard({ event }: { event: GenealogyEventSummary }) {
  const typeInfo = EVENT_TYPE_MAP[event.event_type as EventType];
  const icon = typeInfo?.icon ?? '📎';
  const label = typeInfo?.label ?? event.event_type;

  return (
    <Card className="hover:bg-accent/30 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl" role="img" aria-hidden="true">{icon}</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">{event.title || label}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            {event.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{event.description}</p>
            )}
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              {event.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {event.location}
                </span>
              )}
              {event.participants_count > 0 && (
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" /> {event.participants_count}
                </span>
              )}
              <span className="flex items-center gap-1">
                <CalendarDays className="h-3 w-3" />
                {new Date(event.created_at).toLocaleDateString('vi-VN')}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function EventList({ lineageId }: EventListProps) {
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const { data, isLoading, error } = useEvents(lineageId, { per_page: 100 });

  const events = data?.data ?? [];
  const filtered = typeFilter === 'all'
    ? events
    : events.filter((e) => e.event_type === typeFilter);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-destructive text-sm">Lỗi: {error.message}</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Tất cả loại" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả loại</SelectItem>
            {Object.entries(EVENT_CATEGORIES).map(([cat, catLabel]) => {
              const typesInCat = Object.entries(EVENT_TYPE_MAP)
                .filter(([, info]) => info.category === cat);
              if (typesInCat.length === 0) return null;
              return typesInCat.map(([type, info]) => (
                <SelectItem key={type} value={type}>
                  {info.icon} {info.label}
                </SelectItem>
              ));
            })}
          </SelectContent>
        </Select>
        <Link href={`/events/new?lineage_id=${lineageId}`}>
          <Button size="sm" className="gap-1">
            <Plus className="h-3.5 w-3.5" /> Thêm
          </Button>
        </Link>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
          <CalendarDays className="h-10 w-10 mb-2 opacity-50" />
          <p className="text-sm">Chưa có sự kiện nào</p>
          <Link href={`/events/new?lineage_id=${lineageId}`} className="mt-2">
            <Button variant="outline" size="sm">Tạo sự kiện đầu tiên</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}

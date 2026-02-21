'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Users, Calendar, Repeat, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useEvent, useDeleteEvent } from '@/hooks/use-events';
import { EVENT_TYPE_MAP } from '@/lib/constants/event-types';
import type { EventType } from '@/types/event';

interface EventDetailProps {
  eventId: number;
}

export function EventDetail({ eventId }: EventDetailProps) {
  const router = useRouter();
  const { data: event, isLoading, error } = useEvent(eventId);
  const deleteMutation = useDeleteEvent();
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-2xl">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error || !event) {
    return <p className="text-destructive text-sm">Lỗi: {error?.message || 'Không tìm thấy sự kiện'}</p>;
  }

  const typeInfo = EVENT_TYPE_MAP[event.event_type as EventType];

  async function handleDelete() {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    try {
      await deleteMutation.mutateAsync(eventId);
      router.push('/events');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    }
  }

  return (
    <div className="max-w-2xl space-y-4">
      <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-1">
        <ArrowLeft className="h-3.5 w-3.5" /> Quay lại
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="text-3xl">{typeInfo?.icon ?? '📎'}</span>
              <div>
                <CardTitle className="text-xl">{event.title || typeInfo?.label || event.event_type}</CardTitle>
                <p className="text-sm text-muted-foreground">{typeInfo?.label ?? event.event_type}</p>
              </div>
            </div>
            <div className="flex gap-1">
              {event.is_recurring && <Badge variant="secondary"><Repeat className="h-3 w-3 mr-1" />Hàng năm</Badge>}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {event.description && <p className="text-sm">{event.description}</p>}

          <div className="grid gap-2 text-sm">
            {event.location && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" /> {event.location}
              </div>
            )}
            {event.flexible_dates?.length > 0 && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {event.flexible_dates.map((fd) => fd.display_string || `${fd.solar_day}/${fd.solar_month}/${fd.solar_year}`).join(', ')}
              </div>
            )}
          </div>

          {event.participants?.length > 0 && (
            <div>
              <h4 className="text-sm font-medium flex items-center gap-1 mb-2">
                <Users className="h-4 w-4" /> Người tham dự ({event.participants.length})
              </h4>
              <div className="flex flex-wrap gap-1">
                {event.participants.map((p) => (
                  <Badge key={p.id} variant="outline" className="text-xs">{p.full_name}</Badge>
                ))}
              </div>
            </div>
          )}

          {event.notes && (
            <div className="text-xs text-muted-foreground border-t pt-3">
              <p>{event.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
        >
          <Trash2 className="h-3.5 w-3.5 mr-1" />
          {confirmDelete ? 'Xác nhận xóa?' : 'Xóa sự kiện'}
        </Button>
      </div>
    </div>
  );
}

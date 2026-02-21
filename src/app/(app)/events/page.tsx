'use client';

import { useState } from 'react';
import { CalendarDays, List } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { EventList } from '@/components/events/event-list';
import { LunarCalendar } from '@/components/calendar/lunar-calendar';
import { useLineages } from '@/hooks/use-lineages';
import { useEvents } from '@/hooks/use-events';

export default function EventsPage() {
  const [selectedLineageId, setSelectedLineageId] = useState<number>(0);
  const { data: lineages, isLoading: lineagesLoading } = useLineages();
  const { data: eventsData } = useEvents(selectedLineageId, { per_page: 200 });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sự kiện gia phả</h1>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground">Dòng họ:</span>
        {lineagesLoading ? (
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
        <Tabs defaultValue="list">
          <TabsList>
            <TabsTrigger value="list" className="gap-1.5">
              <List className="h-3.5 w-3.5" /> Danh sách
            </TabsTrigger>
            <TabsTrigger value="calendar" className="gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" /> Lịch
            </TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="mt-4">
            <EventList lineageId={selectedLineageId} />
          </TabsContent>
          <TabsContent value="calendar" className="mt-4">
            <LunarCalendar events={eventsData?.data} />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <p>Vui lòng chọn dòng họ để xem sự kiện.</p>
        </div>
      )}
    </div>
  );
}

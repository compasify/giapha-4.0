'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateEvent, useUpdateEvent, type EventFormPayload } from '@/hooks/use-events';
import { usePersons } from '@/hooks/use-persons';
import { useLunarDate } from '@/hooks/use-lunar-calendar';
import { EVENT_TYPE_OPTIONS, RECURRING_EVENT_TYPES } from '@/lib/constants/event-types';
import type { GenealogyEvent, EventType } from '@/types/event';

interface EventFormProps {
  lineageId: number;
  event?: GenealogyEvent;
  onSuccess?: () => void;
}

export function EventForm({ lineageId, event, onSuccess }: EventFormProps) {
  const router = useRouter();
  const isEdit = !!event;

  const [title, setTitle] = useState(event?.title ?? '');
  const [eventType, setEventType] = useState<EventType>(event?.event_type ?? 'custom');
  const [description, setDescription] = useState(event?.description ?? '');
  const [location, setLocation] = useState(event?.location ?? '');
  const [isRecurring, setIsRecurring] = useState(event?.is_recurring ?? false);
  const [solarDate, setSolarDate] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState<number[]>(
    event?.participants?.map((p) => p.id) ?? [],
  );

  const { data: lunarResult } = useLunarDate(solarDate || null);
  const { data: personsData } = usePersons(lineageId, { per_page: 500 });
  const createMutation = useCreateEvent(lineageId);
  const updateMutation = useUpdateEvent();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const showRecurring = RECURRING_EVENT_TYPES.includes(eventType);

  function toggleParticipant(personId: number) {
    setSelectedParticipants((prev) =>
      prev.includes(personId) ? prev.filter((id) => id !== personId) : [...prev, personId],
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const payload: EventFormPayload = {
      title: title.trim(),
      event_type: eventType,
      description: description || undefined,
      location: location || undefined,
      is_recurring: showRecurring ? isRecurring : false,
      participant_ids: selectedParticipants,
    };

    if (solarDate) {
      const [y, m, d] = solarDate.split('-').map(Number);
      payload.flexible_dates_attributes = [{
        date_type: 'event',
        solar_year: y, solar_month: m, solar_day: d,
        calendar_type: 'solar',
        ...(lunarResult ? {
          lunar_year: lunarResult.lunar_year,
          lunar_month: lunarResult.lunar_month,
          lunar_day: lunarResult.lunar_day,
          lunar_leap_month: lunarResult.is_leap_month,
        } : {}),
      }];
    }

    try {
      if (isEdit && event) {
        await updateMutation.mutateAsync({ id: event.id, payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      onSuccess?.();
      router.push('/events');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <Label htmlFor="title">Tên sự kiện *</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label>Loại sự kiện</Label>
        <Select value={eventType} onValueChange={(v) => setEventType(v as EventType)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {EVENT_TYPE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="solar-date">Ngày diễn ra</Label>
        <Input id="solar-date" type="date" value={solarDate} onChange={(e) => setSolarDate(e.target.value)} />
        {lunarResult && (
          <p className="text-xs text-muted-foreground">
            Âm lịch: {lunarResult.lunar_day}/{lunarResult.lunar_month}/{lunarResult.lunar_year}
            {lunarResult.is_leap_month ? ' (nhuận)' : ''}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Địa điểm</Label>
        <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Mô tả</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
      </div>

      {showRecurring && (
        <div className="flex items-center gap-2">
          <Checkbox
            id="recurring"
            checked={isRecurring}
            onCheckedChange={(checked) => setIsRecurring(checked === true)}
          />
          <Label htmlFor="recurring" className="text-sm font-normal">Lặp lại hàng năm (theo âm lịch)</Label>
        </div>
      )}

      {personsData && personsData.data.length > 0 && (
        <div className="space-y-2">
          <Label>Người tham dự</Label>
          <div className="max-h-48 overflow-y-auto space-y-1 border rounded-md p-2">
            {personsData.data.map((person) => (
              <label key={person.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-accent/50 rounded px-1 py-0.5">
                <Checkbox
                  checked={selectedParticipants.includes(person.id)}
                  onCheckedChange={() => toggleParticipant(person.id)}
                />
                <span>{person.full_name}</span>
                <span className="text-xs text-muted-foreground">({person.gender === 'male' ? 'Nam' : 'Nữ'})</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Tạo sự kiện'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Hủy
        </Button>
      </div>
    </form>
  );
}

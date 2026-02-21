'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarCell } from './calendar-cell';
import { useLunarCalendar } from '@/hooks/use-lunar-calendar';
import type { GenealogyEventSummary } from '@/types/event';

const DAY_NAMES = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

function getMonthGrid(year: number, month: number) {
  const firstDay = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const daysInPrevMonth = new Date(year, month - 1, 0).getDate();

  let startDow = firstDay.getDay();
  startDow = startDow === 0 ? 6 : startDow - 1;

  const cells: { year: number; month: number; day: number; isCurrentMonth: boolean }[] = [];

  for (let i = startDow - 1; i >= 0; i--) {
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    cells.push({ year: prevYear, month: prevMonth, day: daysInPrevMonth - i, isCurrentMonth: false });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ year, month, day: d, isCurrentMonth: true });
  }

  const remaining = 42 - cells.length;
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  for (let d = 1; d <= remaining; d++) {
    cells.push({ year: nextYear, month: nextMonth, day: d, isCurrentMonth: false });
  }

  return cells;
}

interface LunarCalendarProps {
  events?: GenealogyEventSummary[];
  onDayClick?: (date: string) => void;
}

export function LunarCalendar({ events = [], onDayClick }: LunarCalendarProps) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  const { data: lunarMap, isLoading } = useLunarCalendar(year, month);
  const cells = useMemo(() => getMonthGrid(year, month), [year, month]);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, number>();
    for (const ev of events) {
      const dateStr = ev.created_at?.slice(0, 10);
      if (dateStr) map.set(dateStr, (map.get(dateStr) ?? 0) + 1);
    }
    return map;
  }, [events]);

  function prevMonth() {
    if (month === 1) { setMonth(12); setYear(year - 1); }
    else setMonth(month - 1);
  }
  function nextMonth() {
    if (month === 12) { setMonth(1); setYear(year + 1); }
    else setMonth(month + 1);
  }
  function goToday() {
    setYear(today.getFullYear());
    setMonth(today.getMonth() + 1);
  }

  function formatDateStr(y: number, m: number, d: number) {
    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="icon" onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">
            Tháng {month} / {year}
          </h2>
          <Button variant="ghost" size="sm" onClick={goToday} className="text-xs">
            Hôm nay
          </Button>
        </div>
        <Button variant="outline" size="icon" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
        {DAY_NAMES.map((name) => (
          <div key={name} className="bg-muted px-1 py-2 text-center text-xs font-medium text-muted-foreground">
            {name}
          </div>
        ))}
        {isLoading
          ? Array.from({ length: 42 }).map((_, i) => (
              <div key={i} className="bg-background p-1 h-16">
                <Skeleton className="h-4 w-6 mx-auto" />
              </div>
            ))
          : cells.map((cell, i) => {
              const dateStr = formatDateStr(cell.year, cell.month, cell.day);
              const lunar = lunarMap?.get(dateStr);
              const isToday =
                cell.year === today.getFullYear() &&
                cell.month === today.getMonth() + 1 &&
                cell.day === today.getDate();

              return (
                <div key={i} className="bg-background">
                  <CalendarCell
                    solarDay={cell.day}
                    lunarDay={lunar?.lunar_day ?? null}
                    lunarMonth={lunar?.lunar_day === 1 ? lunar.lunar_month : null}
                    isToday={isToday}
                    eventCount={eventsByDate.get(dateStr) ?? 0}
                    isCurrentMonth={cell.isCurrentMonth}
                    onClick={() => onDayClick?.(dateStr)}
                  />
                </div>
              );
            })}
      </div>
    </div>
  );
}

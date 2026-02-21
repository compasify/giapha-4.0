import { useQuery } from '@tanstack/react-query';
import type { LunarDateResult } from '@/types/event';

const PROXY = '/api/proxy';

async function fetchLunarDate(solarDate: string): Promise<LunarDateResult> {
  const res = await fetch(`${PROXY}/utilities/solar_to_lunar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date: solarDate }),
  });
  if (!res.ok) throw new Error(`Lỗi ${res.status}`);
  const json = await res.json();
  return json.data;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function formatDate(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export type LunarDateMap = Map<string, LunarDateResult>;

async function fetchMonthLunarDates(year: number, month: number): Promise<LunarDateMap> {
  const days = getDaysInMonth(year, month);
  const results = new Map<string, LunarDateResult>();

  const batchSize = 10;
  for (let start = 1; start <= days; start += batchSize) {
    const end = Math.min(start + batchSize - 1, days);
    const promises: Promise<void>[] = [];

    for (let day = start; day <= end; day++) {
      const dateStr = formatDate(year, month, day);
      promises.push(
        fetchLunarDate(dateStr)
          .then((lunar) => { results.set(dateStr, lunar); })
          .catch(() => { /* skip failed conversions */ })
      );
    }
    await Promise.all(promises);
  }

  return results;
}

export function useLunarCalendar(year: number, month: number) {
  return useQuery<LunarDateMap>({
    queryKey: ['lunar-dates', year, month],
    queryFn: () => fetchMonthLunarDates(year, month),
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24,
    enabled: year > 0 && month > 0,
  });
}

export function useLunarDate(solarDate: string | null) {
  return useQuery<LunarDateResult>({
    queryKey: ['lunar-date', solarDate],
    queryFn: () => fetchLunarDate(solarDate!),
    staleTime: Infinity,
    enabled: !!solarDate,
  });
}

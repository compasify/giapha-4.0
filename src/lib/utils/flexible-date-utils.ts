import { FlexibleDate } from '@/types/person';

export interface FlexibleDateInput {
  year?: string;
  month?: string;
  day?: string;
  is_lunar: boolean;
  date_qualifier: string;
  date_note?: string;
}

export function emptyFlexibleDateInput(): FlexibleDateInput {
  return {
    year: '',
    month: '',
    day: '',
    is_lunar: false,
    date_qualifier: 'exact',
    date_note: '',
  };
}

export function formatFlexibleDate(date: FlexibleDate): string {
  if (date.display_string) return date.display_string;

  const isLunar = date.calendar_type === 'lunar';
  const year = isLunar ? date.lunar_year : date.solar_year;
  const month = isLunar ? date.lunar_month : date.solar_month;
  const day = isLunar ? date.lunar_day : date.solar_day;

  const parts: string[] = [];
  if (day) parts.push(String(day).padStart(2, '0'));
  if (month) parts.push(String(month).padStart(2, '0'));
  if (year) parts.push(String(year));

  const dateStr = parts.join('/');
  return isLunar ? `${dateStr} (âm lịch)` : dateStr;
}

export function parseFlexibleDateForApi(
  input: FlexibleDateInput,
  dateType: 'birth' | 'death'
): Record<string, unknown> | null {
  if (!input.year && !input.month && !input.day) return null;

  const year = input.year ? parseInt(input.year, 10) : null;
  const month = input.month ? parseInt(input.month, 10) : null;
  const day = input.day ? parseInt(input.day, 10) : null;

  if (input.is_lunar) {
    return {
      date_type: dateType,
      lunar_year: year,
      lunar_month: month,
      lunar_day: day,
      calendar_type: 'lunar',
      date_qualifier: input.date_qualifier || 'exact',
      date_note: input.date_note || null,
    };
  }

  return {
    date_type: dateType,
    solar_year: year,
    solar_month: month,
    solar_day: day,
    calendar_type: 'solar',
    date_qualifier: input.date_qualifier || 'exact',
    date_note: input.date_note || null,
  };
}

export function flexibleDateToInput(date: FlexibleDate | null): FlexibleDateInput {
  if (!date) return emptyFlexibleDateInput();

  const isLunar = date.calendar_type === 'lunar';
  return {
    year: String(isLunar ? (date.lunar_year ?? '') : (date.solar_year ?? '')),
    month: String(isLunar ? (date.lunar_month ?? '') : (date.solar_month ?? '')),
    day: String(isLunar ? (date.lunar_day ?? '') : (date.solar_day ?? '')),
    is_lunar: isLunar,
    date_qualifier: date.date_qualifier || 'exact',
    date_note: date.date_note || '',
  };
}

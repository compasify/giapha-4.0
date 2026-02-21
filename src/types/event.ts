export type EventType =
  | 'birth' | 'death' | 'marriage' | 'divorce' | 'engagement'
  | 'adoption' | 'funeral' | 'memorial' | 'anniversary'
  | 'gio' | 'cung_gio' | 'le_tet' | 'dam_cuoi' | 'dam_tang'
  | 'khai_sinh' | 'khai_tu' | 'xay_nha' | 'dong_tho'
  | 'custom' | 'other';

export interface EventFlexibleDate {
  id: number;
  date_type: string;
  solar_year: number | null;
  solar_month: number | null;
  solar_day: number | null;
  lunar_year: number | null;
  lunar_month: number | null;
  lunar_day: number | null;
  lunar_leap_month: boolean | null;
  date_precision: string | null;
  date_qualifier: string | null;
  calendar_type: string | null;
  display_string: string | null;
}

export interface EventParticipant {
  id: number;
  full_name: string;
  ho: string | null;
  ten_dem: string | null;
  ten: string;
  gender: string;
  is_alive: boolean;
  avatar: string | null;
  generation_number: number | null;
}

export interface GenealogyEvent {
  id: number;
  title: string | null;
  event_type: EventType;
  event_subtype: string | null;
  description: string | null;
  notes: string | null;
  location: string | null;
  is_recurring: boolean;
  recurrence_type: string | null;
  reminder_enabled: boolean;
  reminder_days_before: number | null;
  privacy_level: number | null;
  lineage_id: number;
  created_at: string;
  updated_at: string;
  participants: EventParticipant[];
  flexible_dates: EventFlexibleDate[];
}

export interface GenealogyEventSummary {
  id: number;
  title: string | null;
  event_type: EventType;
  description: string | null;
  location: string | null;
  participants_count: number;
  created_at: string;
}

export interface LunarDateResult {
  solar_date: string;
  lunar_year: number;
  lunar_month: number;
  lunar_day: number;
  is_leap_month: boolean;
}

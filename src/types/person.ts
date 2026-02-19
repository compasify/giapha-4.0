export interface FlexibleDate {
  id: number;
  date_type: string;
  solar_year: number | null;
  solar_month: number | null;
  solar_day: number | null;
  lunar_year: number | null;
  lunar_month: number | null;
  lunar_day: number | null;
  lunar_leap_month: boolean;
  date_precision: number;
  date_qualifier: string;
  range_year_start: number | null;
  range_year_end: number | null;
  date_note: string | null;
  calendar_type: string;
  display_string: string;
}

export interface Person {
  id: number;
  lineage_id: number;
  branch_id: number | null;
  ho: string | null;
  ten_dem: string | null;
  ten: string;
  ten_thuong_goi: string | null;
  ten_huy: string | null;
  ten_thuy: string | null;
  ten_hieu: string | null;
  han_nom_name: string | null;
  gender: 'unknown' | 'male' | 'female' | 'other';
  is_alive: boolean;
  generation_number: number | null;
  biography: string | null;
  avatar: string | null;
  birth_date: FlexibleDate | null;
  death_date: FlexibleDate | null;
  full_name: string;
  created_at: string;
  updated_at: string;
  notes: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  birth_place: string | null;
  death_place: string | null;
  burial_place: string | null;
  burial_latitude: number | null;
  burial_longitude: number | null;
  cover_photo: string | null;
  privacy_level: number | null;
  parents_count: number;
  children_count: number;
  spouses_count: number;
}

export type EventType =
  | 'birth' | 'death' | 'marriage' | 'divorce' | 'adoption'
  | 'ngay_gio' | 'mung_tho' | 'sang_cat' | 'cai_tang' | 'le_an_tang'
  | 'dam_cuoi' | 'le_dinh_hon' | 'le_vu_quy'
  | 'hoi_dong_ho' | 'le_gio_to' | 'xay_nha_tho' | 'hop_mat'
  | 'tot_nghiep' | 'giai_thuong' | 'nhap_ngu' | 'di_cu' | 'custom';

export interface GenealogyEvent {
  id: number;
  event_type: EventType;
  event_subtype: string | null;
  title: string | null;
  description: string | null;
  location: string | null;
  is_recurring: boolean;
  recurrence_type: string | null;
  reminder_enabled: boolean;
  created_at: string;
  updated_at: string;
}

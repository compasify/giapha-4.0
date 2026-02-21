import type { EventType } from '@/types/event';

export type EventCategory = 'lifecycle' | 'memorial' | 'celebration' | 'ritual' | 'milestone' | 'other';

export interface EventTypeInfo {
  label: string;
  icon: string;
  category: EventCategory;
}

export const EVENT_TYPE_MAP: Record<EventType, EventTypeInfo> = {
  birth: { label: 'Sinh', icon: '👶', category: 'lifecycle' },
  death: { label: 'Mất', icon: '🕯️', category: 'lifecycle' },
  marriage: { label: 'Kết hôn', icon: '💍', category: 'milestone' },
  divorce: { label: 'Ly hôn', icon: '📄', category: 'lifecycle' },
  engagement: { label: 'Đính hôn', icon: '💒', category: 'milestone' },
  adoption: { label: 'Nhận nuôi', icon: '🤝', category: 'lifecycle' },
  funeral: { label: 'Tang lễ', icon: '⚰️', category: 'memorial' },
  memorial: { label: 'Tưởng niệm', icon: '🙏', category: 'memorial' },
  anniversary: { label: 'Kỷ niệm', icon: '🎉', category: 'celebration' },
  gio: { label: 'Ngày giỗ', icon: '🕯️', category: 'memorial' },
  cung_gio: { label: 'Cúng giỗ', icon: '🪷', category: 'memorial' },
  le_tet: { label: 'Lễ Tết', icon: '🧧', category: 'celebration' },
  dam_cuoi: { label: 'Đám cưới', icon: '💒', category: 'celebration' },
  dam_tang: { label: 'Đám tang', icon: '🏮', category: 'memorial' },
  khai_sinh: { label: 'Khai sinh', icon: '📜', category: 'lifecycle' },
  khai_tu: { label: 'Khai tử', icon: '📋', category: 'lifecycle' },
  xay_nha: { label: 'Xây nhà', icon: '🏠', category: 'milestone' },
  dong_tho: { label: 'Động thổ', icon: '⛏️', category: 'ritual' },
  custom: { label: 'Tùy chỉnh', icon: '📌', category: 'other' },
  other: { label: 'Khác', icon: '📎', category: 'other' },
};

export const EVENT_CATEGORIES: Record<EventCategory, string> = {
  lifecycle: 'Sự kiện đời sống',
  memorial: 'Tưởng niệm',
  celebration: 'Lễ hội',
  ritual: 'Nghi lễ',
  milestone: 'Cột mốc',
  other: 'Khác',
};

export const EVENT_TYPE_OPTIONS = Object.entries(EVENT_TYPE_MAP).map(([value, info]) => ({
  value: value as EventType,
  label: `${info.icon} ${info.label}`,
  category: info.category,
}));

export const RECURRING_EVENT_TYPES: EventType[] = ['gio', 'cung_gio', 'le_tet', 'memorial', 'anniversary'];

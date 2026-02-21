'use client';

const LUNAR_MONTH_NAMES = [
  '', 'Giêng', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu',
  'Bảy', 'Tám', 'Chín', 'Mười', 'M.một', 'Chạp',
];

function formatLunarDay(day: number, month: number | null): string {
  if (day === 1 && month) return `1/${LUNAR_MONTH_NAMES[month] || month}`;
  if (day <= 10) return `${day}`;
  return String(day);
}

interface CalendarCellProps {
  solarDay: number;
  lunarDay: number | null;
  lunarMonth: number | null;
  isToday: boolean;
  eventCount: number;
  isCurrentMonth: boolean;
  onClick?: () => void;
}

export function CalendarCell({
  solarDay,
  lunarDay,
  lunarMonth,
  isToday,
  eventCount,
  isCurrentMonth,
  onClick,
}: CalendarCellProps) {
  const dimClass = isCurrentMonth ? '' : 'opacity-40';
  const todayClass = isToday ? 'ring-2 ring-primary rounded-lg bg-primary/5' : '';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-start p-1 h-16 w-full text-center hover:bg-accent/50 rounded transition-colors ${dimClass} ${todayClass}`}
    >
      <span className="text-sm font-semibold leading-tight">{solarDay}</span>
      {lunarDay !== null && (
        <span className={`text-[10px] leading-tight ${lunarDay === 1 ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
          {formatLunarDay(lunarDay, lunarMonth)}
        </span>
      )}
      {eventCount > 0 && (
        <div className="flex gap-0.5 mt-auto">
          {Array.from({ length: Math.min(eventCount, 3) }).map((_, i) => (
            <span key={i} className="w-1 h-1 rounded-full bg-primary" />
          ))}
        </div>
      )}
    </button>
  );
}

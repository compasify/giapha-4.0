'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { CalendarType } from '@/components/tree/edit-sidebar';

interface DateInputSectionProps {
  label: string;
  solarDay: string;
  solarMonth: string;
  solarYear: string;
  lunarDay: string;
  lunarMonth: string;
  lunarYear: string;
  lunarLeapMonth: boolean;
  calendarType: CalendarType;
  onSolarChange: (field: string, value: string) => void;
  onLunarChange: (field: string, value: string | boolean) => void;
  onCalendarTypeChange: (type: CalendarType) => void;
}

export function DateInputSection({
  label,
  solarDay, solarMonth, solarYear,
  lunarDay, lunarMonth, lunarYear, lunarLeapMonth,
  calendarType,
  onSolarChange, onLunarChange, onCalendarTypeChange,
}: DateInputSectionProps) {
  const isLunar = calendarType === 'lunar';
  const day = isLunar ? lunarDay : solarDay;
  const month = isLunar ? lunarMonth : solarMonth;
  const year = isLunar ? lunarYear : solarYear;

  const handleFieldChange = (field: 'day' | 'month' | 'year', value: string) => {
    if (isLunar) {
      onLunarChange(field, value);
    } else {
      onSolarChange(field, value);
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-xs">{label}</Label>
        <div className="flex rounded-md border overflow-hidden">
          <Button
            type="button"
            variant={!isLunar ? 'default' : 'ghost'}
            size="sm"
            className="h-6 rounded-none text-[10px] px-2"
            onClick={() => onCalendarTypeChange('solar')}
          >
            Dương
          </Button>
          <Button
            type="button"
            variant={isLunar ? 'default' : 'ghost'}
            size="sm"
            className="h-6 rounded-none text-[10px] px-2"
            onClick={() => onCalendarTypeChange('lunar')}
          >
            Âm
          </Button>
        </div>
      </div>
      <div className="flex gap-1.5">
        <Input
          size={1}
          className="h-8 text-sm w-16"
          value={day}
          onChange={(e) => handleFieldChange('day', e.target.value)}
          placeholder="Ngày"
          type="number"
          min={1}
          max={31}
        />
        <Input
          size={1}
          className="h-8 text-sm w-16"
          value={month}
          onChange={(e) => handleFieldChange('month', e.target.value)}
          placeholder="Tháng"
          type="number"
          min={1}
          max={12}
        />
        <Input
          size={1}
          className="h-8 text-sm flex-1"
          value={year}
          onChange={(e) => handleFieldChange('year', e.target.value)}
          placeholder="Năm"
          type="number"
        />
      </div>
      {isLunar && (
        <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
          <input
            type="checkbox"
            checked={lunarLeapMonth}
            onChange={(e) => onLunarChange('leapMonth', e.target.checked)}
            className="h-3.5 w-3.5 rounded border accent-primary"
          />
          Tháng nhuận
        </label>
      )}
    </div>
  );
}

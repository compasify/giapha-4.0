'use client';

import { Control, useController } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FlexibleDateInput } from '@/lib/utils/flexible-date-utils';

interface FlexibleDatePickerProps {
  label: string;
  fieldName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
}

const DATE_QUALIFIERS = [
  { value: 'exact', label: 'Chính xác' },
  { value: 'about', label: 'Khoảng' },
  { value: 'before', label: 'Trước' },
  { value: 'after', label: 'Sau' },
];

export function FlexibleDatePicker({ label, fieldName, control }: FlexibleDatePickerProps) {
  const { field } = useController({ name: fieldName, control });
  const value: FlexibleDateInput = field.value || {
    year: '',
    month: '',
    day: '',
    is_lunar: false,
    date_qualifier: 'exact',
    date_note: '',
  };

  function update(patch: Partial<FlexibleDateInput>) {
    field.onChange({ ...value, ...patch });
  }

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">{label}</Label>

      <div className="flex gap-2">
        <div className="flex flex-col gap-1">
          <Label className="text-xs text-muted-foreground">Năm</Label>
          <Input
            type="number"
            placeholder="2024"
            value={value.year}
            onChange={(e) => update({ year: e.target.value })}
            className="w-24 text-base"
            min={1}
            max={2100}
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label className="text-xs text-muted-foreground">Tháng</Label>
          <Input
            type="number"
            placeholder="1-12"
            value={value.month}
            onChange={(e) => update({ month: e.target.value })}
            className="w-20 text-base"
            min={1}
            max={12}
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label className="text-xs text-muted-foreground">Ngày</Label>
          <Input
            type="number"
            placeholder="1-31"
            value={value.day}
            onChange={(e) => update({ day: e.target.value })}
            className="w-20 text-base"
            min={1}
            max={31}
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Switch
            id={`${fieldName}-lunar`}
            checked={value.is_lunar}
            onCheckedChange={(checked) => update({ is_lunar: checked })}
          />
          <Label htmlFor={`${fieldName}-lunar`} className="text-sm">
            Âm lịch
          </Label>
        </div>

        <div className="flex items-center gap-2">
          <Label className="text-sm text-muted-foreground">Loại ngày:</Label>
          <Select
            value={value.date_qualifier}
            onValueChange={(v) => update({ date_qualifier: v })}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DATE_QUALIFIERS.map((q) => (
                <SelectItem key={q.value} value={q.value}>
                  {q.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-xs text-muted-foreground">Ghi chú ngày tháng</Label>
        <Input
          type="text"
          placeholder="VD: khoảng đầu thập niên 1950"
          value={value.date_note}
          onChange={(e) => update({ date_note: e.target.value })}
          className="text-sm"
        />
      </div>
    </div>
  );
}

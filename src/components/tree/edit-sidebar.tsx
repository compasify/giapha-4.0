'use client';

import { useState, useEffect } from 'react';
import { Trash2, UserPlus, Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { FamilyChartPersonData } from '@/lib/transforms/family-chart-transform';

export type RelativeType = 'father' | 'mother' | 'spouse' | 'son' | 'daughter';

export interface EditSidebarPerson {
  id: string;
  data: FamilyChartPersonData;
}

export interface EditSidebarFormValues {
  ho: string;
  ten_dem: string;
  ten: string;
  gender: 'M' | 'F';
  birth_year: string;
  birth_month: string;
  birth_day: string;
  death_year: string;
  death_month: string;
  death_day: string;
  is_alive: boolean;
  birth_date_id: number | null;
  death_date_id: number | null;
}

export type SpouseRelationType = 'spouse_married' | 'concubine' | 'partner' | 'spouse_divorced';

export interface AddRelativePayload {
  personId: string;
  relativeType: RelativeType;
  spouseRelationType?: SpouseRelationType;
  values: EditSidebarFormValues;
}

interface EditSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  person: EditSidebarPerson | null;
  mode: 'edit' | 'new';
  relativeType?: RelativeType;
  isStarred?: boolean;
  onToggleStar?: (personId: string) => void;
  onSave: (personId: string, values: EditSidebarFormValues) => Promise<void>;
  onDelete: (personId: string) => Promise<void>;
  onAddRelative: (payload: AddRelativePayload) => Promise<void>;
  onAddRelativeClick?: () => void;
}

function toFormValues(data: FamilyChartPersonData | null): EditSidebarFormValues {
  if (!data) {
    return {
      ho: '', ten_dem: '', ten: '', gender: 'M',
      birth_year: '', birth_month: '', birth_day: '',
      death_year: '', death_month: '', death_day: '',
      is_alive: true, birth_date_id: null, death_date_id: null,
    };
  }
  return {
    ho: data.ho ?? '',
    ten_dem: data.ten_dem ?? '',
    ten: data.ten ?? '',
    gender: data.gender,
    birth_year: data.birth_year != null ? String(data.birth_year) : '',
    birth_month: data.birth_month != null ? String(data.birth_month) : '',
    birth_day: data.birth_day != null ? String(data.birth_day) : '',
    death_year: data.death_year != null ? String(data.death_year) : '',
    death_month: data.death_month != null ? String(data.death_month) : '',
    death_day: data.death_day != null ? String(data.death_day) : '',
    is_alive: data.is_alive,
    birth_date_id: data.birth_date_id ?? null,
    death_date_id: data.death_date_id ?? null,
  };
}

export function EditSidebar({
  open,
  onOpenChange,
  person,
  mode,
  relativeType,
  isStarred,
  onToggleStar,
  onSave,
  onDelete,
  onAddRelative,
  onAddRelativeClick,
}: EditSidebarProps) {
  const [values, setValues] = useState<EditSidebarFormValues>(() =>
    toFormValues(person?.data ?? null)
  );
  const [isAlive, setIsAlive] = useState(person?.data.is_alive ?? true);
  const [newRelType, setNewRelType] = useState<RelativeType>(relativeType ?? 'son');
  const [spouseRelType, setSpouseRelType] = useState<SpouseRelationType>('spouse_married');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'new') {
      setValues(toFormValues(null));
      setIsAlive(true);
    } else if (person) {
      setValues(toFormValues(person.data));
      setIsAlive(person.data.is_alive);
    } else {
      setValues(toFormValues(null));
      setIsAlive(true);
    }
    setError(null);
  }, [person, mode]);

  useEffect(() => {
    if (relativeType) setNewRelType(relativeType);
  }, [relativeType]);

  function handleChange(field: keyof EditSidebarFormValues, val: string | boolean) {
    setValues((prev) => ({ ...prev, [field]: val }));
    if (field === 'is_alive') setIsAlive(val as boolean);
  }

  async function handleSave() {
    if (!person) return;
    setIsLoading(true);
    setError(null);
    try {
      const payload: EditSidebarFormValues = { ...values, is_alive: isAlive };
      if (mode === 'edit') {
        await onSave(person.id, payload);
      } else {
        await onAddRelative({
          personId: person.id,
          relativeType: newRelType,
          spouseRelationType: newRelType === 'spouse' ? spouseRelType : undefined,
          values: payload,
        });
      }
      onOpenChange(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Đã xảy ra lỗi');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    if (!person) return;
    if (!window.confirm('Xóa thành viên này khỏi gia phả?')) return;
    setIsLoading(true);
    setError(null);
    try {
      await onDelete(person.id);
      onOpenChange(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Đã xảy ra lỗi');
    } finally {
      setIsLoading(false);
    }
  }

  const title = mode === 'edit' ? 'Sửa thông tin' : 'Thêm thành viên';
  const fullName = person
    ? [person.data.ho, person.data.ten_dem, person.data.ten].filter(Boolean).join(' ')
    : '';

  return (
    <div
      className={`
        h-full w-80 flex-shrink-0 border-l bg-background flex flex-col
        transition-[margin] duration-300 ease-in-out overflow-hidden
        ${open ? 'mr-0' : '-mr-80'}
      `}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="text-sm font-semibold">
          {title}
          {mode === 'edit' && fullName && (
            <span className="ml-1 text-muted-foreground font-normal text-xs">— {fullName}</span>
          )}
        </div>
        <Button variant="ghost" size="icon-sm" onClick={() => onOpenChange(false)}>
          <X className="size-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {mode === 'new' && (
            <>
              <div className="space-y-1">
                <Label className="text-xs">Quan hệ với {fullName || 'người này'}</Label>
                <Select value={newRelType} onValueChange={(v) => setNewRelType(v as RelativeType)}>
                  <SelectTrigger size="sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="father">Cha</SelectItem>
                    <SelectItem value="mother">Mẹ</SelectItem>
                    <SelectItem value="spouse">Vợ / Chồng</SelectItem>
                    <SelectItem value="son">Con trai</SelectItem>
                    <SelectItem value="daughter">Con gái</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {newRelType === 'spouse' && (
                <div className="space-y-1">
                  <Label className="text-xs">Loại hôn nhân</Label>
                  <Select value={spouseRelType} onValueChange={(v) => setSpouseRelType(v as SpouseRelationType)}>
                    <SelectTrigger size="sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spouse_married">Vợ/Chồng chính thức</SelectItem>
                      <SelectItem value="concubine">Thiếp</SelectItem>
                      <SelectItem value="partner">Bạn đời</SelectItem>
                      <SelectItem value="spouse_divorced">Đã ly hôn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </>
          )}

          <div className="space-y-1">
            <Label className="text-xs" htmlFor="es-ho">Họ</Label>
            <Input
              id="es-ho"
              size={1}
              className="h-8 text-sm"
              value={values.ho}
              onChange={(e) => handleChange('ho', e.target.value)}
              placeholder="Nguyễn"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs" htmlFor="es-ten-dem">Tên đệm</Label>
            <Input
              id="es-ten-dem"
              size={1}
              className="h-8 text-sm"
              value={values.ten_dem}
              onChange={(e) => handleChange('ten_dem', e.target.value)}
              placeholder="Văn"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs" htmlFor="es-ten">Tên *</Label>
            <Input
              id="es-ten"
              size={1}
              className="h-8 text-sm"
              value={values.ten}
              onChange={(e) => handleChange('ten', e.target.value)}
              placeholder="An"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Giới tính</Label>
            <Select
              value={values.gender}
              onValueChange={(v) => handleChange('gender', v)}
            >
              <SelectTrigger size="sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M">Nam</SelectItem>
                <SelectItem value="F">Nữ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Ngày sinh (dương lịch)</Label>
            <div className="flex gap-1.5">
              <Input
                id="es-birth-day"
                size={1}
                className="h-8 text-sm w-16"
                value={values.birth_day}
                onChange={(e) => handleChange('birth_day', e.target.value)}
                placeholder="Ngày"
                type="number"
                min={1}
                max={31}
              />
              <Input
                id="es-birth-month"
                size={1}
                className="h-8 text-sm w-16"
                value={values.birth_month}
                onChange={(e) => handleChange('birth_month', e.target.value)}
                placeholder="Tháng"
                type="number"
                min={1}
                max={12}
              />
              <Input
                id="es-birth-year"
                size={1}
                className="h-8 text-sm flex-1"
                value={values.birth_year}
                onChange={(e) => handleChange('birth_year', e.target.value)}
                placeholder="Năm"
                type="number"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs flex items-center gap-2">
              <span>Còn sống</span>
              <input
                type="checkbox"
                checked={isAlive}
                onChange={(e) => handleChange('is_alive', e.target.checked)}
                className="h-4 w-4 rounded border accent-primary"
              />
            </Label>
          </div>

          {!isAlive && (
            <div className="space-y-1">
              <Label className="text-xs">Ngày mất (dương lịch)</Label>
              <div className="flex gap-1.5">
                <Input
                  id="es-death-day"
                  size={1}
                  className="h-8 text-sm w-16"
                  value={values.death_day}
                  onChange={(e) => handleChange('death_day', e.target.value)}
                  placeholder="Ngày"
                  type="number"
                  min={1}
                  max={31}
                />
                <Input
                  id="es-death-month"
                  size={1}
                  className="h-8 text-sm w-16"
                  value={values.death_month}
                  onChange={(e) => handleChange('death_month', e.target.value)}
                  placeholder="Tháng"
                  type="number"
                  min={1}
                  max={12}
                />
                <Input
                  id="es-death-year"
                  size={1}
                  className="h-8 text-sm flex-1"
                  value={values.death_year}
                  onChange={(e) => handleChange('death_year', e.target.value)}
                  placeholder="Năm"
                  type="number"
                />
              </div>
            </div>
          )}

          {error && (
            <p className="text-xs text-destructive">{error}</p>
          )}
        </div>

      <div className="border-t p-3 space-y-2">
          {mode === 'edit' && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-1 text-muted-foreground"
                onClick={() => onAddRelativeClick ? onAddRelativeClick() : onOpenChange(false)}
                disabled={isLoading}
              >
                <UserPlus className="size-3.5" />
                Thêm người thân
              </Button>
              {onToggleStar && person && (
                <Button
                  variant={isStarred ? 'default' : 'outline'}
                  size="sm"
                  className="flex-none gap-1"
                  onClick={() => onToggleStar(person.id)}
                  title={isStarred ? 'Bỏ đánh dấu' : 'Đánh dấu quan trọng'}
                >
                  <Star className={`size-3.5 ${isStarred ? 'fill-current' : ''}`} />
                </Button>
              )}
            </div>
          )}

          <div className="flex gap-2">
            {mode === 'edit' && (
              <Button
                variant="destructive"
                size="sm"
                className="flex-none"
                onClick={handleDelete}
                disabled={isLoading}
              >
                <Trash2 className="size-3.5" />
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button
              size="sm"
              className="flex-1"
              onClick={handleSave}
              disabled={isLoading || !values.ten.trim()}
            >
              {isLoading ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </div>
        </div>
    </div>
  );
}

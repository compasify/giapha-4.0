'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Trash2, UserPlus, Star, X, Camera } from 'lucide-react';
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
import { resizeImageToBase64 } from '@/lib/utils/resize-image';
import type { FamilyChartPersonData, FamilyChartDatum } from '@/lib/transforms/family-chart-transform';
import { ChildOrderSection } from '@/components/tree/child-order-section';
import { DateInputSection } from '@/components/tree/date-input-section';
import { PersonSearchSelect } from '@/components/tree/person-search-select';
import { canLinkAsSpouse } from '@/lib/utils/validate-spouse-link';
import { lunarToSolar } from '@/lib/api/lunar-converter';
import type { LinkExistingSpousePayload } from '@/app/(app)/lineage/[id]/tree-view-helpers';
import { ParentsSection } from '@/components/tree/parents-section';
import type { SetParentPayload, RemoveParentPayload } from '@/components/tree/parents-section';
import type { RelationshipInfo } from '@/lib/transforms/family-chart-transform';

export type RelativeType = 'father' | 'mother' | 'spouse' | 'son' | 'daughter';

export interface EditSidebarPerson {
  id: string;
  data: FamilyChartPersonData;
}

export type CalendarType = 'solar' | 'lunar';

export interface EditSidebarFormValues {
  ho: string;
  ten_dem: string;
  ten: string;
  gender: 'M' | 'F';
  birth_year: string;
  birth_month: string;
  birth_day: string;
  birth_lunar_year: string;
  birth_lunar_month: string;
  birth_lunar_day: string;
  birth_lunar_leap_month: boolean;
  birth_calendar_type: CalendarType;
  death_year: string;
  death_month: string;
  death_day: string;
  death_lunar_year: string;
  death_lunar_month: string;
  death_lunar_day: string;
  death_lunar_leap_month: boolean;
  death_calendar_type: CalendarType;
  is_alive: boolean;
  birth_date_id: number | null;
  death_date_id: number | null;
  avatar: string | null;
}

export type SpouseRelationType = 'spouse_married' | 'concubine' | 'partner' | 'spouse_divorced';

export type ParentRelationType =
  | 'biological_parent'
  | 'adoptive_parent'
  | 'informal_adoptive'
  | 'step_parent'
  | 'foster_parent'
  | 'godparent';

export interface AddRelativePayload {
  personId: string;
  relativeType: RelativeType;
  spouseRelationType?: SpouseRelationType;
  parentRelationType?: ParentRelationType;
  coParentId?: string;
  sharedChildIds?: string[];
  values: EditSidebarFormValues;
}

interface ChildInfo {
  id: string;
  name: string;
  birthOrder: number;
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
  childrenOfPerson?: ChildInfo[];
  onReorderChildren?: (orderedChildIds: string[]) => Promise<void>;
  onLinkExistingSpouse?: (payload: LinkExistingSpousePayload) => Promise<void>;
  treeData?: FamilyChartDatum[];
  relationshipMap?: Map<string, RelationshipInfo[]>;
  onSetParent?: (payload: SetParentPayload) => Promise<void>;
  onRemoveParent?: (payload: RemoveParentPayload) => Promise<void>;
}

function emptyFormValues(): EditSidebarFormValues {
  return {
    ho: '', ten_dem: '', ten: '', gender: 'M',
    birth_year: '', birth_month: '', birth_day: '',
    birth_lunar_year: '', birth_lunar_month: '', birth_lunar_day: '',
    birth_lunar_leap_month: false, birth_calendar_type: 'solar',
    death_year: '', death_month: '', death_day: '',
    death_lunar_year: '', death_lunar_month: '', death_lunar_day: '',
    death_lunar_leap_month: false, death_calendar_type: 'solar',
    is_alive: true, birth_date_id: null, death_date_id: null,
    avatar: null,
  };
}

function numStr(val: number | null | undefined): string {
  return val != null ? String(val) : '';
}

function toFormValues(data: FamilyChartPersonData | null): EditSidebarFormValues {
  if (!data) return emptyFormValues();
  return {
    ho: data.ho ?? '',
    ten_dem: data.ten_dem ?? '',
    ten: data.ten ?? '',
    gender: data.gender,
    birth_year: numStr(data.birth_year),
    birth_month: numStr(data.birth_month),
    birth_day: numStr(data.birth_day),
    birth_lunar_year: numStr(data.birth_lunar_year),
    birth_lunar_month: numStr(data.birth_lunar_month),
    birth_lunar_day: numStr(data.birth_lunar_day),
    birth_lunar_leap_month: data.birth_lunar_leap_month ?? false,
    birth_calendar_type: (data.birth_calendar_type === 'lunar' ? 'lunar' : 'solar') as CalendarType,
    death_year: numStr(data.death_year),
    death_month: numStr(data.death_month),
    death_day: numStr(data.death_day),
    death_lunar_year: numStr(data.death_lunar_year),
    death_lunar_month: numStr(data.death_lunar_month),
    death_lunar_day: numStr(data.death_lunar_day),
    death_lunar_leap_month: data.death_lunar_leap_month ?? false,
    death_calendar_type: (data.death_calendar_type === 'lunar' ? 'lunar' : 'solar') as CalendarType,
    is_alive: data.is_alive,
    birth_date_id: data.birth_date_id ?? null,
    death_date_id: data.death_date_id ?? null,
    avatar: data.avatar ?? null,
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
  childrenOfPerson,
  onReorderChildren,
  onLinkExistingSpouse,
  treeData,
  relationshipMap,
  onSetParent,
  onRemoveParent,
}: EditSidebarProps) {
  const [values, setValues] = useState<EditSidebarFormValues>(() =>
    toFormValues(person?.data ?? null)
  );
  const [isAlive, setIsAlive] = useState(person?.data.is_alive ?? true);
  const [newRelType, setNewRelType] = useState<RelativeType>(relativeType ?? 'son');
  const [spouseRelType, setSpouseRelType] = useState<SpouseRelationType>('spouse_married');
  const [parentRelType, setParentRelType] = useState<ParentRelationType>('biological_parent');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [spouseMode, setSpouseMode] = useState<'create' | 'link'>('create');
  const [selectedExistingId, setSelectedExistingId] = useState<string | null>(null);
  const [selectedCoParentId, setSelectedCoParentId] = useState<string | null>(null);
  const [sharedChildIds, setSharedChildIds] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const personSpouses = useMemo(() => {
    if (!person || !treeData) return [];
    const datum = treeData.find((d) => d.id === person.id);
    if (!datum) return [];
    return datum.rels.spouses
      .map((sid) => {
        const sp = treeData.find((d) => d.id === sid);
        if (!sp) return null;
        return { id: sp.id, name: [sp.data.ho, sp.data.ten_dem, sp.data.ten].filter(Boolean).join(' ') || '(Không rõ)' };
      })
      .filter((s): s is NonNullable<typeof s> => s !== null);
  }, [person, treeData]);

  const personChildren = useMemo(() => {
    if (!person || !treeData) return [];
    const datum = treeData.find((d) => d.id === person.id);
    if (!datum) return [];
    return datum.rels.children
      .map((cid) => {
        const child = treeData.find((d) => d.id === cid);
        if (!child) return null;
        return { id: child.id, name: [child.data.ho, child.data.ten_dem, child.data.ten].filter(Boolean).join(' ') || '(Không rõ)' };
      })
      .filter((c): c is NonNullable<typeof c> => c !== null);
  }, [person, treeData]);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    try {
      const base64 = await resizeImageToBase64(file, 200);
      setValues((prev) => ({ ...prev, avatar: base64 }));
    } catch {
      setError('Không thể xử lý ảnh');
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  useEffect(() => {
    if (mode === 'new') {
      setValues(toFormValues(null));
      setIsAlive(true);
      setNewRelType(relativeType ?? 'son');
    } else if (person) {
      setValues(toFormValues(person.data));
      setIsAlive(person.data.is_alive);
    } else {
      setValues(toFormValues(null));
      setIsAlive(true);
    }
    setError(null);
    setSpouseMode('create');
    setSelectedExistingId(null);
    setSelectedCoParentId(personSpouses.length > 0 ? personSpouses[0].id : null);
    setSharedChildIds(new Set(personChildren.map((c) => c.id)));
  }, [person, mode, relativeType]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (mode !== 'new') return;
    if (newRelType === 'daughter' || newRelType === 'mother') {
      setValues((prev) => ({ ...prev, gender: 'F' }));
    } else if (newRelType === 'son' || newRelType === 'father') {
      setValues((prev) => ({ ...prev, gender: 'M' }));
    }
  }, [newRelType, mode]);

  useEffect(() => {
    setSelectedExistingId(null);
  }, [spouseMode]);

  function handleChange(field: keyof EditSidebarFormValues, val: string | boolean) {
    setValues((prev) => ({ ...prev, [field]: val }));
    if (field === 'is_alive') setIsAlive(val as boolean);
  }

  async function convertLunarIfNeeded(vals: EditSidebarFormValues): Promise<EditSidebarFormValues> {
    const result = { ...vals };
    if (result.birth_calendar_type === 'lunar' && result.birth_lunar_year && result.birth_lunar_month && result.birth_lunar_day) {
      const solar = await lunarToSolar(
        parseInt(result.birth_lunar_year, 10),
        parseInt(result.birth_lunar_month, 10),
        parseInt(result.birth_lunar_day, 10),
        result.birth_lunar_leap_month,
      );
      result.birth_year = String(solar.solar_year);
      result.birth_month = String(solar.solar_month);
      result.birth_day = String(solar.solar_day);
    }
    if (result.death_calendar_type === 'lunar' && result.death_lunar_year && result.death_lunar_month && result.death_lunar_day) {
      const solar = await lunarToSolar(
        parseInt(result.death_lunar_year, 10),
        parseInt(result.death_lunar_month, 10),
        parseInt(result.death_lunar_day, 10),
        result.death_lunar_leap_month,
      );
      result.death_year = String(solar.solar_year);
      result.death_month = String(solar.solar_month);
      result.death_day = String(solar.solar_day);
    }
    return result;
  }

  async function handleSave() {
    if (!person) return;
    setIsLoading(true);
    setError(null);
    try {
      if (mode === 'new' && newRelType === 'spouse' && spouseMode === 'link') {
        if (!selectedExistingId || !onLinkExistingSpouse) return;
        await onLinkExistingSpouse({
          personId: person.id,
          existingSpouseId: selectedExistingId,
          spouseRelationType: spouseRelType,
        });
      } else {
        const converted = await convertLunarIfNeeded({ ...values, is_alive: isAlive });
        const payload: EditSidebarFormValues = converted;
        if (mode === 'edit') {
          await onSave(person.id, payload);
        } else {
          const isParentChild = ['father', 'mother', 'son', 'daughter'].includes(newRelType);
          const isChild = newRelType === 'son' || newRelType === 'daughter';
          const isSpouse = newRelType === 'spouse';
          await onAddRelative({
            personId: person.id,
            relativeType: newRelType,
            spouseRelationType: isSpouse ? spouseRelType : undefined,
            parentRelationType: isParentChild ? parentRelType : undefined,
            coParentId: isChild && selectedCoParentId ? selectedCoParentId : undefined,
            sharedChildIds: isSpouse && sharedChildIds.size > 0 ? [...sharedChildIds] : undefined,
            values: payload,
          });
        }
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
                <>
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
                  {onLinkExistingSpouse && treeData && (
                    <>
                      <div className="space-y-1">
                        <Label className="text-xs">Cách thêm</Label>
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            className={`flex-1 text-xs py-1.5 rounded-md border transition-colors ${
                              spouseMode === 'create'
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-muted hover:bg-accent border-transparent'
                            }`}
                            onClick={() => setSpouseMode('create')}
                          >
                            Tạo người mới
                          </button>
                          <button
                            type="button"
                            className={`flex-1 text-xs py-1.5 rounded-md border transition-colors ${
                              spouseMode === 'link'
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-muted hover:bg-accent border-transparent'
                            }`}
                            onClick={() => setSpouseMode('link')}
                          >
                            Liên kết người đã có
                          </button>
                        </div>
                      </div>
                      {spouseMode === 'link' && person && (
                        <PersonSearchSelect
                          persons={treeData}
                          currentPersonId={person.id}
                          selectedId={selectedExistingId}
                          onSelect={setSelectedExistingId}
                          validateCandidate={(cid) => canLinkAsSpouse(person.id, cid, treeData)}
                          placeholder="Nhập tên để tìm..."
                        />
                      )}
                    </>
                  )}
                </>
              )}
              {newRelType === 'spouse' && spouseMode === 'create' && personChildren.length > 0 && (
                <div className="space-y-1.5">
                  <Label className="text-xs">Con chung</Label>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {personChildren.map((child) => (
                      <label key={child.id} className="flex items-center gap-2 text-xs cursor-pointer hover:bg-accent rounded px-1 py-0.5">
                        <input
                          type="checkbox"
                          className="h-3.5 w-3.5 rounded border accent-primary"
                          checked={sharedChildIds.has(child.id)}
                          onChange={(e) => {
                            setSharedChildIds((prev) => {
                              const next = new Set(prev);
                              if (e.target.checked) next.add(child.id);
                              else next.delete(child.id);
                              return next;
                            });
                          }}
                        />
                        {child.name}
                      </label>
                    ))}
                  </div>
                </div>
              )}
              {['father', 'mother', 'son', 'daughter'].includes(newRelType) && (
                <div className="space-y-1">
                  <Label className="text-xs">Loại quan hệ</Label>
                  <Select value={parentRelType} onValueChange={(v) => setParentRelType(v as ParentRelationType)}>
                    <SelectTrigger size="sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="biological_parent">Con ruột</SelectItem>
                      <SelectItem value="adoptive_parent">Con nuôi</SelectItem>
                      <SelectItem value="informal_adoptive">Con nuôi (không chính thức)</SelectItem>
                      <SelectItem value="step_parent">Con riêng</SelectItem>
                      <SelectItem value="foster_parent">Con nuôi tạm</SelectItem>
                      <SelectItem value="godparent">Kết nghĩa (cha/mẹ đỡ đầu)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              {(newRelType === 'son' || newRelType === 'daughter') && personSpouses.length >= 1 && (
                <div className="space-y-1">
                  <Label className="text-xs">Con chung với</Label>
                  <Select
                    value={selectedCoParentId ?? '_none'}
                    onValueChange={(v) => setSelectedCoParentId(v === '_none' ? null : v)}
                  >
                    <SelectTrigger size="sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_none">Không (con riêng)</SelectItem>
                      {personSpouses.map((sp) => (
                        <SelectItem key={sp.id} value={sp.id}>{sp.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </>
          )}

          {!(mode === 'new' && newRelType === 'spouse' && spouseMode === 'link') && (
          <>
          <div className="flex justify-center">
            <button
              type="button"
              className="relative group size-16 rounded-full overflow-hidden border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
              title="Đổi ảnh đại diện"
            >
              {values.avatar ? (
                <img src={values.avatar} alt="Avatar" className="size-full object-cover" />
              ) : (
                <div className="size-full flex items-center justify-center bg-muted text-muted-foreground text-lg font-semibold">
                  {((values.ho?.charAt(0) ?? '') + (values.ten?.charAt(0) ?? '')).toUpperCase() || '?'}
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="size-4 text-white" />
              </div>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

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

          <DateInputSection
            label="Ngày sinh"
            solarDay={values.birth_day}
            solarMonth={values.birth_month}
            solarYear={values.birth_year}
            lunarDay={values.birth_lunar_day}
            lunarMonth={values.birth_lunar_month}
            lunarYear={values.birth_lunar_year}
            lunarLeapMonth={values.birth_lunar_leap_month}
            calendarType={values.birth_calendar_type}
            onSolarChange={(field, value) => {
              const key = field === 'day' ? 'birth_day' : field === 'month' ? 'birth_month' : 'birth_year';
              handleChange(key, value);
            }}
            onLunarChange={(field, value) => {
              if (field === 'leapMonth') {
                handleChange('birth_lunar_leap_month', value as boolean);
              } else {
                const key = field === 'day' ? 'birth_lunar_day' : field === 'month' ? 'birth_lunar_month' : 'birth_lunar_year';
                handleChange(key, value as string);
              }
            }}
            onCalendarTypeChange={(type) => handleChange('birth_calendar_type', type)}
          />

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
            <DateInputSection
              label="Ngày mất"
              solarDay={values.death_day}
              solarMonth={values.death_month}
              solarYear={values.death_year}
              lunarDay={values.death_lunar_day}
              lunarMonth={values.death_lunar_month}
              lunarYear={values.death_lunar_year}
              lunarLeapMonth={values.death_lunar_leap_month}
              calendarType={values.death_calendar_type}
              onSolarChange={(field, value) => {
                const key = field === 'day' ? 'death_day' : field === 'month' ? 'death_month' : 'death_year';
                handleChange(key, value);
              }}
              onLunarChange={(field, value) => {
                if (field === 'leapMonth') {
                  handleChange('death_lunar_leap_month', value as boolean);
                } else {
                  const key = field === 'day' ? 'death_lunar_day' : field === 'month' ? 'death_lunar_month' : 'death_lunar_year';
                  handleChange(key, value as string);
                }
              }}
              onCalendarTypeChange={(type) => handleChange('death_calendar_type', type)}
            />
          )}
          </>
          )}

          {mode === 'edit' && person && treeData && relationshipMap && onSetParent && onRemoveParent && (
            <ParentsSection
              personId={person.id}
              treeData={treeData}
              relationshipMap={relationshipMap}
              onSetParent={onSetParent}
              onRemoveParent={onRemoveParent}
            />
          )}

          {mode === 'edit' && childrenOfPerson && onReorderChildren && childrenOfPerson.length >= 2 && (
            <ChildOrderSection children={childrenOfPerson} onReorder={onReorderChildren} />
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
              disabled={
                isLoading ||
                (mode === 'new' && newRelType === 'spouse' && spouseMode === 'link'
                  ? !selectedExistingId
                  : !values.ten.trim())
              }
            >
              {isLoading
                ? 'Đang lưu...'
                : mode === 'new' && newRelType === 'spouse' && spouseMode === 'link'
                  ? 'Liên kết'
                  : 'Lưu'}
            </Button>
          </div>
        </div>
    </div>
  );
}

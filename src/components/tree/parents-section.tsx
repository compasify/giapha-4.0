'use client';

import { useMemo, useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { FamilyChartDatum, RelationshipInfo } from '@/lib/transforms/family-chart-transform';
import type { ParentRelationType } from '@/components/tree/edit-sidebar';

// ── Types ────────────────────────────────────────────────────────────────────

interface ParentDisplay {
  id: string;
  name: string;
  gender: 'M' | 'F';
  avatar: string | null;
  relationshipId: number | null;
}

export interface SetParentPayload {
  childId: string;
  parentId: string;
  relationType: ParentRelationType;
}

export interface RemoveParentPayload {
  relationshipId: number;
}

interface ParentsSectionProps {
  personId: string;
  treeData: FamilyChartDatum[];
  relationshipMap: Map<string, RelationshipInfo[]>;
  onSetParent: (payload: SetParentPayload) => Promise<void>;
  onRemoveParent: (payload: RemoveParentPayload) => Promise<void>;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const PARENT_REL_TYPES = new Set([
  'biological_parent', 'adoptive_parent', 'informal_adoptive',
  'step_parent', 'foster_parent', 'surrogate_parent', 'godparent',
]);

function getPersonName(d: FamilyChartDatum): string {
  return [d.data.ho, d.data.ten_dem, d.data.ten].filter(Boolean).join(' ') || '(Không rõ)';
}

function nameInitials(name: string): string {
  const parts = name.split(' ').filter(Boolean);
  const first = parts[0]?.charAt(0) ?? '';
  const last = parts.at(-1)?.charAt(0) ?? '';
  return (first + last).toUpperCase() || '?';
}

function genderLabel(g: 'M' | 'F'): string {
  return g === 'M' ? 'Cha' : 'Mẹ';
}

function findParentRelId(
  childId: string,
  parentId: string,
  relationshipMap: Map<string, RelationshipInfo[]>,
): number | null {
  const rels = relationshipMap.get(childId);
  if (!rels) return null;
  const rel = rels.find(
    (r) => r.fromId === parentId && r.toId === childId && PARENT_REL_TYPES.has(r.type),
  );
  return rel?.id ?? null;
}

// ── Component ────────────────────────────────────────────────────────────────

export function ParentsSection({
  personId,
  treeData,
  relationshipMap,
  onSetParent,
  onRemoveParent,
}: ParentsSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [parentRelType, setParentRelType] = useState<ParentRelationType>('biological_parent');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dataMap = useMemo(() => new Map(treeData.map((d) => [d.id, d])), [treeData]);

  const parents = useMemo(() => {
    const person = dataMap.get(personId);
    if (!person) return [];

    const result: ParentDisplay[] = [];
    for (const pid of person.rels.parents) {
      const parent = dataMap.get(pid);
      if (!parent) continue;
      result.push({
        id: pid,
        name: getPersonName(parent),
        gender: parent.data.gender,
        avatar: parent.data.avatar,
        relationshipId: findParentRelId(personId, pid, relationshipMap),
      });
    }
    return result;
  }, [personId, dataMap, relationshipMap]);

  const existingParentIds = useMemo(
    () => new Set(parents.map((p) => p.id)),
    [parents],
  );

  const candidates = useMemo(() => {
    if (!isAdding) return [];

    const person = dataMap.get(personId);
    if (!person) return [];

    const excludeIds = new Set<string>([personId]);
    for (const pid of person.rels.parents) excludeIds.add(pid);
    for (const cid of person.rels.children) excludeIds.add(cid);

    const priorityIds = new Set<string>();
    for (const p of parents) {
      const parentDatum = dataMap.get(p.id);
      if (!parentDatum) continue;
      for (const spouseId of parentDatum.rels.spouses) {
        if (!excludeIds.has(spouseId)) {
          priorityIds.add(spouseId);
        }
      }
    }

    const all = treeData
      .filter((d) => !excludeIds.has(d.id))
      .map((d) => ({
        id: d.id,
        name: getPersonName(d),
        avatar: d.data.avatar,
        gender: d.data.gender,
        isPriority: priorityIds.has(d.id),
        generationNumber: d.data.generation_number,
      }));

    all.sort((a, b) => {
      if (a.isPriority !== b.isPriority) return a.isPriority ? -1 : 1;
      return a.name.localeCompare(b.name, 'vi');
    });

    return all;
  }, [isAdding, personId, dataMap, treeData, parents]);

  async function handleSetParent() {
    if (!selectedCandidateId) return;
    if (existingParentIds.has(selectedCandidateId)) {
      setError('Người này đã là bố/mẹ rồi');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await onSetParent({
        childId: personId,
        parentId: selectedCandidateId,
        relationType: parentRelType,
      });
      cancelAdding();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Đã xảy ra lỗi');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRemoveParent(parent: ParentDisplay) {
    if (!parent.relationshipId) return;
    if (!window.confirm(`Xoá quan hệ với ${parent.name}?`)) return;
    setIsLoading(true);
    setError(null);
    try {
      await onRemoveParent({ relationshipId: parent.relationshipId });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Đã xảy ra lỗi');
    } finally {
      setIsLoading(false);
    }
  }

  function cancelAdding() {
    setIsAdding(false);
    setSelectedCandidateId(null);
    setParentRelType('biological_parent');
    setError(null);
  }

  const canAddMore = parents.length < 2;

  return (
    <div className="space-y-2">
      <div className="text-xs font-medium text-muted-foreground">Bố mẹ</div>

      {parents.map((parent) => (
        <div key={parent.id} className="flex items-center gap-2 rounded-md border px-2 py-1.5">
          <div className="size-6 flex-shrink-0 rounded-full overflow-hidden bg-muted flex items-center justify-center text-[10px] font-semibold">
            {parent.avatar ? (
              <img src={parent.avatar} alt="" className="size-full object-cover" />
            ) : (
              nameInitials(parent.name)
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-muted-foreground">{genderLabel(parent.gender)}</div>
            <div className="text-sm font-medium truncate">{parent.name}</div>
          </div>
          {parent.relationshipId && (
            <Button
              variant="ghost"
              size="icon-sm"
              className="size-5 text-muted-foreground hover:text-destructive flex-shrink-0"
              onClick={() => handleRemoveParent(parent)}
              disabled={isLoading}
              title={`Xoá quan hệ ${genderLabel(parent.gender).toLowerCase()}`}
            >
              <X className="size-3" />
            </Button>
          )}
        </div>
      ))}

      {parents.length === 0 && !isAdding && (
        <p className="text-xs text-muted-foreground italic">Chưa có thông tin bố mẹ</p>
      )}

      {canAddMore && !isAdding && (
        <button
          type="button"
          className="w-full flex items-center gap-2 rounded-md border border-dashed px-2 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors disabled:opacity-50"
          onClick={() => setIsAdding(true)}
          disabled={isLoading}
        >
          <UserPlus className="size-3.5 flex-shrink-0" />
          <span>Thêm {parents.length === 0 ? 'bố/mẹ' : 'bố/mẹ còn lại'}</span>
        </button>
      )}

      {isAdding && (
        <div className="space-y-2 rounded-md border p-2 bg-muted/30">
          <div className="text-xs font-medium">Chọn bố/mẹ</div>

          <Select
            value={selectedCandidateId ?? '_none'}
            onValueChange={(v) => setSelectedCandidateId(v === '_none' ? null : v)}
          >
            <SelectTrigger size="sm">
              <SelectValue placeholder="Chọn người..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_none" disabled>Chọn người...</SelectItem>
              {candidates.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.isPriority ? '⭐ ' : ''}{c.name}
                  {c.gender === 'M' ? ' (Nam)' : ' (Nữ)'}
                  {c.generationNumber != null ? ` · Đời ${c.generationNumber}` : ''}
                </SelectItem>
              ))}
              {candidates.length === 0 && (
                <SelectItem value="_empty" disabled>
                  Không tìm thấy ứng viên
                </SelectItem>
              )}
            </SelectContent>
          </Select>

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

          <div className="flex gap-1.5">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-xs"
              onClick={cancelAdding}
              disabled={isLoading}
            >
              Huỷ
            </Button>
            <Button
              size="sm"
              className="flex-1 text-xs"
              onClick={handleSetParent}
              disabled={isLoading || !selectedCandidateId}
            >
              {isLoading ? 'Đang lưu...' : 'Xác nhận'}
            </Button>
          </div>
        </div>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}

      {!canAddMore && !isAdding && (
        <p className="text-xs text-muted-foreground italic">Đã có đầy đủ bố mẹ</p>
      )}
    </div>
  );
}

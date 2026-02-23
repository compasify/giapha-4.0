'use client';

import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Person } from '@/types/person';

// ── Types ────────────────────────────────────────────────────────────────────

/** Fields available for per-field conflict resolution */
export const RESOLVABLE_FIELDS = [
  'ho', 'ten_dem', 'ten', 'ten_thuong_goi', 'gender',
  'is_alive', 'biography', 'notes', 'birth_place', 'death_place',
] as const;

export type ResolvableField = (typeof RESOLVABLE_FIELDS)[number];

export interface ConflictItem {
  personId: string;
  sourcePerson: Person;
  targetPerson: Person;
  resolution: Record<ResolvableField, 'source' | 'target'>;
}

export interface ConflictResolutionProps {
  conflicts: ConflictItem[];
  onChange: (conflicts: ConflictItem[]) => void;
  onConfirm: () => void;
}

// ── Field labels (Vietnamese) ───────────────────────────────────────────────

const FIELD_LABELS: Record<ResolvableField, string> = {
  ho: 'H\u1ecd',
  ten_dem: 'T\u00ean \u0111\u1ec7m',
  ten: 'T\u00ean',
  ten_thuong_goi: 'T\u00ean th\u01b0\u1eddng g\u1ecdi',
  gender: 'Gi\u1edbi t\u00ednh',
  is_alive: 'C\u00f2n s\u1ed1ng',
  biography: 'Ti\u1ec3u s\u1eed',
  notes: 'Ghi ch\u00fa',
  birth_place: 'N\u01a1i sinh',
  death_place: 'N\u01a1i m\u1ea5t',
};

function formatFieldValue(person: Person, field: ResolvableField): string {
  const val = person[field];
  if (val == null || val === '') return '(tr\u1ed1ng)';
  if (typeof val === 'boolean') return val ? 'C\u00f3' : 'Kh\u00f4ng';
  return String(val);
}

// ── Bulk action helpers ─────────────────────────────────────────────────────

function bulkResolve(
  conflicts: ConflictItem[],
  choice: 'source' | 'target',
): ConflictItem[] {
  return conflicts.map((c) => ({
    ...c,
    resolution: Object.fromEntries(
      RESOLVABLE_FIELDS.map((f) => [f, choice]),
    ) as Record<ResolvableField, 'source' | 'target'>,
  }));
}

// ── Sub-components ─────────────────────────────────────────────────────────

function ConflictFieldRow({
  field,
  source,
  target,
  chosen,
  onChoose,
}: {
  field: ResolvableField;
  source: Person;
  target: Person;
  chosen: 'source' | 'target';
  onChoose: (choice: 'source' | 'target') => void;
}) {
  const sourceVal = formatFieldValue(source, field);
  const targetVal = formatFieldValue(target, field);
  const isDiff = sourceVal !== targetVal;

  if (!isDiff) return null; // skip identical fields

  return (
    <tr className="border-b last:border-0">
      <td className="py-2 px-3 text-sm font-medium text-muted-foreground w-28">
        {FIELD_LABELS[field]}
      </td>
      <td
        className={`py-2 px-3 text-sm cursor-pointer transition-colors ${chosen === 'source' ? 'bg-primary/10 font-semibold' : 'hover:bg-muted/50'}`}
        onClick={() => onChoose('source')}
      >
        {sourceVal}
      </td>
      <td
        className={`py-2 px-3 text-sm cursor-pointer transition-colors ${chosen === 'target' ? 'bg-primary/10 font-semibold' : 'hover:bg-muted/50'}`}
        onClick={() => onChoose('target')}
      >
        {targetVal}
      </td>
    </tr>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export function ConflictResolutionUI({ conflicts, onChange, onConfirm }: ConflictResolutionProps) {
  const handleFieldChoose = useCallback(
    (conflictIdx: number, field: ResolvableField, choice: 'source' | 'target') => {
      const updated = [...conflicts];
      updated[conflictIdx] = {
        ...updated[conflictIdx],
        resolution: { ...updated[conflictIdx].resolution, [field]: choice },
      };
      onChange(updated);
    },
    [conflicts, onChange],
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Gi\u1ea3i quy\u1ebft xung \u0111\u1ed9t</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onChange(bulkResolve(conflicts, 'source'))}>
            D\u00f9ng t\u1ea5t c\u1ea3 t\u1eeb ngu\u1ed3n
          </Button>
          <Button variant="outline" size="sm" onClick={() => onChange(bulkResolve(conflicts, 'target'))}>
            D\u00f9ng t\u1ea5t c\u1ea3 t\u1eeb \u0111\u00edch
          </Button>
        </div>
      </div>

      {conflicts.map((conflict, idx) => (
        <Card key={conflict.personId}>
          <CardHeader className="py-3">
            <CardTitle className="text-base flex items-center gap-2">
              {conflict.sourcePerson.full_name}
              <Badge variant="secondary">
                {RESOLVABLE_FIELDS.filter(
                  (f) => formatFieldValue(conflict.sourcePerson, f) !== formatFieldValue(conflict.targetPerson, f),
                ).length}{' '}
                kh\u00e1c bi\u1ec7t
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="py-2 px-3 text-xs text-left">Tr\u01b0\u1eddng</th>
                  <th className="py-2 px-3 text-xs text-left">Ngu\u1ed3n</th>
                  <th className="py-2 px-3 text-xs text-left">\u0110\u00edch</th>
                </tr>
              </thead>
              <tbody>
                {RESOLVABLE_FIELDS.map((field) => (
                  <ConflictFieldRow
                    key={field}
                    field={field}
                    source={conflict.sourcePerson}
                    target={conflict.targetPerson}
                    chosen={conflict.resolution[field]}
                    onChoose={(choice) => handleFieldChoose(idx, field, choice)}
                  />
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-end">
        <Button onClick={onConfirm}>X\u00e1c nh\u1eadn</Button>
      </div>
    </div>
  );
}
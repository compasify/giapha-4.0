'use client';

import { useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { FamilyChartDatum } from '@/lib/transforms/family-chart-transform';

interface BranchFilterProps {
  data: FamilyChartDatum[];
  value: string;
  onChange: (rootId: string) => void;
}

export function BranchFilter({ data, value, onChange }: BranchFilterProps) {
  const rootPersons = useMemo(() => {
    return data.filter((d) => d.rels.parents.length === 0);
  }, [data]);

  if (rootPersons.length <= 1) return null;

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger size="sm" className="w-40">
        <SelectValue placeholder="Tất cả nhánh" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Tất cả nhánh</SelectItem>
        {rootPersons.map((r) => {
          const name = [r.data.ho, r.data.ten_dem, r.data.ten].filter(Boolean).join(' ');
          return (
            <SelectItem key={r.id} value={r.id}>
              Nhánh {name || r.id}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

export function filterByBranch(data: FamilyChartDatum[], rootId: string): FamilyChartDatum[] {
  if (rootId === 'all') return data;

  const included = new Set<string>();
  const dataMap = new Map(data.map((d) => [d.id, d]));

  function collectDescendants(id: string) {
    if (included.has(id)) return;
    included.add(id);
    const person = dataMap.get(id);
    if (!person) return;
    for (const childId of person.rels.children) collectDescendants(childId);
    for (const spouseId of person.rels.spouses) included.add(spouseId);
  }

  collectDescendants(rootId);
  return data.filter((d) => included.has(d.id));
}

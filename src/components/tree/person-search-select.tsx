'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { FamilyChartDatum } from '@/lib/transforms/family-chart-transform';
import type { SpouseLinkValidation } from '@/lib/utils/validate-spouse-link';

interface PersonSearchSelectProps {
  persons: FamilyChartDatum[];
  currentPersonId: string;
  onSelect: (personId: string) => void;
  validateCandidate?: (candidateId: string) => SpouseLinkValidation;
  placeholder?: string;
  selectedId?: string | null;
}

const MAX_RESULTS = 10;

function normalizeSearch(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function personSubline(d: FamilyChartDatum['data']): string {
  const parts: string[] = [];
  if (d.generation_number != null) parts.push(`Đời ${d.generation_number}`);
  parts.push(d.gender === 'M' ? 'Nam' : 'Nữ');
  if (d.birth_year) parts.push(String(d.birth_year));
  if (!d.is_alive) parts.push('Đã mất');
  return parts.join(' · ');
}

function personInitials(d: FamilyChartDatum['data']): string {
  return ((d.ho?.charAt(0) ?? '') + (d.ten?.charAt(0) ?? '')).toUpperCase() || '?';
}

export function PersonSearchSelect({
  persons,
  currentPersonId,
  onSelect,
  validateCandidate,
  placeholder = 'Nhập tên để tìm...',
  selectedId,
}: PersonSearchSelectProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const candidates = persons.filter((p) => p.id !== currentPersonId);

  const filtered = candidates
    .filter((p) => {
      if (!query.trim()) return true;
      return normalizeSearch(p.data.full_name).includes(normalizeSearch(query));
    })
    .slice(0, MAX_RESULTS);

  const validations = new Map<string, SpouseLinkValidation>();
  if (validateCandidate) {
    for (const p of filtered) {
      validations.set(p.id, validateCandidate(p.id));
    }
  }

  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && activeIndex >= 0) {
        e.preventDefault();
        const item = filtered[activeIndex];
        if (item) {
          const v = validations.get(item.id);
          if (!v || v.valid) onSelect(item.id);
        }
      } else if (e.key === 'Escape') {
        setQuery('');
        inputRef.current?.blur();
      }
    },
    [filtered, activeIndex, validations, onSelect],
  );

  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const active = listRef.current.children[activeIndex] as HTMLElement | undefined;
      active?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  const selectedPerson = selectedId ? persons.find((p) => p.id === selectedId) : null;

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          className="h-8 text-sm pl-8"
          size={1}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
        />
      </div>

      <div
        ref={listRef}
        className="max-h-48 overflow-y-auto rounded-md border bg-popover"
        role="listbox"
      >
        {filtered.length === 0 && (
          <div className="px-3 py-4 text-center text-xs text-muted-foreground">
            {query.trim() ? 'Không tìm thấy' : 'Không có người nào khác'}
          </div>
        )}
        {filtered.map((p, i) => {
          const v = validations.get(p.id);
          const disabled = v ? !v.valid : false;
          const isSelected = p.id === selectedId;
          const isActive = i === activeIndex;

          return (
            <button
              key={p.id}
              type="button"
              role="option"
              aria-selected={isSelected}
              disabled={disabled}
              className={`
                w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm
                transition-colors border-b last:border-b-0
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-accent'}
                ${isSelected ? 'bg-accent/70 ring-1 ring-primary/30' : ''}
                ${isActive && !disabled ? 'bg-accent' : ''}
              `}
              onClick={() => !disabled && onSelect(p.id)}
            >
              <div className="size-8 flex-shrink-0 rounded-full overflow-hidden bg-muted flex items-center justify-center text-xs font-semibold">
                {p.data.avatar ? (
                  <img src={p.data.avatar} alt="" className="size-full object-cover" />
                ) : (
                  personInitials(p.data)
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{p.data.full_name || '(Không rõ)'}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {disabled && v?.reason ? v.reason : personSubline(p.data)}
                </div>
              </div>
              {isSelected && (
                <span className="text-primary text-xs font-medium flex-shrink-0">✓</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {query.trim()
            ? `${filtered.length}/${candidates.length} người`
            : `${candidates.length} người`}
        </span>
        {selectedPerson && (
          <span className="font-medium text-foreground truncate ml-2">
            Đã chọn: {selectedPerson.data.full_name}
          </span>
        )}
      </div>
    </div>
  );
}

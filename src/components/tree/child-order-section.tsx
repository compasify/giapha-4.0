'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronUp, ChevronDown, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChildItem {
  id: string;
  name: string;
  birthOrder: number;
}

interface ChildOrderSectionProps {
  children: ChildItem[];
  onReorder: (orderedChildIds: string[]) => Promise<void>;
}

function getOrdinalLabel(index: number): string {
  if (index === 0) return 'Con cả';
  return `Con thứ ${index + 1}`;
}

export function ChildOrderSection({ children, onReorder }: ChildOrderSectionProps) {
  const sorted = useMemo(
    () => [...children].sort((a, b) => a.birthOrder - b.birthOrder),
    [children],
  );
  const [items, setItems] = useState<ChildItem[]>(sorted);
  const [saving, setSaving] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  useEffect(() => {
    setItems(sorted);
  }, [sorted]);

  const hasChanges = items.some((item, i) => item.id !== sorted[i]?.id);

  const moveItem = useCallback((fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= items.length) return;
    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
  }, [items.length]);

  const [error, setError] = useState<string | null>(null);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      await onReorder(items.map((c) => c.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lỗi khi lưu thứ tự');
    } finally {
      setSaving(false);
    }
  }, [items, onReorder]);

  function handleDragStart(e: React.DragEvent, idx: number) {
    setDragIdx(idx);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(idx));
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  function handleDrop(e: React.DragEvent, targetIdx: number) {
    e.preventDefault();
    if (dragIdx !== null && dragIdx !== targetIdx) {
      moveItem(dragIdx, targetIdx);
    }
    setDragIdx(null);
  }

  if (items.length < 2) return null;

  return (
    <div className="space-y-2">
      <div className="text-xs font-medium text-muted-foreground">Thứ tự con ({items.length})</div>
      <div className="space-y-1">
        {items.map((child, idx) => (
          <div
            key={child.id}
            className={`flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs transition-colors ${
              dragIdx === idx ? 'opacity-40' : ''
            }`}
            draggable
            onDragStart={(e) => handleDragStart(e, idx)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, idx)}
            onDragEnd={() => setDragIdx(null)}
          >
            <GripVertical className="size-3 text-muted-foreground cursor-grab flex-shrink-0" />
            <span className="flex-1 truncate">{child.name || '(Không rõ)'}</span>
            <span className="text-muted-foreground flex-shrink-0">{getOrdinalLabel(idx)}</span>
            <div className="flex flex-shrink-0">
              <Button
                variant="ghost"
                size="icon-sm"
                className="size-5"
                onClick={() => moveItem(idx, idx - 1)}
                disabled={idx === 0}
              >
                <ChevronUp className="size-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                className="size-5"
                onClick={() => moveItem(idx, idx + 1)}
                disabled={idx === items.length - 1}
              >
                <ChevronDown className="size-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      {hasChanges && (
        <Button size="sm" className="w-full" onClick={handleSave} disabled={saving}>
          {saving ? 'Đang lưu...' : 'Lưu thứ tự'}
        </Button>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

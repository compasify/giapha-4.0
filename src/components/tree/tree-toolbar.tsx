'use client';

import { useState, type ReactNode } from 'react';
import { AlignHorizontalJustifyCenter, AlignVerticalJustifyCenter, Undo2, Redo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { FamilyChartInstance } from './family-tree';
import type { FamilyChartDatum } from '@/lib/transforms/family-chart-transform';
import type { EditTreeInstance } from './tree-edit-integration';

interface TreeToolbarProps {
  chart: FamilyChartInstance | null;
  data: FamilyChartDatum[];
  editTree?: EditTreeInstance | null;
  extraControls?: ReactNode;
}

export function TreeToolbar({ chart, data, editTree, extraControls }: TreeToolbarProps) {
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('vertical');
  const [, forceUpdate] = useState(0);

  function handlePersonSelect(id: string) {
    if (!chart) return;
    chart.updateMainId(id);
    chart.updateTree({ tree_position: 'main_to_middle' });
  }

  function handleOrientationToggle(next: 'horizontal' | 'vertical') {
    if (!chart) return;
    if (next === 'horizontal') {
      chart.setOrientationHorizontal();
    } else {
      chart.setOrientationVertical();
    }
    chart.updateTree({ tree_position: 'fit' });
    setOrientation(next);
  }

  function handleUndo() {
    if (!editTree?.history.canBack()) return;
    editTree.history.back();
    forceUpdate((n) => n + 1);
  }

  function handleRedo() {
    if (!editTree?.history.canForward()) return;
    editTree.history.forward();
    forceUpdate((n) => n + 1);
  }

  return (
    <div className="flex items-center gap-2 px-1 py-2 flex-wrap">
      <Select onValueChange={handlePersonSelect}>
        <SelectTrigger size="sm" className="w-56">
          <SelectValue placeholder="Tìm thành viên..." />
        </SelectTrigger>
        <SelectContent>
          {data.map((d) => {
            const name = [d.data.ho, d.data.ten_dem, d.data.ten].filter(Boolean).join(' ');
            return (
              <SelectItem key={d.id} value={d.id}>
                {name || '(Không rõ)'}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      <div className="flex items-center gap-1">
        <Button
          variant={orientation === 'horizontal' ? 'default' : 'outline'}
          size="icon-sm"
          onClick={() => handleOrientationToggle('horizontal')}
          title="Ngang"
        >
          <AlignHorizontalJustifyCenter />
        </Button>
        <Button
          variant={orientation === 'vertical' ? 'default' : 'outline'}
          size="icon-sm"
          onClick={() => handleOrientationToggle('vertical')}
          title="Dọc"
        >
          <AlignVerticalJustifyCenter />
        </Button>
      </div>

      {editTree && (
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={handleUndo}
            disabled={!editTree.history.canBack()}
            title="Hoàn tác (Ctrl+Z)"
          >
            <Undo2 />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={handleRedo}
            disabled={!editTree.history.canForward()}
            title="Làm lại (Ctrl+Shift+Z)"
          >
            <Redo2 />
          </Button>
        </div>
      )}

      {extraControls}
    </div>
  );
}
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ChevronRight } from 'lucide-react';
import { useLineages } from '@/hooks/use-lineages';

export interface MergeTargetConfig {
  target: { type: 'new'; name: string } | { type: 'existing'; lineageId: number };
  deleteSources: boolean;
}

interface MergeTargetSelectorProps {
  sourceIds: number[];
  onChange: (config: MergeTargetConfig) => void;
  onContinue: () => void;
}

export function MergeTargetSelector({ sourceIds, onChange, onContinue }: MergeTargetSelectorProps) {
  const { data: allLineages } = useLineages();
  const [targetType, setTargetType] = useState<'new' | 'existing'>('new');
  const [newName, setNewName] = useState('');
  const [existingLineageId, setExistingLineageId] = useState<number | null>(null);
  const [deleteSources, setDeleteSources] = useState(false);

  const availableLineages = (allLineages ?? []).filter((l) => !sourceIds.includes(l.id));

  const isValid = targetType === 'new'
    ? newName.trim().length >= 3
    : existingLineageId !== null;

  const handleContinue = () => {
    const config: MergeTargetConfig = {
      target: targetType === 'new'
        ? { type: 'new', name: newName.trim() }
        : { type: 'existing', lineageId: existingLineageId! },
      deleteSources,
    };
    onChange(config);
    onContinue();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Đích đến</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            value={targetType}
            onValueChange={(v) => setTargetType(v as 'new' | 'existing')}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="new" id="target-new" />
              <Label htmlFor="target-new">Tạo gia phả mới</Label>
            </div>
            {targetType === 'new' && (
              <Input
                placeholder="Nhập tên gia phả mới (tối thiểu 3 ký tự)"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="ml-6"
              />
            )}

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="existing" id="target-existing" />
              <Label htmlFor="target-existing">Merge vào gia phả đã có</Label>
            </div>
            {targetType === 'existing' && (
              <Select
                value={existingLineageId?.toString() ?? ''}
                onValueChange={(v) => setExistingLineageId(Number(v))}
              >
                <SelectTrigger className="ml-6">
                  <SelectValue placeholder="Chọn gia phả..." />
                </SelectTrigger>
                <SelectContent>
                  {availableLineages.map((l) => (
                    <SelectItem key={l.id} value={l.id.toString()}>
                      {l.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Sau khi gộp, xử lý gia phả gốc</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <RadioGroup
            value={deleteSources ? 'delete' : 'keep'}
            onValueChange={(v) => setDeleteSources(v === 'delete')}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="keep" id="source-keep" />
              <Label htmlFor="source-keep">Giữ lại gia phả gốc (chỉ tạo bản sao)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="delete" id="source-delete" />
              <Label htmlFor="source-delete">Xóa gia phả gốc sau khi gộp xong</Label>
            </div>
          </RadioGroup>

          {deleteSources && (
            <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-md text-sm text-destructive">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>Gia phả gốc sẽ bị xóa sau khi gộp. Bản backup tự động sẽ được tạo trước khi xóa.</span>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleContinue} disabled={!isValid}>
          Tiếp theo
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

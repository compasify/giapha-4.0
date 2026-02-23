'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Loader2, CheckCircle2 } from 'lucide-react';
import type { MergeProgress } from '@/hooks/use-merge-lineages';

interface MergeSummary {
  sourceCount: number;
  sourceNames: string[];
  totalPersons: number;
  duplicatesResolved: number;
  uniquePersons: number;
  targetName: string;
  deleteSources: boolean;
}

interface MergeConfirmStepProps {
  summary: MergeSummary;
  progress: MergeProgress;
  onConfirm: () => void;
  isLoading: boolean;
}

const CONFIRM_TEXT = 'Tôi đồng ý';

const PROGRESS_LABELS: Record<MergeProgress, string> = {
  idle: '',
  snapshotting: 'Đang tạo bản backup...',
  merging: 'Đang gộp gia phả...',
  done: 'Hoàn tất!',
};

export function MergeConfirmStep({ summary, progress, onConfirm, isLoading }: MergeConfirmStepProps) {
  const [confirmInput, setConfirmInput] = useState('');
  const requireTextGuard = summary.deleteSources;
  const isConfirmed = !requireTextGuard || confirmInput === CONFIRM_TEXT;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Tóm tắt gộp gia phả</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-y-2">
            <span className="text-muted-foreground">Gia phả gốc:</span>
            <span>{summary.sourceNames.join(', ')}</span>

            <span className="text-muted-foreground">Gia phả đích:</span>
            <span className="font-medium">{summary.targetName}</span>

            <span className="text-muted-foreground">Tổng thành viên:</span>
            <span>{summary.totalPersons}</span>

            <span className="text-muted-foreground">Trùng được gộp:</span>
            <span>{summary.duplicatesResolved}</span>

            <span className="text-muted-foreground">Thành viên sau gộp:</span>
            <span className="font-medium">{summary.uniquePersons}</span>
          </div>
        </CardContent>
      </Card>

      <Card className={summary.deleteSources ? 'border-destructive' : ''}>
        <CardContent className="py-4 space-y-3">
          {summary.deleteSources ? (
            <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-md text-sm text-destructive">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Gia phả gốc sẽ bị XÓA sau khi gộp.</p>
                <p>Bản backup tự động sẽ được tạo trước khi xóa.</p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2 p-3 bg-muted rounded-md text-sm">
              <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-green-600" />
              <span>Các gia phả gốc sẽ được giữ nguyên. Bản backup tự động sẽ được tạo.</span>
            </div>
          )}

          {requireTextGuard && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Gõ &quot;{CONFIRM_TEXT}&quot; để xác nhận:
              </p>
              <Input
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
                placeholder={CONFIRM_TEXT}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {progress !== 'idle' && (
        <div className="flex items-center gap-2 text-sm">
          {progress === 'done' ? (
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          ) : (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}
          <span>{PROGRESS_LABELS[progress]}</span>
        </div>
      )}

      <div className="flex justify-end">
        <Button
          onClick={onConfirm}
          disabled={!isConfirmed || isLoading}
          variant={summary.deleteSources ? 'destructive' : 'default'}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            'Xác nhận gộp'
          )}
        </Button>
      </div>
    </div>
  );
}

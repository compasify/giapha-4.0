'use client';

import { useState } from 'react';
import { FileText, FileImage, Link2, Loader2, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { exportSubtreePdf } from '@/lib/export/export-pdf';
import { exportPng } from '@/lib/export/export-png-svg';
import { copyToClipboard } from '@/lib/export/share-utils';
import type { FamilyChartInstance } from './family-tree';

interface ShareBranchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedIds: Set<string>;
  lineageId: number;
  lineageName: string;
  chart: FamilyChartInstance | null;
  chartContainer: HTMLElement | null;
}

type ExportOption = 'pdf' | 'png' | 'link';

interface OptionConfig {
  value: ExportOption;
  label: string;
  icon: typeof FileImage;
  description: string;
}

const EXPORT_OPTIONS: OptionConfig[] = [
  {
    value: 'pdf',
    label: 'Xuất PDF nhánh',
    icon: FileText,
    description: 'In ấn dạng PDF',
  },
  {
    value: 'png',
    label: 'Xuất PNG nhánh',
    icon: FileImage,
    description: 'Hình ảnh nén',
  },
  {
    value: 'link',
    label: 'Copy link',
    icon: Link2,
    description: 'Liên kết chia sẻ',
  },
];

export function ShareBranchDialog({
  open,
  onOpenChange,
  selectedIds,
  lineageId,
  lineageName,
  chart: _chart,
  chartContainer,
}: ShareBranchDialogProps) {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const rootPersonId = selectedIds.size > 0 ? [...selectedIds][0] : null;

  async function handleExportPdf() {
    if (!chartContainer || selectedIds.size === 0) return;
    setLoading(true);
    try {
      const filename = `nhanh-${lineageName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '')}`;
      await exportSubtreePdf(chartContainer, {
        title: `${lineageName} - Nhánh`,
        filename,
      });
      onOpenChange(false);
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleExportPng() {
    if (!chartContainer || selectedIds.size === 0) return;

    setLoading(true);
    try {
      await exportPng(chartContainer, {
        filename: 'nhanh-gia-pha',
      });
      onOpenChange(false);
    } catch (err) {
      console.error('PNG export failed:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCopyLink() {
    if (!rootPersonId) return;

    const shareUrl = `${window.location.origin}/lineage/${lineageId}?focus=${rootPersonId}`;

    const ok = await copyToClipboard(shareUrl);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function handleOption(option: ExportOption) {
    switch (option) {
      case 'pdf':
        await handleExportPdf();
        break;
      case 'png':
        await handleExportPng();
        break;
      case 'link':
        await handleCopyLink();
        break;
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Chia sẻ nhánh gia phả</DialogTitle>
          <DialogDescription>Chọn cách xuất nhánh đã chọn</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-3 gap-2">
            {EXPORT_OPTIONS.map((option) => {
              const Icon = option.icon;
              const isLink = option.value === 'link';
              const isLoading = loading && option.value !== 'link';
              const showCopyFeedback = copied && isLink;

              return (
                <Button
                  key={option.value}
                  variant="outline"
                  size="sm"
                  className="flex flex-col gap-1 h-auto py-3"
                  onClick={() => handleOption(option.value)}
                  disabled={
                    loading ||
                    selectedIds.size === 0 ||
                    (option.value === 'pdf' && !chartContainer) ||
                    (option.value === 'png' && !chartContainer) ||
                    (option.value === 'link' && !rootPersonId)
                  }
                >
                  {isLoading && option.value !== 'link' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : showCopyFeedback ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                  <span className="text-xs text-center">{option.label}</span>
                </Button>
              );
            })}
          </div>

          {copied && (
            <p className="text-xs text-center text-green-600 dark:text-green-400">
              Đã sao chép!
            </p>
          )}

          {selectedIds.size === 0 && (
            <p className="text-xs text-center text-muted-foreground">
              Vui lòng chọn các thành viên để chia sẻ
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

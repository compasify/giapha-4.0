'use client';

import { useState } from 'react';
import { Download, FileImage, FileText, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { exportPng, exportSvg } from '@/lib/export/export-png-svg';
import { exportPdf, PAPER_SIZES, type PaperSize, type Orientation } from '@/lib/export/export-pdf';
import type { FamilyChartInstance } from './family-tree';

type ExportFormat = 'png' | 'svg' | 'pdf';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chart: FamilyChartInstance | null;
  lineageName?: string;
}

const FORMAT_OPTIONS: { value: ExportFormat; label: string; icon: typeof FileImage }[] = [
  { value: 'png', label: 'PNG (Ảnh)', icon: FileImage },
  { value: 'svg', label: 'SVG (Vector)', icon: FileImage },
  { value: 'pdf', label: 'PDF (In ấn)', icon: FileText },
];

const PAPER_SIZE_OPTIONS = Object.keys(PAPER_SIZES) as PaperSize[];

export function ExportDialog({ open, onOpenChange, chart, lineageName }: ExportDialogProps) {
  const [format, setFormat] = useState<ExportFormat>('png');
  const [paperSize, setPaperSize] = useState<PaperSize>('A4');
  const [orientation, setOrientation] = useState<Orientation>('landscape');
  const [exporting, setExporting] = useState(false);

  const filename = lineageName
    ? lineageName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '')
    : 'gia-pha';

  async function handleExport() {
    if (!chart?.svg || !chart?.cont) return;

    setExporting(true);
    try {
      switch (format) {
        case 'png':
          await exportPng(chart.cont, { filename, pixelRatio: 2 });
          break;
        case 'svg':
          await exportSvg(chart.cont, { filename });
          break;
        case 'pdf':
          await exportPdf(chart.cont, {
            paperSize,
            orientation,
            title: lineageName || 'Gia Phả',
            filename,
          });
          break;
      }
      onOpenChange(false);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Xuất gia phả</DialogTitle>
          <DialogDescription>Chọn định dạng và cài đặt xuất file</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Định dạng</Label>
            <div className="grid grid-cols-3 gap-2">
              {FORMAT_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                return (
                  <Button
                    key={opt.value}
                    variant={format === opt.value ? 'default' : 'outline'}
                    size="sm"
                    className="flex flex-col gap-1 h-auto py-3"
                    onClick={() => setFormat(opt.value)}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs">{opt.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {format === 'pdf' && (
            <>
              <div className="space-y-2">
                <Label>Khổ giấy</Label>
                <Select value={paperSize} onValueChange={(v) => setPaperSize(v as PaperSize)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAPER_SIZE_OPTIONS.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size} ({PAPER_SIZES[size][0]}×{PAPER_SIZES[size][1]}mm)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Hướng giấy</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={orientation === 'landscape' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setOrientation('landscape')}
                  >
                    Ngang
                  </Button>
                  <Button
                    variant={orientation === 'portrait' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setOrientation('portrait')}
                  >
                    Dọc
                  </Button>
                </div>
              </div>
            </>
          )}

          {format === 'png' && (
            <p className="text-xs text-muted-foreground">
              Xuất ảnh PNG chất lượng cao (2x retina), nền trắng.
            </p>
          )}

          {format === 'svg' && (
            <p className="text-xs text-muted-foreground">
              Xuất vector SVG — sắc nét ở mọi kích thước, có thể chỉnh sửa trong Figma/Illustrator.
            </p>
          )}
        </div>

        <Button onClick={handleExport} disabled={exporting || !chart?.svg || !chart?.cont} className="w-full">
          {exporting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Đang xuất...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Xuất {FORMAT_OPTIONS.find((o) => o.value === format)?.label}
            </>
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

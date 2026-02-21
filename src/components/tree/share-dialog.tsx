'use client';

import { useState, useMemo } from 'react';
import { Copy, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { generateQrSvg, copyToClipboard } from '@/lib/export/share-utils';

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lineageId: number;
  lineageName?: string;
  accessCodeRequired?: boolean;
}

export function ShareDialog({ open, onOpenChange, lineageId, lineageName, accessCodeRequired }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/lineage/${lineageId}`
    : '';

  const qrSvg = useMemo(() => {
    if (!shareUrl) return '';
    return generateQrSvg(shareUrl);
  }, [shareUrl]);

  async function handleCopy() {
    const ok = await copyToClipboard(shareUrl);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Chia sẻ gia phả</DialogTitle>
          <DialogDescription>
            {lineageName ? `Chia sẻ "${lineageName}" với người thân` : 'Gửi link cho người thân để xem cây gia phả'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Link chia sẻ</Label>
            <div className="flex gap-2">
              <Input value={shareUrl} readOnly className="text-sm" />
              <Button variant="outline" size="icon" onClick={handleCopy} title="Sao chép">
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {accessCodeRequired && (
            <div className="rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3">
              <p className="text-xs text-amber-800 dark:text-amber-200">
                🔒 Gia phả này yêu cầu <strong>mã bảo mật</strong> để xem. Hãy gửi kèm mã cho người nhận (quản lý mã trong Cài đặt).
              </p>
            </div>
          )}

          {qrSvg && (
            <div className="space-y-2">
              <Label>Mã QR</Label>
              <div className="flex justify-center p-4 bg-white rounded-lg border">
                <div dangerouslySetInnerHTML={{ __html: qrSvg }} />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Quét mã QR bằng điện thoại để mở nhanh
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

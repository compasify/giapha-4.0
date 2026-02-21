'use client';

import { useState, useRef, useEffect } from 'react';
import { Lock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AccessCodeDialogProps {
  lineageId: number;
  open: boolean;
  onVerified: () => void;
}

const CODE_LENGTH = 6;
const STORAGE_PREFIX = 'lineage_access_';

export function hasStoredAccess(lineageId: number): boolean {
  if (typeof window === 'undefined') return false;
  const stored = sessionStorage.getItem(`${STORAGE_PREFIX}${lineageId}`);
  if (!stored) return false;
  const expiry = parseInt(stored, 10);
  if (Date.now() > expiry) {
    sessionStorage.removeItem(`${STORAGE_PREFIX}${lineageId}`);
    return false;
  }
  return true;
}

function storeAccess(lineageId: number) {
  const ttl = 24 * 60 * 60 * 1000;
  sessionStorage.setItem(`${STORAGE_PREFIX}${lineageId}`, String(Date.now() + ttl));
}

export function AccessCodeDialog({ lineageId, open, onVerified }: AccessCodeDialogProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setCode('');
      setError(null);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  async function handleVerify() {
    if (code.length !== CODE_LENGTH) {
      setError(`Vui lòng nhập đủ ${CODE_LENGTH} ký tự`);
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const res = await fetch(`/api/proxy/lineages/${lineageId}/verify_access_code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_code: code }),
      });

      if (res.ok) {
        storeAccess(lineageId);
        onVerified();
      } else {
        const body = await res.json().catch(() => ({}));
        setError(body?.message || 'Mã không đúng. Vui lòng thử lại.');
      }
    } catch {
      setError('Không thể kết nối. Vui lòng thử lại.');
    } finally {
      setIsVerifying(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleVerify();
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-sm" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="size-4" />
            Nhập mã bảo mật
          </DialogTitle>
          <DialogDescription>
            Gia phả này yêu cầu mã bảo mật để xem. Hãy nhập mã {CODE_LENGTH} ký tự được chia sẻ cho bạn.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <Input
            ref={inputRef}
            value={code}
            onChange={(e) => setCode(e.target.value.slice(0, CODE_LENGTH))}
            onKeyDown={handleKeyDown}
            placeholder={`Nhập ${CODE_LENGTH} ký tự`}
            maxLength={CODE_LENGTH}
            className="text-center text-lg tracking-[0.3em] font-mono"
            autoComplete="off"
          />
          {error && <p className="text-xs text-destructive text-center">{error}</p>}
          <Button
            className="w-full"
            onClick={handleVerify}
            disabled={isVerifying || code.length !== CODE_LENGTH}
          >
            {isVerifying ? 'Đang xác minh...' : 'Xác nhận'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

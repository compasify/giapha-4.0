'use client';

import { useState } from 'react';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PrivacySettingsSectionProps {
  lineageId: number;
  currentLevel: number;
  onUpdate: (level: number) => Promise<void>;
}

const CODE_LENGTH = 6;

export function PrivacySettingsSection({ lineageId, currentLevel, onUpdate }: PrivacySettingsSectionProps) {
  const [level, setLevel] = useState(String(currentLevel));
  const [accessCode, setAccessCode] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSaveLevel(newLevel: string) {
    setLevel(newLevel);
    const numLevel = parseInt(newLevel, 10);

    if (numLevel !== 2) {
      setIsSaving(true);
      setError(null);
      setSuccess(null);
      try {
        await onUpdate(numLevel);
        setSuccess('Đã cập nhật chế độ riêng tư');
        setTimeout(() => setSuccess(null), 3000);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Lỗi cập nhật');
      } finally {
        setIsSaving(false);
      }
    }
  }

  async function handleSaveCode() {
    if (accessCode.length !== CODE_LENGTH) {
      setError(`Mã phải có đúng ${CODE_LENGTH} ký tự`);
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/proxy/lineages/${lineageId}/set_access_code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_code: accessCode }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message || 'Lỗi cập nhật mã');
      }

      setSuccess('Đã cập nhật mã bảo mật');
      setAccessCode('');
      setTimeout(() => setSuccess(null), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lỗi cập nhật');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="space-y-4 border rounded-lg p-6">
      <div className="flex items-center gap-2">
        <Shield className="size-5 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Chế độ riêng tư</h2>
      </div>

      <div className="space-y-2">
        <Label className="text-sm">Ai có thể xem gia phả?</Label>
        <Select value={level} onValueChange={handleSaveLevel} disabled={isSaving}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Công khai — Ai cũng xem được</SelectItem>
            <SelectItem value="1">Thành viên — Chỉ thành viên gia phả</SelectItem>
            <SelectItem value="2">Mã bảo mật — Cần nhập mã để xem</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {level === '2' && (
        <div className="space-y-2 pl-1 border-l-2 border-primary/20 ml-1">
          <Label className="text-sm">Đặt mã bảo mật ({CODE_LENGTH} ký tự)</Label>
          <div className="flex gap-2">
            <Input
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value.slice(0, CODE_LENGTH))}
              placeholder={`Nhập ${CODE_LENGTH} ký tự`}
              maxLength={CODE_LENGTH}
              className="font-mono tracking-wider"
              autoComplete="off"
            />
            <Button
              onClick={handleSaveCode}
              disabled={isSaving || accessCode.length !== CODE_LENGTH}
              size="sm"
            >
              {isSaving ? 'Đang lưu...' : 'Lưu mã'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Chia sẻ mã này cho những người bạn muốn cho xem gia phả.
          </p>
        </div>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
      {success && <p className="text-xs text-green-600">{success}</p>}
    </section>
  );
}

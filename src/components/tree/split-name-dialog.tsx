'use client'

import { useState, useEffect } from 'react'
import { Copy, Scissors, Loader2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export type SplitMode = 'copy' | 'move'

interface SplitNameDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sourceLineageName: string
  suggestedName: string
  isPending: boolean
  onConfirm: (name: string, mode: SplitMode, createSnapshot: boolean) => void
}

export function SplitNameDialog({
  open,
  onOpenChange,
  sourceLineageName,
  suggestedName,
  isPending,
  onConfirm,
}: SplitNameDialogProps) {
  const [name, setName] = useState(suggestedName)
  const [mode, setMode] = useState<SplitMode>('copy')
  const [createSnapshot, setCreateSnapshot] = useState(true)

  useEffect(() => {
    if (open) {
      setName(suggestedName)
      setMode('copy')
      setCreateSnapshot(true)
    }
  }, [open, suggestedName])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (name.trim().length >= 3) {
      onConfirm(name.trim(), mode, createSnapshot)
    }
  }

  const isNameValid = name.trim().length >= 3

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tách nhánh</DialogTitle>
          <DialogDescription>
            Chọn cách tách và đặt tên cho gia phả mới
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">

          <RadioGroup
            value={mode}
            onValueChange={(v) => setMode(v as SplitMode)}
            className="space-y-3"
            disabled={isPending}
          >
            <label
              htmlFor="mode-copy"
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                mode === 'copy'
                  ? 'border-primary bg-primary/5'
                  : 'border-muted hover:bg-muted/50'
              }`}
            >
              <RadioGroupItem value="copy" id="mode-copy" className="mt-0.5" />
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <Copy className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-sm">Sao chép nhánh</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Tạo bản sao nhánh thành gia phả mới. Gia phả gốc giữ nguyên, không bị thay đổi.
                </p>
              </div>
            </label>

            <label
              htmlFor="mode-move"
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                mode === 'move'
                  ? 'border-primary bg-primary/5'
                  : 'border-muted hover:bg-muted/50'
              }`}
            >
              <RadioGroupItem value="move" id="mode-move" className="mt-0.5" />
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <Scissors className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-sm">Tách nhánh (di chuyển)</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Di chuyển nhánh sang gia phả mới. Nhánh sẽ bị xóa khỏi gia phả gốc.
                </p>
              </div>
            </label>
          </RadioGroup>


          {mode === 'move' && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-800 dark:text-amber-200">
                Nhánh đã chọn sẽ bị xóa khỏi gia phả <strong>{sourceLineageName}</strong>.
                Hành động này không thể hoàn tác nếu không có backup.
              </p>
            </div>
          )}


          <div className="space-y-2">
            <Label htmlFor="lineage-name">Tên gia phả mới</Label>
            <Input
              id="lineage-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên gia phả mới"
              required
              minLength={3}
              disabled={isPending}
              className="w-full"
            />
            {name.trim().length > 0 && name.trim().length < 3 && (
              <p className="text-xs text-red-500">Tên phải có ít nhất 3 ký tự</p>
            )}
          </div>


          {mode === 'move' && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="auto-backup"
                  checked={createSnapshot}
                  onCheckedChange={(checked) =>
                    setCreateSnapshot(checked === true)
                  }
                  disabled={isPending}
                />
                <Label htmlFor="auto-backup" className="cursor-pointer font-medium">
                  Tự động backup gia phả gốc
                </Label>
              </div>
              <p className="text-xs text-muted-foreground ml-6">
                Lưu bản sao toàn bộ gia phả gốc trước khi tách
              </p>
            </div>
          )}

          <DialogFooter className="flex gap-2 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={!isNameValid || isPending}
              className="gap-2"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === 'copy' ? 'Sao chép nhánh' : 'Xác nhận tách'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

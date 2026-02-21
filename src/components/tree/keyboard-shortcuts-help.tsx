'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface KeyboardShortcutsHelpProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SHORTCUTS = [
  { keys: ['↑'], desc: 'Chuyển đến cha/mẹ' },
  { keys: ['↓'], desc: 'Chuyển đến con' },
  { keys: ['←', '→'], desc: 'Chuyển giữa anh chị em' },
  { keys: ['Enter'], desc: 'Mở panel chỉnh sửa' },
  { keys: ['Escape'], desc: 'Đóng panel / thoát focus' },
  { keys: ['Ctrl', 'F'], desc: 'Tìm thành viên' },
  { keys: ['F'], desc: 'Vừa khung hình' },
  { keys: ['+'], desc: 'Phóng to' },
  { keys: ['−'], desc: 'Thu nhỏ' },
  { keys: ['Ctrl', 'Z'], desc: 'Hoàn tác' },
  { keys: ['Ctrl', 'Shift', 'Z'], desc: 'Làm lại' },
  { keys: ['?'], desc: 'Hiện/ẩn phím tắt' },
  { keys: ['Shift', 'Click'], desc: 'Xem xưng hô giữa 2 người' },
] as const;

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded border bg-muted px-1 text-[10px] font-mono text-muted-foreground">
      {children}
    </kbd>
  );
}

export function KeyboardShortcutsHelp({ open, onOpenChange }: KeyboardShortcutsHelpProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-sm">Phím tắt</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {SHORTCUTS.map((s) => (
            <div key={s.desc} className="flex items-center justify-between gap-4">
              <span className="text-xs text-muted-foreground">{s.desc}</span>
              <div className="flex items-center gap-0.5">
                {s.keys.map((k, i) => (
                  <span key={k} className="flex items-center gap-0.5">
                    {i > 0 && <span className="text-[10px] text-muted-foreground">+</span>}
                    <Kbd>{k}</Kbd>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

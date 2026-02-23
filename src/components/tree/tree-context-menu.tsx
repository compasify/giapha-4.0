'use client';

import { useEffect, useRef } from 'react';
import {
  UserPlus,
  Heart,
  Users,
  Pencil,
  Trash2,
  FoldVertical,
  UnfoldVertical,
  Focus,
  GitBranch,
  Scissors,
} from 'lucide-react';

export type ContextMenuAction =
  | { type: 'add-child' }
  | { type: 'add-spouse' }
  | { type: 'add-parent' }
  | { type: 'edit' }
  | { type: 'delete' }
  | { type: 'toggle-collapse' }
  | { type: 'focus' }
  | { type: 'view-kinship' }
  | { type: 'split-from-here' };

interface TreeContextMenuProps {
  personName: string;
  position: { x: number; y: number };
  isCollapsed: boolean;
  hasChildren: boolean;
  isRoot: boolean;
  onClose: () => void;
  onAction: (action: ContextMenuAction) => void;
}

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  action: ContextMenuAction;
  show?: boolean;
  destructive?: boolean;
}

const ICON_SIZE = 14;

export function TreeContextMenu({
  personName,
  position,
  isCollapsed,
  hasChildren,
  isRoot,
  onClose,
  onAction,
}: TreeContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  useEffect(() => {
    const el = menuRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
      el.style.left = `${position.x - rect.width}px`;
    }
    if (rect.bottom > window.innerHeight) {
      el.style.top = `${position.y - rect.height}px`;
    }
  }, [position]);

  const items: MenuItem[] = [
    { label: 'Thêm con', icon: <UserPlus size={ICON_SIZE} />, action: { type: 'add-child' } },
    { label: 'Thêm vợ/chồng', icon: <Heart size={ICON_SIZE} />, action: { type: 'add-spouse' } },
    { label: 'Thêm cha/mẹ', icon: <Users size={ICON_SIZE} />, action: { type: 'add-parent' }, show: isRoot },
    { label: 'Sửa thông tin', icon: <Pencil size={ICON_SIZE} />, action: { type: 'edit' } },
    { label: 'Xóa', icon: <Trash2 size={ICON_SIZE} />, action: { type: 'delete' }, destructive: true },
  ];

  const collapseItems: MenuItem[] = [
    {
      label: isCollapsed ? 'Mở rộng nhánh' : 'Thu gọn nhánh',
      icon: isCollapsed ? <UnfoldVertical size={ICON_SIZE} /> : <FoldVertical size={ICON_SIZE} />,
      action: { type: 'toggle-collapse' },
      show: hasChildren || isCollapsed,
    },
    { label: 'Tập trung', icon: <Focus size={ICON_SIZE} />, action: { type: 'focus' } },
    { label: 'Xem xưng hô', icon: <GitBranch size={ICON_SIZE} />, action: { type: 'view-kinship' } },
    { label: 'Tách nhánh từ đây', icon: <Scissors size={ICON_SIZE} />, action: { type: 'split-from-here' } },
  ];

  const visibleItems = items.filter((item) => item.show !== false);
  const visibleCollapseItems = collapseItems.filter((item) => item.show !== false);

  return (
    <div
      ref={menuRef}
      className="fixed z-50 min-w-[180px] rounded-lg border bg-popover p-1 shadow-lg animate-in fade-in-0 zoom-in-95"
      style={{ left: position.x, top: position.y }}
      role="menu"
      aria-label={`Menu cho ${personName}`}
    >
      <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground truncate max-w-[200px]">
        {personName}
      </div>
      <div className="h-px bg-border my-1" role="separator" />
      {visibleItems.map((item) => (
        <button
          key={item.action.type}
          className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors ${
            item.destructive ? 'text-destructive hover:text-destructive' : ''
          }`}
          role="menuitem"
          onClick={() => {
            onAction(item.action);
            onClose();
          }}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
      {visibleCollapseItems.length > 0 && (
        <>
          <div className="h-px bg-border my-1" role="separator" />
          {visibleCollapseItems.map((item) => (
            <button
              key={item.action.type}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
              role="menuitem"
              onClick={() => {
                onAction(item.action);
                onClose();
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </>
      )}
    </div>
  );
}

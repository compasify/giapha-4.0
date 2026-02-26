'use client';

import { usePathname } from 'next/navigation';
import { useLineage } from '@/hooks/use-lineages';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { logoutAction } from '@/app/actions/auth-actions';
import { useAuthStore } from '@/stores/auth-store';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Bảng điều khiển',
  '/lineage': 'Gia Phả',
  '/person': 'Thành Viên',
  '/settings': 'Cài Đặt',
};

export function AppHeader() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  // Extract lineage ID from /lineage/[id] paths
  const lineageIdMatch = pathname.match(/^\/lineage\/(\d+)/);
  const lineageId = lineageIdMatch ? Number(lineageIdMatch[1]) : 0;
  const { data: lineage } = useLineage(lineageId);
  const pageTitle =
    (lineageId > 0 && lineage?.name) ? lineage.name :
    PAGE_TITLES[pathname] ??
    Object.entries(PAGE_TITLES).find(([key]) => pathname.startsWith(key))?.[1] ??
    'Gia Phả 365';

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-4" />
      <h1 className="flex-1 text-sm font-semibold">{pageTitle}</h1>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>
            <p className="font-medium">{user?.name ?? 'Người dùng'}</p>
            <p className="text-xs font-normal text-muted-foreground">{user?.email ?? ''}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <form action={logoutAction} className="w-full">
              <button type="submit" className="w-full text-left text-destructive">
                Đăng xuất
              </button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}


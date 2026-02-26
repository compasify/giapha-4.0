'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TreePine, LayoutDashboard, LogOut, User, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/stores/auth-store';
import { logoutAction } from '@/app/actions/auth-actions';

export function LandingNav() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).slice(-2).join('').toUpperCase()
    : '?';

  async function handleLogout() {
    await logoutAction();
    router.push('/');
  }

  return (
    <nav className="flex items-center gap-2">
      <a
        href="https://github.com/compasify/giapha-4.0"
        target="_blank"
        rel="noopener noreferrer"
        className="hidden sm:inline-flex items-center text-muted-foreground hover:text-vn-red transition-colors px-2 py-2"
        aria-label="GitHub"
      >
        <Github className="h-5 w-5" />
      </a>

      <Link
        href="#features"
        className="hidden sm:inline-flex text-sm text-muted-foreground hover:text-vn-red transition-colors px-3 py-2"
      >
        Tính năng
      </Link>

      {isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar ?? undefined} alt={user?.name} />
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard" className="cursor-pointer">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Tài khoản
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive cursor-pointer"
              onSelect={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-vn-red-dark hover:text-vn-red hover:bg-vn-red/5">Đăng nhập</Button>
          </Link>
          <Link href="/register">
            <Button size="sm" className="bg-vn-red text-white hover:bg-vn-red-dark">Đăng ký</Button>
          </Link>
        </>
      )}
    </nav>
  );
}

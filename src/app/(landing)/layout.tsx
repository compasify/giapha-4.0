import Link from 'next/link';
import { TreePine } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <TreePine className="h-5 w-5 text-primary" />
            <span>Gia Phả Online</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link href="#features" className="hidden sm:inline-flex text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2">
              Tính năng
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="sm">Đăng nhập</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Đăng ký</Button>
            </Link>
          </nav>
        </div>
      </header>
      <div className="flex-1">{children}</div>
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TreePine className="h-4 w-4" />
              <span>© 2026 Gia Phả Online</span>
            </div>
            <nav className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/about" className="hover:text-foreground transition-colors">Giới thiệu</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Điều khoản</Link>
              <Link href="/privacy" className="hover:text-foreground transition-colors">Bảo mật</Link>
              <Link href="/contact" className="hover:text-foreground transition-colors">Liên hệ</Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}

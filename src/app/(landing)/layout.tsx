import Link from 'next/link';
import { Github } from 'lucide-react';
import { LandingNav } from '@/components/landing/landing-nav';
import { AuthHydrator } from '@/providers/auth-hydrator';
import { getCurrentUser } from '@/app/actions/auth-actions';
import { AppLogo } from '@/components/ui/app-logo';

export default async function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  return (
    <div className="min-h-screen flex flex-col">
      <AuthHydrator user={user} />
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <AppLogo size={40} />
            <span className="text-vn-red-dark">Gia Phả 365</span>
          </Link>
          <LandingNav />
        </div>
      </header>
      <div className="flex-1">{children}</div>
      <footer className="border-t bg-vn-cream/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <AppLogo size={16} />
              <span>© 2026 Gia Phả 365</span>
              <span className="text-gray-300">·</span>
              <a
                href="https://github.com/compasify/giapha-4.0"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-vn-red transition-colors"
              >
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </a>
            </div>
            <nav className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/about" className="hover:text-vn-red transition-colors">Giới thiệu</Link>
              <Link href="/terms" className="hover:text-vn-red transition-colors">Điều khoản</Link>
              <Link href="/privacy" className="hover:text-vn-red transition-colors">Bảo mật</Link>
              <Link href="/contact" className="hover:text-vn-red transition-colors">Liên hệ</Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}

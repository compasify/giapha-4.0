import Link from 'next/link';
import { TreePine, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="container mx-auto px-4 py-24 sm:py-32 lg:py-40">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm text-muted-foreground shadow-sm">
            <TreePine className="h-4 w-4 text-primary" />
            <span>Nền tảng gia phả trực tuyến đầu tiên cho người Việt</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Gìn giữ{' '}
            <span className="text-primary">gia phả dòng họ</span>
            {' '}cho muôn đời sau
          </h1>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl leading-relaxed">
            Xây dựng cây gia phả tương tác, quản lý sự kiện gia đình với lịch âm dương,
            chia sẻ dễ dàng qua QR code — tất cả miễn phí.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/register">
              <Button size="lg" className="gap-2 text-base px-8">
                Đăng ký miễn phí
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="text-base px-8">
                Khám phá tính năng
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 right-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
    </section>
  );
}

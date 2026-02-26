import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HeroIllustration } from './hero-illustration';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-vn-cream via-white to-white">
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-vn-red opacity-5 blur-3xl" />
      <div className="pointer-events-none absolute -top-16 right-0 h-72 w-72 rounded-full bg-vn-gold opacity-8 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-vn-red opacity-5 blur-3xl" />

      <div className="container mx-auto px-4 py-20 sm:py-28 lg:py-32">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-16">
          <div className="flex-1 text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-vn-red/20 bg-white/80 px-4 py-1.5 text-sm text-vn-red shadow-sm backdrop-blur-sm">
              <span className="text-base" role="img" aria-label="đèn lồng">🏮</span>
              <span className="font-medium">Nền tảng gia phả trực tuyến mã nguồn mở chất lượng cao cho người Việt</span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Gìn giữ{' '}
              <span className="text-vn-red">gia phả dòng họ</span>
              {' '}cho muôn đời sau
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-gray-600 sm:text-xl">
              Xây dựng cây gia phả tương tác, quản lý sự kiện gia đình với lịch âm dương,
              chia sẻ dễ dàng qua QR code — tất cả miễn phí.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Link href="/register">
                <Button
                  size="lg"
                  className="gap-2 bg-vn-red px-8 text-base text-white hover:bg-vn-red-dark"
                >
                  Đăng ký miễn phí
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-vn-red/30 px-8 text-base text-vn-red hover:bg-vn-red/5 hover:border-vn-red/50"
                >
                  Khám phá tính năng
                </Button>
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 lg:justify-start">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="h-1.5 w-1.5 rounded-full bg-vn-green" />
                Miễn phí mãi mãi
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="h-1.5 w-1.5 rounded-full bg-vn-green" />
                Sử dụng ở bất kỳ đâu, bất kỳ thiết bị nào
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="h-1.5 w-1.5 rounded-full bg-vn-green" />
                Hỗ trợ âm lịch Việt Nam
              </div>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center w-full max-w-lg lg:max-w-none">
            <div className="relative w-full">
              <div className="absolute inset-0 -m-4 rounded-3xl bg-gradient-to-br from-vn-red/8 to-vn-gold/8 blur-xl" />
              <HeroIllustration className="relative w-full drop-shadow-sm" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

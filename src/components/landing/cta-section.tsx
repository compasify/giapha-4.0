import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CtaSection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28 bg-gradient-to-br from-vn-cream via-white to-vn-gold-light/30">
      <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-vn-red opacity-5 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 -left-16 h-64 w-64 rounded-full bg-vn-gold opacity-8 blur-3xl" />

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Bắt đầu gìn giữ{' '}
            <span className="text-vn-red">gia phả</span>
            {' '}ngay hôm nay
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-gray-600">
            Miễn phí, không giới hạn số lượng thành viên. Hãy để thế hệ sau biết đến nguồn cội của mình.
          </p>
          <div className="mt-10">
            <Link href="/register">
              <Button
                size="lg"
                className="gap-2 bg-vn-red px-8 text-base text-white hover:bg-vn-red-dark"
              >
                Tạo gia phả miễn phí
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-gray-400">
            Miễn phí mãi mãi · Không cần tải app · Hỗ trợ âm lịch
          </p>
        </div>
      </div>
    </section>
  );
}

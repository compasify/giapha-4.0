import Link from 'next/link';
import { ArrowRight, Github, MessageSquareHeart } from 'lucide-react';
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
            Miễn phí mãi mãi · Sử dụng ở bất kỳ đâu, bất kỳ thiết bị nào · Hỗ trợ âm lịch
          </p>

          {/* Community contribution CTA */}
          <div className="mt-14 rounded-2xl border border-vn-gold/20 bg-white/60 p-8 backdrop-blur-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-vn-gold/10">
              <MessageSquareHeart className="h-6 w-6 text-vn-gold-dark" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-gray-900">
              Hãy đóng góp ý tưởng của bạn — chúng tôi sẽ biến nó thành hiện thực
            </h3>
            <p className="mt-3 text-base leading-relaxed text-gray-600">
              Gia Phả 365 là dự án mã nguồn mở, được xây dựng bởi cộng đồng.
              Góp ý tính năng, báo lỗi, thảo luận ý tưởng hay đóng góp code — mọi đóng góp đều quý giá.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a
                href="https://github.com/compasify/giapha-4.0/issues"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  className="gap-2 border-vn-gold-dark/30 text-vn-gold-dark hover:bg-vn-gold/10 hover:border-vn-gold-dark/50"
                >
                  <MessageSquareHeart className="h-4 w-4" />
                  Góp ý & Thảo luận
                </Button>
              </a>
              <a
                href="https://github.com/compasify/giapha-4.0"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Github className="h-4 w-4" />
                  Xem mã nguồn trên GitHub
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

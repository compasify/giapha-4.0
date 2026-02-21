import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CtaSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Bắt đầu gìn giữ gia phả ngay hôm nay
          </h2>
          <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
            Miễn phí, không giới hạn số lượng thành viên. Hãy để thế hệ sau biết đến nguồn cội của mình.
          </p>
          <div className="mt-8">
            <Link href="/register">
              <Button size="lg" className="gap-2 text-base px-8">
                Tạo gia phả ngay
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

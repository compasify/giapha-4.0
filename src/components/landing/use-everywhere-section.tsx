import Link from 'next/link';
import { Globe, Monitor, Download, Smartphone, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GITHUB_REPO = 'https://github.com/compasify/giapha-4.0';
const RELEASES_URL = `${GITHUB_REPO}/releases`;

interface PlatformCard {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  external?: boolean;
  badge?: string;
}

const PLATFORMS: PlatformCard[] = [
  {
    icon: Globe,
    iconBg: 'bg-vn-red/10',
    iconColor: 'text-vn-red',
    title: 'Sử dụng trực tuyến',
    description:
      'Truy cập ngay trên trình duyệt — không cần cài đặt. Đăng ký miễn phí, bắt đầu xây dựng gia phả trong vài giây.',
    cta: 'Dùng ngay',
    href: '/register',
  },
  {
    icon: Monitor,
    iconBg: 'bg-vn-green/10',
    iconColor: 'text-vn-green',
    title: 'Tự triển khai (Self-host)',
    description:
      'Tải mã nguồn mở về cài trên server riêng hoặc máy cá nhân. Toàn quyền kiểm soát dữ liệu, tuỳ biến theo ý muốn.',
    cta: 'Xem mã nguồn',
    href: GITHUB_REPO,
    external: true,
  },
  {
    icon: Download,
    iconBg: 'bg-vn-gold/10',
    iconColor: 'text-vn-gold-dark',
    title: 'App Desktop (Offline)',
    description:
      'Tải app cài trên máy tính — hoạt động hoàn toàn offline. Hỗ trợ Windows, macOS và Linux, tự động cập nhật.',
    cta: 'Tải về',
    href: RELEASES_URL,
    external: true,
    badge: 'Win · Mac · Linux',
  },
  {
    icon: Smartphone,
    iconBg: 'bg-gray-100',
    iconColor: 'text-gray-400',
    title: 'Mobile App',
    description:
      'Phiên bản ứng dụng di động cho iOS và Android đang được phát triển với React Native. Sắp ra mắt!',
    cta: 'Sắp ra mắt',
    href: '#',
    badge: 'Coming soon',
  },
];

export function UseEverywhereSection() {
  return (
    <section className="py-20 sm:py-28 bg-gradient-to-b from-white to-vn-cream/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Sử dụng{' '}
            <span className="text-vn-red">mọi nơi</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Dùng trực tuyến, tự triển khai trên server riêng, hoặc tải app về
            máy — bạn chọn cách phù hợp nhất
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          {PLATFORMS.map((platform) => {
            const Icon = platform.icon;
            const isDisabled = platform.href === '#';
            const Wrapper = platform.external
              ? 'a'
              : isDisabled
                ? 'div'
                : Link;
            const wrapperProps = platform.external
              ? {
                  href: platform.href,
                  target: '_blank' as const,
                  rel: 'noopener noreferrer',
                }
              : isDisabled
                ? {}
                : { href: platform.href };

            return (
              <div
                key={platform.title}
                className={`group relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition-all duration-200 ${
                  isDisabled
                    ? 'opacity-75 cursor-default'
                    : 'hover:-translate-y-1 hover:shadow-lg cursor-pointer'
                }`}
              >
                {platform.badge && (
                  <span
                    className={`absolute top-4 right-4 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      isDisabled
                        ? 'bg-gray-100 text-gray-500'
                        : 'bg-vn-gold/15 text-vn-gold-dark'
                    }`}
                  >
                    {platform.badge}
                  </span>
                )}

                <div
                  className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${platform.iconBg} transition-transform duration-200 group-hover:scale-110`}
                >
                  <Icon className={`h-6 w-6 ${platform.iconColor}`} />
                </div>

                <h3 className="text-base font-semibold text-gray-900 leading-snug">
                  {platform.title}
                </h3>
                <p className="mt-2 flex-1 text-sm text-gray-500 leading-relaxed">
                  {platform.description}
                </p>

                <div className="mt-5">
                  {isDisabled ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-1.5 pointer-events-none opacity-60"
                      disabled
                    >
                      {platform.cta}
                    </Button>
                  ) : (
                    <Wrapper {...(wrapperProps as Record<string, unknown>)}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-1.5 border-vn-red/20 text-vn-red hover:bg-vn-red/5 hover:border-vn-red/40"
                      >
                        {platform.cta}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Wrapper>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Open source callout */}
        <div className="mt-12 mx-auto max-w-2xl text-center">
          <p className="text-sm text-gray-500">
            Mã nguồn mở trên{' '}
            <a
              href={GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-vn-red hover:underline"
            >
              GitHub
              <ArrowRight className="h-3 w-3" />
            </a>
            {' '}— đóng góp code, báo lỗi, hoặc đề xuất tính năng mới
          </p>
        </div>
      </div>
    </section>
  );
}

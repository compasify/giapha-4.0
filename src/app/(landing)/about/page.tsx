import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  TreePine,
  CalendarDays,
  Users,
  Globe,
  Heart,
  Shield,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Giới thiệu',
  description:
    'Gia Phả 365 — nền tảng quản lý gia phả trực tuyến đầu tiên dành riêng cho người Việt. Gìn giữ truyền thống dòng họ qua công nghệ hiện đại.',
  keywords: [
    'gia phả online',
    'gia phả trực tuyến',
    'quản lý gia phả',
    'cây gia phả',
    'phả hệ việt nam',
    'dòng họ',
    'xưng hô việt nam',
    'âm lịch',
    'truyền thống gia đình',
    'gia phả số',
    'gia phả 365',
  ],
};

const FEATURES = [
  {
    icon: TreePine,
    iconBg: 'bg-vn-red/10',
    iconColor: 'text-vn-red',
    title: 'Cây gia phả tương tác',
    description:
      'Trực quan hóa dòng họ bằng cây tương tác — zoom, kéo thả, minimap, highlight đường máu mủ theo thế hệ.',
  },
  {
    icon: CalendarDays,
    iconBg: 'bg-vn-gold/10',
    iconColor: 'text-vn-gold-dark',
    title: 'Hỗ trợ âm lịch đầy đủ',
    description:
      'Nhập ngày sinh, ngày mất theo lịch Âm, hỗ trợ tháng nhuận, tự động chuyển đổi và hiển thị song song.',
  },
  {
    icon: Users,
    iconBg: 'bg-vn-green/10',
    iconColor: 'text-vn-green',
    title: 'Xưng hô Việt Nam 3 miền',
    description:
      'Tự động tính xưng hô từ góc nhìn bất kỳ thành viên — ông bà, bác chú cô dì — hỗ trợ Bắc, Trung, Nam.',
  },
  {
    icon: Globe,
    iconBg: 'bg-vn-red/10',
    iconColor: 'text-vn-red',
    title: 'Xuất & chia sẻ dễ dàng',
    description:
      'Xuất PDF, PNG, GEDCOM. Chia sẻ qua link hoặc mã QR — người thân xem được ngay, không cần đăng nhập.',
  },
  {
    icon: Shield,
    iconBg: 'bg-vn-gold/10',
    iconColor: 'text-vn-gold-dark',
    title: 'Bảo mật & riêng tư',
    description:
      'Dữ liệu gia đình thuộc về bạn. Đặt mã PIN, toggle công khai/riêng tư, chỉ người được phép mới xem được.',
  },
  {
    icon: Sparkles,
    iconBg: 'bg-vn-green/10',
    iconColor: 'text-vn-green',
    title: 'Miễn phí mãi mãi',
    description:
      'Không giới hạn số lượng thành viên, không quảng cáo, không thu phí ẩn. Xây dựng vì cộng đồng Việt Nam.',
  },
];

const VALUES = [
  {
    emoji: '🏮',
    title: 'Gìn giữ truyền thống',
    description:
      'Gia phả là di sản văn hóa quý báu. Chúng tôi giúp số hóa và bảo tồn để truyền thống dòng họ không bị mai một theo thời gian.',
  },
  {
    emoji: '🇻🇳',
    title: 'Thiết kế cho người Việt',
    description:
      'Từ hệ thống xưng hô 3 miền, âm lịch, đến 19 loại sự kiện gia đình — mọi tính năng đều được xây dựng riêng cho văn hóa Việt.',
  },
  {
    emoji: '🔒',
    title: 'Dữ liệu thuộc về bạn',
    description:
      'Gia phả là thông tin riêng tư của gia đình. Chúng tôi cam kết không bán dữ liệu, không chia sẻ với bên thứ ba, và hỗ trợ xuất dữ liệu bất cứ lúc nào.',
  },
  {
    emoji: '💡',
    title: 'Công nghệ hiện đại',
    description:
      'Giao diện thân thiện, hoạt động trên mọi thiết bị, không cần tải ứng dụng. Chỉ cần trình duyệt web là đủ.',
  },
];

export default function AboutPage() {
  return (
    <main>
      {/* Hero section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-vn-cream via-white to-white">
        <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-vn-red opacity-5 blur-3xl" />
        <div className="pointer-events-none absolute -top-16 right-0 h-72 w-72 rounded-full bg-vn-gold opacity-8 blur-3xl" />

        <div className="container mx-auto px-4 py-20 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-vn-red/20 bg-white/80 px-4 py-1.5 text-sm text-vn-red shadow-sm backdrop-blur-sm">
              <span className="text-base" role="img" aria-label="đèn lồng">
                🏮
              </span>
              <span className="font-medium">Về Gia Phả 365</span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Gìn giữ{' '}
              <span className="text-vn-red">truyền thống dòng họ</span>
              {' '}bằng công nghệ hiện đại
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-gray-600 sm:text-xl">
              Gia Phả 365 là nền tảng quản lý gia phả trực tuyến đầu tiên được thiết kế
              riêng cho các gia đình Việt Nam. Chúng tôi tin rằng mỗi dòng họ đều có một câu
              chuyện đáng được lưu giữ và truyền lại cho muôn đời sau.
            </p>
          </div>
        </div>
      </section>

      {/* Mission section */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Sứ mệnh của{' '}
              <span className="text-vn-red">chúng tôi</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600 leading-relaxed">
              Trong nhịp sống hiện đại, nhiều gia đình Việt Nam đang dần mất đi sợi dây kết nối
              với cội nguồn. Cuốn gia phả giấy cũ kỹ phai nhạt theo thời gian, những câu chuyện
              về ông bà tổ tiên chỉ còn trong ký ức mờ nhạt. Gia Phả 365 ra đời để thay đổi
              điều đó — biến truyền thống thành di sản số, bền vững qua nhiều thế hệ.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            {VALUES.map((value) => (
              <Card
                key={value.title}
                className="border border-gray-100 bg-white shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
              >
                <CardContent className="pt-6 pb-5">
                  <span className="text-3xl mb-4 block" role="img" aria-label={value.title}>
                    {value.emoji}
                  </span>
                  <h3 className="text-base font-semibold text-gray-900 leading-snug">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features highlight */}
      <section className="py-20 sm:py-28 bg-vn-cream/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Tại sao chọn{' '}
              <span className="text-vn-red">Gia Phả 365?</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Không chỉ là phần mềm — đây là công cụ bảo tồn di sản gia đình
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="group border border-gray-100 bg-white shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
                >
                  <CardContent className="pt-6 pb-5">
                    <div
                      className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.iconBg} transition-all duration-200 group-hover:scale-110`}
                    >
                      <Icon className={`h-6 w-6 ${feature.iconColor}`} />
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 leading-snug">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Vision section */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Heart className="mx-auto mb-6 h-10 w-10 text-vn-red" />
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Tầm nhìn
            </h2>
            <p className="mt-6 text-lg text-gray-600 leading-relaxed">
              Chúng tôi mơ về một ngày mà mỗi gia đình Việt Nam đều có một cuốn gia phả số —
              nơi mọi thành viên, dù ở đâu trên thế giới, đều có thể truy cập, đóng góp và tự
              hào về cội nguồn của mình. Gia Phả 365 không chỉ là công cụ — đó là cầu nối giữa
              quá khứ, hiện tại và tương lai của mỗi dòng họ.
            </p>
            <p className="mt-4 text-lg text-gray-600 leading-relaxed">
              Dự án được xây dựng bởi đội ngũ người Việt, với niềm đam mê công nghệ và tình yêu
              dành cho văn hóa truyền thống. Mọi tính năng đều được thiết kế từ góc nhìn của
              người Việt, cho người Việt.
            </p>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-20 sm:py-28 bg-gradient-to-br from-vn-cream via-white to-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Bắt đầu gìn giữ gia phả ngay hôm nay
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Đăng ký miễn phí chỉ trong 30 giây. Không cần thẻ tín dụng.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/register">
                <Button
                  size="lg"
                  className="gap-2 bg-vn-red px-8 text-base text-white hover:bg-vn-red-dark"
                >
                  Đăng ký miễn phí
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-vn-red/30 px-8 text-base text-vn-red hover:bg-vn-red/5 hover:border-vn-red/50"
                >
                  Liên hệ với chúng tôi
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

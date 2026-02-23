import { TreeIcon, AddressBookIcon, CalendarMoonIcon } from './landing-icons';

interface DeepDiveFeature {
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  badge: string;
  title: string;
  description: string;
  highlights: string[];
}

const DEEP_DIVE_FEATURES: DeepDiveFeature[] = [
  {
    icon: TreeIcon,
    iconBg: 'bg-vn-red/10',
    iconColor: 'text-vn-red',
    badge: 'Cây gia phả',
    title: 'Trực quan hóa dòng họ với cây tương tác',
    description:
      'Khám phá cây gia phả với thu phóng, kéo thả, minimap và highlight đường máu mủ. Chữ độ xem rút gọn, lọc theo thế hệ, drag & drop đổi cấu trúc — tất cả trên một giao diện mượt mà.',
    highlights: [
      'Zoom, pan, minimap điều hướng nhanh',
      'Highlight toàn bộ chuỗi tổ tiên — hậu duệ',
      'Drag & Drop đổi quan hệ cha/mẹ',
      'Lọc và xem theo từng thế hệ',
    ],
  },
  {
    icon: AddressBookIcon,
    iconBg: 'bg-vn-gold/10',
    iconColor: 'text-vn-gold-dark',
    badge: 'Xưng hô',
    title: 'Tự động tính xưng hô 3 miền Bắc – Trung – Nam',
    description:
      'Chỉ cần chọn "Tôi" là ai, hệ thống tự động tính từ xưng hô đến mọi thành viên trong cây. Hỗ trợ xưng hô 2 chiều và override thủ công cho trường hợp đặc biệt.',
    highlights: [
      'Tính xưng hô tự động từ góc nhìn bất kỳ',
      'Hỗ trợ Bắc / Trung / Nam',
      'Xưng hô 2 chiều: "Tôi gọi họ" & "Họ gọi tôi"',
      'Override thủ công theo tập tục địa phương',
    ],
  },
  {
    icon: CalendarMoonIcon,
    iconBg: 'bg-vn-green/10',
    iconColor: 'text-vn-green',
    badge: 'Âm lịch',
    title: 'Hỗ trợ âm lịch Việt Nam đầy đủ',
    description:
      'Nhập ngày sinh/mất trực tiếp theo lịch Âm, hỗ trợ tháng nhuận, tự động chuyển đổi và hiển thị song song dương lịch trên thẻ thành viên.',
    highlights: [
      'Nhập ngày âm lịch trực tiếp',
      'Hỗ trợ tháng nhuận (âm lịch)',
      'Tự động chuyển đổi dương ↔ âm',
      'Hiển thị song lang trên thẻ thành viên',
    ],
  },
];

export function FeatureDeepDiveSection() {
  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Khám phá{' '}
            <span className="text-vn-red">chi tiết</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            3 tính năng nổi bật được thiết kế riêng cho gia đình Việt Nam
          </p>
        </div>

        <div className="space-y-20 max-w-6xl mx-auto">
          {DEEP_DIVE_FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            const isReversed = index % 2 === 1;
            return (
              <div
                key={feature.badge}
                className={`flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16 ${
                  isReversed ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Illustration placeholder — decorative card */}
                <div className="flex-1">
                  <div className={`relative rounded-3xl p-8 sm:p-12 ${feature.iconBg}`}>
                    <div className="flex items-center justify-center">
                      <Icon className={`h-32 w-32 sm:h-40 sm:w-40 ${feature.iconColor} opacity-30`} />
                    </div>
                    <div className="absolute inset-0 rounded-3xl border border-current opacity-5" />
                  </div>
                </div>

                {/* Text content */}
                <div className="flex-1">
                  <div
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${feature.iconBg} ${feature.iconColor} mb-4`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {feature.badge}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    {feature.title}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-gray-600">
                    {feature.description}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {feature.highlights.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-gray-700">
                        <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${feature.iconColor.replace('text-', 'bg-')}`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

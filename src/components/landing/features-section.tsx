import { Card, CardContent } from '@/components/ui/card';
import {
  TreeIcon,
  CalendarMoonIcon,
  CeremonyIcon,
  ExportIcon,
  QrShareIcon,
  AddressBookIcon,
  ShieldLockIcon,
  MergeIcon,
  DragDropIcon,
  SearchPersonIcon,
  KeyboardIcon,
  MultiFamilyIcon,
} from './landing-icons';

type FeatureIconComponent = React.ComponentType<{ className?: string }>;

interface Feature {
  icon: FeatureIconComponent;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: TreeIcon,
    iconBg: 'bg-vn-red/10',
    iconColor: 'text-vn-red',
    title: 'Cây gia phả tương tác',
    description: 'Trực quan hóa dòng họ với cây tương tác — zoom, pan, minimap, highlight đường máu mủ và xem theo thế hệ.',
  },
  {
    icon: CalendarMoonIcon,
    iconBg: 'bg-vn-gold/10',
    iconColor: 'text-vn-gold-dark',
    title: 'Âm lịch & Ngày tháng',
    description: 'Nhập ngày âm lịch trực tiếp, hỗ trợ tháng nhuận, tự động chuyển đổi và hiển thị song song dương lịch.',
  },
  {
    icon: CeremonyIcon,
    iconBg: 'bg-vn-red/10',
    iconColor: 'text-vn-red',
    title: 'Sự kiện gia đình (19 loại)',
    description: 'Quản lý đầy đủ: sinh, mất, kết hôn, ly hôn, tốt nghiệp, di cư, tôn giáo và các sự kiện đặc trưng Việt Nam.',
  },
  {
    icon: ExportIcon,
    iconBg: 'bg-vn-green/10',
    iconColor: 'text-vn-green',
    title: 'Xuất PDF, PNG, GEDCOM',
    description: 'Xuất cây thành PDF chất lượng cao để in ấn, PNG độ phân giải cao, hoặc GEDCOM để chuyển sang phần mềm khác.',
  },
  {
    icon: QrShareIcon,
    iconBg: 'bg-vn-gold/10',
    iconColor: 'text-vn-gold-dark',
    title: 'Chia sẻ QR Code',
    description: 'Tạo mã QR trỏ đến gia phả để chia sẻ với người thân chỉ bằng một lần quét — không cần đăng nhập.',
  },
  {
    icon: AddressBookIcon,
    iconBg: 'bg-vn-red/10',
    iconColor: 'text-vn-red',
    title: 'Xưng hô Việt Nam',
    description: 'Tự động tính xưng hô từ góc nhìn bất kỳ thành viên — ông bà, cha mẹ, bác chú cô dì, hỗ trợ 3 miền.',
  },
  {
    icon: ShieldLockIcon,
    iconBg: 'bg-vn-green/10',
    iconColor: 'text-vn-green',
    title: 'Bảo mật & Quyền truy cập',
    description: 'Đặt mã PIN bảo vệ gia phả, toggle công khai/riêng tư, chỉ người có link và mã mới xem được.',
  },
  {
    icon: MergeIcon,
    iconBg: 'bg-vn-gold/10',
    iconColor: 'text-vn-gold-dark',
    title: 'Gộp & Tách gia phả',
    description: 'Wizard 5 bước gộp 2 gia phả, tự động phát hiện trùng lặp. Tách nhánh thành gia phả mới dễ dàng.',
  },
  {
    icon: DragDropIcon,
    iconBg: 'bg-vn-red/10',
    iconColor: 'text-vn-red',
    title: 'Drag & Drop đổi cấu trúc',
    description: 'Kéo thả thẻ thành viên để tái cấu trúc cây — thay đổi quan hệ cha mẹ nhanh chóng với xác nhận trực quan.',
  },
  {
    icon: SearchPersonIcon,
    iconBg: 'bg-vn-green/10',
    iconColor: 'text-vn-green',
    title: 'Tìm tổ tiên chung',
    description: 'Tự động tính và hiển thị tổ tiên chung giữa 2 thành viên bất kỳ — khám phá mối liên hệ huyết thống.',
  },
  {
    icon: KeyboardIcon,
    iconBg: 'bg-vn-gold/10',
    iconColor: 'text-vn-gold-dark',
    title: 'Phím tắt & Điều hướng',
    description: 'Ctrl+F tìm kiếm, +/- zoom, F focus thành viên, Shift+Click chọn góc nhìn xưng hô — thao tác nhanh như chuyên gia.',
  },
  {
    icon: MultiFamilyIcon,
    iconBg: 'bg-vn-red/10',
    iconColor: 'text-vn-red',
    title: 'Đa gia phả',
    description: 'Quản lý nhiều cây gia phả độc lập, xem kết hợp đồng thời 2–5 gia phả trên cùng màn hình để so sánh.',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-28 bg-white">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Tính năng{' '}
            <span className="text-vn-red">nổi bật</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Thiết kế riêng cho gia đình Việt Nam — từ lịch âm đến cách xưng hô
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-7xl mx-auto">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="group border border-gray-100 bg-white shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-200 cursor-default"
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
  );
}

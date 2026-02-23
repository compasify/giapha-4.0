import { CeremonyIcon, ExportIcon, MergeIcon } from './landing-icons';

interface CultureItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const CULTURE_ITEMS: CultureItem[] = [
  {
    icon: CeremonyIcon,
    title: '19 loại sự kiện gia đình',
    description:
      'Từ sinh, mất, kết hôn đến rửa tội, tốt nghiệp, di cư, phục viên — bao quát mọi sự kiện quan trọng của đời người Việt Nam.',
  },
  {
    icon: ExportIcon,
    title: 'Xuất GEDCOM chuẩn quốc tế',
    description:
      'Định dạng GEDCOM cho phép chuyển dữ liệu sang phần mềm gia phả khác như Ancestry, MyHeritage — không bị khóa vào nền tảng nào.',
  },
  {
    icon: MergeIcon,
    title: 'Gộp gia phả thông minh',
    description:
      'Wizard 5 bước tự động phát hiện thành viên trùng lặp khi gộp 2 gia phả. Tách nhánh thành gia phả mới chỉ với 2 click.',
  },
];

export function CultureShowcaseSection() {
  return (
    <section className="py-20 sm:py-28 bg-gradient-to-b from-white to-vn-cream/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-vn-gold/30 bg-vn-gold-light/50 px-4 py-1.5 text-sm text-vn-gold-dark">
            <span className="text-base" role="img" aria-label="Việt Nam">🇻🇳</span>
            <span className="font-medium">Đặc trưng Việt Nam</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Thiết kế{' '}
            <span className="text-vn-gold-dark">riêng cho người Việt</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Những tính năng không có ở bất kỳ nền tảng gia phả nước ngoài nào
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-3 max-w-5xl mx-auto">
          {CULTURE_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="relative rounded-2xl border border-vn-gold/20 bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-vn-gold-light">
                  <Icon className="h-6 w-6 text-vn-gold-dark" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import { TreeIcon, CalendarMoonIcon, QrShareIcon } from './landing-icons';
const STEPS = [
  {
    step: '01',
    icon: TreeIcon,
    title: 'Tạo tài khoản & gia phả',
    description: 'Đăng ký miễn phí chỉ với email. Tạo dòng họ và thêm thành viên đầu tiên — thường là ông bà tổ.',
  },
  {
    step: '02',
    icon: CalendarMoonIcon,
    title: 'Xây dựng cây gia phả',
    description: 'Thêm thành viên bằng nút + trên mỗi thẻ. Điền tên, ngày sinh (âm/dương lịch), ảnh đại diện, tiểu sử.',
  },
  {
    step: '03',
    icon: QrShareIcon,
    title: 'Khám phá & chia sẻ',
    description: 'Tra cứu xưng hô, xuất PDF/PNG, tạo QR code để chia sẻ gia phả với người thân chỉ bằng 1 lần quét.',
  },
] as const;

export function HowItWorksSection() {
  return (
    <section className="py-20 sm:py-28 bg-gradient-to-b from-vn-cream/50 to-white">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-14">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Bắt đầu trong{' '}
            <span className="text-vn-gold-dark">3 bước</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Đơn giản, nhanh chóng — không cần kiến thức kỹ thuật
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-3 max-w-4xl mx-auto">
          {STEPS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="text-center group">
                <div className="relative mx-auto w-fit">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-vn-red text-white text-xl font-bold shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
                    {item.step}
                  </div>
                  <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-lg bg-vn-gold-light text-vn-gold-dark shadow-sm">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <h3 className="mt-6 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
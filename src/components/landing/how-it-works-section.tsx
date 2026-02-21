const STEPS = [
  {
    step: '01',
    title: 'Tạo tài khoản',
    description: 'Đăng ký miễn phí chỉ với email. Tạo dòng họ và bắt đầu xây dựng gia phả.',
  },
  {
    step: '02',
    title: 'Thêm thành viên',
    description: 'Nhập thông tin ông bà, cha mẹ, anh chị em. Hệ thống tự động vẽ cây gia phả.',
  },
  {
    step: '03',
    title: 'Khám phá & chia sẻ',
    description: 'Xem lịch sự kiện, tra cứu xưng hô, xuất file và chia sẻ qua QR code.',
  },
] as const;

export function HowItWorksSection() {
  return (
    <section className="py-20 sm:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-14">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Bắt đầu trong 3 bước
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Đơn giản, nhanh chóng — không cần kiến thức kỹ thuật
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-3 max-w-4xl mx-auto">
          {STEPS.map((item) => (
            <div key={item.step} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
                {item.step}
              </div>
              <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

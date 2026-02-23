interface Testimonial {
  quote: string;
  name: string;
  role: string;
  location: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'Tôi đã lưu giữ gia phả dòng họ Nguyễn được 8 đời. Tính năng xưng hô tự động giúp các cháu nhỏ biết gọi đúng theo vùng Bắc.',
    name: 'Ông Nguyễn Văn Hòa',
    role: 'Trưởng họ Nguyễn',
    location: 'Hà Nội',
  },
  {
    quote:
      'Gia phả bên chồng và bên vợ được gộp lại dễ dàng. Tạo QR code dán ở bàn thờ, ai quét cũng xem được.',
    name: 'Chị Trần Thị Mai',
    role: 'Nội trợ',
    location: 'TP. Hồ Chí Minh',
  },
  {
    quote:
      'Sống ở Mỹ nhưng vẫn giữ được gia phả đầy đủ ngày âm lịch. Xuất PDF gửi về Việt Nam cho ông bà rất tiện.',
    name: 'Anh Phạm Minh Tuấn',
    role: 'Kỹ sư phần mềm',
    location: 'California, Mỹ',
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 sm:py-28 bg-vn-cream/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-14">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Gia đình Việt{' '}
            <span className="text-vn-red">tin dùng</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Những câu chuyện thực tế từ người dùng
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-3 max-w-5xl mx-auto">
          {TESTIMONIALS.map((t) => (
            <blockquote
              key={t.name}
              className="relative rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm"
            >
              <div className="absolute -top-3 left-6 text-4xl font-serif text-vn-red/20"
                aria-hidden="true"
              >
                &ldquo;
              </div>
              <p className="text-sm leading-relaxed text-gray-700">{t.quote}</p>
              <footer className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-vn-red/10 text-sm font-bold text-vn-red">
                  {t.name.split(' ').pop()?.[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role} &middot; {t.location}</p>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

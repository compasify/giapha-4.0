import { Card, CardContent } from '@/components/ui/card';

const FEATURES = [
  {
    icon: '🌳',
    title: 'Cây gia phả tương tác',
    description: 'Trực quan hóa dòng họ với cây gia phả D3.js — thu phóng, di chuyển, tìm kiếm thành viên dễ dàng.',
  },
  {
    icon: '🗓️',
    title: 'Lịch âm dương tự động',
    description: 'Tích hợp chuyển đổi âm lịch ↔ dương lịch. Hiển thị ngày âm trên mỗi ô lịch.',
  },
  {
    icon: '🎎',
    title: 'Sự kiện gia đình',
    description: 'Quản lý ngày giỗ, cúng giỗ, lễ Tết, đám cưới — 20+ loại sự kiện đặc trưng Việt Nam.',
  },
  {
    icon: '📄',
    title: 'Xuất PDF, PNG, SVG',
    description: 'Xuất cây gia phả thành file ảnh hoặc PDF chất lượng cao để in ấn hoặc lưu trữ.',
  },
  {
    icon: '📱',
    title: 'Chia sẻ QR Code',
    description: 'Tạo mã QR để chia sẻ gia phả với người thân chỉ bằng một lần quét.',
  },
  {
    icon: '👪',
    title: 'Xưng hô Việt Nam',
    description: 'Tự động tra cứu mối quan hệ và cách xưng hô — ông nội, bác, chú, cô, cậu, dì...',
  },
] as const;

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-14">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Tính năng nổi bật
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Thiết kế riêng cho gia đình Việt Nam — từ lịch âm đến cách xưng hô
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {FEATURES.map((feature) => (
            <Card key={feature.title} className="border bg-card/50 hover:bg-card hover:shadow-md transition-all">
              <CardContent className="pt-6">
                <span className="text-4xl" role="img" aria-hidden="true">{feature.icon}</span>
                <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

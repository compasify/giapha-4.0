import type { Metadata } from 'next';
import {
  Mail,
  MessageSquare,
  HelpCircle,
  Facebook,
  Youtube,
  TreePine,
  Send,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export const metadata: Metadata = {
  title: 'Liên hệ',
  description:
    'Liên hệ đội ngũ Gia Phả Online — hỗ trợ kỹ thuật, góp ý tính năng, hợp tác. Email: support@giapha.online.',
  keywords: [
    'liên hệ gia phả online',
    'hỗ trợ gia phả',
    'support giapha',
    'gia phả trực tuyến',
    'liên hệ hỗ trợ',
  ],
};

const FAQ_ITEMS = [
  {
    question: 'Gia Phả Online có miễn phí không?',
    answer:
      'Có, Gia Phả Online hoàn toàn miễn phí. Bạn có thể tạo không giới hạn gia phả, thêm không giới hạn thành viên, và sử dụng tất cả tính năng mà không cần thanh toán.',
  },
  {
    question: 'Dữ liệu gia phả của tôi có an toàn không?',
    answer:
      'Dữ liệu được mã hóa khi truyền tải (HTTPS), mật khẩu hash bằng bcrypt, và hệ thống được sao lưu định kỳ. Gia phả mặc định ở chế độ riêng tư — chỉ bạn mới xem được trừ khi bạn chia sẻ.',
  },
  {
    question: 'Tôi có thể xuất dữ liệu ra định dạng khác không?',
    answer:
      'Có, bạn có thể xuất gia phả dưới dạng PDF (in ấn), PNG (hình ảnh), hoặc GEDCOM (định dạng chuẩn quốc tế để chuyển sang phần mềm gia phả khác). Vào trang gia phả > Cài đặt > Xuất dữ liệu.',
  },
  {
    question: 'Hệ thống có hỗ trợ âm lịch Việt Nam không?',
    answer:
      'Có, Gia Phả Online hỗ trợ đầy đủ âm lịch Việt Nam. Bạn có thể nhập ngày sinh/mất theo lịch Âm, bao gồm cả tháng nhuận. Hệ thống tự động chuyển đổi và hiển thị song song cả dương lịch và âm lịch.',
  },
  {
    question: 'Làm sao để chia sẻ gia phả với người thân?',
    answer:
      'Bạn có thể tạo link chia sẻ hoặc mã QR từ trang cài đặt gia phả. Người nhận chỉ cần mở link hoặc quét mã — không cần đăng nhập. Bạn cũng có thể đặt mã PIN bảo mật cho gia phả.',
  },
  {
    question: 'Tính năng xưng hô hoạt động như thế nào?',
    answer:
      'Giữ Shift và click vào một thành viên trên cây để đặt làm "Tôi". Hệ thống sẽ tự động tính xưng hô từ góc nhìn đó ra toàn bộ thành viên. Hỗ trợ 3 miền Bắc, Trung, Nam với bộ từ xưng hô khác nhau.',
  },
];

export default function ContactPage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-gradient-to-br from-vn-cream via-white to-white">
        <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-vn-red opacity-5 blur-3xl" />
        <div className="pointer-events-none absolute -top-16 right-0 h-72 w-72 rounded-full bg-vn-gold opacity-8 blur-3xl" />

        <div className="container mx-auto px-4 py-20 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-vn-red/20 bg-white/80 px-4 py-1.5 text-sm text-vn-red shadow-sm backdrop-blur-sm">
              <MessageSquare className="h-4 w-4" />
              <span className="font-medium">Chúng tôi luôn lắng nghe</span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Liên hệ <span className="text-vn-red">với chúng tôi</span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-gray-600 sm:text-xl">
              Có câu hỏi, góp ý hay cần hỗ trợ? Đội ngũ Gia Phả Online sẵn sàng giúp đỡ bạn.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <Card className="border border-gray-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Send className="h-5 w-5 text-vn-red" />
                    Gửi tin nhắn
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="contact-name">Họ và tên</Label>
                        <Input
                          id="contact-name"
                          placeholder="Nguyễn Văn A"
                          disabled
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-email">Email</Label>
                        <Input
                          id="contact-email"
                          type="email"
                          placeholder="email@example.com"
                          disabled
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact-subject">Chủ đề</Label>
                      <Input
                        id="contact-subject"
                        placeholder="Ví dụ: Hỗ trợ kỹ thuật, Góp ý tính năng..."
                        disabled
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact-message">Nội dung</Label>
                      <Textarea
                        id="contact-message"
                        placeholder="Mô tả chi tiết câu hỏi hoặc yêu cầu của bạn..."
                        rows={5}
                        disabled
                      />
                    </div>

                    <Button
                      type="button"
                      className="w-full gap-2 bg-vn-red text-white hover:bg-vn-red-dark"
                      disabled
                    >
                      <Send className="h-4 w-4" />
                      Gửi tin nhắn
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      Tính năng gửi tin nhắn đang được phát triển. Vui lòng liên hệ qua email.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <Card className="border border-gray-100 shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-vn-red/10">
                      <Mail className="h-5 w-5 text-vn-red" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Email hỗ trợ</h3>
                      <a
                        href="mailto:support@giapha.online"
                        className="mt-1 block text-vn-red hover:underline"
                      >
                        support@giapha.online
                      </a>
                      <p className="mt-1 text-sm text-gray-500">
                        Phản hồi trong vòng 24 giờ làm việc
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-100 shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-vn-gold/10">
                      <HelpCircle className="h-5 w-5 text-vn-gold-dark" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Các chủ đề thường gặp</h3>
                      <ul className="mt-2 space-y-1 text-sm text-gray-500">
                        <li>Hỗ trợ kỹ thuật & lỗi phần mềm</li>
                        <li>Góp ý & đề xuất tính năng mới</li>
                        <li>Hướng dẫn sử dụng</li>
                        <li>Hợp tác & liên kết</li>
                        <li>Báo cáo vi phạm nội dung</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-100 shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-vn-green/10">
                      <TreePine className="h-5 w-5 text-vn-green" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Theo dõi chúng tôi</h3>
                      <div className="mt-3 flex gap-3">
                        <a
                          href="#"
                          aria-label="Facebook"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:border-vn-red/30 hover:text-vn-red"
                        >
                          <Facebook className="h-4 w-4" />
                        </a>
                        <a
                          href="#"
                          aria-label="YouTube"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:border-vn-red/30 hover:text-vn-red"
                        >
                          <Youtube className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-vn-cream/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Câu hỏi <span className="text-vn-red">thường gặp</span>
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Tìm câu trả lời nhanh cho các thắc mắc phổ biến
              </p>
            </div>

            <div className="space-y-4">
              {FAQ_ITEMS.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-xl border border-gray-200 bg-white shadow-sm"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-4 text-left font-medium text-gray-900 [&::-webkit-details-marker]:hidden">
                    <span>{item.question}</span>
                    <ChevronDown className="h-5 w-5 shrink-0 text-gray-400 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

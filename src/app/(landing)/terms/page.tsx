import type { Metadata } from 'next';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export const metadata: Metadata = {
  title: 'Điều khoản sử dụng',
  description:
    'Điều khoản sử dụng dịch vụ Gia Phả 365 — nền tảng quản lý gia phả trực tuyến dành cho người Việt. Quyền và trách nhiệm của người dùng.',
  keywords: [
    'điều khoản sử dụng',
    'gia phả online',
    'điều khoản dịch vụ',
    'quy định sử dụng',
    'gia phả trực tuyến',
    'quyền người dùng',
    'gia phả 365',
  ],
};

const EFFECTIVE_DATE = '01/01/2026';

export default function TermsPage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-gradient-to-br from-vn-cream via-white to-white">
        <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-vn-red opacity-5 blur-3xl" />
        <div className="container mx-auto px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Điều khoản <span className="text-vn-red">sử dụng</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Có hiệu lực từ ngày {EFFECTIVE_DATE}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <article className="prose prose-gray mx-auto max-w-3xl">
            <p className="text-gray-600 leading-relaxed">
              Chào mừng bạn đến với Gia Phả 365 (&ldquo;Dịch vụ&rdquo;), nền tảng quản lý gia phả trực
              tuyến được vận hành tại tên miền giapha.online (&ldquo;Trang web&rdquo;). Bằng việc truy cập
              hoặc sử dụng Dịch vụ, bạn đồng ý tuân thủ các điều khoản và điều kiện dưới đây
              (&ldquo;Điều khoản&rdquo;). Nếu bạn không đồng ý với bất kỳ phần nào của Điều khoản này, vui
              lòng không sử dụng Dịch vụ.
            </p>

            <Separator className="my-10" />

            <h2 className="text-2xl font-bold text-gray-900">1. Định nghĩa</h2>
            <ul className="mt-4 space-y-2 text-gray-600">
              <li>
                <strong>&ldquo;Chúng tôi&rdquo;</strong>, <strong>&ldquo;Của chúng tôi&rdquo;</strong>: Đội
                ngũ phát triển và vận hành Gia Phả 365.
              </li>
              <li>
                <strong>&ldquo;Bạn&rdquo;</strong>, <strong>&ldquo;Người dùng&rdquo;</strong>: Cá nhân đăng
                ký và sử dụng Dịch vụ.
              </li>
              <li>
                <strong>&ldquo;Nội dung người dùng&rdquo;</strong>: Mọi dữ liệu, thông tin, hình ảnh và nội
                dung khác mà bạn tải lên hoặc tạo ra trên Dịch vụ, bao gồm nhưng không giới hạn ở dữ liệu
                gia phả, thông tin thành viên và sự kiện gia đình.
              </li>
              <li>
                <strong>&ldquo;Tài khoản&rdquo;</strong>: Tài khoản cá nhân được tạo khi bạn đăng ký sử dụng
                Dịch vụ.
              </li>
            </ul>

            <Separator className="my-10" />

            <h2 className="text-2xl font-bold text-gray-900">2. Tài khoản người dùng</h2>
            <div className="mt-4 space-y-3 text-gray-600 leading-relaxed">
              <p>
                Để sử dụng đầy đủ tính năng của Dịch vụ, bạn cần tạo một Tài khoản bằng địa chỉ email hợp
                lệ hoặc thông qua tài khoản Google (OAuth).
              </p>
              <p>
                Bạn có trách nhiệm bảo mật thông tin đăng nhập của mình. Mọi hoạt động diễn ra dưới Tài
                khoản của bạn được xem là do bạn thực hiện.
              </p>
              <p>
                Bạn cam kết cung cấp thông tin chính xác, đầy đủ khi đăng ký và cập nhật kịp thời khi có
                thay đổi.
              </p>
              <p>
                Mỗi cá nhân chỉ được sở hữu một Tài khoản. Việc tạo nhiều tài khoản với mục đích lạm dụng
                có thể dẫn đến việc khóa tất cả các tài khoản liên quan.
              </p>
            </div>

            <Separator className="my-10" />

            <h2 className="text-2xl font-bold text-gray-900">3. Quy định sử dụng</h2>
            <div className="mt-4 space-y-3 text-gray-600 leading-relaxed">
              <p>Khi sử dụng Dịch vụ, bạn cam kết:</p>
              <ul className="space-y-2">
                <li>Tuân thủ pháp luật Việt Nam và các quy định pháp luật quốc tế có liên quan.</li>
                <li>Không sử dụng Dịch vụ cho mục đích bất hợp pháp, lừa đảo hoặc gây hại cho người khác.</li>
                <li>
                  Không tải lên nội dung vi phạm quyền sở hữu trí tuệ, nội dung khiêu dâm, bạo lực, phân
                  biệt đối xử hoặc nội dung trái pháp luật.
                </li>
                <li>
                  Không cố gắng truy cập trái phép vào hệ thống, tài khoản của người dùng khác hoặc dữ liệu
                  không thuộc quyền sở hữu của bạn.
                </li>
                <li>
                  Không sử dụng bot, script hoặc phương pháp tự động để khai thác Dịch vụ trừ khi được chúng
                  tôi cho phép bằng văn bản.
                </li>
                <li>
                  Không can thiệp, phá hoại hoặc gây gián đoạn hoạt động bình thường của Dịch vụ.
                </li>
              </ul>
            </div>

            <Separator className="my-10" />

            <h2 className="text-2xl font-bold text-gray-900">4. Sở hữu trí tuệ</h2>
            <div className="mt-4 space-y-3 text-gray-600 leading-relaxed">
              <p>
                Giao diện, mã nguồn, thiết kế, logo, thương hiệu và các tài liệu liên quan đến Dịch vụ
                thuộc quyền sở hữu của Gia Phả 365 và được bảo hộ bởi luật sở hữu trí tuệ.
              </p>
              <p>
                Bạn không được sao chép, phân phối, sửa đổi hoặc tạo sản phẩm phái sinh từ bất kỳ phần nào
                của Dịch vụ mà không có sự đồng ý bằng văn bản của chúng tôi.
              </p>
            </div>

            <Separator className="my-10" />

            <h2 className="text-2xl font-bold text-gray-900">5. Quyền sở hữu dữ liệu</h2>
            <div className="mt-4 space-y-3 text-gray-600 leading-relaxed">
              <p className="font-medium text-gray-900">
                Dữ liệu gia phả của bạn thuộc về bạn. Chúng tôi cam kết:
              </p>
              <ul className="space-y-2">
                <li>
                  Bạn giữ toàn quyền sở hữu đối với Nội dung người dùng mà bạn tạo ra trên Dịch vụ.
                </li>
                <li>
                  Chúng tôi không sử dụng dữ liệu gia phả của bạn cho bất kỳ mục đích thương mại nào.
                </li>
                <li>
                  Bạn có quyền xuất (export) toàn bộ dữ liệu của mình dưới định dạng chuẩn (GEDCOM, PDF,
                  PNG) bất cứ lúc nào.
                </li>
                <li>
                  Bạn có quyền yêu cầu xóa toàn bộ dữ liệu và tài khoản của mình khỏi hệ thống.
                </li>
              </ul>
              <p>
                Bằng việc sử dụng Dịch vụ, bạn cấp cho chúng tôi quyền hạn chế để lưu trữ, xử lý và hiển
                thị Nội dung người dùng nhằm mục đích cung cấp Dịch vụ cho bạn. Quyền này tự động chấm dứt
                khi bạn xóa nội dung hoặc tài khoản.
              </p>
            </div>

            <Separator className="my-10" />

            <h2 className="text-2xl font-bold text-gray-900">6. Miễn trừ trách nhiệm</h2>
            <div className="mt-4 space-y-3 text-gray-600 leading-relaxed">
              <p>
                Dịch vụ được cung cấp trên cơ sở &ldquo;nguyên trạng&rdquo; (as-is) và &ldquo;tùy vào khả
                năng sẵn có&rdquo; (as-available). Chúng tôi không đảm bảo rằng Dịch vụ sẽ hoạt động liên
                tục, không có lỗi hoặc hoàn toàn an toàn.
              </p>
              <p>
                Chúng tôi không chịu trách nhiệm về tính chính xác của thông tin gia phả do người dùng nhập
                vào. Người dùng có trách nhiệm kiểm tra và xác minh dữ liệu của mình.
              </p>
              <p>
                Chúng tôi cố gắng hết sức để bảo vệ dữ liệu của bạn, tuy nhiên không thể đảm bảo tuyệt đối
                khỏi mọi rủi ro bảo mật. Chúng tôi khuyến khích bạn thường xuyên xuất và sao lưu dữ liệu.
              </p>
            </div>

            <Separator className="my-10" />

            <h2 className="text-2xl font-bold text-gray-900">7. Giới hạn trách nhiệm</h2>
            <div className="mt-4 space-y-3 text-gray-600 leading-relaxed">
              <p>
                Trong mọi trường hợp, trách nhiệm pháp lý của chúng tôi đối với bạn — dù phát sinh từ hợp
                đồng, lỗi dân sự, hay bất kỳ lý thuyết pháp lý nào — sẽ không vượt quá tổng số tiền bạn đã
                thanh toán cho Dịch vụ trong 12 tháng trước khi phát sinh sự kiện gây ra trách nhiệm.
              </p>
              <p>
                Chúng tôi không chịu trách nhiệm về bất kỳ thiệt hại gián tiếp, ngẫu nhiên, đặc biệt hoặc
                mang tính hậu quả nào, bao gồm nhưng không giới hạn ở mất dữ liệu, mất lợi nhuận hoặc gián
                đoạn kinh doanh.
              </p>
            </div>

            <Separator className="my-10" />

            <h2 className="text-2xl font-bold text-gray-900">8. Chấm dứt</h2>
            <div className="mt-4 space-y-3 text-gray-600 leading-relaxed">
              <p>
                Bạn có thể ngừng sử dụng Dịch vụ và xóa tài khoản bất cứ lúc nào từ trang cài đặt tài
                khoản.
              </p>
              <p>Chúng tôi có quyền tạm ngưng hoặc chấm dứt tài khoản của bạn nếu:</p>
              <ul className="space-y-2">
                <li>Bạn vi phạm bất kỳ điều khoản nào trong Điều khoản này.</li>
                <li>Tài khoản có dấu hiệu hoạt động bất thường hoặc gian lận.</li>
                <li>Theo yêu cầu của cơ quan chức năng có thẩm quyền.</li>
              </ul>
              <p>
                Trong trường hợp chấm dứt, chúng tôi sẽ thông báo trước ít nhất 30 ngày (trừ trường hợp vi
                phạm nghiêm trọng) để bạn có thời gian xuất dữ liệu.
              </p>
            </div>

            <Separator className="my-10" />

            <h2 className="text-2xl font-bold text-gray-900">9. Thay đổi điều khoản</h2>
            <div className="mt-4 space-y-3 text-gray-600 leading-relaxed">
              <p>
                Chúng tôi có quyền sửa đổi Điều khoản này bất cứ lúc nào. Mọi thay đổi quan trọng sẽ được
                thông báo qua email hoặc thông báo trên Trang web ít nhất 15 ngày trước khi có hiệu lực.
              </p>
              <p>
                Việc tiếp tục sử dụng Dịch vụ sau khi thay đổi có hiệu lực đồng nghĩa với việc bạn chấp
                nhận Điều khoản mới. Nếu bạn không đồng ý, vui lòng ngừng sử dụng Dịch vụ và xóa tài khoản.
              </p>
            </div>

            <Separator className="my-10" />

            <h2 className="text-2xl font-bold text-gray-900">10. Liên hệ</h2>
            <div className="mt-4 text-gray-600 leading-relaxed">
              <p>
                Nếu bạn có câu hỏi về Điều khoản sử dụng này, vui lòng liên hệ với chúng tôi qua:
              </p>
              <ul className="mt-3 space-y-2">
                <li>
                  Email:{' '}
                  <a href="mailto:support@giapha.online" className="text-vn-red hover:underline">
                    support@giapha.online
                  </a>
                </li>
                <li>
                  Trang liên hệ:{' '}
                  <Link href="/contact" className="text-vn-red hover:underline">
                    giapha.online/contact
                  </Link>
                </li>
              </ul>
            </div>

            <Separator className="my-10" />

            <p className="text-sm text-gray-400 text-center">
              Điều khoản sử dụng này có hiệu lực từ ngày {EFFECTIVE_DATE}.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}

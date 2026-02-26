import type { Metadata } from 'next';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export const metadata: Metadata = {
  title: 'Chính sách bảo mật',
  description:
    'Chính sách bảo mật của Gia Phả 365 — cam kết bảo vệ dữ liệu gia phả và thông tin cá nhân của bạn. Dữ liệu thuộc về bạn.',
  keywords: [
    'chính sách bảo mật',
    'gia phả online',
    'bảo mật dữ liệu',
    'quyền riêng tư',
    'bảo vệ thông tin',
    'GDPR',
    'gia phả trực tuyến',
    'gia phả 365',
  ],
};

const EFFECTIVE_DATE = '01/01/2026';

export default function PrivacyPage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-gradient-to-br from-vn-cream via-white to-white">
        <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-vn-red opacity-5 blur-3xl" />
        <div className="container mx-auto px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Chính sách <span className="text-vn-red">bảo mật</span>
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
              Tại Gia Phả 365, chúng tôi hiểu rằng dữ liệu gia phả là thông tin nhạy cảm và
              riêng tư của gia đình bạn. Chính sách bảo mật này giải thích cách chúng tôi thu thập,
              sử dụng, lưu trữ và bảo vệ thông tin của bạn khi bạn sử dụng dịch vụ tại
              giapha.online.
            </p>

            <div className="mt-8 rounded-xl border border-vn-green/30 bg-vn-green/5 p-6">
              <p className="font-semibold text-gray-900">
                Nguyên tắc cốt lõi của chúng tôi:
              </p>
              <ul className="mt-3 space-y-1 text-gray-700">
                <li>Dữ liệu gia phả của bạn thuộc về bạn.</li>
                <li>Gia phả mặc định ở chế độ riêng tư.</li>
                <li>Chúng tôi không bán hoặc chia sẻ dữ liệu với bên thứ ba.</li>
                <li>Bạn có quyền xuất và xóa dữ liệu bất cứ lúc nào.</li>
              </ul>
            </div>

            <Separator className="my-10" />

            <h2 className="text-2xl font-bold text-gray-900">1. Dữ liệu chúng tôi thu thập</h2>
            <div className="mt-4 space-y-4 text-gray-600 leading-relaxed">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  1.1. Thông tin bạn cung cấp trực tiếp
                </h3>
                <ul className="mt-2 space-y-1">
                  <li>
                    <strong>Thông tin tài khoản:</strong> Họ tên, địa chỉ email, mật khẩu (được mã hóa).
                  </li>
                  <li>
                    <strong>Dữ liệu gia phả:</strong> Tên thành viên, ngày sinh, ngày mất, ảnh đại diện,
                    tiểu sử, quan hệ gia đình, sự kiện và các thông tin liên quan.
                  </li>
                  <li>
                    <strong>Thông tin liên hệ:</strong> Khi bạn gửi yêu cầu hỗ trợ hoặc phản hồi.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  1.2. Thông tin thu thập tự động
                </h3>
                <ul className="mt-2 space-y-1">
                  <li>
                    <strong>Dữ liệu sử dụng:</strong> Trang đã truy cập, thời gian sử dụng, tính năng được
                    dùng.
                  </li>
                  <li>
                    <strong>Thông tin thiết bị:</strong> Loại trình duyệt, hệ điều hành, độ phân giải màn
                    hình.
                  </li>
                  <li>
                    <strong>Địa chỉ IP:</strong> Để bảo mật tài khoản và ngăn chặn truy cập trái phép.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  1.3. Thông tin từ bên thứ ba
                </h3>
                <p className="mt-2">
                  Khi bạn đăng nhập bằng Google (OAuth), chúng tôi nhận được họ tên, email và ảnh đại diện
                  từ tài khoản Google của bạn. Chúng tôi không truy cập danh bạ, email hay bất kỳ dữ liệu
                  nào khác trên tài khoản Google.
                </p>
              </div>
            </div>

            <Separator className="my-10" />

            <h2 className="text-2xl font-bold text-gray-900">2. Cách chúng tôi sử dụng dữ liệu</h2>
            <div className="mt-4 text-gray-600 leading-relaxed">
              <p>Chúng tôi sử dụng thông tin của bạn để:</p>
              <ul className="mt-3 space-y-2">
                <li>Cung cấp, duy trì và cải thiện Dịch vụ.</li>
                <li>Xác thực tài khoản và bảo vệ an ninh.</li>
                <li>Hiển thị cây gia phả, tính toán xưng hô và quản lý sự kiện.</li>
                <li>Gửi thông báo quan trọng về Dịch vụ (thay đổi điều khoản, bảo trì hệ thống).</li>
                <li>Hỗ trợ kỹ thuật khi bạn liên hệ.</li>
                <li>Phân tích xu hướng sử dụng (ẩn danh) để cải thiện trải nghiệm.</li>
              </ul>
              <p className="mt-4 font-medium text-gray-900">
                Chúng tôi KHÔNG sử dụng dữ liệu gia phả của bạn cho mục đích quảng cáo, nghiên cứu thị
                trường hoặc bán cho bên thứ ba.
              </p>
            </div>

            <Separator className="my-10" />

            <h2 className="text-2xl font-bold text-gray-900">3. Lưu trữ và bảo mật dữ liệu</h2>
            <div className="mt-4 space-y-3 text-gray-600 leading-relaxed">
              <p>Chúng tôi áp dụng các biện pháp bảo mật sau:</p>
              <ul className="mt-2 space-y-2">
                <li>
                  <strong>Mã hóa truyền tải:</strong> Toàn bộ dữ liệu được truyền qua HTTPS/TLS.
                </li>
                <li>
                  <strong>Mã hóa mật khẩu:</strong> Mật khẩu được hash bằng thuật toán bcrypt, không lưu trữ
                  dưới dạng văn bản thuần.
                </li>
                <li>
                  <strong>Xác thực JWT:</strong> Phiên đăng nhập được quản lý bằng JSON Web Token với thời
                  hạn giới hạn.
                </li>
                <li>
                  <strong>Sao lưu định kỳ:</strong> Dữ liệu được sao lưu thường xuyên để phòng ngừa mất
                  mát.
                </li>
                <li>
                  <strong>Giám sát bảo mật:</strong> Hệ thống được giám sát liên tục để phát hiện và ngăn
                  chặn truy cập trái phép.
                </li>
              </ul>
              <p>
                Dữ liệu được lưu trữ trên hạ tầng đám mây có chứng nhận bảo mật quốc tế. Chúng tôi chỉ lưu
                giữ dữ liệu trong thời gian bạn duy trì tài khoản, trừ khi pháp luật yêu cầu lưu trữ lâu
                hơn.
              </p>
            </div>

            <Separator className="my-10" />

            <h2 className="text-2xl font-bold text-gray-900">4. Cookie và công nghệ theo dõi</h2>
            <div className="mt-4 space-y-3 text-gray-600 leading-relaxed">
              <p>Chúng tôi sử dụng cookie cho các mục đích sau:</p>
              <ul className="mt-2 space-y-2">
                <li>
                  <strong>Cookie thiết yếu:</strong> Duy trì phiên đăng nhập, ghi nhớ tùy chọn ngôn ngữ và
                  giao diện.
                </li>
                <li>
                  <strong>Cookie phân tích:</strong> Thu thập thông tin ẩn danh về cách bạn sử dụng Dịch vụ
                  (trang truy cập, thời gian sử dụng).
                </li>
              </ul>
              <p>
                Chúng tôi không sử dụng cookie quảng cáo hoặc cookie theo dõi của bên thứ ba. Bạn có thể tắt
                cookie trong cài đặt trình duyệt, tuy nhiên một số tính năng có thể không hoạt động đầy đủ.
              </p>
            </div>

            <Separator className="my-10" />

            <h2 className="text-2xl font-bold text-gray-900">5. Dịch vụ bên thứ ba</h2>
            <div className="mt-4 space-y-3 text-gray-600 leading-relaxed">
              <p>Chúng tôi có thể sử dụng các dịch vụ bên thứ ba sau:</p>
              <ul className="mt-2 space-y-2">
                <li>
                  <strong>Google OAuth:</strong> Để cung cấp tùy chọn đăng nhập bằng tài khoản Google.
                </li>
                <li>
                  <strong>Dịch vụ lưu trữ đám mây:</strong> Để lưu trữ và sao lưu dữ liệu.
                </li>
                <li>
                  <strong>Dịch vụ email:</strong> Để gửi thông báo và email hỗ trợ.
                </li>
              </ul>
              <p>
                Các dịch vụ bên thứ ba chỉ nhận được lượng thông tin tối thiểu cần thiết để hoạt động. Chúng
                tôi không chia sẻ dữ liệu gia phả của bạn với bất kỳ bên thứ ba nào.
              </p>
            </div>

            <Separator className="my-10" />

            <h2 className="text-2xl font-bold text-gray-900">6. Quyền của người dùng</h2>
            <div className="mt-4 text-gray-600 leading-relaxed">
              <p>
                Tuân thủ các nguyên tắc bảo vệ dữ liệu quốc tế (GDPR), bạn có các quyền sau:
              </p>
              <ul className="mt-3 space-y-3">
                <li>
                  <strong>Quyền truy cập:</strong> Bạn có quyền xem toàn bộ dữ liệu cá nhân mà chúng tôi
                  lưu trữ về bạn.
                </li>
                <li>
                  <strong>Quyền chỉnh sửa:</strong> Bạn có quyền yêu cầu sửa đổi thông tin cá nhân không
                  chính xác hoặc không đầy đủ.
                </li>
                <li>
                  <strong>Quyền xóa:</strong> Bạn có quyền yêu cầu xóa toàn bộ dữ liệu cá nhân và tài
                  khoản. Việc xóa sẽ được thực hiện trong vòng 30 ngày kể từ ngày yêu cầu.
                </li>
                <li>
                  <strong>Quyền xuất dữ liệu:</strong> Bạn có quyền tải xuống toàn bộ dữ liệu gia phả dưới
                  các định dạng chuẩn (GEDCOM, PDF, PNG).
                </li>
                <li>
                  <strong>Quyền hạn chế xử lý:</strong> Bạn có quyền yêu cầu giới hạn cách chúng tôi xử
                  lý dữ liệu của bạn trong một số trường hợp nhất định.
                </li>
                <li>
                  <strong>Quyền phản đối:</strong> Bạn có quyền phản đối việc xử lý dữ liệu cá nhân cho
                  mục đích phân tích.
                </li>
              </ul>
              <p className="mt-4">
                Để thực hiện bất kỳ quyền nào ở trên, vui lòng liên hệ qua email{' '}
                <a href="mailto:support@giapha.online" className="text-vn-red hover:underline">
                  support@giapha.online
                </a>
                . Chúng tôi sẽ phản hồi trong vòng 15 ngày làm việc.
              </p>
            </div>

            <Separator className="my-10" />

            <h2 className="text-2xl font-bold text-gray-900">7. Bảo vệ trẻ em</h2>
            <div className="mt-4 space-y-3 text-gray-600 leading-relaxed">
              <p>
                Dịch vụ không hướng đến trẻ em dưới 13 tuổi. Chúng tôi không cố ý thu thập thông tin cá nhân
                từ trẻ em dưới 13 tuổi.
              </p>
              <p>
                Trẻ em từ 13 đến 16 tuổi cần có sự đồng ý của cha mẹ hoặc người giám hộ hợp pháp để sử dụng
                Dịch vụ.
              </p>
              <p>
                Dữ liệu gia phả có thể chứa thông tin về trẻ em (tên, ngày sinh) trong ngữ cảnh cây gia phả.
                Thông tin này được bảo vệ ở cùng mức độ bảo mật với toàn bộ dữ liệu gia phả và chỉ có thể
                truy cập bởi chủ sở hữu gia phả hoặc người được ủy quyền.
              </p>
            </div>

            <Separator className="my-10" />

            <h2 className="text-2xl font-bold text-gray-900">8. Thay đổi chính sách</h2>
            <div className="mt-4 space-y-3 text-gray-600 leading-relaxed">
              <p>
                Chúng tôi có thể cập nhật Chính sách bảo mật này theo thời gian. Mọi thay đổi quan trọng sẽ
                được:
              </p>
              <ul className="mt-2 space-y-1">
                <li>Thông báo qua email đến địa chỉ đăng ký của bạn.</li>
                <li>Hiển thị thông báo nổi bật trên Trang web.</li>
                <li>Đăng tải ít nhất 15 ngày trước khi có hiệu lực.</li>
              </ul>
              <p>
                Phiên bản mới nhất của Chính sách bảo mật luôn có sẵn tại trang này.
              </p>
            </div>

            <Separator className="my-10" />

            <h2 className="text-2xl font-bold text-gray-900">9. Liên hệ</h2>
            <div className="mt-4 text-gray-600 leading-relaxed">
              <p>
                Nếu bạn có câu hỏi, lo ngại hoặc yêu cầu liên quan đến Chính sách bảo mật này hoặc cách
                chúng tôi xử lý dữ liệu của bạn, vui lòng liên hệ:
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
              Chính sách bảo mật này có hiệu lực từ ngày {EFFECTIVE_DATE}.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}

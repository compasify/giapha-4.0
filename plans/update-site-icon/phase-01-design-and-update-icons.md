# Phase 1: Thay thế Icon và Favicon cho ứng dụng Gia Phả

## Context (Bối cảnh)

- **Parent Plan:** [Cập nhật Icon website](./plan.md)
- **Tình trạng:** Sử dụng cái cây mặc định khô khan, đơn điệu, không phản ánh được tinh thần văn hóa và vẻ đẹp của ứng dụng gia phả.
- **Dependency:** Cần được lên ý tưởng và sinh bằng svg/png (hoặc công cụ như generate_image) và thay thế vào source gốc.

## Overview

*   **Thời gian ước tính:** 1 giờ
*   **Mức độ ưu tiên:** Quan trọng (giao diện)
*   **Trạng thái triển khai:** pending
*   **Trạng thái review:** pending

## Key Insights

- Ứng dụng "Gia Phả Online" xoay quanh yếu tố cốt lõi: Kết nối các thế hệ, bảo tồn văn hóa Việt (hoa sen, rễ cây, gam màu huyết dụ đỏ/hoàng kim).
- Icon cần sự đơn giản trong kích thước nhỏ của tab trình duyệt `favicon.ico` nhưng cũng đủ sang trọng khi làm `apple-touch-icon` hoặc Logo web ở `icon.tsx`.
- Các file tĩnh thường đổi: `src/app/favicon.ico`, `src/app/icon.tsx`, `public` app/icon, apple-icon...

## Requirements
- Sinh bộ hình ảnh (icon, favicon) mới theo concept Á Đông/Việt Nam cho trang (VD: hình tượng Cây kết hợp Hoa Sen, màu đỏ đun và vàng đồng) cực kỳ minimalism và rõ nét.
- Xóa các icon rưởi cũ.
- Tích hợp chuẩn xác vào router của Next.js (chỉnh sửa `src/app/favicon.ico` và cấu hình Metadata).

## Architecture & File thay đổi (Related code files)
- `src/app/favicon.ico` (Thay thế/Xóa).
- `src/app/icon.tsx` (Hoặc thêm file icon.tsx để gen SVG động) hoặc `src/app/icon.svg` / `public/favicon.ico`.
- `src/app/layout.tsx` (Update cấu hình metadata.icons nếu cần thiết).

## Implementation Steps

1. Xoá `src/app/favicon.ico` và các icon cũ (như `favicon.ico`, `logo.svg`, ...)
2. Dùng code Next.js `ImageResponse` trong file `src/app/icon.tsx` để render Icon xịn từ thẻ `<svg>` (vì Next.js hỗ trợ generate dynamic icon trực tiếp từ SVG/TSX mà ko cần tạo file ICO cứng nhắc).
   - SVG này sẽ phản ánh logo gia phả: 1 lá bồ đề hoặc lá bướm/cây kết hợp gia tộc mang sắc đỏ huyết dụ và vàng hoàng kim.
3. Chỉnh sửa cả `src/app/apple-icon.tsx` cho file hiển thị di động.
4. Cập nhật `src/app/layout.tsx` (nếu cần thiết để xóa các thẻ cứng `<link rel="icon">`).
5. (Optional) Thay thế file favicon.ico trong root bằng cách tải hình ảnh convert chuẩn xác từ .svg để legacy browsers đọc (trong Next14 chỉ cần `/app/favicon.ico` bằng file gốc hoặc routing).

## Todo list
- [ ] Thiết kế ý tưởng icon, mã hóa SVG gốc.
- [ ] Implement `src/app/icon.tsx` chứa SVG và ImageResponse.
- [ ] Xóa file `.ico` cũ.
- [ ] Restart dev server & Verify.

## Success Criteria
- Tab trình duyệt hiện ra icon/favicon gia phả mới mẻ, cao cấp, rõ nét được mix gradient Đỏ và Vàng.
- Không còn icon cây đơn điệu.
- PWA/Apple icons cũng nhận bộ logo mới.

## Security Considerations
N/A

## Risk Assessment
- Rủi ro bị trình duyệt cache. Có thể bypass bằng cách thêm version param vào icon trong layout.

## Next steps
- Tiến hành thực thi các TODOs, chạy công cụ xoá các file icon cũ và viết file cấu trúc Icon dưới dạng TSX cho Next.js 14/15.

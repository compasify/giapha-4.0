# Gia Phả Online

Ứng dụng web quản lý gia phả trực tuyến dành cho các gia đình Việt Nam. Được xây dựng với Next.js 15 + React 19 + TypeScript.

## Tính năng chính

- **Cây gia phả tương tác** — SVG chart (family-chart), thu phóng, điều hướng bằng bàn phím & cảm ứng
- **Xung hô tự động** — Tính toán và hiển thị danh xưng Việt Nam (Ông/Bà/Cha/Mẹ/Bác/Chú/Cô/Dì…) dựa trên quan hệ trong cây
- **Âm lịch** — Lưu trữ và hiển thị ngày sinh/mất theo cả dương lịch và âm lịch (có hỗ trợ tháng nhuận)
- **Tên Việt Nam đầy đủ** — Họ, tên đệm, tên, tên thường gọi, tên húy, tên thụy, tên hiệu, chữ Hán Nôm
- **Sự kiện gia đình** — Quản lý giỗ, cúng giỗ, lễ tết, đám cưới, đám tang, khai sinh, khai tử…
- **Xuất dữ liệu** — PDF (A0–A4, dọc/ngang), PNG, SVG
- **Chia sẻ** — Tạo QR code để chia sẻ cây gia phả
- **Đa gia phả** — Một tài khoản quản lý nhiều gia phả

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| UI | React 19 + Tailwind CSS v4 |
| Language | TypeScript 5 |
| State | Zustand 5 |
| Data fetching | TanStack Query v5 |
| Forms | react-hook-form + Zod v4 |
| Tree chart | family-chart 0.9.0 |
| Backend | Rails API (external) |

## Cài đặt & Chạy

### Yêu cầu

- Node.js ≥ 20
- npm / yarn / pnpm / bun

### Cài đặt

```bash
# Clone repo
git clone <repo-url>
cd family-tree

# Cài dependencies
npm install

# Tạo file env
cp .env.example .env.local
# Điền NEXT_PUBLIC_API_URL=<URL Rails API>
```

### Chạy development

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

### Build production

```bash
npm run build
npm run start
```

## Biến môi trường

| Biến | Mô tả |
|------|-------|
| `NEXT_PUBLIC_API_URL` | URL gốc của Rails API backend |

## Cấu trúc thư mục

```
src/
├── app/
│   ├── (landing)/          # Trang chủ công khai
│   ├── (auth)/             # Đăng nhập / Đăng ký
│   ├── (app)/              # Khu vực bảo vệ (yêu cầu đăng nhập)
│   │   ├── dashboard/      # Bảng điều khiển
│   │   ├── lineage/[id]/   # Xem cây gia phả
│   │   ├── person/[id]/    # Hồ sơ thành viên
│   │   ├── events/         # Sự kiện gia đình
│   │   └── settings/       # Cài đặt
│   ├── api/proxy/          # Proxy API → Rails backend
│   └── actions/            # Server Actions (auth)
├── components/
│   ├── tree/               # Family chart + Edit sidebar
│   └── ui/                 # shadcn/ui components
├── hooks/                  # TanStack Query hooks
├── lib/
│   ├── api/                # Axios client + endpoints
│   ├── transforms/         # Biến đổi dữ liệu → family-chart
│   ├── xung-ho/            # Thuật toán xưng hô Việt Nam
│   ├── export/             # PDF / PNG / share
│   └── constants/          # Loại sự kiện
├── stores/                 # Zustand stores
└── types/                  # TypeScript interfaces
```

## Scripts

```bash
npm run dev      # Development server (hot reload)
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint
```

## Tài liệu

Xem thêm tại thư mục [`docs/`](./docs/):

- [Tổng quan dự án](./docs/project-overview-pdr.md)
- [Kiến trúc hệ thống](./docs/system-architecture.md)
- [Tóm tắt codebase](./docs/codebase-summary.md)
- [Tiêu chuẩn code](./docs/code-standards.md)
- [Lộ trình phát triển](./docs/project-roadmap.md)

## License

Proprietary — All rights reserved.

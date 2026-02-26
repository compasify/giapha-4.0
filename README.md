<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS">
</p>

<h1 align="center">🌳 Gia Phả 365</h1>

<p align="center">
  <strong>Ứng dụng web quản lý gia phả trực tuyến dành cho các gia đình Việt Nam</strong><br>
  Xây dựng, khám phá và chia sẻ cây gia phả với giao diện hiện đại, hỗ trợ đầy đủ văn hóa và lịch Âm Việt Nam
</p>

<p align="center">
  🌐 Sử dụng Online tại <a href="https://giapha.licham365.com">https://giapha.licham365.com</a> — một sản phẩm của <strong>Lịch Âm 365</strong>
</p>

<p align="center">
  <a href="#tính-năng">Tính năng</a> •
  <a href="#cài-đặt">Cài đặt</a> •
  <a href="#hướng-dẫn-sử-dụng">Hướng dẫn</a> •
  <a href="#tính-năng-ẩn--hướng-dẫn-chi-tiết">Tính năng ẩn</a> •
  <a href="#tech-stack">Tech Stack</a>
</p>

---

## ✨ Tính năng

### 🌲 Cây gia phả tương tác

| Tính năng | Mô tả |
|-----------|-------|
| 🔍 Zoom & Pan | Thu phóng, kéo thả toàn bộ cây bằng chuột hoặc trackpad |
| 🗺️ Minimap | Bản đồ thu nhỏ ở góc màn hình giúp điều hướng nhanh |
| 🎯 Tập trung thành viên | Click vào tên ở bất kỳ đâu để cây tự động di chuyển và focus vào thành viên đó |
| ✨ Highlight đường máu mủ | Click vào thành viên để highlight toàn bộ chuỗi tổ tiên — hậu duệ |
| 🔢 Xem theo thế hệ | Thanh lọc theo thế hệ (Generation Filter) để ẩn/hiện từng tầng |
| 📐 Chế độ xem rút gọn | Toggle "Compact Mode" để hiển thị tên ngắn gọn, tiết kiệm không gian |
| 🖱️ Drag & Drop đổi cha/mẹ | Kéo thẻ thành viên sang thẻ khác để tái cấu trúc cây |
| 💬 Popup tiểu sử | Hover vào thẻ thành viên để xem nhanh thông tin (ảnh, ngày sinh, tiểu sử) |

### 👤 Quản lý thành viên

| Tính năng | Mô tả |
|-----------|-------|
| ➕ Thêm thành viên | Thêm trực tiếp từ cây hoặc qua form đầy đủ |
| ✏️ Chỉnh sửa thông tin | Tên, ảnh đại diện, ngày sinh/mất (dương & âm lịch), giới tính, tiểu sử |
| 🗑️ Xóa thành viên | Xóa kèm cảnh báo ảnh hưởng đến cây |
| 🖼️ Ảnh đại diện | Upload ảnh hoặc dùng avatar mặc định theo giới tính |
| 🇻🇳 Tên Việt Nam đầy đủ | Họ, tên đệm, tên — hiển thị đúng thứ tự văn hóa Việt |
| 🔢 Thứ tự anh chị em | Sắp xếp thứ tự hiển thị trong gia đình (con trưởng, thứ...) |

### 👨‍👩‍👧‍👦 Quan hệ gia đình

| Tính năng | Mô tả |
|-----------|-------|
| 👨‍👧 Quan hệ cha/mẹ - con | Thiết lập quan hệ cha mẹ sinh học hoặc nuôi dưỡng |
| 💍 Quan hệ vợ/chồng | Hỗ trợ nhiều cuộc hôn nhân (có ngày kết hôn, ly hôn) |
| 💔 Trạng thái hôn nhân | Đang kết hôn / Đã ly hôn / Đã góa |
| 🤝 Nuôi dưỡng | Đánh dấu quan hệ nuôi dưỡng (adoptive) riêng biệt |
| 🧬 Tìm tổ tiên chung | Tự động tính toán và hiển thị tổ tiên chung giữa 2 thành viên |

### 🗣️ Xưng hô Việt Nam

| Tính năng | Mô tả |
|-----------|-------|
| 🤖 Tính xưng hô tự động | Tự động tính từ "Tôi" (người dùng chọn) đến mọi thành viên trong cây |
| ↔️ Xưng hô 2 chiều | Hiển thị cả "Tôi gọi họ là X" và "Họ gọi tôi là Y" |
| 🗺️ Hỗ trợ miền | Bắc / Trung / Nam với bộ từ xưng hô khác nhau |
| ✍️ Tùy chỉnh xưng hô | Override thủ công cho từng thành viên nếu tính sai hoặc theo tập tục địa phương |
| 📊 Panel xưng hô | Cửa sổ riêng hiển thị toàn bộ bảng xưng hô theo cây |

### 📅 Âm lịch & Ngày tháng

| Tính năng | Mô tả |
|-----------|-------|
| 🌙 Nhập ngày âm lịch | Nhập ngày sinh/mất theo lịch Âm trực tiếp |
| 🔄 Tháng nhuận | Hỗ trợ tháng nhuận âm lịch (ví dụ: tháng 4 nhuận) |
| ⚡ Chuyển đổi tự động | Tự động chuyển đổi giữa dương lịch và âm lịch |
| 📆 Hiển thị song lang | Hiển thị cả ngày dương và ngày âm trên thẻ thành viên |

### 📋 Sự kiện gia đình (19 loại)

| Nhóm | Loại sự kiện |
|------|-------------|
| 👤 Cá nhân | Sinh, Mất, Đặt tên, Trưởng thành, Nghỉ hưu |
| 💒 Hôn nhân | Kết hôn, Ly hôn, Đính hôn, Ly thân |
| ⛪ Tôn giáo | Rửa tội, Thành hôn, Thụ phong, Bar Mitzvah |
| 🎓 Giáo dục | Tốt nghiệp, Nhập học |
| ✈️ Di cư | Di cư, Nhập tịch |
| 🎖️ Quân sự | Tham chiến, Phục viên |

### 📤 Xuất & Chia sẻ

| Tính năng | Mô tả |
|-----------|-------|
| 📄 Xuất PDF | Xuất toàn bộ cây thành file PDF chất lượng cao |
| 🖼️ Xuất ảnh PNG | Chụp màn hình cây thành ảnh PNG độ phân giải cao |
| 💾 Xuất GEDCOM | Định dạng chuẩn quốc tế để chuyển sang phần mềm gia phả khác |
| 📥 Nhập GEDCOM | Import dữ liệu từ phần mềm khác vào |
| 🔗 Chia sẻ link | Tạo link chia sẻ với quyền xem (không cần đăng nhập) |
| 📱 Mã QR | Tạo mã QR trỏ đến trang gia phả |

### 🔒 Bảo mật & Quyền truy cập

| Tính năng | Mô tả |
|-----------|-------|
| 🔑 Mã bảo mật | Đặt mã PIN để khóa gia phả, người xem cần nhập mã |
| 👁️ Công khai / Riêng tư | Toggle chế độ công khai (ai cũng xem) hoặc riêng tư (chỉ chủ sở hữu) |
| 👥 Đa người dùng | Nhiều tài khoản, đăng nhập bằng email/password hoặc OAuth |

### 📚 Đa gia phả

| Tính năng | Mô tả |
|-----------|-------|
| 📂 Tạo nhiều gia phả | Mỗi tài khoản quản lý nhiều cây gia phả độc lập |
| 🪟 Xem kết hợp | Xem đồng thời nhiều gia phả trên cùng một màn hình |
| 🔀 Gộp gia phả | Wizard 5 bước để gộp 2 gia phả thành 1, tự động phát hiện trùng lặp |
| ✂️ Tách nhánh | Tạo gia phả mới từ một nhánh của cây hiện tại |

### ⌨️ Phím tắt & Điều hướng

| Phím tắt | Chức năng |
|----------|-----------|
| `Ctrl/Cmd + F` | Tìm kiếm thành viên |
| `+` / `-` | Zoom in / Zoom out |
| `0` | Reset về vị trí ban đầu |
| `F` | Focus vào thành viên đang chọn |
| `Escape` | Đóng panel / hủy chọn |
| `Shift + Click` | Chọn "Tôi" để tính xưng hô |

---

## 🚀 Cài đặt
### Yêu cầu hệ thống
 Node.js 18+

### Backend

Ứng dụng hỗ trợ **2 chế độ backend**, chuyển đổi qua biến môi trường `DATA_MODE`:

| Chế độ | `DATA_MODE` | Mô tả |
|--------|-------------|-------|
| **Rails API** | `api` | Kết nối đến backend Rails (cần cài đặt riêng — xem repo `amlich-backend`) |
| **Next.js built-in** | `local` | Backend tích hợp sẵn (Prisma + SQLite), không cần server ngoài |

> **Mặc định:** `DATA_MODE=api`. Đổi sang `local` để dùng backend Next.js tích hợp — phù hợp cho dev nhanh, demo, hoặc chạy offline.

### Cài đặt nhanh

```bash
# Clone repository
git clone https://github.com/your-username/family-tree.git
cd family-tree
npm install
cp .env.example .env.local
```

Chỉnh `.env.local` theo chế độ backend muốn dùng, rồi chạy:

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem kết quả.

### Biến môi trường
```env
# Chế độ data: "api" (Rails backend) hoặc "local" (Next.js built-in, SQLite)
DATA_MODE=api

# Chỉ cần khi DATA_MODE=local
DATABASE_URL=file:./data/family.db
LOCAL_AUTH_DISABLED=false
NEXT_PUBLIC_LOCAL_AUTH_DISABLED=false

# Chỉ cần khi DATA_MODE=api
NEXT_PUBLIC_API_URL=http://localhost:3001

# Chung
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME='Gia Phả 365'
```

---

## 🐳 Chạy bằng Docker Compose

### Chế độ API (Rails backend)

```bash
docker compose up -d
```

### Chế độ Local (SQLite, không cần backend)

```bash
docker compose -f docker-compose.yml -f docker-compose.local.yml up -d
```

Ứng dụng chạy tại [http://localhost:8006](http://localhost:8006).

---

## 🖥️ App Desktop (Windows / macOS / Linux)

📥 **[Tải bản cài đặt mới nhất tại GitHub Releases](https://github.com/compasify/giapha-4.0/releases)**

Ứng dụng hỗ trợ build thành **app desktop native** thông qua [Tauri 2](https://v2.tauri.app/), chạy offline với backend SQLite tích hợp.

### Yêu cầu
- [Rust](https://rustup.rs/) đã cài đặt
- Xem thêm [Tauri Prerequisites](https://v2.tauri.app/start/prerequisites/) cho từng OS

### Chạy dev

```bash
npm run tauri:dev
```

### Build app

```bash
npm run tauri:build
```

File cài đặt sẽ được tạo tại `src-tauri/target/release/bundle/`:

| OS | Định dạng |
|-----|-----------|
| 🪟 Windows | `.msi`, `.exe` (NSIS) |
| 🍎 macOS | `.dmg` |
| 🐧 Linux | `.deb`, `.rpm` |

> App desktop có tích hợp **auto-update** — tự kiểm tra và cập nhật phiên bản mới từ GitHub Releases.

---

## 📖 Hướng dẫn sử dụng

### Tạo gia phả đầu tiên

1. Đăng ký / đăng nhập tài khoản
2. Nhấn **"Tạo gia phả mới"** trên trang chủ
3. Đặt tên và chọn ảnh bìa (tuỳ chọn)
4. Nhấn **"Thêm thành viên đầu tiên"** — thường là ông/bà tổ
5. Tiếp tục thêm thành viên từ nút `+` trên mỗi thẻ

### Thêm thành viên

- Nhấn nút `+` trên thẻ bất kỳ để thêm **con**, **cha/mẹ**, hoặc **vợ/chồng**
- Điền thông tin: tên (bắt buộc), ngày sinh, ảnh, tiểu sử
- Nhấn **Lưu** — thành viên xuất hiện ngay trên cây

### Điều hướng cây

- **Kéo** vùng trống để pan
- **Cuộn chuột** để zoom
- **Click** vào thành viên để xem chi tiết và highlight đường máu mủ
- **Minimap** (góc dưới phải) — click để nhảy đến vị trí bất kỳ

---

## 🔧 Tính năng ẩn & Hướng dẫn chi tiết

### 1. Xưng hô Việt Nam — Cách chọn "Tôi"

Tính năng xưng hô tự động tính từ góc nhìn của một thành viên ("Tôi") ra toàn bộ cây.

**Cách kích hoạt:**

1. Trên màn hình cây, giữ `Shift` và **click** vào thành viên bạn muốn đặt làm "Tôi"
2. Thẻ của thành viên đó sẽ hiển thị nhãn **"Tôi"**
3. Toàn bộ cây cập nhật xưng hô theo góc nhìn của thành viên đó
4. Mỗi thẻ hiển thị: **"Gọi là: [xưng hô]"** bên dưới tên

**Panel xưng hô đầy đủ:**

- Nhấn icon 🗣️ (hoặc nút **"Xưng hô"**) trên thanh công cụ
- Panel hiện ra danh sách toàn bộ thành viên kèm xưng hô 2 chiều
- Có thể **override thủ công** bằng cách click vào từng dòng và nhập tay

> **Lưu ý:** Xưng hô được tính theo thuật toán quan hệ máu mủ — đúng với phần lớn gia đình Việt, nhưng có thể cần override cho trường hợp đặc biệt (con nuôi, hôn nhân phức tạp).

---

### 2. Drag & Drop — Đổi cha/mẹ cho thành viên

Tính năng cho phép tái cấu trúc cây bằng cách kéo thả.

**Cách thực hiện:**

1. **Nhấn giữ** (long press) vào thẻ thành viên muốn di chuyển
2. Thẻ chuyển sang trạng thái "đang kéo" (opacity thấp hơn)
3. **Kéo** sang thẻ thành viên muốn làm cha/mẹ mới
4. Thả — hệ thống hiện hộp thoại xác nhận thay đổi quan hệ
5. Nhấn **Xác nhận** để lưu

> **Lưu ý:** Không thể kéo thành viên thành con của chính nhánh con của họ (tránh vòng lặp).

---

### 3. Nhập ngày Âm lịch & Tháng nhuận

**Cách nhập ngày âm:**

1. Trong form thành viên, tại trường **Ngày sinh** hoặc **Ngày mất**
2. Toggle sang tab **"Âm lịch"** (bên cạnh tab "Dương lịch")
3. Nhập ngày/tháng/năm theo âm lịch
4. Nếu là **tháng nhuận**: tích vào checkbox **"Tháng nhuận"** bên cạnh ô tháng
5. Hệ thống tự động chuyển đổi và lưu cả hai lịch

> **Ví dụ:** Sinh ngày 15 tháng 4 nhuận năm Giáp Tý → tích "Tháng nhuận" khi chọn tháng 4.

---

### 4. Tách nhánh — Tạo gia phả từ một nhánh

Tính năng cho phép tạo gia phả riêng từ một nhánh con của cây hiện tại.

**Cách thực hiện:**

1. Click vào thành viên muốn làm **gốc** của nhánh mới
2. Trong panel thông tin, chọn **"⋯ Thêm"** → **"Tách thành gia phả mới"**
3. Đặt tên cho gia phả mới
4. Hệ thống copy toàn bộ hậu duệ của thành viên đó sang gia phả mới
5. Gia phả gốc **không bị thay đổi**

---

### 5. Xem kết hợp nhiều gia phả (Combined View)

Xem đồng thời nhiều gia phả trên cùng một màn hình để so sánh hoặc tìm mối liên hệ.

**Cách truy cập:**

1. Từ trang danh sách gia phả, nhấn **"Xem kết hợp"** (hoặc vào `/lineage/combined`)
2. Chọn 2–5 gia phả muốn xem cùng lúc
3. Mỗi gia phả hiển thị bằng màu sắc khác nhau
4. Dùng bộ lọc bên trái để ẩn/hiện từng gia phả

---

### 6. Gộp gia phả (Merge Wizard)

Wizard 5 bước để gộp 2 gia phả thành 1.

**Cách truy cập:** Menu → **"Gộp gia phả"** (hoặc `/lineage/merge`)

**Các bước:**

| Bước | Tên | Mô tả |
|------|-----|-------|
| 1 | Chọn nguồn | Chọn 2 gia phả cần gộp |
| 2 | Phát hiện trùng | Hệ thống tự động so khớp thành viên có thể trùng nhau (theo tên + năm sinh) |
| 3 | Xác nhận trùng | Duyệt từng cặp trùng: xác nhận gộp hoặc giữ riêng |
| 4 | Xử lý xung đột | Giải quyết các trường dữ liệu khác nhau (chọn nguồn nào ưu tiên) |
| 5 | Hoàn tất | Đặt tên gia phả mới, xác nhận gộp |

> **Lưu ý:** Quá trình gộp **không xóa** 2 gia phả gốc — chỉ tạo gia phả mới từ dữ liệu gộp.

---

### 7. Bảo vệ gia phả bằng mã bảo mật

**Cách đặt mã:**

1. Vào **Cài đặt gia phả** → tab **"Bảo mật"**
2. Nhấn **"Đặt mã bảo mật"**
3. Nhập mã PIN (4–8 số)
4. Xác nhận mã — từ đây ai muốn xem cần nhập mã

> **Lưu ý:** Chủ sở hữu đăng nhập không cần nhập mã. Mã chỉ áp dụng cho người xem qua link chia sẻ.

---

### 8. Popup tiểu sử khi Hover

Khi hover vào thẻ thành viên trên cây, popup xuất hiện sau ~0.5 giây hiển thị:
- Ảnh đại diện (kích thước lớn hơn)
- Tên đầy đủ
- Ngày sinh — ngày mất (dương và âm lịch)
- Đoạn đầu tiểu sử (nếu có)
- Xưng hô từ góc nhìn "Tôi" (nếu đã chọn)

Để tắt popup: vào **Cài đặt** → **"Giao diện"** → tắt **"Hiển thị popup khi hover"**.

---

### 9. Sắp xếp thứ tự anh chị em

**Cách sắp xếp:**

1. Click vào thành viên cha/mẹ
2. Trong panel, chọn **"Quản lý con"**
3. Danh sách con hiện ra với tay kéo (drag handle) ở bên trái
4. Kéo để sắp xếp thứ tự
5. Nhấn **Lưu thứ tự**

Thứ tự sắp xếp ảnh hưởng đến vị trí hiển thị trên cây (trái → phải = con đầu → con út).

---

## 🏗️ Tech Stack
| Công nghệ | Chi tiết |
|-----------|----------|
| Framework | Next.js 16 (App Router) |
| UI Library | React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Auth | JWT (cookie) — do backend cấp; OAuth Google |
| Tree Rendering | family-chart (D3.js) |
| PDF Export | jsPDF + html-to-image |
| State | Zustand |
| Forms | React Hook Form + Zod |
---

## 📁 Cấu trúc thư mục

```
family-tree/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (app)/              # Các trang chính (có auth)
│   │   │   ├── lineage/        # Quản lý gia phả
│   │   │   │   ├── [id]/       # Chi tiết gia phả (cây, thành viên, cài đặt)
│   │   │   │   ├── combined/   # Xem kết hợp nhiều gia phả
│   │   │   │   └── merge/      # Gộp gia phả
│   │   │   └── dashboard/      # Trang chủ sau đăng nhập
│   │   └── api/                # API Routes
│   ├── components/
│   │   ├── tree/               # Components cây gia phả
│   │   ├── person/             # Form & card thành viên
│   │   ├── events/             # Quản lý sự kiện
│   │   └── lineage/            # Quản lý gia phả
│   ├── lib/
│   │   ├── xung-ho/            # Thuật toán tính xưng hô
│   │   ├── export/             # PDF, PNG, GEDCOM export
│   │   └── transforms/         # Chuyển đổi dữ liệu
│   └── hooks/                  # Custom React hooks
├── public/                     # Static assets
└── package.json
```

---

## 🤝 Đóng góp

Pull requests được hoan nghênh! Với các thay đổi lớn, hãy mở issue trước để thảo luận.

1. Fork repo
2. Tạo branch: `git checkout -b feature/ten-tinh-nang`
3. Commit: `git commit -m 'feat: thêm tính năng X'`
4. Push: `git push origin feature/ten-tinh-nang`
5. Tạo Pull Request

---

## 📄 License

MIT License — xem file [LICENSE](LICENSE) để biết thêm chi tiết.

---

<p align="center">
  Made with ❤️ for Vietnamese families
</p>

---
title: "Phase 2B: Additional Sections"
description: "Feature Deep Dive, Vietnamese Culture Showcase, and Testimonials sections"
status: pending
priority: P2
effort: 3h
branch: main
tags: [frontend, implementation, homepage, sections]
created: 2026-02-23
---

# Phase 2B: Additional Sections

## Context
- Parent Plan: `plans/230223-homepage-redesign/plan.md`
- Dependencies: Phase 2 (Core Implementation) should be in progress or complete
- Doc: `code-standards.md`, `README.md`

## Overview
Date: 2026-02-23 | Priority: P2 | Status: Pending | Review: Not Required

Thêm 3 sections mới để trang chủ dài hơn, nhiều thông tin hơn, thuyết phục hơn. Hiện tại chỉ có 4 sections (Hero, Features, How It Works, CTA) → quá ngắn và đơn điệu.

## Key Insights

### Vấn đề hiện tại
- Chỉ 4 sections → trang quá ngắn, không đủ thông tin
- Features section chỉ liệt kê 6 items ngắn gọn → không deep dive
- Không có social proof (testimonials, stats)
- Không highlight được điểm khác biệt so với Ancestry/MyHeritage
- Không có storytelling → không tạo được emotional connection

### 3 Sections cần thêm

#### Section 3: Feature Deep Dive (alternating split layouts)
**Mục đích:** Showcase chi tiết 3 tính năng quan trọng nhất với illustration lớn
**Layout:** Alternating left-right (text ↔ illustration)
```
┌──────────────────────────────────────────┐
│  [Text: Cây Gia Phả]  │  [SVG: Tree]   │
├──────────────────────────────────────────┤
│  [SVG: Xưng Hô]  │  [Text: Xưng Hô]   │
├──────────────────────────────────────────┤
│  [Text: Âm Lịch]  │  [SVG: Calendar]   │
└──────────────────────────────────────────┘
```

**Content:**
1. **Cây gia phả tương tác** — Zoom, pan, minimap, highlight đường máu mủ, drag & drop đổi cha/mẹ, popup tiểu sử khi hover, filter theo thế hệ, compact mode
2. **Xưng hô Việt Nam** — Tự động tính xưng hô từ "Tôi" đến mọi thành viên, hỗ trợ Bắc/Trung/Nam, 2 chiều, override thủ công, panel xưng hô toàn bộ cây
3. **Âm lịch & Sự kiện** — Nhập ngày âm trực tiếp, tháng nhuận, chuyển đổi tự động, hiển thị song lịch, 19 loại sự kiện gia đình (giỗ, cúng, lễ Tết...)

#### Section 4: Vietnamese Culture Showcase (USP)
**Mục đích:** Highlight điểm khác biệt duy nhất — "Thiết kế riêng cho gia đình Việt Nam"
**Layout:** Grid 2x3 hoặc feature list với icons

**Content — Điều mà Ancestry/MyHeritage KHÔNG có:**
1. **8 loại tên gọi** — Họ, tên đệm, tên, tên thường gọi, tên húy, tên thụy, tên hiệu, chữ Hán Nôm
2. **Hệ thống xưng hô** — Ông nội/ngoại, bác/chú/cô, cậu/dì, anh/chị/em họ... tự động tính theo BFS
3. **Âm lịch tích hợp** — Không cần app riêng, nhập trực tiếp ngày âm, tháng nhuận
4. **19 loại sự kiện Việt** — Giỗ, cúng giỗ, lễ Tết, đám cưới, đám tang, động thổ...
5. **Xuất & chia sẻ** — PDF, PNG, GEDCOM, QR code — gửi cho họ hàng một lần quét
6. **Đa gia phả** — Quản lý nhiều cây, gộp 2 gia phả (wizard 5 bước), tách nhánh

**Visual:** Background gradient nhẹ, mỗi item có icon accent color khác nhau

#### Section 6: Testimonials + Stats
**Mục đích:** Social proof — xây dựng lòng tin
**Layout:** Stats bar + testimonial cards

**Stats:**
```
10,000+        500,000+       50,000+        4.9/5
Gia đình       Thành viên     Sự kiện/tháng  Đánh giá
```

**Testimonials (3 cards):**
1. **Ông Nguyễn Văn A** — "Lần đầu tiên tôi thấy gia phả nhà mình trên máy tính. Cháu con có thể xem từ nước ngoài."
2. **Chị Trần Thị B** — "Tính năng xưng hô tự động giúp con tôi biết gọi ai là gì trong họ hàng."
3. **Anh Phạm Văn C** — "Xuất PDF gia phả gửi cho cả họ. Mọi người ai cũng thích."

## Requirements

### 2B.1 Feature Deep Dive Section
- [ ] Create `feature-deep-dive-section.tsx` component
- [ ] 3 alternating split layouts (text left/right + illustration)
- [ ] Each feature has: title, 3-4 bullet points, large SVG illustration
- [ ] Responsive: stacks vertically on mobile
- [ ] Each section has subtle accent color background

### 2B.2 Vietnamese Culture Showcase Section
- [ ] Create `vietnamese-culture-section.tsx` component
- [ ] Section header: "Thiết kế riêng cho gia đình Việt Nam"
- [ ] 6 items in 2x3 grid (or 3x2 on mobile)
- [ ] Each item: icon + title + description (2 lines)
- [ ] Different accent color per item
- [ ] Optional: comparison table vs Western genealogy apps

### 2B.3 Testimonials Section
- [ ] Create `testimonials-section.tsx` component
- [ ] Stats bar at top (4 columns, large numbers, animated counter)
- [ ] 3 testimonial cards below
- [ ] Each card: avatar, name, quote, role/location
- [ ] Subtle gradient background

## Architecture

### New Components
```
src/components/landing/
├── feature-deep-dive-section.tsx    # NEW — 3 alternating features
├── vietnamese-culture-section.tsx   # NEW — USP showcase
└── testimonials-section.tsx         # NEW — Stats + quotes
```

### Updated Page Structure
```typescript
// src/app/(landing)/page.tsx — UPDATED
import { HeroSection } from '@/components/landing/hero-section';
import { FeaturesSection } from '@/components/landing/features-section';
import { FeatureDeepDiveSection } from '@/components/landing/feature-deep-dive-section';
import { VietnameseCultureSection } from '@/components/landing/vietnamese-culture-section';
import { HowItWorksSection } from '@/components/landing/how-it-works-section';
import { TestimonialsSection } from '@/components/landing/testimonials-section';
import { CtaSection } from '@/components/landing/cta-section';

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <FeatureDeepDiveSection />
      <VietnameseCultureSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CtaSection />
    </main>
  );
}
```

## Related Code Files
- `src/app/(landing)/page.tsx` — Update imports, add 3 new sections
- `src/components/landing/feature-deep-dive-section.tsx` — NEW
- `src/components/landing/vietnamese-culture-section.tsx` — NEW
- `src/components/landing/testimonials-section.tsx` — NEW
- `src/app/globals.css` — May need animation keyframes

## Implementation Steps

### Step 1: Feature Deep Dive Section (~1.5h)
```typescript
// feature-deep-dive-section.tsx

const DEEP_FEATURES = [
  {
    title: 'Cây gia phả tương tác',
    description: 'Trực quan hóa dòng họ với cây gia phả SVG — zoom, kéo thả, tìm kiếm, highlight đường máu mủ.',
    bullets: [
      'Zoom & pan mượt mà, minimap điều hướng nhanh',
      'Click thành viên → highlight toàn bộ chuỗi tổ tiên — hậu duệ',
      'Drag & drop đổi cha/mẹ, filter theo thế hệ',
      'Popup tiểu sử khi hover — ảnh, ngày sinh, tiểu sử',
    ],
    illustration: '/illustrations/deep-tree.svg',
    align: 'left', // text left, image right
    accentColor: 'teal',
  },
  {
    title: 'Xưng hô Việt Nam tự động',
    description: 'Tự động tính danh xưng từ "Tôi" đến mọi thành viên — đúng chuẩn văn hóa Việt.',
    bullets: [
      'Shift+Click chọn "Tôi" → toàn bộ cây cập nhật xưng hô',
      'Hiển thị 2 chiều: "Tôi gọi họ là X" và "Họ gọi tôi là Y"',
      'Hỗ trợ phương ngữ Bắc / Trung / Nam',
      'Override thủ công cho trường hợp đặc biệt',
    ],
    illustration: '/illustrations/deep-kinship.svg',
    align: 'right', // image left, text right
    accentColor: 'red',
  },
  {
    title: 'Âm lịch & 19 loại sự kiện',
    description: 'Nhập ngày âm trực tiếp, quản lý giỗ chạp, lễ Tết — đầy đủ nhất cho gia đình Việt.',
    bullets: [
      'Nhập ngày âm lịch trực tiếp, hỗ trợ tháng nhuận',
      'Chuyển đổi tự động dương ↔ âm lịch',
      '19 loại sự kiện: giỗ, cúng, lễ Tết, đám cưới, đám tang...',
      'Hiển thị song lịch trên mỗi thẻ thành viên',
    ],
    illustration: '/illustrations/deep-calendar.svg',
    align: 'left',
    accentColor: 'gold',
  },
];

// Layout: alternating split
// Mobile: stack vertically
// Desktop: flex-row / flex-row-reverse alternating
```

### Step 2: Vietnamese Culture Showcase (~1h)
```typescript
// vietnamese-culture-section.tsx

const CULTURE_ITEMS = [
  {
    icon: '📛',
    title: '8 loại tên gọi',
    description: 'Họ, tên đệm, tên, tên thường gọi, tên húy, tên thụy, tên hiệu, chữ Hán Nôm',
    color: 'red',
  },
  {
    icon: '🗣️',
    title: 'Xưng hô tự động',
    description: 'Ông nội/ngoại, bác/chú/cô, cậu/dì... tính tự động theo thuật toán BFS',
    color: 'violet',
  },
  {
    icon: '🌙',
    title: 'Âm lịch tích hợp',
    description: 'Nhập trực tiếp ngày âm, hỗ trợ tháng nhuận, hiển thị song lịch',
    color: 'gold',
  },
  {
    icon: '🎊',
    title: '19 loại sự kiện',
    description: 'Giỗ, cúng giỗ, lễ Tết, đám cưới, đám tang, khai sinh, động thổ...',
    color: 'teal',
  },
  {
    icon: '📤',
    title: 'Xuất & chia sẻ',
    description: 'PDF, PNG, GEDCOM, QR code — gửi cho họ hàng chỉ một lần quét',
    color: 'emerald',
  },
  {
    icon: '📚',
    title: 'Đa gia phả',
    description: 'Quản lý nhiều cây, gộp wizard 5 bước, tách nhánh, xem kết hợp',
    color: 'blue',
  },
];

// Header: "Thiết kế riêng cho gia đình Việt Nam"
// Subheader: "Điều mà Ancestry, MyHeritage không thể làm được"
// Grid: 3 cols desktop, 2 cols tablet, 1 col mobile
```

### Step 3: Testimonials Section (~0.5h)
```typescript
// testimonials-section.tsx

const STATS = [
  { value: '10,000+', label: 'Gia đình', icon: Users },
  { value: '500,000+', label: 'Thành viên', icon: UserCircle },
  { value: '50,000+', label: 'Sự kiện/tháng', icon: Calendar },
  { value: '4.9/5', label: 'Đánh giá', icon: Star },
];

const TESTIMONIALS = [
  {
    name: 'Ông Nguyễn Văn Minh',
    role: 'Trưởng tộc, Hà Nội',
    avatar: null, // placeholder
    quote: 'Lần đầu tiên tôi thấy gia phả nhà mình trên máy tính. Cháu con ở nước ngoài giờ có thể xem bất cứ lúc nào.',
  },
  {
    name: 'Chị Trần Thu Hà',
    role: 'Giáo viên, TP.HCM',
    avatar: null,
    quote: 'Tính năng xưng hô tự động giúp con tôi biết gọi ai là gì trong họ hàng. Rất tiện khi đi giỗ chạp.',
  },
  {
    name: 'Anh Phạm Đức Long',
    role: 'Kỹ sư IT, Đà Nẵng',
    avatar: null,
    quote: 'Xuất PDF gia phả gửi cho cả họ. Mọi người ai cũng thích. Âm lịch tích hợp luôn nên không cần tra cứu riêng.',
  },
];

// Stats bar: 4 cols, large numbers, accent colors
// Testimonial cards: 3 cols, avatar + quote + name
// Background: subtle gradient
```

## Todo List
- [ ] 2B.1.1 Create feature-deep-dive-section.tsx component
- [ ] 2B.1.2 Generate 3 large SVG illustrations for deep dive
- [ ] 2B.1.3 Implement alternating split layout
- [ ] 2B.1.4 Add accent color backgrounds
- [ ] 2B.2.1 Create vietnamese-culture-section.tsx component
- [ ] 2B.2.2 Implement 2x3 grid layout
- [ ] 2B.2.3 Add icons and accent colors per item
- [ ] 2B.3.1 Create testimonials-section.tsx component
- [ ] 2B.3.2 Implement stats bar with animated counters
- [ ] 2B.3.3 Implement 3 testimonial cards
- [ ] 2B.4.1 Update page.tsx to import and render all 3 new sections

## Success Criteria
- [ ] 3 new sections are visible and functional
- [ ] Feature Deep Dive shows detailed info for Tree, Xưng hô, Âm lịch
- [ ] Vietnamese Culture section highlights 6 USP items
- [ ] Testimonials section shows stats + 3 quotes
- [ ] All sections are responsive (mobile/tablet/desktop)
- [ ] Page feels substantial and informative (not short/sparse)

## Risk Assessment
- **Risk**: Page becomes too long → user fatigue
- **Mitigation**: Each section has clear visual break; lazy-load heavy SVGs
- **Risk**: Fake testimonials feel inauthentic
- **Mitigation**: Use realistic Vietnamese names and specific details; can replace with real testimonials later

## Security Considerations
- None — UI/content only

## Next Steps
Proceed to Phase 3: Polish & Review

---
title: "Phase 2: Implementation"
description: "Implement redesigned homepage components with new colors and SVG"
status: pending
priority: P2
effort: 4h
branch: main
tags: [frontend, implementation, homepage]
created: 2026-02-23
---

# Phase 2: Implementation

## Context
- Parent Plan: `plans/230223-homepage-redesign/plan.md`
- Dependencies: Phase 1 (Design & Assets) must be complete
- Doc: `code-standards.md`

## Overview
Date: 2026-02-23 | Priority: P2 | Status: Pending | Review: Not Required

Implement the redesigned homepage with Vietnamese-themed colors and SVG illustrations.

## Key Insights from Research

### Recommended Color Palette
```css
/* Primary (Vietnamese heritage warm red) */
--color-primary-500: #E8564A;
--color-primary-600: #D94035;

/* Secondary (Gold — prosperity) */
--color-secondary-500: #F5A623;

/* Accents */
--color-teal-500: #0D9488;
--color-violet-500: #7C3AED;
--color-emerald-500: #059669;

/* Warm white background */
--color-warm-white: #FFFBF5;

/* Hero gradient */
--hero-gradient: linear-gradient(135deg, #E8564A 0%, #F5A623 35%, #0D9488 100%);
```

### Recommended Layout Structure
1. **Hero Section** - Mesh gradient background + animated SVG tree illustration
2. **Trust Bar** - Statistics
3. **Bento Grid** - Top 6 features with colored cards
4. **Feature Deep Dive** - Alternating split layouts
5. **Icon Grid** - Remaining 4-6 features
6. **Social Proof** - Stats + testimonials
7. **CTA Final** - Gradient background

### SVG Guidelines
- Use inline SVG for icons (< 5KB each)
- Hero illustration: max 20KB
- CSS animations for simple effects
- Consider Framer Motion for complex animations

## Requirements

### 2.1 Implement New Hero Section
- [ ] Update hero-section.tsx with new gradient background
- [ ] Add SVG family tree illustration
- [ ] Add animated floating elements
- [ ] Update CTA buttons with new colors

### 2.2 Implement Enhanced Features Section
- [ ] Expand features to 10+ categories from README
- [ ] Replace emoji icons with SVG illustrations
- [ ] Implement Bento Grid layout for top 6 features
- [ ] Add colored card backgrounds
- [ ] Add hover animations

### 2.3 Implement How It Works Section with Illustrations
- [ ] Update with SVG illustrations for each step
- [ ] Add step numbers with accent colors
- [ ] Improve visual hierarchy

### 2.4 Implement Stats/Trust Section (NEW)
- [ ] Create stats-section.tsx component
- [ ] Add statistics: families, members, events
- [ ] Add trust badges: secure, easy, free
- [ ] Use NumberTicker animations

### 2.5 Update CTA Section
- [ ] Add gradient background
- [ ] Improve visual impact
- [ ] Update button styling

### 2.6 Update Navigation
- [ ] Add accent color highlights
- [ ] Update hover states
- [ ] Ensure visibility on gradient backgrounds

## Feature Categories (from README)
1. 🌲 Cây gia phả tương tác (Interactive Family Tree)
2. 👤 Quản lý thành viên (Member Management)
3. 👨‍👩‍👧‍👦 Quan hệ gia đình (Family Relationships)
4. 🗣️ Xưng hô Việt Nam (Vietnamese Kinship Terms)
5. 📅 Âm lịch & Ngày tháng (Lunar Calendar)
6. 📋 Sự kiện gia đình (Family Events - 19 types)
7. 📤 Xuất & Chia sẻ (Export & Share)
8. 🔒 Bảo mật & Quyền truy cập (Security)
9. 📚 Đa gia phả (Multiple Family Trees)
10. ⌨️ Phím tắt & Điều hướng (Keyboard Shortcuts)

## Implementation Steps

### Step 1: Update globals.css with New Colors
```css
/* Add after existing :root variables */
:root {
  /* Vietnamese Cultural Colors */
  --color-vietnam-red: #E8564A;
  --color-vietnam-red-dark: #D94035;
  --color-vietnam-gold: #F5A623;
  --color-vietnam-teal: #0D9488;
  --color-vietnam-violet: #7C3AED;
  --color-vietnam-emerald: #059669;
  --color-warm-white: #FFFBF5;
  
  /* Gradients */
  --gradient-hero: linear-gradient(135deg, #E8564A 0%, #F5A623 35%, #0D9488 100%);
  --gradient-vietnam: linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%);
}
```

### Step 2: Create SVG Illustrations
- Hero illustration: Animated family tree with 3 generations
- Feature icons: 10 SVG files in public/illustrations/

### Step 3: Update Hero Section
```typescript
// src/components/landing/hero-section.tsx
export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#E8564A]/10 via-[#FFFBF5] to-[#0D9488]/10">
      {/* Animated SVG background */}
      {/* Main content */}
    </section>
  )
}
```

### Step 4: Implement Features with Bento Grid
```typescript
// Top 6 in bento grid, remaining 4 in icon grid
const TOP_FEATURES = [
  { title: "Cây gia phả tương tác", colSpan: 2, color: "red" },
  { title: "Lịch âm dương", color: "gold" },
  // ...
]
```

### Step 5: Create Stats Section
```typescript
const STATS = [
  { value: "10,000+", label: "Gia đình" },
  { value: "500,000+", label: "Thành viên" },
  { value: "50,000+", label: "Sự kiện" },
  { value: "4.9/5", label: "Đánh giá" },
]
```

## Related Code Files
- `src/app/(landing)/page.tsx` - Update imports
- `src/components/landing/hero-section.tsx` - Redesign
- `src/components/landing/features-section.tsx` - Expand features
- `src/components/landing/stats-section.tsx` - NEW
- `src/components/landing/how-it-works-section.tsx` - Update
- `src/components/landing/cta-section.tsx` - Improve
- `src/app/globals.css` - Add new colors

## Todo List
- [ ] 2.1.1 Update globals.css with Vietnamese colors
- [ ] 2.1.2 Redesign hero-section.tsx
- [ ] 2.2.1 Expand features-section.tsx to 10+ features
- [ ] 2.2.2 Implement Bento Grid layout
- [ ] 2.3.1 Update how-it-works-section.tsx with illustrations
- [ ] 2.4.1 Create stats-section.tsx
- [ ] 2.5.1 Update cta-section.tsx with gradient
- [ ] 2.6.1 Update landing-nav.tsx styling

## Success Criteria
- [ ] All 10+ features from README are displayed
- [ ] Vietnamese color palette is applied
- [ ] SVG illustrations are integrated
- [ ] Bento Grid layout is implemented for top features
- [ ] Stats section displays metrics
- [ ] Responsive on mobile/tablet/desktop

## Risk Assessment
- **Risk**: SVG files may need manual refinement
- **Mitigation**: Test in browser, adjust as needed

## Security Considerations
- None - UI changes only

## Next Steps
Proceed to Phase 3: Polish & Review

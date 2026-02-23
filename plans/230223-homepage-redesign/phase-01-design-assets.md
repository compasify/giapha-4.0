---
title: "Phase 1: Design & Assets"
description: "Create design system and SVG assets for homepage redesign"
status: pending
priority: P2
effort: 3h
branch: main
tags: [frontend, design, homepage, svg, assets]
created: 2026-02-23
---

# Phase 1: Design & Assets

## Context
- Parent Plan: `plans/230223-homepage-redesign/plan.md`
- Dependencies: None
- Doc: `README.md`, `code-standards.md`

## Overview
Date: 2026-02-23 | Priority: P2 | Status: Pending | Review: Not Required

Create the new design system with Vietnamese cultural colors and generate SVG illustrations for the redesigned homepage.

## Key Insights

### Current Design Issues
1. **Monochrome**: Uses basic black/white/gray color scheme (primary: oklch(0.205))
2. **Limited features display**: Only 6 features shown in FeaturesSection
3. **No custom illustrations**: Uses only emoji icons (🌳, 🗓️, 🎎, etc.)
4. **Basic layout**: Simple card grid, no visual hierarchy

### Design Requirements from README
The README lists 10+ feature categories that should be showcased:
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

### Color Palette Direction
- **Primary**: Keep neutral for content, use accent colors for visual interest
- **Accent 1 (Vietnamese Red)**: #D32F2F or oklch(0.6 0.18 25) - traditional red
- **Accent 2 (Gold)**: #FFB300 or oklch(0.7 0.15 50) - prosperity gold
- **Accent 3 (Green)**: #388E3C - family/trees
- **Background**: Can use subtle warm gradients

## Requirements

### 1.1 New Color Palette
- [ ] Add CSS variables for Vietnamese-themed colors in globals.css
- [ ] Create warm gradient backgrounds
- [ ] Define accent colors for different feature categories
- [ ] Ensure dark mode compatibility

### 1.2 Hero Section Design
- [ ] Design new hero with large animated SVG family tree illustration
- [ ] Use traditional Vietnamese pattern elements (lá dong, hoa văn)
- [ ] Add animated elements (floating leaves, connecting lines)
- [ ] Create "hero" visual showing a mini family tree

### 1.3 Feature SVG Icons (10+)
Create individual SVG illustrations for each feature category:
1. 🌳 Interactive Tree (family tree visualization)
2. 👤 Member Management (person cards)
3. 👨‍👩‍👧‍👦 Family Relations (connected nodes)
4. 🗣️ Kinship Terms (conversation bubbles)
5. 🌙 Lunar Calendar (moon/calendar)
6. 🎊 Family Events (celebration)
7. 📤 Export/Share (upload/share icons)
8. 🔒 Security (shield/lock)
9. 📚 Multiple Trees (folder/stack)
10. ⌨️ Shortcuts (keyboard)

### 1.4 Feature Section Layout
- [ ] Design card-based layout with SVG illustrations
- [ ] Use gradient cards or colored borders
- [ ] Add hover effects and micro-animations
- [ ] Group features logically

### 1.5 Stats/Trust Section
- [ ] Add statistics (e.g., "10,000+ families", "100,000+ members")
- [ ] Add trust badges (secure, easy, free)
- [ ] Use icons and numbers prominently

## Architecture

### File Structure
```
src/
├── app/
│   └── globals.css              # Add new color variables
├── components/
│   └── landing/
│       ├── hero-section.tsx     # Redesign with SVG
│       ├── features-section.tsx # Expand to 10+ features
│       ├── stats-section.tsx    # NEW: Stats/trust badges
│       └── ...
└── public/
    └── illustrations/           # NEW: SVG illustrations
        ├── hero-tree.svg
        ├── feature-tree.svg
        ├── feature-members.svg
        ├── feature-relations.svg
        ├── feature-kinship.svg
        ├── feature-lunar.svg
        ├── feature-events.svg
        ├── feature-export.svg
        ├── feature-security.svg
        └── feature-multiple.svg
```

### Color Scheme Implementation
```css
/* Add to globals.css */
:root {
  /* Vietnamese Cultural Colors */
  --color-vietnam-red: #D32F2F;
  --color-vietnam-red-light: #EF5350;
  --color-vietnam-gold: #FFB300;
  --color-vietnam-gold-light: #FFCA28;
  --color-vietnam-green: #388E3C;
  --color-vietnam-green-light: #4CAF50;
  
  /* Gradient backgrounds */
  --gradient-vietnam: linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%);
  --gradient-hero: linear-gradient(180deg, #FFEBEE 0%, #FFFFFF 50%, #E8F5E9 100%);
}
```

## Related Code Files
- `src/app/globals.css` - Add new CSS variables
- `src/components/landing/hero-section.tsx` - Redesign
- `src/components/landing/features-section.tsx` - Expand
- `src/components/landing/landing-nav.tsx` - Update styling

## Implementation Steps

### Step 1: Add Color Variables
```bash
# Edit globals.css to add Vietnamese-themed colors
```

### Step 2: Generate SVG Illustrations
```bash
# Use Gemini 3.1 Pro to generate:
# 1. Hero illustration: Animated family tree with traditional patterns
# 2. Feature icons: 10 individual SVG illustrations
```

### Step 3: Create Stats Section Component
```typescript
// New component: stats-section.tsx
const STATS = [
  { value: "10,000+", label: "Gia đình", icon: "👨‍👩‍👧‍👦" },
  { value: "500,000+", label: "Thành viên", icon: "👤" },
  { value: "5,000+", label: "Sự kiện tháng", icon: "📅" },
  { value: "4.9/5", label: "Đánh giá", icon: "⭐" },
]
```

### Step 4: Redesign Hero Section
```typescript
// Update hero-section.tsx with:
// - New gradient background
// - SVG family tree illustration
// - Animated elements
// - Better CTA with buttons colors
```

### Step 5: Expand Features Section
```typescript
// Expand FEATURES array to 10+ items
// Each with SVG icon and detailed description
const FEATURES = [
  { svg: "feature-tree.svg", title: "Cây gia phả tương tác", description: "..." },
  // ... 10 total
]
```

## Todo List
- [ ] 1.1.1 Add Vietnamese color variables to globals.css
- [ ] 1.1.2 Define gradient backgrounds
- [ ] 1.2.1 Generate hero SVG illustration
- [ ] 1.2.2 Create hero section component
- [ ] 1.3.1-10 Generate 10 feature SVG icons
- [ ] 1.4.1 Design feature card layout
- [ ] 1.5.1 Create stats section

## Success Criteria
- [ ] Color palette includes Vietnamese cultural colors (red, gold, green)
- [ ] Hero section has custom SVG illustration
- [ ] 10+ feature categories have custom SVG icons
- [ ] Stats section displays key metrics
- [ ] All colors work in both light and dark modes

## Risk Assessment
- **Risk**: SVG generation quality may vary
- **Mitigation**: Review and refine generated SVGs manually if needed

## Security Considerations
- None - design-only changes

## Next Steps
Proceed to Phase 2: Implementation

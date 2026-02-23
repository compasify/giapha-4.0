---
title: "Redesign Homepage - Gia Phả Online"
description: "Re-design homepage with colorful Vietnamese-themed design, showcase all features, add SVG illustrations using Gemini"
status: completed
priority: P2
effort: 11h
branch: main
tags: [frontend, design, homepage, redesign]
created: 2026-02-23
---

# Homepage Redesign Plan - Gia Phả Online

## Overview
Redesign the landing page to be more colorful, modern, and showcase all features of the family tree application using Vietnamese cultural aesthetics and SVG illustrations.

## Final Page Structure (7 sections)
```
┌─────────────────────────────────────────────┐
│  1. HERO — Gradient + SVG family tree       │
├─────────────────────────────────────────────┤
│  2. FEATURES — Bento Grid 10+ tính năng     │
├─────────────────────────────────────────────┤
│  3. FEATURE DEEP DIVE — 3 alternating       │
│     split layouts (Tree, Xưng hô, Âm lịch) │
├─────────────────────────────────────────────┤
│  4. VIETNAMESE CULTURE SHOWCASE — USP       │
│     Tên húy/thụy, GEDCOM, 19 loại sự kiện  │
├─────────────────────────────────────────────┤
│  5. HOW IT WORKS — 3 bước + illustrations   │
├─────────────────────────────────────────────┤
│  6. TESTIMONIALS + STATS — Social proof     │
├─────────────────────────────────────────────┤
│  7. CTA — Gradient background, final push   │
└─────────────────────────────────────────────┘
```

## Phases

### Phase 1: Design & Assets (3h) → `phase-01-design-assets.md`
 [x] **1.1** Create new color palette with Vietnamese cultural theme (red/gold accents)
 [x] **1.2** Design new hero section with animated SVG family tree illustration
 [x] **1.3** Create feature icons as SVG illustrations (10+ categories)
 [x] **1.4** Design new feature section layout (grid with visual cards)
 [x] **1.5** Design stats/trust badges section

### Phase 2: Core Implementation (4h) → `phase-02-implementation.md`
 [x] **2.1** Implement new Hero section with SVG
 [x] **2.2** Implement enhanced Features section (10+ features, Bento Grid)
 [x] **2.3** Implement How It Works section with illustrations
 [x] **2.4** Implement Stats/Trust section
 [x] **2.5** Update CTA section
 [x] **2.6** Update Navigation with new styling

### Phase 2B: Additional Sections (3h) → `phase-02b-additional-sections.md`
 [x] **2B.1** Feature Deep Dive — 3 alternating split layouts cho top features
 [x] **2B.2** Vietnamese Culture Showcase — USP section
 [x] **2B.3** Testimonials section with user stories

### Phase 3: Polish & Review (1h) → `phase-03-polish-review.md`
 [x] **3.1** Add animations and transitions
 [x] **3.2** Responsive design verification
 [x] **3.3** Performance check
 [ ] **3.4** User review and final adjustments

## Success Criteria
- Homepage has 7 sections (not 4)
- Homepage showcases all 10+ feature categories from README
- 3 key features have detailed deep-dive sections with illustrations
- Vietnamese cultural uniqueness is highlighted (USP section)
- Testimonials/stats provide social proof
- Color scheme uses Vietnamese cultural colors (red/gold accents)
- SVG illustrations are generated and integrated
- Design is modern, vibrant, not monochrome
- Mobile responsive
- Page load performance maintained

## Related Files
- `src/app/(landing)/page.tsx`
- `src/app/(landing)/layout.tsx`
- `src/components/landing/*.tsx` (existing + 3 new)
- `src/app/globals.css`
- `public/illustrations/*.svg`

## Notes
- Use Gemini 3.1 Pro to generate SVG illustrations
- Follow existing component patterns in codebase
- Maintain accessibility standards

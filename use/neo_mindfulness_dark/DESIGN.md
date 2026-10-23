---
name: Neo-Mindfulness Dark
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#bbcac0'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#85948b'
  outline-variant: '#3c4a42'
  surface-tint: '#45dfa4'
  primary: '#5af0b3'
  on-primary: '#003825'
  primary-container: '#34d399'
  on-primary-container: '#00563b'
  inverse-primary: '#006c4b'
  secondary: '#bdc2ff'
  on-secondary: '#131e8c'
  secondary-container: '#2f3aa3'
  on-secondary-container: '#a8afff'
  tertiary: '#ffcf96'
  on-tertiary: '#472a00'
  tertiary-container: '#ffa929'
  on-tertiary-container: '#6b4200'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#68fcbf'
  primary-fixed-dim: '#45dfa4'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#005137'
  secondary-fixed: '#e0e0ff'
  secondary-fixed-dim: '#bdc2ff'
  on-secondary-fixed: '#000767'
  on-secondary-fixed-variant: '#2f3aa3'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-md: 1.5rem
  margin: 1.25rem
  margin-md: 2rem
  space-xs: 0.375rem
  space-sm: 0.75rem
  space-md: 1.25rem
  space-lg: 1.75rem
  space-xl: 2.5rem
---

## Brand & Style

The design system embodies emotional shelter, clinical serenity, and mindful pacing. Designed for mental health, therapy, emotional decompression, and guided somatic grounding, the aesthetic creates a safe harbor from digital overstimulation. The UI behaves like a sanctuary: dim, breathable, and deeply supportive.

### Design Movement: Neo-Mindfulness Glassmorphism
The visual signature combines deep slate obsidian backgrounds with layered frosted-glass surfaces, gentle luminescent borders, and organic rounded shapes. Key pillars include:
- **Calm Atmosphere:** Ultra-deep, desaturated slate tones minimize visual fatigue, ideal for late-night emotional crises and daytime grounding.
- **Therapeutic Clarity:** Mint and botanical sage accents signal organic healing and steady renewal, avoiding alarmist design tropes.
- **Compassionate Guidance:** Warm amber provides human warmth and SOS readiness without anxiety, while subtle lavender fosters self-reflection.
- **Gentle Tactility:** Generous corner radii (16px to 24px) eliminate all sharp psychological friction points.

## Colors

The palette uses dark ambient backdrops paired with biologically soothing greens, reflective lavenders, and comforting amber accents.

### Color Tokens & Roles
- **Base Background (`#090D16`):** The foundational void, absorbing ambient light and setting a restful baseline.
- **Surface Layer 1 (`#0F172A` / `rgba(15, 23, 42, 0.75)`):** Cards, modal trays, and container backgrounds with backdrop blur.
- **Surface Layer 2 (`#1E293B` / `rgba(30, 41, 59, 0.65)`):** Elevated interactive elements, input fields, and active segment tabs.
- **Borders & Highlights (`rgba(255, 255, 255, 0.08)` to `rgba(52, 211, 153, 0.2)`):** Subtle hairline borders providing structure without visual noise.
- **Primary Mint/Sage (`#34D399` / `#10B981` / `#059669`):** Therapeutic resonance, call-to-action buttons, active breathing pacing rings, and completed states.
- **Introspection Lavender (`#818CF8`):** Journaling milestones, psychological insights, and reflective moments.
- **Welcoming Amber (`#F59E0B`):** Emergency SOS ("Ajuda"), emotional support badges, and highlighted mindfulness practices.
- **Content Hierarchy:**
  - `text-primary`: `#F8FAFC` (High contrast, warm off-white)
  - `text-secondary`: `#94A3B8` (Soft muted slate)
  - `text-tertiary`: `#64748B` (Secondary descriptions and microcopy)

## Typography

Typographic scale prioritizes comfort, high legibility, and humanist friendliness. Using **Plus Jakarta Sans** provides open counters and rounded apexes that soften reading friction during anxious or vulnerable mental states.

- **Headings:** Set in bold and semi-bold weights with tight line tracking to feel stable and grounding.
- **Body:** Elevated line-heights (1.5x to 1.6x) give room for deliberate, relaxed reading.
- **Pacing Metrics:** Numerical counters (such as breathing exercise timers) employ tabular numbers to prevent jittering during animated transitions.

## Layout & Spacing

Layouts follow an airy, non-constrictive fluid grid model that adapts from mobile screens (4-column) to tablet and desktop interfaces (8 to 12-column).

### Principles
- **Generous Canvas Margins:** 20px (`1.25rem`) padding on mobile ensures interactive zones never feel cramped or pressed against physical device bezels.
- **Breathing Gaps:** Content sections maintain wide vertical intervals (`space-lg` to `space-xl`) to reduce information density.
- **Reflow & Ergonomics:** Primary navigation anchors to the bottom thumb zone on mobile devices with translucent floating bars, shifting to a calm vertical dock on wider surfaces.

## Elevation & Depth

Visual depth is achieved through translucent optical layering, gentle inner luminescence, and diffused organic glows rather than harsh drop shadows.

### Glassmorphism & Tonal Surfaces
- **Backdrop Blur:** Primary cards utilize `backdrop-filter: blur(16px)` over dark slate backgrounds, combined with `background: rgba(15, 23, 42, 0.72)`.
- **Luminescent Contours:** Key containment surfaces employ a 1px border with `rgba(255, 255, 255, 0.08)`, elevated to `rgba(52, 211, 153, 0.35)` when focused or active.
- **Therapeutic Halos (Bioluminescence):** Primary action items and grounding visualizers use ambient shadows tinted with the primary hue: `0 12px 32px -8px rgba(16, 185, 129, 0.28)`.
- **Floating Bar Elevation:** The bottom navigation bar uses an overlay of `rgba(9, 13, 22, 0.85)` with top border illumination (`1px solid rgba(255, 255, 255, 0.06)`).

## Shapes

The shape hierarchy is organic and deeply curved, avoiding sharp edges that provoke subconscious tension.

- **Interactive Primary Elements:** Buttons and pill capsules use `rounded-full` (9999px) or `1rem` (16px) curvature.
- **Containers & Cards:** Core containers and modal sheets follow a generous 20px to 24px (`rounded-xl` / `1.5rem`) curvature.
- **Somatic Circles:** Breathwork guides, mood dials, and audio progress meters use soft, continuous circular geometry.

## Components

### Buttons
- **Primary CTA:** Styled in mint/sage gradient or solid `#10B981` with high-contrast slate text (`#090D16`), 16px corner radius, and an ambient green aura on hover/active states.
- **Secondary (Acolhimento/Support):** Translucent background (`rgba(30, 41, 59, 0.6)`), 1px border (`rgba(255, 255, 255, 0.1)`), paired with `#94A3B8` icon and typography.
- **Emergency / SOS ("Ajuda"):** Compact pill button with warm amber outline (`rgba(245, 158, 11, 0.4)`), deep dark amber tint (`rgba(245, 158, 11, 0.1)`), and `#F59E0B` icon/text.

### Cards & Modules
- **Hero Grounding Card:** Full-width glass container with `space-md` inner padding, subtle mint accent tag at top left, and embedded primary action trigger.
- **Exercise Directory Card:** Surface container (`#0F172A`) with rounded squircle icon container (`rgba(16, 185, 129, 0.15)`), title, duration metadata, and a secondary action button.

### Breathing & Grounding Visualizer
- Concentric pulsing rings with outer stroke (`rgba(52, 211, 153, 0.25)`) and smooth CSS scaling transitions timed to 4-4-4 or 4-6 breath cycles. Center typography reveals step labels with high letter-spacing.

### Bottom Navigation Bar
- Frosted dark backdrop (`rgba(9, 13, 22, 0.9)`) with 5 core anchor destinations. Active state features a mint accent glow and solid icon fill, with inactive states muted to `#64748B`.

### Segmented Controls & Chips
- Capsule tabs (`rounded-full`) housed in an enclosed slate rail. Active state utilizes deep sage container with mint text; idle chips rest in translucent dark gray.
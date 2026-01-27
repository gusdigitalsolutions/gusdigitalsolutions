This plan outlines the steps to overhaul the website's CSS, focusing on professional polish, consistent design tokens, and tighter spacing as requested.

## 1. Global Spacing & Layout Unification

**Goal:** Reduce gaps between sections and ensure a cohesive rhythm.

- [ ] **Standardize Section Spacing:** define a utility class (or strictly use) `py-8` (32px) or `py-10` (40px) maximum for all major sections, replacing inconsistent `py-12`, `py-20`, `pt-24`.
- [ ] **Section Separators:** Evaluate if distinct borders or background alternations are needed to separate sections without large whitespace.
- [ ] **Container Widths:** Enforce the new `max-w-[1800px]` standard for "Full Width" sections and `max-w-6xl` for text-heavy sections to prevent "stretching" on huge monitors.

## 2. Design System Refinement (Tailwind Theme)

**Goal:** Enforce the "Solid Blue" and "Dark Premium" aesthetic.

- [ ] **Color Palette:** Lock in the Primary Blue (`#2563eb`) as the source of truth. Remove stray gradients on buttons unless explicitly desired for "Featured" items.
- [ ] **Typography:** increasing contrast for body text (`text-slate-300` vs `text-dark-400`). Ensure Headings have tight line-heights and are responsive (`text-balance`).
- [ ] **Borders & Glassmorphism:** Standardize the "glass" look. Use `border-white/10` consistently instead of mixing colors. Provide a subtle `hover:border-primary/50` interaction for interactive cards.

## 3. Component Updates

**Goal:** Apply the new design tokens to existing components.

- [ ] **Buttons:** Verify all buttons use the new solid blue style. Add a subtle "inner glow" or shadow to make them pop against the dark background.
- [ ] **Cards (Services, Experience, Portfolio):**
  - Reduce internal padding if needed to make them denser.
  - Consistency in `rounded-2xl` vs `rounded-xl`.
  - Harmonize shadow effects (`shadow-lg` vs `shadow-2xl`).
- [ ] **Forms:** Update input fields to have consistent height, focus rings (Blue), and background opacity.

## 4. Mobile Responsiveness Polish

- [ ] **Font Sizing:** Ensure `h1` and `h2` scale down nicely on mobile (no word breaks).
- [ ] **Touch Targets:** Verify buttons and links are easy to tap.
- [ ] **Padding:** Use `px-4` on mobile containers to ensure content goes edge-to-edge with breathing room.

## 5. Execution Plan

1.  **Refactor `globals.css`:** Define clear `@layer components` for `.section-standard` (spacing) and verify button overrides.
2.  **Batch Update Sections:** Go through `Hero.astro`, `Services.astro`, `Experience.astro`, `WorkPortfolio.astro`, `Contact.astro`, `About.astro` and apply the tighter spacing classes.
3.  **Review:** Check the "Free Resources" page to match the main landing page style.

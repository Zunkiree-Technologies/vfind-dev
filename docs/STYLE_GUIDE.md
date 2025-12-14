# V-Find Style Guide

**Inspired by:** AssessFirst (Pink rebrand)
**Version:** 3.0 (Pink Rebrand)
**Updated:** 2025-12-14

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Typography](#typography)
3. [Color System](#color-system)
4. [Spacing System](#spacing-system)
5. [Border & Radius](#border--radius)
6. [Shadows](#shadows)
7. [Buttons](#buttons)
8. [Cards](#cards)
9. [Form Elements](#form-elements)
10. [Navigation](#navigation)
11. [Icons](#icons)
12. [Responsive Breakpoints](#responsive-breakpoints)
13. [Animation & Transitions](#animation--transitions)
14. [Component Patterns](#component-patterns)

---

## Design Philosophy

### "Approachable & Empowering" - AssessFirst-Inspired Pink Rebrand

V-Find's pink rebrand creates a design that feels **warm, empowering, and approachable** for our primarily female nursing audience. Inspired by AssessFirst's vibrant pink palette.

| Principle | Implementation |
|-----------|---------------|
| **Warmth** | Pink primary (approachable, feminine), soft gradients |
| **Trust** | Clean typography, consistent patterns, professional layout |
| **Clarity** | Generous whitespace, clear hierarchy, easy navigation |
| **Conversion** | High-contrast pink CTAs, smooth micro-interactions |

### Key Design Decisions

- **Pink Primary**: Warm, approachable, appeals to nursing demographic
- **Warm Accents**: Amber/coral for secondary CTAs and highlights
- **Subtle Animations**: Smooth 200-300ms transitions, no distracting motion
- **Consistent Radius**: `rounded-lg` (8px) for buttons, `rounded-xl` (12px) for cards

---

## Typography

### Font Families

```css
/* Primary Font - Headings & UI Elements */
--font-primary: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Secondary Font - Body Text */
--font-secondary: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Accent Font - Special Elements (optional) */
--font-accent: 'Space Grotesk', 'Inter', sans-serif;

/* Monospace - Code snippets */
--font-mono: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Mono', monospace;
```

### Font Sizes

```css
/* Font Size Scale (rem based, 1rem = 16px) */
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px */
--text-5xl: 3rem;        /* 48px */
--text-6xl: 3.75rem;     /* 60px */
--text-7xl: 4.5rem;      /* 72px */
```

### Font Weights

```css
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
```

### Line Heights

```css
--leading-none: 1;
--leading-tight: 1.25;
--leading-snug: 1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
--leading-loose: 2;
```

### Letter Spacing

```css
--tracking-tighter: -0.05em;
--tracking-tight: -0.025em;
--tracking-normal: 0;
--tracking-wide: 0.025em;
--tracking-wider: 0.05em;
--tracking-widest: 0.1em;
```

### Typography Usage

| Element | Font | Size | Weight | Line Height |
|---------|------|------|--------|-------------|
| H1 - Hero | Montserrat | 48-72px | 700-800 | 1.1-1.2 |
| H2 - Section | Montserrat | 36-48px | 700 | 1.2 |
| H3 - Subsection | Montserrat | 24-30px | 600 | 1.3 |
| H4 - Card Title | Montserrat | 20-24px | 600 | 1.4 |
| H5 - Small Title | Montserrat | 18px | 600 | 1.4 |
| H6 - Label | Montserrat | 14-16px | 600 | 1.5 |
| Body Large | Open Sans | 18px | 400 | 1.6 |
| Body | Open Sans | 16px | 400 | 1.5 |
| Body Small | Open Sans | 14px | 400 | 1.5 |
| Caption | Open Sans | 12px | 400 | 1.4 |
| Button | Montserrat | 14-16px | 600 | 1 |
| Nav Link | Montserrat | 14-15px | 500 | 1 |

---

## Color System

### Primary Colors

```css
/* Primary Pink - Main Brand Color (AssessFirst-inspired) */
--primary-50: #fdf2f8;
--primary-100: #fce7f3;
--primary-200: #fbcfe8;
--primary-300: #f9a8d4;
--primary-400: #f472b6;
--primary-500: #ec4899;   /* Main Primary */
--primary-600: #db2777;   /* Hover State */
--primary-700: #be185d;   /* Active State */
--primary-800: #9d174d;
--primary-900: #831843;
--primary-950: #500724;
```

### Accent Colors (Warmth & Conversion) - NEW v2.0

```css
/* Amber - High-conversion CTAs, badges, highlights */
--accent-amber: #F59E0B;
--accent-amber-light: #FEF3C7;
--accent-amber-dark: #D97706;

/* Coral/Orange - Urgent actions, notifications */
--accent-coral: #F97316;
--accent-coral-light: #FFEDD5;
--accent-coral-dark: #EA580C;

/* Teal - Success, positive indicators */
--accent-teal: #14B8A6;
--accent-teal-light: #CCFBF1;
--accent-teal-dark: #0D9488;
```

### Gradients - NEW v2.0

```css
/* Hero gradient - soft, welcoming */
--gradient-hero: linear-gradient(135deg, #EFF6FF 0%, #FEF3C7 50%, #FFFFFF 100%);

/* CTA gradient - action-oriented (Pink) */
--gradient-cta: linear-gradient(135deg, #ec4899 0%, #db2777 100%);

/* Warm accent gradient - high conversion */
--gradient-warm: linear-gradient(135deg, #F59E0B 0%, #F97316 100%);
```

### Secondary Colors

```css
/* Secondary Indigo/Purple - Accents */
--secondary-50: #eef2ff;
--secondary-100: #e0e7ff;
--secondary-200: #c7d2fe;
--secondary-300: #a5b4fc;
--secondary-400: #818cf8;
--secondary-500: #6366f1;   /* Main Secondary */
--secondary-600: #4f46e5;
--secondary-700: #4338ca;
--secondary-800: #3730a3;
--secondary-900: #312e81;
```

### Neutral/Gray Colors

```css
/* Neutral Gray Scale */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;
--gray-950: #030712;
```

### Semantic Colors

```css
/* Success - Green */
--success-50: #f0fdf4;
--success-100: #dcfce7;
--success-200: #bbf7d0;
--success-300: #86efac;
--success-400: #4ade80;
--success-500: #22c55e;   /* Main Success */
--success-600: #16a34a;
--success-700: #15803d;
--success-800: #166534;
--success-900: #14532d;

/* Warning - Amber/Yellow */
--warning-50: #fffbeb;
--warning-100: #fef3c7;
--warning-200: #fde68a;
--warning-300: #fcd34d;
--warning-400: #fbbf24;
--warning-500: #f59e0b;   /* Main Warning */
--warning-600: #d97706;
--warning-700: #b45309;
--warning-800: #92400e;
--warning-900: #78350f;

/* Error - Red */
--error-50: #fef2f2;
--error-100: #fee2e2;
--error-200: #fecaca;
--error-300: #fca5a5;
--error-400: #f87171;
--error-500: #ef4444;     /* Main Error */
--error-600: #dc2626;
--error-700: #b91c1c;
--error-800: #991b1b;
--error-900: #7f1d1d;

/* Info - Cyan */
--info-50: #ecfeff;
--info-100: #cffafe;
--info-200: #a5f3fc;
--info-300: #67e8f9;
--info-400: #22d3ee;
--info-500: #06b6d4;      /* Main Info */
--info-600: #0891b2;
--info-700: #0e7490;
--info-800: #155e75;
--info-900: #164e63;
```

### Background Colors

```css
/* Page Backgrounds */
--bg-page: #ffffff;
--bg-page-secondary: #f9fafb;
--bg-page-tertiary: #f3f4f6;

/* Card/Surface Backgrounds */
--bg-card: #ffffff;
--bg-card-hover: #f9fafb;
--bg-card-active: #f3f4f6;

/* Input Backgrounds */
--bg-input: #ffffff;
--bg-input-disabled: #f3f4f6;

/* Overlay Backgrounds */
--bg-overlay: rgba(0, 0, 0, 0.5);
--bg-overlay-light: rgba(0, 0, 0, 0.3);
```

### Text Colors

```css
/* Text Hierarchy */
--text-primary: #111827;      /* Headings, important text */
--text-secondary: #374151;    /* Body text */
--text-tertiary: #6b7280;     /* Muted/helper text */
--text-placeholder: #9ca3af;  /* Placeholder text */
--text-disabled: #d1d5db;     /* Disabled text */
--text-inverse: #ffffff;      /* Text on dark backgrounds */
--text-link: #db2777;         /* Link text (Pink) */
--text-link-hover: #be185d;   /* Link hover */
```

### Border Colors

```css
/* Border Colors */
--border-light: #e9eaeb;      /* Manatal's border color */
--border-default: #e5e7eb;
--border-medium: #d1d5db;
--border-dark: #9ca3af;
--border-focus: #ec4899;
--border-error: #ef4444;
--border-success: #22c55e;
```

---

## Spacing System

Based on 4px base unit (0.25rem), creating an 8-point grid system.

```css
/* Spacing Scale */
--space-0: 0;
--space-px: 1px;
--space-0.5: 0.125rem;   /* 2px */
--space-1: 0.25rem;      /* 4px */
--space-1.5: 0.375rem;   /* 6px */
--space-2: 0.5rem;       /* 8px */
--space-2.5: 0.625rem;   /* 10px */
--space-3: 0.75rem;      /* 12px */
--space-3.5: 0.875rem;   /* 14px */
--space-4: 1rem;         /* 16px */
--space-5: 1.25rem;      /* 20px */
--space-6: 1.5rem;       /* 24px */
--space-7: 1.75rem;      /* 28px */
--space-8: 2rem;         /* 32px */
--space-9: 2.25rem;      /* 36px */
--space-10: 2.5rem;      /* 40px */
--space-11: 2.75rem;     /* 44px */
--space-12: 3rem;        /* 48px */
--space-14: 3.5rem;      /* 56px */
--space-16: 4rem;        /* 64px */
--space-20: 5rem;        /* 80px */
--space-24: 6rem;        /* 96px */
--space-28: 7rem;        /* 112px */
--space-32: 8rem;        /* 128px */
--space-36: 9rem;        /* 144px */
--space-40: 10rem;       /* 160px */
--space-44: 11rem;       /* 176px */
--space-48: 12rem;       /* 192px */
--space-52: 13rem;       /* 208px */
--space-56: 14rem;       /* 224px */
--space-60: 15rem;       /* 240px */
--space-64: 16rem;       /* 256px */
--space-72: 18rem;       /* 288px */
--space-80: 20rem;       /* 320px */
--space-96: 24rem;       /* 384px */
```

### Common Spacing Usage

| Use Case | Value | CSS Variable |
|----------|-------|--------------|
| Button padding (x) | 16-24px | --space-4 to --space-6 |
| Button padding (y) | 10-14px | --space-2.5 to --space-3.5 |
| Card padding | 24-32px | --space-6 to --space-8 |
| Section padding | 64-96px | --space-16 to --space-24 |
| Input padding (x) | 12-16px | --space-3 to --space-4 |
| Input padding (y) | 10-12px | --space-2.5 to --space-3 |
| Gap between elements | 8-16px | --space-2 to --space-4 |
| Gap between sections | 32-64px | --space-8 to --space-16 |
| Navbar height | 64-80px | --space-16 to --space-20 |
| Footer padding | 48-80px | --space-12 to --space-20 |

---

## Border & Radius

### Border Width

```css
--border-0: 0;
--border-1: 1px;
--border-2: 2px;
--border-4: 4px;
--border-8: 8px;
```

### Border Radius

```css
/* Border Radius Scale */
--radius-none: 0;
--radius-sm: 0.125rem;    /* 2px */
--radius-default: 0.25rem; /* 4px */
--radius-md: 0.375rem;    /* 6px */
--radius-lg: 0.5rem;      /* 8px */
--radius-xl: 0.75rem;     /* 12px */
--radius-2xl: 1rem;       /* 16px */
--radius-3xl: 1.5rem;     /* 24px */
--radius-full: 9999px;    /* Pill shape */
```

### Radius Usage

| Element | Radius | CSS Variable |
|---------|--------|--------------|
| Buttons (default) | 8px | --radius-lg |
| Buttons (pill) | 9999px | --radius-full |
| Cards | 12-16px | --radius-xl to --radius-2xl |
| Inputs | 8px | --radius-lg |
| Modals | 16-24px | --radius-2xl to --radius-3xl |
| Avatars | 9999px | --radius-full |
| Tags/Badges | 6px | --radius-md |
| Tooltips | 8px | --radius-lg |
| Dropdowns | 12px | --radius-xl |

---

## Shadows

```css
/* Shadow Scale */
--shadow-none: none;
--shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
--shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);

/* Colored Shadows (for elevated elements - Pink) */
--shadow-primary: 0 4px 14px 0 rgba(236, 72, 153, 0.25);
--shadow-primary-lg: 0 10px 25px 0 rgba(236, 72, 153, 0.3);

/* Card Shadows */
--shadow-card: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06);
--shadow-card-hover: 0 10px 20px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.06);
```

### Shadow Usage

| Element | Shadow | CSS Variable |
|---------|--------|--------------|
| Cards (default) | Subtle | --shadow-card |
| Cards (hover) | Elevated | --shadow-card-hover |
| Dropdowns | Medium | --shadow-lg |
| Modals | Large | --shadow-xl |
| Buttons (hover) | Colored | --shadow-primary |
| Tooltips | Small | --shadow-md |
| Navbar (sticky) | Small | --shadow-sm |

---

## Buttons

### Button Sizes

```css
/* Button Size Variants */
.btn-xs {
  padding: 6px 12px;
  font-size: 12px;
  height: 28px;
}

.btn-sm {
  padding: 8px 16px;
  font-size: 14px;
  height: 36px;
}

.btn-md {
  padding: 10px 20px;
  font-size: 14px;
  height: 40px;
}

.btn-lg {
  padding: 12px 24px;
  font-size: 16px;
  height: 48px;
}

.btn-xl {
  padding: 16px 32px;
  font-size: 18px;
  height: 56px;
}
```

### Button Variants

```css
/* Primary Button */
.btn-primary {
  background: var(--primary-500);
  color: white;
  border: none;
  font-weight: 600;
  border-radius: var(--radius-lg);
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: var(--primary-600);
  box-shadow: var(--shadow-primary);
  transform: translateY(-1px);
}

.btn-primary:active {
  background: var(--primary-700);
  transform: translateY(0);
}

/* Secondary Button */
.btn-secondary {
  background: white;
  color: var(--gray-700);
  border: 1px solid var(--border-default);
  font-weight: 600;
  border-radius: var(--radius-lg);
}

.btn-secondary:hover {
  background: var(--gray-50);
  border-color: var(--gray-300);
}

/* Outline Button */
.btn-outline {
  background: transparent;
  color: var(--primary-500);
  border: 1px solid var(--primary-500);
  font-weight: 600;
  border-radius: var(--radius-lg);
}

.btn-outline:hover {
  background: var(--primary-50);
}

/* Ghost Button */
.btn-ghost {
  background: transparent;
  color: var(--gray-600);
  border: none;
  font-weight: 500;
}

.btn-ghost:hover {
  background: var(--gray-100);
  color: var(--gray-900);
}

/* Warm CTA Button - NEW v2.0 (High Conversion) */
.btn-warm {
  background: linear-gradient(135deg, #F59E0B 0%, #F97316 100%);
  color: white;
  border: none;
  font-weight: 600;
  border-radius: var(--radius-lg);
  box-shadow: 0 4px 14px rgba(245, 158, 11, 0.25);
  transition: all 0.2s ease;
}

.btn-warm:hover {
  filter: brightness(1.05);
  box-shadow: 0 10px 25px rgba(245, 158, 11, 0.3);
  transform: translateY(-1px);
}

.btn-warm:active {
  filter: brightness(0.95);
  transform: translateY(0);
}

/* Danger Button */
.btn-danger {
  background: var(--error-500);
  color: white;
  border: none;
  font-weight: 600;
}

.btn-danger:hover {
  background: var(--error-600);
}
```

### Button States

```css
/* Disabled State */
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* Loading State */
.btn-loading {
  position: relative;
  color: transparent;
}

.btn-loading::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

/* Focus State */
.btn:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}
```

---

## Cards

### Card Styles

```css
/* Base Card */
.card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  transition: all 0.2s ease;
}

/* Interactive Card */
.card-interactive {
  cursor: pointer;
}

.card-interactive:hover {
  border-color: var(--border-medium);
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-2px);
}

/* Elevated Card */
.card-elevated {
  border: none;
  box-shadow: var(--shadow-card);
}

.card-elevated:hover {
  box-shadow: var(--shadow-lg);
}

/* Featured Card */
.card-featured {
  border: 2px solid var(--primary-500);
  background: linear-gradient(135deg, var(--primary-50) 0%, white 100%);
}
```

### Job Card Pattern

```css
.job-card {
  background: white;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-xl);
  padding: var(--space-5);
  transition: all 0.2s ease;
}

.job-card:hover {
  border-color: var(--primary-200);
  box-shadow: var(--shadow-md);
}

.job-card-header {
  display: flex;
  gap: var(--space-4);
  align-items: flex-start;
  margin-bottom: var(--space-4);
}

.job-card-logo {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  object-fit: cover;
}

.job-card-title {
  font-family: var(--font-primary);
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-1);
}

.job-card-company {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.job-card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.job-card-tag {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  background: var(--gray-100);
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
  color: var(--text-tertiary);
}
```

---

## Form Elements

### Input Fields

```css
/* Base Input */
.input {
  width: 100%;
  height: 44px;
  padding: var(--space-2.5) var(--space-4);
  font-family: var(--font-secondary);
  font-size: var(--text-base);
  color: var(--text-primary);
  background: var(--bg-input);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  transition: all 0.2s ease;
}

.input::placeholder {
  color: var(--text-placeholder);
}

.input:hover {
  border-color: var(--border-medium);
}

.input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px var(--primary-100);
}

.input:disabled {
  background: var(--bg-input-disabled);
  cursor: not-allowed;
  opacity: 0.7;
}

/* Input with error */
.input-error {
  border-color: var(--error-500);
}

.input-error:focus {
  box-shadow: 0 0 0 3px var(--error-100);
}
```

### Labels

```css
.label {
  display: block;
  font-family: var(--font-primary);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: var(--space-2);
}

.label-required::after {
  content: ' *';
  color: var(--error-500);
}
```

### Select Dropdown

```css
.select {
  appearance: none;
  width: 100%;
  height: 44px;
  padding: var(--space-2.5) var(--space-4);
  padding-right: var(--space-10);
  font-family: var(--font-secondary);
  font-size: var(--text-base);
  color: var(--text-primary);
  background: var(--bg-input);
  background-image: url("data:image/svg+xml,..."); /* Chevron icon */
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  cursor: pointer;
}
```

### Checkbox & Radio

```css
.checkbox {
  width: 18px;
  height: 18px;
  border: 2px solid var(--border-medium);
  border-radius: var(--radius-default);
  transition: all 0.15s ease;
}

.checkbox:checked {
  background: var(--primary-500);
  border-color: var(--primary-500);
}

.radio {
  width: 18px;
  height: 18px;
  border: 2px solid var(--border-medium);
  border-radius: var(--radius-full);
}

.radio:checked {
  border-color: var(--primary-500);
  border-width: 5px;
}
```

### Textarea

```css
.textarea {
  width: 100%;
  min-height: 120px;
  padding: var(--space-3) var(--space-4);
  font-family: var(--font-secondary);
  font-size: var(--text-base);
  line-height: var(--leading-normal);
  color: var(--text-primary);
  background: var(--bg-input);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  resize: vertical;
}
```

---

## Navigation

### Main Navbar

```css
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 72px;
  background: white;
  border-bottom: 1px solid var(--border-light);
  z-index: 1000;
  transition: all 0.3s ease;
}

.navbar-scrolled {
  box-shadow: var(--shadow-sm);
}

.navbar-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--space-6);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-logo {
  height: 32px;
  width: auto;
}

.navbar-menu {
  display: flex;
  align-items: center;
  gap: var(--space-8);
}

.navbar-link {
  font-family: var(--font-primary);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.navbar-link:hover {
  color: var(--primary-500);
}

.navbar-link-active {
  color: var(--primary-500);
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
```

### Mobile Navigation

```css
.mobile-menu {
  position: fixed;
  top: 72px;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  padding: var(--space-6);
  z-index: 999;
  transform: translateX(100%);
  transition: transform 0.3s ease;
}

.mobile-menu-open {
  transform: translateX(0);
}

.mobile-menu-link {
  display: block;
  padding: var(--space-4) 0;
  font-family: var(--font-primary);
  font-size: var(--text-lg);
  font-weight: 500;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-light);
}
```

---

## Icons

### Icon Sizes

```css
--icon-xs: 12px;
--icon-sm: 16px;
--icon-md: 20px;
--icon-lg: 24px;
--icon-xl: 32px;
--icon-2xl: 48px;
```

### Icon Usage

- Use **Lucide React** or **Heroicons** for consistent iconography
- Icons should have 1.5-2px stroke width
- Icon color should match text color or be slightly muted
- Always include proper spacing (4-8px) between icon and text

```css
.icon {
  flex-shrink: 0;
  stroke-width: 1.5;
}

.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-lg);
  color: var(--text-tertiary);
  transition: all 0.2s ease;
}

.icon-button:hover {
  background: var(--gray-100);
  color: var(--text-primary);
}
```

---

## Responsive Breakpoints

```css
/* Breakpoint Values */
--breakpoint-sm: 640px;   /* Small phones landscape */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Small laptops */
--breakpoint-xl: 1280px;  /* Desktops */
--breakpoint-2xl: 1536px; /* Large desktops */

/* Media Query Mixins (for reference) */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

### Container Widths

```css
.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

@media (min-width: 640px) {
  .container { max-width: 640px; }
}

@media (min-width: 768px) {
  .container { max-width: 768px; padding: 0 var(--space-6); }
}

@media (min-width: 1024px) {
  .container { max-width: 1024px; }
}

@media (min-width: 1280px) {
  .container { max-width: 1280px; }
}
```

---

## Animation & Transitions

### Transition Durations

```css
--duration-75: 75ms;
--duration-100: 100ms;
--duration-150: 150ms;
--duration-200: 200ms;
--duration-300: 300ms;
--duration-500: 500ms;
--duration-700: 700ms;
--duration-1000: 1000ms;
```

### Easing Functions

```css
--ease-linear: linear;
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Common Animations

```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide Up */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scale In */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Spin */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Pulse */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

### Default Transitions

```css
.transition-default {
  transition-property: color, background-color, border-color, box-shadow, transform;
  transition-duration: var(--duration-200);
  transition-timing-function: var(--ease-in-out);
}

.transition-transform {
  transition-property: transform;
  transition-duration: var(--duration-200);
  transition-timing-function: var(--ease-in-out);
}

.transition-opacity {
  transition-property: opacity;
  transition-duration: var(--duration-200);
  transition-timing-function: var(--ease-in-out);
}
```

---

## Component Patterns

### Badge/Tag

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: var(--space-1) var(--space-2.5);
  font-family: var(--font-primary);
  font-size: var(--text-xs);
  font-weight: 500;
  border-radius: var(--radius-md);
}

.badge-primary {
  background: var(--primary-100);
  color: var(--primary-700);
}

.badge-success {
  background: var(--success-100);
  color: var(--success-700);
}

.badge-warning {
  background: var(--warning-100);
  color: var(--warning-700);
}

.badge-error {
  background: var(--error-100);
  color: var(--error-700);
}

.badge-gray {
  background: var(--gray-100);
  color: var(--gray-700);
}
```

### Avatar

```css
.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  background: var(--gray-200);
  color: var(--gray-600);
  font-family: var(--font-primary);
  font-weight: 600;
  overflow: hidden;
}

.avatar-xs { width: 24px; height: 24px; font-size: 10px; }
.avatar-sm { width: 32px; height: 32px; font-size: 12px; }
.avatar-md { width: 40px; height: 40px; font-size: 14px; }
.avatar-lg { width: 48px; height: 48px; font-size: 16px; }
.avatar-xl { width: 64px; height: 64px; font-size: 20px; }
.avatar-2xl { width: 96px; height: 96px; font-size: 28px; }
```

### Toast/Alert

```css
.toast {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}

.toast-success {
  background: var(--success-50);
  border: 1px solid var(--success-200);
  color: var(--success-800);
}

.toast-error {
  background: var(--error-50);
  border: 1px solid var(--error-200);
  color: var(--error-800);
}

.toast-warning {
  background: var(--warning-50);
  border: 1px solid var(--warning-200);
  color: var(--warning-800);
}

.toast-info {
  background: var(--info-50);
  border: 1px solid var(--info-200);
  color: var(--info-800);
}
```

### Progress Bar

```css
.progress {
  width: 100%;
  height: 8px;
  background: var(--gray-200);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: var(--primary-500);
  border-radius: var(--radius-full);
  transition: width var(--duration-300) var(--ease-out);
}
```

### Divider

```css
.divider {
  width: 100%;
  height: 1px;
  background: var(--border-light);
  margin: var(--space-6) 0;
}

.divider-vertical {
  width: 1px;
  height: 100%;
  background: var(--border-light);
  margin: 0 var(--space-4);
}
```

### Tooltip

```css
.tooltip {
  position: absolute;
  padding: var(--space-2) var(--space-3);
  font-family: var(--font-secondary);
  font-size: var(--text-sm);
  color: white;
  background: var(--gray-900);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  white-space: nowrap;
  z-index: 1100;
}
```

---

## Tailwind CSS Integration

### Extend Tailwind Config

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        'primary': ['Montserrat', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'secondary': ['Open Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
          950: '#500724',
        },
        border: {
          light: '#e9eaeb',
          DEFAULT: '#e5e7eb',
          medium: '#d1d5db',
        },
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 20px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.06)',
        'primary': '0 4px 14px 0 rgba(236, 72, 153, 0.25)',
      },
    },
  },
}
```

---

## Quick Reference

### Most Used Values

| Property | Value |
|----------|-------|
| Primary Color | #ec4899 (Pink) |
| Primary Hover | #db2777 |
| Text Primary | #111827 |
| Text Secondary | #374151 |
| Border Color | #e9eaeb |
| Border Focus | #ec4899 |
| Border Radius (buttons, inputs) | 8px |
| Border Radius (cards) | 12px |
| Shadow (cards) | 0 1px 3px rgba(0,0,0,0.08) |
| Button Height | 40-48px |
| Input Height | 44px |
| Navbar Height | 72px |
| Primary Font | Montserrat |
| Body Font | Open Sans |
| Base Font Size | 16px |
| Container Max Width | 1280px |

---

*This style guide should be used as the single source of truth for all V-Find UI development.*

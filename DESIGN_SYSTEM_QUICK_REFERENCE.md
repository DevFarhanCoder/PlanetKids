# MyPlanetKids Design System - Quick Reference

## 🎨 Color Palette (Hex Codes)

### Primary - Soft Light Blue

```css
#F0F8FB  /* primary-50 */
#E1F2F7  /* primary-100 */
#C3E5EF  /* primary-200 */
#A8D8EA  /* primary-300 - MAIN BRAND COLOR */
#7AC5E0  /* primary-400 */
#4FB2D6  /* primary-500 */
#3A9BC4  /* primary-600 */
#2E7DA0  /* primary-700 */
```

### Secondary - Soft Peach

```css
#FFF7F5  /* secondary-50 */
#FFEFEB  /* secondary-100 */
#FFE0D7  /* secondary-200 */
#FFCFBF  /* secondary-300 */
#FFB6A3  /* secondary-400 - MAIN SECONDARY */
#FF9D87  /* secondary-500 */
#FF7A5C  /* secondary-600 */
```

### Accent - Soft Yellow

```css
#FFFEF8  /* accent-50 */
#FFFCF0  /* accent-100 */
#FFF9E0  /* accent-200 */
#FFF5C8  /* accent-300 */
#FFF0A5  /* accent-400 - MAIN ACCENT */
#FFE87C  /* accent-500 */
#FFD84A  /* accent-600 */
```

### Lavender

```css
#FAF8FF  /* lavender-50 */
#F4F0FF  /* lavender-100 */
#E9E1FF  /* lavender-200 */
#DED2FF  /* lavender-300 */
#D4C5F9  /* lavender-400 - MAIN */
#BFA7F5  /* lavender-500 */
```

### Pink

```css
#FFFAFC  /* pink-50 */
#FFF5F9  /* pink-100 */
#FFEBF3  /* pink-200 */
#FFE0ED  /* pink-300 */
#FFD6E8  /* pink-400 - MAIN */
#FFBDD9  /* pink-500 */
```

### Success - Soft Green

```css
#F5FCFA  /* success-50 */
#EBF9F5  /* success-100 */
#D7F3EB  /* success-200 */
#C3EDE1  /* success-300 */
#B8E6D5  /* success-400 - MAIN */
#8CD9BF  /* success-500 */
```

---

## 📏 Spacing Scale

```css
0.5rem  /* 2  - 8px */
0.75rem /* 3  - 12px */
1rem    /* 4  - 16px */
1.25rem /* 5  - 20px */
1.5rem  /* 6  - 24px */
2rem    /* 8  - 32px */
2.5rem  /* 10 - 40px */
3rem    /* 12 - 48px */
4rem    /* 16 - 64px */
```

**Common Usage:**

- Padding: `p-3`, `p-4`, `p-5`, `p-6`
- Margin: `mb-3`, `mb-8`, `mb-10`
- Gap: `gap-4`, `gap-6`, `gap-8`

---

## 🔘 Border Radius

```css
rounded-xl    /* 12px */
rounded-2xl   /* 16px - Small elements */
rounded-3xl   /* 24px - Cards, buttons */
rounded-5xl   /* 40px - Large sections */
rounded-full  /* 9999px - Circles, pills */
```

**When to use:**

- **rounded-2xl**: Input fields, small buttons, badges
- **rounded-3xl**: Product cards, category cards, large buttons
- **rounded-full**: Badges, icon buttons, indicators

---

## 💫 Shadow Scale

```css
/* Tailwind Defaults */
shadow-sm   /* 0 1px 2px rgba(0,0,0,0.05) */
shadow      /* 0 1px 3px rgba(0,0,0,0.1) */
shadow-md   /* 0 4px 6px rgba(0,0,0,0.1) */
shadow-lg   /* 0 10px 15px rgba(0,0,0,0.1) */

/* Custom Soft Shadows */
shadow-soft    /* 0 2px 15px rgba(0,0,0,0.08) */
shadow-soft-lg /* 0 4px 25px rgba(0,0,0,0.12) */
shadow-soft-xl /* 0 8px 40px rgba(0,0,0,0.15) */
shadow-pastel  /* 0 4px 20px rgba(168,216,234,0.3) */
```

**When to use:**

- **shadow-soft**: Default card state
- **shadow-soft-lg**: Hover state, elevated cards
- **shadow-soft-xl**: Modals, dropdowns, important elements
- **shadow-pastel**: Special brand-colored shadows

---

## 🎭 Typography

### Font Families

```css
font-sans    /* Inter - Body text */
font-nunito  /* Nunito - Headings */
```

### Font Weights

```css
font-semibold  /* 600 - Body emphasis */
font-bold      /* 700 - Subheadings */
font-extrabold /* 800 - Headings */
font-black     /* 900 - Main headings */
```

### Font Sizes

```css
text-xs    /* 12px - Labels, badges */
text-sm    /* 14px - Body small */
text-base  /* 16px - Body text */
text-lg    /* 18px - Subtitles */
text-xl    /* 20px - Card titles */
text-2xl   /* 24px - Section subtitles */
text-3xl   /* 30px - Section titles */
text-4xl   /* 36px - Page titles */
text-5xl   /* 48px - Hero headlines */
```

**Responsive Pattern:**

```html
<h1 class="text-4xl md:text-5xl font-black"></h1>
```

---

## 🎨 Gradient Patterns

### Common Gradients

**Pastel Backgrounds:**

```css
bg-gradient-to-br from-primary-50 via-lavender-50 to-pink-50
bg-gradient-to-br from-accent-50 via-secondary-50 to-pink-50
bg-gradient-to-br from-primary-100 via-lavender-100 to-pink-100
```

**Button Gradients:**

```css
bg-gradient-to-r from-primary-400 to-primary-500
bg-gradient-to-r from-secondary-400 to-secondary-500
bg-gradient-to-r from-accent-400 to-accent-500
```

**Text Gradients:**

```css
text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-lavender-600
text-transparent bg-clip-text bg-gradient-to-r from-accent-500 to-secondary-500
text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-lavender-500
```

**Navigation Gradient:**

```css
bg-gradient-to-r from-primary-300 via-lavender-300 to-pink-300
```

---

## 🔲 Utility Classes

### Buttons

**Primary Button:**

```html
<button class="btn-primary">Click Me</button>
```

**Secondary Button:**

```html
<button class="btn-secondary">Shop Now</button>
```

**Accent Button:**

```html
<button class="btn-accent">New Arrival</button>
```

**Outline Button:**

```html
<button class="btn-outline">Learn More</button>
```

### Cards

**Product Card:**

```html
<div class="product-card">
  <!-- Card content -->
</div>
```

**Category Card:**

```html
<div class="category-card">
  <!-- Category content -->
</div>
```

**Banner Card:**

```html
<div class="banner-card">
  <!-- Banner content -->
</div>
```

### Badges

**Sale Badge:**

```html
<span class="badge-sale">🔥 50% OFF</span>
```

**New Badge:**

```html
<span class="badge-new">✨ NEW</span>
```

**Hot Badge:**

```html
<span class="badge-hot">🔥 HOT</span>
```

### Input Fields

**Standard Input:**

```html
<input type="text" class="input-field" placeholder="Enter text..." />
```

---

## ⚡ Animation & Transitions

### Standard Transitions

```css
transition-all duration-300
transition-all duration-500
transition-colors duration-300
transition-transform duration-500
```

### Common Hover Effects

**Scale:**

```css
hover:scale-105      /* 5% larger */
hover:scale-110      /* 10% larger */
```

**Translate:**

```css
hover:-translate-y-1    /* Lift 4px */
hover:-translate-y-2    /* Lift 8px */
hover:translate-x-1     /* Slide right 4px */
```

**Rotate:**

```css
hover:rotate-6          /* Rotate 6deg */
hover:rotate-12         /* Rotate 12deg */
```

**Combined Effects:**

```html
<!-- Card hover -->
<div
  class="transform hover:scale-105 hover:-translate-y-2 hover:shadow-soft-lg transition-all duration-500"
></div>
```

---

## 📱 Responsive Breakpoints

```css
sm:   640px   /* Small devices */
md:   768px   /* Tablets */
lg:   1024px  /* Laptops */
xl:   1280px  /* Desktops */
2xl:  1536px  /* Large screens */
```

**Usage Pattern:**

```html
<div class="text-base md:text-lg lg:text-xl">
  <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
    <div class="py-12 md:py-16"></div>
  </div>
</div>
```

---

## 🎯 Common Patterns

### Section Header

```html
<div class="text-center mb-10">
  <h2 class="text-4xl md:text-5xl font-black text-gray-900 mb-3">
    Shop by
    <span
      class="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-lavender-600"
      >Category</span
    >
  </h2>
  <p class="text-gray-600 text-lg font-semibold">
    Explore our full range of products
  </p>
</div>
```

### Icon with Background

```html
<div
  class="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-soft group-hover:shadow-soft-lg transform group-hover:scale-110 transition-all"
>
  <span class="text-5xl">🚚</span>
</div>
```

### Link with Arrow

```html
<Link href="/products" class="inline-flex items-center text-primary-700 font-black hover:text-primary-800 text-lg group">
  View All <ArrowRight class="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
</Link>
```

### Gradient Text Heading

```html
<h1
  class="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-lavender-600"
>
  MyPlanetKids
</h1>
```

---

## 🎨 Color Usage Guidelines

### Do's ✅

- Use gradients for visual interest
- Apply soft shadows for elevation
- Use pastel backgrounds for sections
- Combine colors from the same family
- Use bold typography for hierarchy

### Don'ts ❌

- Don't use harsh shadows
- Don't use pure black (#000000)
- Don't mix too many gradients
- Don't use colors outside the palette
- Don't use light text on light backgrounds

---

## 📦 Component Checklist

When creating new components, ensure:

- [ ] Uses rounded-2xl or rounded-3xl corners
- [ ] Has soft shadow (shadow-soft variants)
- [ ] Includes hover state with scale/translate
- [ ] Uses gradient backgrounds where appropriate
- [ ] Has bold typography (font-bold or font-black)
- [ ] Responsive design (mobile-first)
- [ ] Proper spacing (py-12/py-16 for sections)
- [ ] Accessibility (contrast, focus states)
- [ ] Consistent transitions (300-500ms)
- [ ] Uses emojis where playful touch needed

---

## 🚀 Quick Start Template

```html
<!-- Section Template -->
<section
  class="py-16 bg-gradient-to-br from-primary-50 via-lavender-50 to-pink-50"
>
  <div class="container-custom">
    <!-- Header -->
    <div class="text-center mb-10">
      <h2 class="text-4xl md:text-5xl font-black text-gray-900 mb-3">
        Section
        <span
          class="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-lavender-600"
          >Title</span
        >
      </h2>
      <p class="text-gray-600 text-lg font-semibold">Subtitle goes here</p>
    </div>

    <!-- Content Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
      <!-- Items -->
    </div>

    <!-- CTA -->
    <div class="text-center mt-10">
      <button class="btn-secondary px-12 py-4 text-lg">View All</button>
    </div>
  </div>
</section>
```

---

**Last Updated**: February 1, 2026  
**Version**: 2.0  
**Framework**: Tailwind CSS v3  
**Brand**: MyPlanetKids

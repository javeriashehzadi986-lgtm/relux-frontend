---
name: Luxe Cycle
colors:
  surface: '#fbf9f1'
  surface-dim: '#dcdad2'
  surface-bright: '#fbf9f1'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f4ec'
  surface-container: '#f0eee6'
  surface-container-high: '#eae8e0'
  surface-container-highest: '#e4e3db'
  on-surface: '#1b1c17'
  on-surface-variant: '#414942'
  inverse-surface: '#30312c'
  inverse-on-surface: '#f3f1e9'
  outline: '#717971'
  outline-variant: '#c1c9bf'
  surface-tint: '#3b6848'
  primary: '#3b6848'
  on-primary: '#ffffff'
  primary-container: '#98c9a3'
  on-primary-container: '#285537'
  inverse-primary: '#a1d2ac'
  secondary: '#49654f'
  on-secondary: '#ffffff'
  secondary-container: '#cbebcf'
  on-secondary-container: '#4f6b55'
  tertiary: '#5b5f5d'
  on-tertiary: '#ffffff'
  tertiary-container: '#babfbb'
  on-tertiary-container: '#494e4b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#bcefc7'
  primary-fixed-dim: '#a1d2ac'
  on-primary-fixed: '#00210e'
  on-primary-fixed-variant: '#224f32'
  secondary-fixed: '#cbebcf'
  secondary-fixed-dim: '#afceb3'
  on-secondary-fixed: '#05200f'
  on-secondary-fixed-variant: '#324d38'
  tertiary-fixed: '#dfe3e0'
  tertiary-fixed-dim: '#c3c7c4'
  on-tertiary-fixed: '#181d1a'
  on-tertiary-fixed-variant: '#434845'
  background: '#fbf9f1'
  on-background: '#1b1c17'
  surface-variant: '#e4e3db'
typography:
  display:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Manrope
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  button:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-padding: 32px
  gutter: 24px
  card-gap: 20px
  sidebar-width: 260px
---

## Brand & Style

The design system is built on the philosophy of "Sustainable Serenity." As an admin dashboard for a pre-loved fashion marketplace, the interface must balance professional utility with the soft, organic values of the circular economy. The target audience—marketplace administrators—requires a high-density information environment that feels calm rather than overwhelming.

The aesthetic leans heavily into **Soft Minimalism** with a **Tactile** edge. It utilizes a card-based architecture to compartmentalize complex user data into digestible modules. The emotional response is one of clarity, reliability, and approachability, moving away from the coldness of traditional enterprise software toward a lifestyle-oriented management tool.

## Colors

The palette is anchored in a "Mint & Cream" harmony. The primary **Soft Mint Green** (#98C9A3) is used for primary actions and brand presence, while the **Cream** (#FFFDF5) background provides a warmer, more premium feel than standard white, reducing eye strain during long working sessions.

**Professional Accents:** 
- **Forest Slate** (#4A6650) is used for high-contrast text and iconography to ensure legibility.
- **Pale Sage** (#F0F4F0) acts as a secondary background for nested containers or inactive states.
- **Functional Grays** are tinted with green (Warm Gray) to maintain the organic atmosphere.

## Typography

The design system employs **Manrope** as the primary typeface. Its modern, geometric construction offers the perfect balance between professional SaaS aesthetics and a friendly, approachable character. 

**Hierarchy Rules:**
- **Display and Headlines:** Use tighter letter spacing and semi-bold weights to anchor the page.
- **Body Text:** Standard weight for readability. Use Forest Slate for primary text and a 60% opacity variant for secondary descriptions.
- **Technical Labels:** **JetBrains Mono** is introduced sparingly for IDs, SKU numbers, or timestamps to provide a subtle "data-driven" feel without breaking the soft aesthetic.

## Layout & Spacing

The layout follows a **Fixed-Fluid Hybrid** model. The sidebar remains fixed at 260px, while the main content area utilizes a fluid grid with a maximum content width of 1440px to prevent excessive line lengths on ultra-wide monitors.

**Grid Philosophy:**
- **8px Base Unit:** All margins and paddings are multiples of 8px to ensure mathematical harmony.
- **Spacious Margins:** A generous 32px outer padding for main containers creates a "breathable" environment suitable for a luxury-adjacent brand.
- **Card-Based Reflow:** On tablet devices, three-column metric rows collapse to two, and data tables transition to a horizontal scroll or card-stacking format.

## Elevation & Depth

This design system avoids harsh dropshadows. Instead, it uses **Ambient Tonal Depth** to create hierarchy:

1.  **Level 0 (Base):** The Cream background (#FFFDF5).
2.  **Level 1 (Cards):** Pure White (#FFFFFF) surfaces with a very soft, diffused shadow (15% opacity of the Forest Slate color) and a 1px border in #E8EEE8.
3.  **Level 2 (Interactive):** Elements like active buttons or open dropdowns use a slightly more pronounced shadow to indicate "lift" and "press-ability."

The goal is a "pillowy" feel where elements look nested into the surface rather than floating high above it.

## Shapes

The shape language is consistently **Rounded**. Sharp corners are strictly avoided to maintain the friendly, approachable personality of the marketplace.

- **Standard Elements:** 0.5rem (8px) for input fields, small buttons, and tooltips.
- **Large Containers:** 1rem (16px) for main content cards and modals.
- **Interaction Cues:** Fully pill-shaped (100px) for status badges (e.g., "Active", "Banned") and selection chips.

## Components

### Buttons
Primary buttons use the Soft Mint Green background with dark Forest Slate text for maximum accessibility. Secondary buttons use a ghost style with a 1px border. Hover states should involve a subtle darkening of the background and a transition speed of 200ms.

### User Data Tables
Tables are the heart of the User Management dashboard. They feature:
- **No vertical borders:** Only thin horizontal dividers in #F0F4F0.
- **Avatar Integration:** Circular profile images in every row to humanize the data.
- **Sticky Headers:** Always visible during scroll, with a slight backdrop-blur effect.

### Status Chips
Status indicators (e.g., Verified, Pending, Suspended) must use a low-saturation background of the status color with high-saturation text to remain legible without being distracting.

### Search & Filters
The search bar should be oversized with a 24px height, featuring the "Cream" background to blend into the header while remaining distinct through its 1px border.

### Metric Cards
Summary stats at the top of the user list (e.g., "Total Sellers," "Active Rentals") should feature a large Manrope display number and a subtle sparkline graph in Soft Mint Green.
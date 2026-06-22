---
name: Luminous Editorial
colors:
  surface: '#fbf9f4'
  surface-dim: '#dbdad5'
  surface-bright: '#fbf9f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f4ee'
  surface-container: '#efeee9'
  surface-container-high: '#e9e8e3'
  surface-container-highest: '#e3e2dd'
  on-surface: '#1b1c19'
  on-surface-variant: '#404848'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f1ec'
  outline: '#707979'
  outline-variant: '#c0c8c8'
  surface-tint: '#356668'
  primary: '#356668'
  on-primary: '#ffffff'
  primary-container: '#a8dadc'
  on-primary-container: '#306163'
  inverse-primary: '#9ecfd1'
  secondary: '#5e5f5b'
  on-secondary: '#ffffff'
  secondary-container: '#e3e3de'
  on-secondary-container: '#646561'
  tertiary: '#586062'
  on-tertiary: '#ffffff'
  tertiary-container: '#cbd2d4'
  on-tertiary-container: '#535a5d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b9ecee'
  primary-fixed-dim: '#9ecfd1'
  on-primary-fixed: '#002021'
  on-primary-fixed-variant: '#1a4e50'
  secondary-fixed: '#e3e3de'
  secondary-fixed-dim: '#c7c7c2'
  on-secondary-fixed: '#1b1c19'
  on-secondary-fixed-variant: '#464744'
  tertiary-fixed: '#dde4e6'
  tertiary-fixed-dim: '#c1c8ca'
  on-tertiary-fixed: '#161d1f'
  on-tertiary-fixed-variant: '#41484a'
  background: '#fbf9f4'
  on-background: '#1b1c19'
  surface-variant: '#e3e2dd'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: DM Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: DM Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: DM Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
---

## Brand & Style

The design system is anchored in an "Editorial Minimalism" aesthetic, blending the prestige of high-fashion print media with modern digital fluidity. It targets a discerning, eco-conscious audience that values sustainable luxury and quiet sophistication. 

The visual language balances the organic warmth of a cream canvas with the refreshing precision of mint accents. The emotional response is one of "calm exclusivity"—a space that feels premium without being exclusionary, and structured without being rigid. The style utilizes heavy whitespace, intentional asymmetry in layouts, and high-contrast typography to guide the user through a curated shopping experience.

## Colors

The palette is centered on a foundation of **#F9F8F3 (Cream)**, which serves as the primary surface color to provide a warmer, more premium feel than pure white. 

- **Primary Mint (#A8DADC):** Used sparingly for high-intent actions, active states, and eco-conscious signaling. It should never overwhelm the layout.
- **Typography Charcoal (#2D3436):** Provides deep, accessible contrast for all text elements, ensuring a grounded feel.
- **Subtle Neutral (#E5E4DF):** Employed for hairline borders and secondary backgrounds to create soft separation without breaking the minimalist flow.

## Typography

This design system employs a classic high-contrast pairing. **Playfair Display** provides an editorial, sophisticated authority for headings, suggesting the heritage of luxury publishing. 

**DM Sans** is used for all functional and body text. Its low-contrast, geometric construction ensures maximum legibility and a modern, "tech-forward" edge that keeps the brand from feeling dated. Labels and small metadata should utilize the uppercase tracking of DM Sans to create a clear visual hierarchy between "content" and "navigation."

## Layout & Spacing

The layout philosophy follows a **Fixed-Fluid Hybrid Grid**. Content is centered within a 1280px container on desktop to maintain the boutique feel, while outer margins are generous (64px) to emphasize the "Luxury of Space."

Spacing follows an 8px rhythmic scale. However, section vertical padding should be aggressive—typically 80px to 120px—to allow high-quality product photography to breathe. On mobile, the grid collapses to a 2-column format for product feeds with 20px side margins to maximize screen real estate for imagery.

## Elevation & Depth

Depth in this design system is achieved through **Tonal Layering** and **Ambient Shadows**. Instead of traditional drop shadows, we use "Diffusion Glows"—shadows with a very large blur radius (30px+) and low opacity (5-8%), often tinted with a hint of the Charcoal color.

- **Level 0 (Surface):** The Cream background.
- **Level 1 (Cards):** Slightly elevated with a soft ambient shadow.
- **Level 2 (Modals/Popovers):** Clean borders (1px solid #E5E4DF) combined with a more pronounced soft shadow to create a floating effect.

Avoid heavy blurs or glassmorphism to maintain the organic, tactile feel of premium paper and fabric.

## Shapes

The shape language is defined by "Extra-Large Radius" curves. While the base `roundedness` is set to 2, specific container elements like product cards and primary buttons should utilize the `rounded-xl` (24px) or even `rounded-2xl` (32px) tokens. 

These soft, sweeping curves counteract the "sharpness" of the high-contrast serif typography, making the interface feel approachable and modern. Circular elements are reserved exclusively for profile avatars or specific "Eco-Certified" badges.

## Components

### Buttons
Primary buttons are solid **Charcoal (#2D3436)** with white text to provide the strongest call-to-action. They feature a 32px corner radius and generous horizontal padding (32px). Secondary buttons use the **Mint (#A8DADC)** background with charcoal text for a softer, yet distinct, interaction.

### Cards
Product cards are the centerpiece. They use a 24px corner radius and a subtle 1px border in #E5E4DF. Photography within cards should always have a slight zoom-on-hover effect to add a layer of interactive luxury.

### Inputs & Form Fields
Fields use the Cream background but are defined by a bottom-only border in Charcoal for an "editorial form" look. Labels are always positioned above the field in the `label-sm` uppercase style.

### Navigation
The header should be transparent on scroll-up and transition to a semi-opaque Cream background. Use minimal icons—thin-stroke (1px) icons that match the weight of the DM Sans body text.

### Chips & Badges
Used for "Sustainable," "Limited Edition," or "New In." These should be small, pill-shaped, and use a subtle Mint tint (10% opacity) with Mint text to remain sophisticated rather than loud.
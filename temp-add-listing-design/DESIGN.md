---
name: Luxe Ether
colors:
  surface: '#f4fbf5'
  surface-dim: '#d5dcd6'
  surface-bright: '#f4fbf5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eef5ef'
  surface-container: '#e9f0e9'
  surface-container-high: '#e3eae4'
  surface-container-highest: '#dde4de'
  on-surface: '#161d1a'
  on-surface-variant: '#424841'
  inverse-surface: '#2b322e'
  inverse-on-surface: '#ebf3ec'
  outline: '#727970'
  outline-variant: '#c2c8bf'
  surface-tint: '#446648'
  primary: '#446648'
  on-primary: '#ffffff'
  primary-container: '#b2d8b2'
  on-primary-container: '#3e5f41'
  inverse-primary: '#aad0ab'
  secondary: '#60603e'
  on-secondary: '#ffffff'
  secondary-container: '#e6e5b9'
  on-secondary-container: '#666643'
  tertiary: '#56642b'
  on-tertiary: '#ffffff'
  tertiary-container: '#c5d691'
  on-tertiary-container: '#4f5d25'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c6ecc5'
  primary-fixed-dim: '#aad0ab'
  on-primary-fixed: '#012109'
  on-primary-fixed-variant: '#2d4e31'
  secondary-fixed: '#e6e5b9'
  secondary-fixed-dim: '#cac99f'
  on-secondary-fixed: '#1d1d03'
  on-secondary-fixed-variant: '#484828'
  tertiary-fixed: '#d9eaa3'
  tertiary-fixed-dim: '#bdce89'
  on-tertiary-fixed: '#161f00'
  on-tertiary-fixed-variant: '#3e4c16'
  background: '#f4fbf5'
  on-background: '#161d1a'
  surface-variant: '#dde4de'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
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
The design system embodies a "Soft Minimalist" aesthetic tailored for a high-end circular fashion economy. It balances the sustainability of resale with the prestige of luxury retail. The visual language is airy, calm, and sophisticated, prioritizing high-quality garment photography over heavy UI decoration. By utilizing a light-drenched palette and generous whitespace, the interface evokes the feeling of a curated boutique rather than a cluttered marketplace. The emotional response is one of trust, effortless chic, and environmental mindfulness.

## Colors
The palette is rooted in organic, soothing tones that signal luxury and nature. 
- **Primary (Soft Mint):** Used for key actions, active states, and brand moments. It should be applied to primary buttons and selection indicators.
- **Background (Cream/Off-white):** A layered approach using `#FFFDD0` for the base canvas and `#FAF9F6` for secondary sections or card backgrounds to create subtle depth.
- **Text (Deep Charcoal/Earthy Green):** `#2F3632` provides high legibility while remaining softer and more sophisticated than pure black.
- **Accent (Sage Green):** `#8A9A5B` is reserved for specialized tags (e.g., "Verified Luxury"), hover states, and subtle decorative elements.

## Typography
The system uses a pairing of **Montserrat** for impact and **Plus Jakarta Sans** for utility. 
- **Headlines:** Montserrat is set with tighter letter-spacing in display sizes to maintain a fashion-forward, editorial look.
- **Body:** Plus Jakarta Sans provides a friendly, contemporary feel with high legibility for product descriptions and terms of service. 
- **Labels:** Use uppercase for small labels (like "RENTAL" or "RESALE" tags) to distinguish them from body copy without increasing weight excessively.

## Layout & Spacing
The layout follows a fluid 12-column grid on desktop and a 4-column grid on mobile. 
- **Spaciousness:** Large vertical margins (64px+) between sections are encouraged to allow product photography to "breathe."
- **Grid:** Use a 24px gutter to maintain a light, airy feel between cards. 
- **Padding:** Internal card padding should be generous (default 24px) to emphasize the premium nature of the items.

## Elevation & Depth
Depth is communicated through **Ambient Shadows** and **Tonal Layering**. 
- **Shadows:** Use extremely soft, long-spread shadows with a hint of the Earthy Green tint (e.g., `rgba(47, 54, 50, 0.05)`) to make cards appear to float slightly above the cream background.
- **Layers:** Surface elevations are created by placing `#FAF9F6` elements on the `#FFFDD0` base. 
- **Interaction:** On hover, cards should lift slightly (y-offset increase) and the shadow spread should widen to provide tactile feedback.

## Shapes
The shape language is "Rounded," utilizing a 0.5rem (8px) base radius. This creates a soft, approachable container for sharp fashion photography. 
- **Cards:** Use `rounded-lg` (16px) for main product cards to emphasize the "soft" brand pillar.
- **Buttons:** Primary buttons use `rounded-xl` (24px) or full pill-shape to contrast against the more structured grid.
- **Inputs:** Maintain the base 8px radius for a clean, architectural look.

## Components
- **Buttons:** Primary buttons feature a Soft Mint background with Deep Charcoal text. Ghost buttons use a Sage Green outline.
- **Product Cards:** Image-centric with minimal text. Price and title are placed below the image. A small "Soft Mint" tag in the top-right indicates "Rental" vs "Buy."
- **Toggle Selectors:** Sliding segment controls for switching between "Rent" and "Buy" views, using the Cream background for the track and Soft Mint for the active thumb.
- **Image Upload Cards:** Large, dashed-border containers in Sage Green with a "plus" icon, designed to look like a premium frame awaiting a photo.
- **Inputs:** Clean, bottom-border only or very light four-sided borders (Sage Green at 20% opacity) that disappear when not focused to keep the UI minimal.
- **Chips:** Used for sizes and fabric types; these should be pill-shaped with light Sage Green backgrounds and dark text.
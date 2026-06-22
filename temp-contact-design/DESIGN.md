---
name: Luminous Sustainable Marketplace
colors:
  surface: '#fbf9f9'
  surface-dim: '#dbdad9'
  surface-bright: '#fbf9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#efeded'
  surface-container-high: '#e9e8e7'
  surface-container-highest: '#e4e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#404945'
  inverse-surface: '#303031'
  inverse-on-surface: '#f2f0f0'
  outline: '#717975'
  outline-variant: '#c0c8c3'
  surface-tint: '#3a6758'
  primary: '#3a6758'
  on-primary: '#ffffff'
  primary-container: '#a7d7c5'
  on-primary-container: '#325f51'
  inverse-primary: '#a1d1bf'
  secondary: '#5e5f5a'
  on-secondary: '#ffffff'
  secondary-container: '#e3e3dc'
  on-secondary-container: '#64655f'
  tertiary: '#506164'
  on-tertiary: '#ffffff'
  tertiary-container: '#bdd0d2'
  on-tertiary-container: '#485a5c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#bcedda'
  primary-fixed-dim: '#a1d1bf'
  on-primary-fixed: '#002118'
  on-primary-fixed-variant: '#214f41'
  secondary-fixed: '#e3e3dc'
  secondary-fixed-dim: '#c7c7c0'
  on-secondary-fixed: '#1b1c18'
  on-secondary-fixed-variant: '#464742'
  tertiary-fixed: '#d3e6e8'
  tertiary-fixed-dim: '#b7cacc'
  on-tertiary-fixed: '#0d1e20'
  on-tertiary-fixed-variant: '#394a4c'
  background: '#fbf9f9'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e2'
typography:
  display-lg:
    fontFamily: DM Sans
    fontSize: 48px
    fontWeight: '500'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: DM Sans
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: DM Sans
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: DM Sans
    fontSize: 20px
    fontWeight: '500'
    lineHeight: '1.4'
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
  label-md:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.02em
  label-sm:
    fontFamily: DM Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The design system is built for a premium circular fashion economy, emphasizing sustainability through an elegant, high-end lens. The brand personality is rooted in trust and clarity, positioning pre-loved fashion as a sophisticated lifestyle choice rather than a secondary market. 

The visual style is **Minimalist** with a focus on editorial-grade whitespace and high-quality imagery. It leverages a clean, airy aesthetic to reduce cognitive load, allowing the textures and colors of the garments to remain the focal point. The interface should feel breathable, intentional, and modern, moving away from the cluttered layouts often associated with traditional resale platforms.

## Colors
The palette is centered on a "Mint & Cream" harmony. 
- **Primary (Mint):** Used for key actions, focus states, and success indicators. It represents freshness and the eco-conscious nature of the platform.
- **Secondary (Cream):** Used as the primary background color for the entire interface to provide a warmer, more premium feel than pure white.
- **Tertiary (Charcoal):** A deep, muted green-grey used for typography to ensure high legibility while maintaining a softer contrast than pure black.
- **Neutral:** Used for secondary text, borders, and disabled states.

Surface colors should always favor the secondary cream, creating a "paper-like" tactile quality that feels sophisticated and archival.

## Typography
This design system utilizes **DM Sans** for its geometric clarity and understated elegance. The typographic hierarchy is designed with generous line heights to enhance readability and evoke a high-fashion editorial feel. 

Headlines should use tighter letter-spacing for a modern look, while labels and small captions use increased letter-spacing to maintain legibility. Use sentence case for most headings to keep the tone approachable, reserving uppercase exclusively for small labels or category tags.

## Layout & Spacing
The layout follows a **fluid grid** logic with significant margins to maintain the minimalist aesthetic. 
- **Desktop:** 12-column grid with 24px gutters and wide 64px side margins to center the content and provide "breathing room."
- **Mobile:** 4-column grid with 16px gutters and 20px margins.

Spacing is based on a 4px scale. Vertical rhythm should prioritize large "stack" spacing (32px+) between major sections to prevent the UI from feeling crowded. Content is largely card-based, which helps define boundaries without the need for heavy lines.

## Elevation & Depth
Depth is communicated through **ambient shadows** and **tonal layering**. 
- **Base Level:** The Cream background (Secondary Color).
- **Surface Level:** Cards and containers use pure white (#FFFFFF) to subtly pop against the cream background.
- **Shadows:** Use extremely soft, diffused shadows with a slight tint of the primary mint or tertiary charcoal (e.g., `box-shadow: 0 10px 30px rgba(45, 62, 64, 0.05)`). 

Avoid harsh borders. Depth should feel organic and light, as if elements are floating slightly above a soft surface.

## Shapes
The shape language is defined by generous, friendly curves. A **Rounded (Level 2)** approach is applied across the system to evoke a sense of softness and modernity. 
- Standard components (Inputs, Buttons): 0.5rem (8px).
- Large containers (Product Cards, Modals): 1rem (16px).
- Feature elements (Search bars, Pills): 1.5rem (24px) or fully pill-shaped.

Curvature should be consistent across all interactive elements to reinforce the approachable and trustworthy brand persona.

## Components
- **Buttons:** Primary buttons use the Mint color with Tertiary-colored text. They should have a large horizontal padding (24px+) to feel substantial. Secondary buttons are outlined in the Tertiary color with a transparent background.
- **Product Cards:** The core of the marketplace. Use White backgrounds with the standard 1rem corner radius and a soft ambient shadow. Product images should have a slight 4px radius within the card.
- **Chips & Tags:** Use pill-shaped containers with the Primary color at 15% opacity for "Rental" or "Available" status indicators.
- **Input Fields:** Use a subtle Tertiary-colored border at 10% opacity. Upon focus, the border transitions to the Primary Mint color with a soft outer glow.
- **Navigation:** Top navigation should be sticky with a backdrop-blur (glassmorphism) effect over the Cream background to maintain a sense of space as the user scrolls.
- **Lists:** Use generous vertical padding (16px) between items with a very light divider line to maintain the clean, fashion-forward look.
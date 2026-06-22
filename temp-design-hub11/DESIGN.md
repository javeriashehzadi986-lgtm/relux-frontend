---
name: Luminous Ecological Exchange
colors:
  surface: '#fbf9f8'
  surface-dim: '#dbd9d9'
  surface-bright: '#fbf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#efeded'
  surface-container-high: '#eae8e7'
  surface-container-highest: '#e4e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#424843'
  inverse-surface: '#303030'
  inverse-on-surface: '#f2f0f0'
  outline: '#727973'
  outline-variant: '#c1c8c1'
  surface-tint: '#436651'
  primary: '#163826'
  on-primary: '#ffffff'
  primary-container: '#2d4f3c'
  on-primary-container: '#9ac0a7'
  inverse-primary: '#a9cfb7'
  secondary: '#3c6842'
  on-secondary: '#ffffff'
  secondary-container: '#bdefbe'
  on-secondary-container: '#426e47'
  tertiary: '#32322b'
  on-tertiary: '#ffffff'
  tertiary-container: '#494941'
  on-tertiary-container: '#b9b8ae'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c5ecd2'
  primary-fixed-dim: '#a9cfb7'
  on-primary-fixed: '#002112'
  on-primary-fixed-variant: '#2c4e3b'
  secondary-fixed: '#bdefbe'
  secondary-fixed-dim: '#a2d3a4'
  on-secondary-fixed: '#002109'
  on-secondary-fixed-variant: '#24502c'
  tertiary-fixed: '#e4e3d8'
  tertiary-fixed-dim: '#c8c7bd'
  on-tertiary-fixed: '#1b1c16'
  on-tertiary-fixed-variant: '#474740'
  background: '#fbf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e2'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 42px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
  headline-sm:
    fontFamily: Hanken Grotesk
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
    letterSpacing: 0.05em
  caption:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style
The design system is rooted in "Ethical Minimalism"—a philosophy that balances high-end retail aesthetics with the warmth of environmental consciousness. The target audience consists of conscious consumers who value longevity over fast fashion trends. 

The visual style is a blend of **Minimalism** and **Soft Modernism**. It utilizes expansive whitespace to allow product photography to breathe, conveying a sense of calm and intentionality. The interface avoids urgency-driven patterns, opting instead for a serene, editorial feel that mimics a premium boutique experience. The emotional response should be one of "quiet luxury" that feels accessible, transparent, and grounded in nature.

## Colors
The palette is derived from natural landscapes to reinforce the sustainability narrative. 

- **Primary (Deep Forest):** Used for primary actions, heavy typography, and brand-critical iconography. It provides the "professional" anchor for the brand.
- **Secondary (Soft Mint):** A breath of fresh air used for subtle highlights, success states, and gentle background accents.
- **Surface (Warm Cream):** This replaces pure white as the primary background color to reduce eye strain and provide a tactile, organic paper-like feel.
- **Neutral (Slate Carbon):** A soft off-black used for body text and secondary information to maintain high legibility without the harshness of #000000.

## Typography
This design system uses a dual-sans serif approach to balance precision with friendliness. 

**Hanken Grotesk** is utilized for headlines and display text. Its sharp, contemporary cuts reflect the professional and modern aspect of the marketplace. For body copy and labels, **Plus Jakarta Sans** provides a softer, more approachable geometry that ensures high readability during long browsing sessions. 

Editorial spacing is key: headlines should have slightly tightened letter-spacing, while labels use generous tracking to create a premium, curated look.

## Layout & Spacing
The layout follows a **Fluid Grid** logic with exaggerated margins to evoke a high-fashion magazine aesthetic. 

- **Desktop:** A 12-column grid with a maximum container width of 1280px. Gutters are kept at 24px to maintain tight relationships between image and text within cards, while external page margins are wide (40px+) to frame the content.
- **Mobile:** A 2-column or 4-column grid. The 16px margin ensures content doesn't feel cramped on smaller devices.
- **Rhythm:** Spacing follows a 1:2:4 ratio. Small clusters (like tags or price/title) use 8px; larger groups (description to image) use 16px; and major sections use 32px or 64px to create distinct visual "chapters."

## Elevation & Depth
To maintain the "Calm" aesthetic, this design system avoids heavy drop shadows. Depth is communicated through **Tonal Layers** and **Ambient Shadows**.

- **Level 0 (Base):** The Cream background.
- **Level 1 (Cards):** Pure white surfaces with an extremely diffused, low-opacity shadow (4% opacity, 20px blur) and no offset. This makes items appear to "float" gently above the cream base.
- **Interactive States:** On hover, a card’s shadow should subtly deepen (6% opacity) or the card should scale 1% to provide tactile feedback without visual noise. 
- **Overlays:** Modals and menus use a backdrop blur (12px) to keep the user grounded in their previous context.

## Shapes
The shape language is organic and approachable. Standard UI elements (inputs, buttons, cards) utilize a **0.5rem (8px)** base radius. This strikes a balance between the precision of a professional platform and the softness of a nature-inspired brand.

For more lifestyle-oriented elements, like category chips or profile avatars, use the `rounded-xl` or full pill-shape to emphasize the "friendly" side of the brand. Secondary imagery (like sustainability badges) can utilize idiosyncratic organic shapes or "squircle" masks to reinforce the eco-friendly theme.

## Components
- **Buttons:** Primary buttons are solid "Deep Forest" with white text. Secondary buttons are "Soft Mint" with "Deep Forest" text. All buttons feature high horizontal padding (2.5x height) to feel more premium and balanced.
- **Product Cards:** The cornerstone of the marketplace. These should have a "full-bleed" image at the top with a 1:1 or 4:5 aspect ratio, followed by a padded info section using a 16px internal margin.
- **Chips & Tags:** Used for material types (e.g., "Organic Cotton") and sizes. These use the "Soft Mint" background with a slightly darker green text for high legibility and a pill-shaped radius.
- **Inputs:** Text fields use a subtle 1px border in a muted green-gray. On focus, the border transitions to "Deep Forest" with a soft 4px outer glow in "Soft Mint."
- **Sustainability Meters:** Instead of complex graphs, use simple, visual icons (like leaf counts or thread-spools) to denote the "eco-score" of an item.
- **Empty States:** Use hand-drawn, minimalist line illustrations in "Deep Forest" to maintain the artisanal feel of the brand.
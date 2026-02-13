# 🎨 Styling Guide - Cooperative Poker

This document outlines the standardized styling conventions used throughout the Cooperative Poker application.

## 🎯 Philosophy

- **Hybrid Approach**: Tailwind for layout/utilities + MUI for components + CSS Modules for complex animations
- **Consistency First**: Use predefined values from theme/config
- **Performance**: GPU-accelerated transforms, no layout-affecting animations
- **Dark Mode**: Primary theme with purple/dark purple palette

---

## 🎨 Color Palette

### Primary Colors
```typescript
primary: '#5D0F80'     // Main purple - buttons, primary UI
secondary: '#2C043E'   // Dark purple - accents, borders
table: '#7F1D1D'       // Red-950 - poker table background
highlight: '#FACC15'   // Yellow-400 - selected/active states
disabled: '#6B7280'    // Gray-500 - disabled elements
```

### Usage
```tsx
// Tailwind
<div className="bg-poker-primary text-white">
<div className="bg-poker-table">

// MUI
<Button color="primary">
<Paper sx={{ bgcolor: 'primary.main' }}>
```

---

## 📐 Spacing Scale

Use Tailwind's default spacing scale (4px increments):

```
gap-1  = 4px    p-1  = 4px
gap-2  = 8px    p-2  = 8px
gap-3  = 12px   p-3  = 12px
gap-4  = 16px   p-4  = 16px
gap-6  = 24px   p-6  = 24px
```

### Common Patterns
```tsx
// Card spacing
<Stack spacing={3}>  // 12px between cards

// Layout spacing
<Box sx={{ p: 4 }}>  // 16px padding

// Component gaps
<div className="flex gap-2">  // 8px gap
```

---

## 🃏 Card Styling

### Dimensions
```typescript
SMALL_CARD = 80px   // Other players' cards
BIG_CARD = 100px    // Current player's cards
height = width * 1.4  // Standard playing card ratio
```

### Border & Shadow
```css
/* Card borders */
.rounded-card { border-radius: 6px; }

/* Card shadows */
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);  /* Default */
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);  /* Hover */
```

### Card States
```tsx
// Normal card
<PlayingCard
  card={card}
  width={100}
  isFaceUp={true}
/>

// Highlighted card (selected/active)
<PlayingCard
  isHighlighted={true}
  // Adds: ring-2 ring-yellow-400 shadow-glow-yellow
/>

// Disabled card
<PlayingCard
  isDisabled={true}
  // Adds: opacity-50 grayscale cursor-not-allowed
/>
```

---

## ✨ Animation Guidelines

### Principles
1. **GPU-Accelerated Only**: Use `transform` (translate, scale, rotate)
2. **No Layout Shifts**: Fixed dimensions, absolute positioning
3. **Smooth Timing**: 200-400ms with easing
4. **60fps Target**: Avoid properties that trigger reflow

### Allowed Properties
✅ `transform: translate()`
✅ `transform: scale()`
✅ `transform: rotate()`
✅ `opacity`

❌ `width` / `height`
❌ `margin` / `padding`
❌ `top` / `left` (use translate instead)

### Animation Durations
```typescript
flipDuration: 300ms     // Card flip
hoverDuration: 200ms    // Hover effects
dealDuration: 400ms     // Deal animation
transitionDuration: 300ms  // General transitions
```

### Framer Motion Patterns
```tsx
// Deal animation
<motion.div
  initial={{ scale: 0.8, x: 100, y: -50, opacity: 0 }}
  animate={{ scale: 1, x: 0, y: 0, opacity: 1 }}
  transition={{ duration: 0.4, ease: 'easeOut' }}
/>

// Hover effect
<motion.div
  whileHover={{ y: -8, scale: 1.05 }}
  transition={{ duration: 0.2 }}
/>

// Tap effect
<motion.div
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.1 }}
/>
```

---

## 📦 Component Patterns

### Player Seats
```tsx
<PlayerSeat
  player={player}
  cards={cards}
  cardWidth={100}
  isCurrentPlayer={true}     // Shows "You" label
  isActivePlayer={true}      // Highlights with glow
  handDescription="Pair"     // Poker hand type
  numFigures={3}            // Figure count
  handValue={25}            // Point value
/>
```

### Layout Structure
```
FramerGame (bg-red-950, w-screen h-screen)
├── Options Display (top)
├── PlayerSeat × N (circular positioning)
│   ├── Avatar + Badge (card count)
│   ├── PlayerHand (rotated to center)
│   ├── Hand Description
│   └── Chips
└── Table (center)
    ├── Community Cards
    └── Table Chips
```

---

## 🎭 Shadow Scale

### Card Shadows
```css
shadow-md           /* Default card shadow */
shadow-lg           /* Elevated card */
shadow-card         /* Standardized card shadow */
shadow-card-hover   /* Hover state */
shadow-glow-yellow  /* Selection glow */
```

### Usage
```tsx
// Default card
className="shadow-card"

// Highlighted card
className="shadow-glow-yellow"

// MUI Paper elevation
<Paper elevation={3}>  // Standard
<Paper elevation={8}>  // Active player
```

---

## 🔤 Typography

### Font Family
- **Primary**: Roboto (300, 400, 500, 700)
- Loaded via Next.js Google Fonts

### Font Sizes
```typescript
variant="h3"      // Main headings
variant="h5"      // Section headings
variant="body1"   // Default text
variant="body2"   // Secondary text
variant="caption" // Small labels

// Tailwind custom
text-xxs   // 10px/12px
text-xxxs  // 8px/8px
```

---

## 📱 Responsive Patterns

### Breakpoints (MUI)
```typescript
xs: 0px
sm: 600px
md: 900px
lg: 1200px
xl: 1536px
```

### Circular Player Layout
```typescript
// Ellipse for landscape screens
radiusX: 42vw  // Horizontal radius
radiusY: 38vw  // Vertical radius

// Positioning formula
x = 50 + radiusX * Math.cos(theta)
y = 50 + radiusY * Math.sin(theta)
```

---

## 🛠 Best Practices

### DO ✅
- Use Tailwind for layout (flex, grid, positioning)
- Use MUI for structured components (Button, Paper, Avatar)
- Use CSS Modules for complex animations
- Keep animations GPU-accelerated
- Use theme colors consistently
- Memoize expensive calculations

### DON'T ❌
- Mix inline styles with utility classes
- Animate layout-affecting properties
- Create new color values (use theme)
- Use arbitrary values without reason
- Skip memoization for positioning

---

## 📚 Quick Reference

### Imports
```typescript
// Components
import { PlayingCard } from '@/client/components/AnimatedCard';
import { PlayerSeat } from '@/client/components/FramerGame';
import { motion } from 'framer-motion';

// MUI
import { Stack, Box, Paper, Typography, Avatar, Badge } from '@mui/material';

// Tailwind
className="flex flex-col gap-4 p-4 bg-poker-table"
```

### Common Classes
```typescript
// Layout
"flex flex-col items-center justify-center gap-4"
"absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"

// Cards
"rounded-md shadow-md outline outline-1 outline-black"

// Interactive
"cursor-pointer hover:scale-105 transition-transform"
```

---

## 🔄 Migration Notes

When updating existing components:

1. Replace inline colors with theme values
2. Replace arbitrary shadows with standardized scale
3. Use PlayingCard component for new card displays
4. Use PlayerSeat for player displays
5. Apply consistent spacing (gap-2, gap-4, etc.)
6. Ensure animations use transforms only

---

## 📖 Related Files

- `tailwind.config.js` - Tailwind configuration
- `src/theme.ts` - MUI theme configuration
- `src/client/components/AnimatedCard/AnimatedCard.module.css` - Card animations
- `src/client/components/AnimatedCard/PlayingCard.tsx` - Card component
- `src/client/components/FramerGame/PlayerSeat.tsx` - Player seat component

---

**Last Updated**: 2026-02-13
**Version**: 1.0.0

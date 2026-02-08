

## White Product Backgrounds and Search Bar Styling Fix

Making two styling improvements: white backgrounds for product images and fixing the search bar focus state.

---

### Changes Overview

#### 1. Search Bar Focus State Fix

**File:** `src/components/ui/input.tsx`

The current input has `focus-visible:bg-secondary/80` which darkens the background on focus. Removing this to keep the background consistent.

**Current:**
```css
focus-visible:bg-secondary/80
```

**Change to:**
Remove the focus background change entirely, keeping only the outline and shadow:
```css
focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30
```

---

#### 2. Product Card White Backgrounds

**File:** `src/components/ProductCard.tsx`

Changing the product image container from a gradient dark background to a clean white background.

**Current (line 28):**
```css
bg-gradient-to-br from-secondary via-secondary/50 to-secondary/30
```

**Change to:**
```css
bg-white
```

---

#### 3. DealsSection White Backgrounds

**File:** `src/components/DealsSection.tsx`

Same treatment for deal card images.

**Current (line 42):**
```css
bg-gradient-to-br from-destructive/10 via-secondary to-secondary/50
```

**Change to:**
```css
bg-white
```

---

### Summary of Files to Modify

| File | Change |
|------|--------|
| `src/components/ui/input.tsx` | Remove `focus-visible:bg-secondary/80`, add subtle ring instead |
| `src/components/ProductCard.tsx` | Change image container to `bg-white` |
| `src/components/DealsSection.tsx` | Change deal image container to `bg-white` |

---

### Visual Result

- **Search bar:** Background stays consistent (`bg-secondary/50`) when focused, with just a subtle ring to indicate focus state
- **Product cards:** Clean white backgrounds behind product images, creating a professional e-commerce look similar to Apple's product display style
- **Deal cards:** Same white background treatment for consistency


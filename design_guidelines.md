# Design Guidelines: Qarz Yozuvlarini Boshqarish Tizimi

## Design Approach
**Selected Framework**: Material Design-inspired system optimized for data-intensive business applications
**Rationale**: This is a utility-focused administrative tool requiring clear information hierarchy, efficient data entry, and professional polish suitable for daily business operations.

## Typography System
- **Primary Font**: Inter (Google Fonts) - excellent readability for data tables and forms
- **Headings**: 
  - H1: 2rem (32px), semibold - page titles
  - H2: 1.5rem (24px), medium - section headers, card titles
  - H3: 1.25rem (20px), medium - subsections
- **Body Text**: 0.875rem (14px), regular - table data, form labels
- **Small Text**: 0.75rem (12px), regular - metadata, timestamps, helper text
- **Labels**: 0.875rem (14px), medium - form field labels, badges

## Layout System
**Spacing Scale**: Use Tailwind units of 2, 4, 6, 8, 12, and 16 for consistent rhythm
- Component padding: p-4 or p-6
- Section gaps: gap-4 or gap-6
- Card spacing: p-6
- Form field spacing: space-y-4

**Layout Structure**:
- Sidebar navigation: 256px fixed width (w-64), left-aligned
- Main content area: Full remaining width with max-w-7xl container, px-8 horizontal padding
- Top header: h-16 fixed height with shadow

## Core Components

### Navigation
- **Sidebar**: Fixed left navigation with menu items, icons from Heroicons
- **Top Bar**: Logo, search bar, user profile, notifications
- **Menu Items**: Icon + text, hover state with subtle background, active state with accent border-left

### Data Tables
- **Structure**: Striped rows, hover highlight, sticky header
- **Headers**: Medium weight, subtle background (bg-gray-50)
- **Cells**: Consistent padding (px-4 py-3)
- **Status Badges**: Rounded-full pills with colored backgrounds (green for paid, yellow for partial, red for overdue)
- **Actions Column**: Compact icon buttons aligned right

### Forms
- **Layout**: Single column max-w-2xl, generous vertical spacing (space-y-6)
- **Input Fields**: 
  - Full width, h-10 minimum height
  - Border with focus ring (focus:ring-2)
  - Clear labels above inputs
  - Optional helper text below in muted color
- **Buttons**: 
  - Primary: Solid background, h-10, px-6, rounded-md
  - Secondary: Outline variant
  - Destructive actions: Red variant
- **Form Groups**: Group related fields with subtle background card (bg-gray-50, p-6, rounded-lg)

### Cards & Containers
- **Stats Cards**: Grid of 3-4 cards showing key metrics
  - Large number (text-3xl, font-bold)
  - Label below (text-sm, text-gray-600)
  - Icon in corner
  - Subtle border or shadow
- **Data Cards**: White background, rounded-lg, shadow-sm, p-6
- **List Cards**: Divide-y for separated items

### Modals & Overlays
- **Dialogs**: Centered, max-w-lg, rounded-lg, shadow-xl
- **Content**: p-6 with clear header, body, and footer sections
- **Backdrop**: Semi-transparent overlay (bg-black/50)

### Reports Section
- **Summary Cards**: Grid layout showing totals, paid, unpaid, overdue
- **Filters**: Horizontal layout with date pickers, dropdowns, search
- **Results**: Sortable table with export functionality

### Search & Filters
- **Search Bar**: Prominent placement in top bar, icon prefix
- **Filter Panel**: Collapsible sidebar or top row with chips for active filters
- **Quick Filters**: Button group for common statuses (Hammasi, To'langan, To'lanmagan, Kechikkan)

## Responsive Behavior
- **Desktop** (lg): Sidebar visible, multi-column forms where appropriate
- **Tablet** (md): Collapsible sidebar, single-column forms
- **Mobile**: Hidden sidebar with hamburger menu, stacked layout, simplified tables (consider card view)

## Accessibility
- All form inputs have visible labels
- Focus indicators on all interactive elements
- Sufficient color contrast (WCAG AA minimum)
- Keyboard navigation for all actions
- Screen reader labels for icon-only buttons

## Uzbek Language Considerations
- Text alignment: Left-to-right
- Ensure adequate spacing for potentially longer Uzbek text
- Use clear, business-appropriate Uzbek terminology
- Date format: DD.MM.YYYY (common in Uzbekistan)
- Number format: Space as thousands separator (10 000)

## Critical UI Patterns
- **Empty States**: Friendly illustrations with clear "Add first customer/debt" CTAs
- **Loading States**: Skeleton screens for tables, spinner for actions
- **Success/Error Messages**: Toast notifications in top-right corner
- **Confirmation Dialogs**: For delete/archive actions with clear consequences
- **Debt Status Indicators**: Color-coded badges visible at a glance

## Images
This is a data management application - minimal decorative imagery. If needed:
- **Login/Landing**: Optional branded illustration or photo of shop/business
- **Empty States**: Simple, friendly SVG illustrations
- **User Avatars**: Placeholder initials in colored circles

No large hero images required for this admin interface.
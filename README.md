# Developer Portfolio

Multilingual developer portfolio with a lightweight Git-based CMS.

**Live:** https://www.jiantao.dev

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- next-intl
- Vercel

## Features

- English, Swedish, and Chinese
- Localized routes: `/en`, `/sv`, `/zh`
- Multilingual About / CV content
- GitHub and Live Demo links for projects
- Media-query-driven responsive design with CSS design tokens
- Public CMS trial mode
- Local content dashboard
- Git-based publishing workflow
- Development-only file writing

## Architecture & Design Principles

The UI follows a clear separation of responsibilities:

```text
shadcn/ui
└── UI primitives

Tailwind CSS
├── Component styling
├── Page layout
├── Responsive behavior
└── Local visual adjustments

CSS variables
├── Design tokens
├── Colors
├── Typography
├── Spacing
└── Responsive sizing

Media queries
└── Breakpoint-specific design token overrides

Shared assets
└── Brand SVGs
```

In short:

> shadcn/ui manages UI primitives; Tailwind manages components and layout; CSS variables manage design tokens; media queries adjust those tokens across viewport sizes.

The project avoids scaling the entire page on larger displays. Instead, container widths, typography, spacing, navigation, controls, project cards, and dashboard dimensions are adjusted independently.

Brand assets also follow a single-source approach. The main SVG logo is stored once and reused across the Navbar and Footer, while each location controls its own responsive display size.

## DRY Principles

The project follows **DRY (Don't Repeat Yourself)** by keeping shared knowledge and behavior in a single source of truth.

Examples include:

- Locale metadata and locale types are defined centrally.
- Shared form field patterns are reused across CMS editors.
- Comma-separated value parsing is handled by a shared utility.
- Technology badges are rendered through a shared semantic component.
- Dashboard navigation states use shared variants.
- Design values such as colors, typography, spacing, and responsive sizing are controlled through shared design tokens.
- The main brand logo is stored once as a shared SVG asset and reused across the Navbar and Footer.
- shadcn/ui primitives centralize common control styles and variants.

DRY is applied to shared **knowledge and behavior**, rather than removing every repeated Tailwind class.

Similar-looking code is intentionally kept separate when it represents different semantic concepts or may evolve independently. This avoids over-abstraction while still maintaining a clear single source of truth for genuinely shared behavior.

## Routes

```text
/sv
/en
/zh

/trial
/trial/cv

/dashboard
/dashboard/cv
```

The root route detects the user's browser language and redirects to the matching locale.

If no supported language matches, it falls back to English.

## Content

```text
i18n/
└── locales/
    ├── en/
    ├── sv/
    └── zh/
```

About, Projects, Skills, and Education content is stored as multilingual JSON.

Project entries contain only relatively stable information:

```text
Title
Description
Status
Technologies
GitHub URL
Live Demo URL
```

Long-form Project Case Studies were removed to reduce duplicated documentation and maintenance.

Technical details and frequently changing project information are maintained in the corresponding GitHub repositories, while Live Demo links show the current product experience.

The portfolio acts as a curated entry point rather than a second documentation system.

## Dashboard

### Trial

```text
/trial
```

Public sandbox mode.

Changes only exist in browser state and are not written to source files.

### Local Dashboard

```text
/dashboard
```

Local CMS for editing portfolio content.

```text
Dashboard
   ↓
Next.js Route Handlers
   ↓
JSON
   ↓
Git
   ↓
Vercel
```

File-writing APIs are only enabled during development.

## Internationalization

Public UI and CMS interface translations use `next-intl`.

The CMS separates:

```text
Interface language
≠
Content language
```

For example, the CMS interface can be Chinese while editing Swedish portfolio content.

Locale definitions are maintained through a shared source of truth so routing, language selectors, and CMS language handling stay consistent.

## Responsive Design

The portfolio uses a mobile-first, media-query-driven responsive design system.

Responsive sizing is controlled primarily through shared CSS design tokens. Components consume these tokens without needing to know the current viewport breakpoint.

```text
Mobile defaults
    ↓
640px
    ↓
768px
    ↓
1024px
    ↓
1280px
    ↓
1536px
    ↓
1920px
    ↓
2560px+
```

The larger breakpoints are used for dedicated large-screen enhancements rather than scaling the entire interface.

Responsive values include:

```text
Container width
Page padding
Section spacing
Navigation sizing
Logo sizing
Hero typography
Project typography
Buttons and controls
Technology badges
Footer sizing
Dashboard sidebar
Dashboard editor width
```

The interface does not rely on page-level `zoom`, `scale`, or other whole-page transformations.

Instead, each part of the design can grow independently through CSS variables and media-query overrides. This keeps the interface readable and proportionally balanced across phones, tablets, laptops, Full HD displays, QHD displays, and larger screens.

### Responsive Branding

The main brand logo is stored as a shared SVG asset:

```text
public/
└── logo.svg
```

The same asset is used in multiple locations while each component controls its own responsive display size:

```text
logo.svg
   │
   ├── Navbar
   │   └── --nav-logo-height
   │
   └── Footer
       └── --footer-logo-height
```

The SVG keeps its intrinsic aspect ratio while CSS design tokens control its displayed height across breakpoints.

## Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Local dashboard:

```text
http://localhost:3000/dashboard
```

Trial:

```text
http://localhost:3000/trial
```

## Build

Create a production build:

```bash
npm run build
```

Start the production server locally:

```bash
npm run start
```

Content is version-controlled in Git and deployed through Vercel.

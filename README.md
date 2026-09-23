# Developer Portfolio

Multilingual developer portfolio with a lightweight Git-based CMS.

**Live:** [https://www.jiantao.dev](https://www.jiantao.dev)

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
- Responsive project cards
- GitHub and Live Demo links for projects
- Responsive UI
- Large-screen responsive enhancements
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
├── Typography scale
├── Spacing
└── Responsive sizing

Regular CSS
└── Features Tailwind is not well suited for
└── Selector-driven cases
```

In short:

> shadcn/ui manages UI primitives; Tailwind manages components and layout; CSS variables manage design tokens; regular CSS is reserved for cases where Tailwind is not a good fit.

The project avoids scaling the entire page on larger displays. Instead, typography, spacing, containers, controls, and layout dimensions can be adjusted independently through responsive design rules.

## DRY Principles

The project follows **DRY (Don't Repeat Yourself)** by keeping shared knowledge and behavior in a single source of truth.

Examples include:

- Locale metadata and locale types are defined centrally.
- Shared form field patterns are reused across CMS editors.
- Comma-separated value parsing is handled by a shared utility.
- Technology badges are rendered through a shared semantic component.
- Dashboard navigation states use shared variants.
- Design values such as colors, typography, spacing, and responsive sizing are controlled through shared design tokens.
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

Long-form project Case Studies were removed to reduce duplicated documentation and maintenance.

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

The portfolio uses a mobile-first responsive layout.

The interface does not rely on page-level `zoom`, `scale`, or other whole-page transformations.

Instead, individual design tokens and layout properties can adapt independently:

```text
Container width
Typography
Spacing
Navigation
Buttons and controls
Project cards
Dashboard sidebar
Editor width
```

This keeps the layout flexible across different viewport sizes without scaling the entire interface as one unit.

## Development

```bash
npm install
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

```bash
npm run build
```

Content is version-controlled in Git and deployed through Vercel.
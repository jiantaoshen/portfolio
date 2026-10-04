# Developer Portfolio (Updated 2026 Oct)

Multilingual developer portfolio with a lightweight local Git-based content dashboard.

**Live:** [https://www.jiantao.dev](https://www.jiantao.dev)

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- next-intl
- Vercel

## Features

- Language support: English, Swedish, and Chinese
- Localized portfolio routes: `/en`, `/sv`, `/zh`
- Localized dashboard routes: `/en/dashboard`, `/sv/dashboard`, `/zh/dashboard`
- Multilingual portfolio content stored as JSON
- Shared language-independent project and skill data
- Media-query-driven responsive design with CSS design tokens
- Local content dashboard for editing portfolio JSON
- Git-based publishing workflow

## Content Workflow

```text
Local Dashboard
      ↓
     JSON
      ↓
     Git
      ↓
   Vercel
```

Git remains the source of truth. The dashboard is only available for local development and writes changes directly to the project's JSON content files.

## Internationalization

Portfolio and dashboard routes are locale-based:

```text
/en
/sv
/zh

/en/dashboard
/sv/dashboard
/zh/dashboard
```

The dashboard UI language follows the locale in the URL, while portfolio content can be edited independently for each supported language.

Language-independent data such as skill names, project order, and technology groups is shared across locales.

## Responsive Design

The UI uses a responsive design token system.

```text
CSS variables
      ↓
Media-query overrides
      ↓
Components
```

This allows typography, spacing, containers, navigation, branding, and dashboard dimensions to scale independently without using whole-page `zoom` or `scale`.

## Development

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

Portfolio:

```text
http://localhost:3000/en
http://localhost:3000/sv
http://localhost:3000/zh
```

Local dashboard:

```text
http://localhost:3000/en/dashboard
http://localhost:3000/sv/dashboard
http://localhost:3000/zh/dashboard
```

## Build

```bash
npm run build
npm run start
```

Content is version-controlled in Git and deployed through Vercel.

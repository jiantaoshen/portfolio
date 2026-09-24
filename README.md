# Developer Portfolio

Multilingual developer portfolio with a lightweight local Git-based content dashboard.

**Live:** https://www.jiantao.dev

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- next-intl
- Vercel

## Features

- Language support: English, Swedish, and Chinese
- Localized routes: `/en`, `/sv`, `/zh`
- Multilingual portfolio content stored as JSON
- Media-query-driven responsive design with CSS design tokens
- Local content dashboard for editing portfolio JSON `/dashboard`
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

Git remains the source of truth. The dashboard is only used during local development.

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

Local dashboard:

```text
http://localhost:3000/dashboard
```

## Build

```bash
npm run build
npm run start
```

Content is version-controlled in Git and deployed through Vercel.

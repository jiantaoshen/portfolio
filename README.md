# Developer Portfolio

A multilingual developer portfolio built with Astro, React, TypeScript, and Tailwind CSS.

**Live site:**

https://www.jiantao.dev

## Tech Stack

* Astro
* React
* TypeScript
* Tailwind CSS
* Astro Content Collections
* Markdown
* Vercel

## Features

* English, Swedish, and Chinese support
* Static language routes under `/en/`, `/sv/`, and `/zh/`
* Multilingual About/CV content
* Markdown-based Project content
* Static HTML-first portfolio
* Responsive design
* Public dashboard Trial mode
* Local content management dashboard
* Project Edit / Preview views
* Git-based publishing workflow
* Development-only local content editor middleware

## Content Structure

```text
src/
├── content/
│   └── projects/
│       ├── en/
│       ├── sv/
│       └── zh/
│
└── i18n/locales/
    ├── en/
    ├── sv/
    └── zh/
```

Project content is stored in Markdown and validated with Astro Content Collections.

About, Skills, and Education content is stored as multilingual JSON.

## Dashboard

The project includes two dashboard modes.

### Trial

```text
/trial
```

A public sandbox where visitors can explore the editor interface.

Changes only exist in browser state and are never written to repository source files.

### Local Dashboard

```text
/dashboard
```

A local content editor built with React and integrated into the Astro development server.

```text
Dashboard
   ↓
Astro / Vite dev middleware
   ↓
JSON / Markdown
   ↓
Git commit
   ↓
Vercel rebuild
```

The local content editor middleware only runs during development and directly updates the portfolio source files.

No file-writing API is deployed to production.

## Development

Install dependencies:

```bash
npm install
```

Start the portfolio and local content editor:

```bash
npm run dev
```

The development environment runs as a single process:

```text
Astro / Vite
├── Portfolio
├── Dashboard
└── Local content editor middleware
```

Default local address:

```text
http://localhost:4321
```

No separate backend process is required.

## Architecture

The public portfolio follows a content-to-code approach:

```text
JSON / Markdown
       ↓
     Astro
       ↓
 Static Build
       ↓
    Vercel
```

Content remains version-controlled in Git instead of being stored in a production database.

The local dashboard provides a visual editing layer over the same source files.

During local development, Astro/Vite middleware handles content updates directly inside the same development process.

Production remains static:

```text
Vercel
├── Portfolio
└── Public Trial
    └── Browser-only changes
```

The deployed site does not expose persistent content-writing APIs.

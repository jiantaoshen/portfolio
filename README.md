# Developer Portfolio

A multilingual developer portfolio built with Astro, React, TypeScript, Tailwind CSS, and ASP.NET Core.

**Live site:**
https://www.jiantao.dev

## Tech Stack

* Astro
* React
* TypeScript
* Tailwind CSS
* ASP.NET Core
* Astro Content Collections
* Markdown
* Vercel

## Features

* English, Swedish, and Chinese support
* Static language routes under `/en/`, `/sv/`, and `/zh/`
* Multilingual About/CV content
* Markdown-based Blog and Project content
* Static HTML-first portfolio
* Responsive design
* Public dashboard Trial mode
* Local content management dashboard
* Blog and Project Edit / Preview tabs
* Git-based publishing workflow

## Content Structure

```text
src/

├── content/
│   ├── blog/
│   │   ├── en/
│   │   ├── sv/
│   │   └── zh/
│   │
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

Blog and Project content is stored in Markdown and validated with Astro Content Collections.

About, Skills, and Education content is stored as multilingual JSON.

## Dashboard

The project includes two dashboard modes.

### Trial

```text
/trial
```

A public sandbox where visitors can explore the editor interface.

Changes only exist in browser state and are never saved.

### Local Dashboard

```text
/dashboard
```

A local content editor built with React and ASP.NET Core.

```text
Dashboard
   ↓
ASP.NET Core
   ↓
JSON / Markdown
   ↓
Git commit
   ↓
Vercel rebuild
```

The ASP.NET Core backend is used only during local development and directly edits the portfolio source files.

## Development

Install dependencies:

```bash
npm install
```

Start Astro:

```bash
npm run dev
```

Start the local content backend:

```bash
cd backend/Career.Api
dotnet run
```

Default local addresses:

```text
Astro:   http://localhost:4321
Backend: http://127.0.0.1:5080
```

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

The local dashboard provides a visual editing layer over the same source files, while the deployed portfolio remains static and lightweight.

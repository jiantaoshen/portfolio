# Developer Portfolio

Multilingual developer portfolio with a lightweight Git-based CMS.

**Live:** https://www.jiantao.dev

## Tech Stack

* Next.js 16
* TypeScript
* Tailwind CSS v4
* shadcn/ui
* next-intl
* Markdown
* Vercel

## Features

* English, Swedish, and Chinese
* Localized routes: `/en`, `/sv`, `/zh`
* Multilingual About / CV content
* Markdown-based project pages
* Responsive UI
* Public CMS trial mode
* Local content dashboard
* Project edit and preview
* Git-based publishing workflow
* Development-only file writing

## Routes

```text
/sv
/en
/zh

/trial
/trial/cv
/trial/projects

/dashboard
/dashboard/cv
/dashboard/projects
```

The root route redirects to the language of user uses in the webbrowser. If no language match, then it redirects to English.

## Content

```text
content/
└── projects/
    ├── en/
    ├── sv/
    └── zh/

i18n/
└── locales/
    ├── en/
    ├── sv/
    └── zh/
```

Project content is stored in Markdown.

About, Skills, and Education content is stored as multilingual JSON.

## Dashboard

### Trial

```text
/trial
```

Public sandbox mode. Changes only exist in browser state and are not written to source files.

### Local Dashboard

```text
/dashboard
```

Local CMS for editing About/CV and project content.

```text
Dashboard
   ↓
Next.js Route Handlers
   ↓
JSON / Markdown
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

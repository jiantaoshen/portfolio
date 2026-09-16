---
lang: en
title: "Developer Portfolio"
description: "A multilingual portfolio and lightweight Git-based content management system (CMS) with a public CMS trial and local-only source content editing."
status: "Live"
order: 3
technologies:
  - "Next.js 16"
  - "TypeScript"
  - "Tailwind CSS v4"
  - "shadcn/ui"
  - "next-intl"
  - "GitHub"
  - "Vercel"
links:
  github: "https://github.com/jiantaoshen/portfolio-dev"
  live: "https://www.jiantao.dev"
draft: false
---

## Overview

This is a multilingual portfolio and lightweight Git-based content management system built with Next.js 16, TypeScript, Tailwind CSS v4, shadcn/ui and next-intl. The public site supports English, Swedish and Chinese through locale-specific routes and content. Project case studies are stored as Markdown, while structured profile content such as About, Skills and Education is maintained as multilingual JSON.

The project also includes two content editing experiences:

- A public Trial mode for exploring the CMS interface without persistent changes
- A local Dashboard for editing the repository's actual JSON and Markdown source files during development

The current architecture keeps Git as the source of truth, avoids a production content database and uses the same Next.js application for public rendering, CMS interfaces, localization and development-only content APIs.

---

## The Problem

A multilingual portfolio contains several types of content that need to stay organized and easy to maintain.

This project includes:

- About and CV information
- Skills and education
- Project metadata
- Long-form project case studies
- Content in English, Swedish and Chinese
- Public UI translations
- CMS interface translations

Editing all of this directly in JSON and Markdown files is manageable at a small scale, but becomes increasingly inconvenient as the content grows. At the same time, the portfolio does not need a conventional production CMS. The content changes relatively infrequently and naturally belongs alongside the application code. Introducing a database, authentication system, hosted CMS and permanent write API would add infrastructure that provides limited value wihile the costs are high. The goal was therefore to keep the advantages of content stored in GitHub while providing a more convenient editing workflow.

---

## Solution

The portfolio now uses a single Next.js App Router application. The core content flow remains intentionally simple:

```text
JSON / Markdown
      ↓
   Next.js
      ↓
Public Portfolio
      ↓
    Vercel
```

Project case studies are stored in Markdown. About, Skills and Education content is stored as multilingual JSON. The CMS operates directly on those same source files during local development.

```text
Local Dashboard
      ↓
Next.js Route Handlers
      ↓
JSON / Markdown
      ↓
   Git diff
      ↓
 Git commit
      ↓
   Vercel
```

The public `/trial` route uses the same editing interface but keeps all changes in browser/application state. No persistent write operation is performed in Trial mode. This preserves Git as the source of truth while still providing a visual content management workflow.

---

## Features

### Multilingual Portfolio

The portfolio supports:

```text
English
Swedish
Chinese
```

Public routes are locale-prefixed:

```text
/en
/sv
/zh
```

The root route redirects to Swedish:

```text
/
↓
/sv
```

Localized project pages follow the same structure:

```text
/en/projects/...
/sv/projects/...
/zh/projects/...
```

Each locale can maintain an independent version of the same project.

---

### Next.js App Router

The application uses the Next.js App Router.

The public portfolio is organized under:

```text
app/[locale]/
```

Project pages use a catch-all route:

```text
app/[locale]/projects/[...slug]/
```

This supports both simple and nested project paths.

Examples:

```text
/en/projects/light-manager
/sv/projects/light-manager
/zh/projects/light-manager
```

and:

```text
/en/projects/backend/example-project
```

---

### Multiple Root Layouts

The public site and CMS use separate root layouts.

```text
app/[locale]/layout.tsx
```

handles the localized portfolio.

```text
app/(career)/layout.tsx
```

handles the Trial and Dashboard experiences.

The `(career)` segment is a Next.js Route Group and does not appear in the URL.

This makes it possible to expose:

```text
/dashboard
/trial
```

without adding `/career` to the public route structure.

The separation also allows the public portfolio and CMS to use different request-level localization strategies while still sharing global styles and UI primitives.

---

### next-intl Localization

Internationalization is handled with `next-intl`.

The core configuration is stored under:

```text
i18n/
├── request.ts
├── routing.ts
└── locales/
```

Localized messages are organized by language:

```text
i18n/locales/
├── en/
├── sv/
└── zh/
```

Each locale currently contains message files such as:

```text
about.json
common.json
dashboard.json
home.json
project.json
```

Server Components use server-side translation helpers.

Client Components use translation hooks.

This replaced the project's earlier custom translation loader and reduced translation-specific glue code.

---

### Separate Interface and Content Languages

The CMS distinguishes between two different language concepts:

```text
CMS interface language
≠
Portfolio content language
```

The interface language controls labels such as:

```text
Save
Delete
Preview
Projects
Education
Skills
```

The content language controls which portfolio data is being edited.

For example:

```text
CMS interface
→ 中文

Content being edited
→ Svenska
```

The CMS interface locale is stored independently from the selected content locale.

This avoids coupling the language of the editor itself to the language of the content being managed.

---

### Markdown Project Content

Project case studies are stored under:

```text
content/
└── projects/
    ├── en/
    ├── sv/
    └── zh/
```

Each project is a Markdown file with structured frontmatter.

Example:

```yaml
---
lang: en
title: Example Project
description: Example project description
status: Live
order: 1
technologies:
  - Next.js
  - TypeScript
links:
  github: https://github.com/example/project
  live: https://example.com
draft: false
---
```

The Markdown body contains the long-form case study.

```markdown
## Overview

Project description...

## Architecture

Technical details...
```

The public project page also extracts Markdown headings to generate a table of contents.

---

### Multilingual JSON Content

Structured profile content such as About, Skills and Education is stored as JSON.

```text
i18n/locales/
├── en/
│   └── about.json
├── sv/
│   └── about.json
└── zh/
    └── about.json
```

Each language maintains its own content.

This keeps structured profile data separate from longer project case studies while retaining both formats inside the repository.

---

### Public Trial Mode

The portfolio includes a public CMS sandbox at:

```text
/trial
```

Additional routes include:

```text
/trial/cv
/trial/projects
```

Visitors can explore the editing interface and modify content without affecting repository files.

The changes exist only in temporary application state.

```text
Visitor
   ↓
Trial CMS
   ↓
Temporary browser state
```

No persistent content request is sent to the local write APIs.

This makes it possible to demonstrate the CMS publicly without exposing repository modification capabilities.

---

### Local Content Dashboard

The local Dashboard is available at:

```text
/dashboard
```

with sections including:

```text
/dashboard/cv
/dashboard/projects
```

The dashboard provides a visual editing layer over the same JSON and Markdown files used by the public portfolio.

The CV editor supports:

- Introduction
- Skills
- Skill categories
- Technologies
- Education
- Learning activities
- Education descriptions
- Thesis information
- Thesis links

The Project editor supports:

- Title
- Slug
- Project status
- Language
- Description
- Technologies
- GitHub URL
- Live URL
- Display order
- Published status
- Markdown content

The Project editor also provides separate:

```text
Edit
Preview
```

views.

This allows Markdown changes to be reviewed before writing them to disk.

---

### Development-Only Content APIs

Persistent local editing is implemented with Next.js Route Handlers.

Current endpoints include:

```text
PUT /api/local/about/[locale]

PUT /api/local/projects
DELETE /api/local/projects
```

The About endpoint writes to:

```text
i18n/locales/{locale}/about.json
```

The Project endpoint manages files under:

```text
content/projects/{locale}/
```

Project editing supports:

- Creating projects
- Updating existing projects
- Changing slugs
- Changing content language
- Moving projects between locale directories
- Markdown source files
- Existing MDX source discovery
- Deleting projects

When the slug or language changes, the new file is written before the previous source file is removed.

---

### Development-Only Writes

The local content API is intentionally unavailable in production.

Write handlers check the environment before performing any file operation.

```text
NODE_ENV === "development"
```

Requests outside development receive:

```text
403 Forbidden
```

The resulting security model is:

```text
Public Portfolio
→ Read-only

Public Trial
→ Temporary browser state

Local Dashboard
→ Development-only file writes
```

No persistent repository editing API is intentionally exposed in production.

---

### Shared UI System

The project uses:

```text
Tailwind CSS v4
+
shadcn/ui
+
semantic design tokens
```

Reusable UI primitives live under:

```text
components/ui/
```

Examples include:

```text
Button
Badge
Card
Input
Label
Textarea
Sheet
Alert
```

The public portfolio and CMS share the same component system.

This reduced duplicated UI patterns and made the Dashboard feel like part of the same product rather than a separate internal tool.

---

### Semantic Styling

The design system uses semantic Tailwind classes instead of scattered hard-coded application colors.

Examples include:

```text
bg-background
bg-muted
bg-primary

text-foreground
text-muted-foreground
text-primary

border-border
```

The underlying palette is defined centrally through CSS variables.

This makes visual changes easier to maintain and keeps public and CMS interfaces consistent.

---

## Architecture

### Public Site

```text
Localized JSON
      +
Localized Markdown
      ↓
   Next.js
      ↓
Server Components
      ↓
Generated Pages
      ↓
    Vercel
```

Localized routes and project pages are generated from repository content.

Git remains the source of truth.

---

### Local Content Management

```text
Dashboard
   ↓
Career Workspace
   ↓
Next.js Route Handlers
   ↓
Markdown / JSON
   ↓
Git
   ↓
Vercel
```

No separate backend process is required.

The Next.js development server provides:

```text
Next.js
├── Public Portfolio
├── Trial CMS
├── Local Dashboard
└── Development-only Route Handlers
```

---

## Migration from Astro to Next.js

The previous version of the portfolio was built with Astro. That architecture was a good fit when the project was primarily a statically generated portfolio. The original structure:

```text
Markdown / JSON
      ↓
    Astro
      ↓
 Static HTML
      ↓
   Vercel
```

The CMS was later added as a React interface.

Persistent local content editing was implemented through development-only middleware registered inside the Astro/Vite development server.

```text
React Dashboard
      ↓
Astro / Vite middleware
      ↓
Markdown / JSON
```

This successfully avoided introducing a separate backend service.

---

### Before

```text
Astro
├── Public portfolio
├── Static routes
├── Markdown content collections
│
├── React CMS
│   ├── Trial mode
│   └── Local dashboard
│
└── Astro / Vite middleware
    └── Development-only writes
```

---

### After

```text
Next.js
├── Localized portfolio
├── Project pages
├── Trial CMS
├── Local dashboard
├── Server Components
├── Client Components
├── next-intl
└── Route Handlers
    └── Development-only writes
```

The migration consolidated public rendering, CMS routing, localization and server-side functionality into a single framework.

---

### Migrating Routing

Astro's language-specific routes were replaced with a dynamic App Router locale segment:

```text
app/[locale]/
```

The portfolio still exposes:

```text
/en
/sv
/zh
```

but the routing logic is now centralized around the locale segment.

Project pages moved to:

```text
app/[locale]/projects/[...slug]/
```

The CMS routes were placed inside:

```text
app/(career)/
```

which keeps their URLs clean while allowing them to use a separate layout.

---

### Migrating Internationalization

The original project used a custom translation loader.

The Next.js version replaced that layer with `next-intl`.

This provided separate patterns for Server and Client Components and removed the need to manually pass large translation objects through the application.

The migration also expanded localization into the CMS itself.

This led to the separation between:

```text
interface locale
```

and:

```text
content locale
```

which is now an explicit part of the CMS architecture.

---

### Migrating Project Content

Astro Content Collections were removed.

The Markdown files themselves were retained.

Projects are now loaded directly from:

```text
content/projects/
```

Frontmatter continues to contain structured project metadata, while Markdown contains the case study body.

The important architectural choice remained unchanged:

```text
Content stays in Git.
```

Only the framework-specific content loading mechanism changed.

---

### Migrating the Local Editor API

The Astro version used custom Vite development middleware for content writes.

The Next.js version replaces that middleware with standard Route Handlers.

```text
Before

Dashboard
   ↓
Astro / Vite middleware
   ↓
Files
```

```text
After

Dashboard
   ↓
Next.js Route Handlers
   ↓
Files
```

This removed framework-specific server middleware while keeping the same development-only security boundary.

---

### Migrating the UI Layer

The migration also included a UI cleanup.

Older custom component and styling patterns were replaced with:

```text
shadcn/ui
+
Tailwind CSS v4
+
semantic design tokens
```

Shared components are now used across both the public portfolio and CMS.

This reduced duplicated styling and simplified future design changes.

---

### Migration Result

The migration changed the framework architecture without changing the project's underlying content philosophy.

The original design principle was:

```text
Content
→ Git
→ Static/public site
```

The current design principle remains:

```text
Content
→ Git
→ Next.js
→ Vercel
```

The main improvement is consolidation.

Instead of maintaining:

```text
Astro
+
React
+
Custom dev middleware
+
Custom i18n
```

the project now primarily relies on:

```text
Next.js
+
next-intl
+
Route Handlers
+
shared React components
```

The result is a simpler application boundary while preserving the lightweight Git-based workflow.

---

## Key Decisions

### Keeping Content in Git

Markdown and JSON remain the source of truth.

This keeps portfolio content version-controlled alongside the application code.

Every persistent content change can therefore be reviewed through:

```text
git diff
```

before being committed.

The workflow remains:

```text
Edit
  ↓
Review diff
  ↓
Commit
  ↓
Push
  ↓
Vercel deploy
```

This provides:

- Full history
- Easy rollback
- Reviewable content changes
- No CMS database
- No separate content backup strategy
- Portable Markdown and JSON

---

### Avoiding a Production CMS Database

The portfolio does not require frequent collaborative publishing or real-time production editing.

A production CMS database would therefore introduce:

- Additional infrastructure
- Authentication requirements
- API management
- Database hosting
- Content synchronization concerns
- More operational complexity

without providing enough value for the current use case.

Repository content is simpler and fits the project's update frequency.

---

### Development-Only Editing

Persistent editing is intentionally a local development feature.

This keeps the production application focused on presenting portfolio content rather than administering it.

The Dashboard provides convenience without turning the portfolio into a permanently writable production CMS.

---

### Separating Trial and Local Modes

The same core editor supports two different purposes.

```text
/trial
```

is public and non-persistent.

```text
/dashboard
```

is intended for local development and can modify source files.

This allows the CMS itself to be demonstrated as part of the portfolio without exposing write access.

---

### Using Markdown and JSON for Different Content Types

Different types of content use different storage formats.

Project case studies use Markdown because they contain long-form technical writing.

Structured profile content uses JSON because it consists of predictable fields and repeated structured objects.

```text
Markdown
→ Project case studies

JSON
→ About
→ Skills
→ Education
```

This avoids forcing all content into a single storage model.

---

### Separating UI Translation from Editable Content

Not every localized value has the same responsibility.

UI messages such as:

```text
Save
Delete
Projects
Preview
Back to projects
```

belong to the translation layer.

Actual portfolio information such as:

```text
About description
Education
Skills
Project summary
Project case study
```

is editable content.

The project is gradually keeping these responsibilities separate so that internationalization infrastructure does not become the content model itself.

---

### Removing the Blog

An earlier version of the portfolio included a multilingual technical Blog.

Maintaining long-form articles in several languages introduced significant translation and maintenance overhead while contributing relatively little to the portfolio's main purpose.

The Blog was therefore removed rather than expanded into a larger publishing platform.

Technical writing intended for professional visibility is better suited to platforms such as LinkedIn, where distribution and professional context already exist.

Project-specific technical decisions remain inside project case studies, where they directly support the systems being presented.

The portfolio is therefore focused around:

```text
About
→ Who I am

Skills
→ What I work with

Projects
→ What I have built

Project case studies
→ How the systems were designed and evolved

GitHub
→ Source code and development history

LinkedIn
→ Professional writing and communication
```

This reduces duplicated content and translation work while keeping the engineering evidence most relevant to the portfolio.

---

## Project Structure

A simplified view of the current repository:

```text
.
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── projects/
│   │       └── [...slug]/
│   │
│   ├── (career)/
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   └── trial/
│   │
│   ├── api/
│   │   └── local/
│   │
│   └── globals.css
│
├── career/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── server/
│   └── workspace.tsx
│
├── components/
│   ├── content/
│   ├── page/
│   └── ui/
│
├── content/
│   └── projects/
│       ├── en/
│       ├── sv/
│       └── zh/
│
├── i18n/
│   ├── request.ts
│   ├── routing.ts
│   └── locales/
│       ├── en/
│       ├── sv/
│       └── zh/
│
├── lib/
│   └── content/
│
├── next.config.ts
└── package.json
```

---

## Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The default local address is:

```text
http://localhost:3000
```

Public portfolio:

```text
http://localhost:3000/sv
http://localhost:3000/en
http://localhost:3000/zh
```

Local Dashboard:

```text
http://localhost:3000/dashboard
```

Trial:

```text
http://localhost:3000/trial
```

No separate backend process is required.

The development environment runs through Next.js:

```text
Next.js
├── Public portfolio
├── Trial CMS
├── Local Dashboard
└── Development-only Route Handlers
```

---

## Build

Create a production build with:

```bash
npm run build
```

The build validates the Next.js application, localized routes, TypeScript code and server/client component boundaries.

---

## Deployment

The portfolio is deployed through Vercel.

Content changes follow a Git-based workflow:

```text
Edit locally
     ↓
Review Git diff
     ↓
Git commit
     ↓
Git push
     ↓
Vercel rebuild
```

Persistent content writing is restricted to local development.

The public Trial remains available in production but does not persist changes.

---

## Current Architecture

```text
                 Git Repository
                       │
            ┌──────────┴──────────┐
            │                     │
      JSON Content          Markdown Content
            │                     │
            └──────────┬──────────┘
                       ↓
                    Next.js
                       │
       ┌───────────────┼────────────────┐
       │               │                │
Public Portfolio    Trial CMS     Local Dashboard
       │               │                │
       │          Browser state         ↓
       │                         Route Handlers
       │                                │
       │                         JSON / Markdown
       │                                │
       └────────────────┬───────────────┘
                        ↓
                       Git
                        ↓
                      Vercel
```

The repository remains the source of truth throughout the entire workflow.

## Portfolio's hisotry

My portfolio project originally started with only HTML and CSS. After I learned React during my studies, I migrated the website to React. Later, I encountered a problem related to JavaScript. When JavaScript was disabled in the browser, the website would not display properly. Because of this, I eventually migrated the project to Astro.

Around the same time, I also added a blog feature so I could publish and share my writing. However, as the blog grew, I found it difficult to manage the content manually. To solve this problem, I created my own CMS using C#. As the project continued to evolve, I wanted to simplify the overall architecture. I therefore replaced the C# CMS with a React-based solution and remove the blog feat. I also noticed another performance issue. My website would sometimes render the HTML first and load the CSS afterward. This was especially noticeable on slower internet connections, because users could briefly see an unstyled version of the page. I tried placing the CSS directly inside the HTML so that both could be delivered together, but this did not solve the problem.

Later, I learned that Next.js supports server-side rendering and can still deliver rendered HTML even when JavaScript is disabled in the browser. Because of this, I decided to migrate the website from Astro to Next.js.

## Lighthouse Results — Astro (Mobile)

**First Contentful Paint:** 0.8 s
**Largest Contentful Paint:** 0.8 s
**Total Blocking Time:** 0 ms
**Cumulative Layout Shift:** 0
**Speed Index:** 0.8 s

**Performance:** 100
**Accessibility:** 94

* Background and foreground colors do not have a sufficient contrast ratio.

**Best Practices:** 100
**SEO:** 100
**Agentic Browsing:** 2/2

I do not include the desktop results because the desktop performance is already better than the mobile performance.

## Lighthouse Results — Next.js (Mobile)

**First Contentful Paint:** 1.2 s
**Largest Contentful Paint:** 2.1 s
**Total Blocking Time:** 40 ms
**Cumulative Layout Shift:** 0
**Speed Index:** 3.9 s

**Performance:** 97

* Some JavaScript is unused.

**Accessibility:** 96

* Background and foreground colors do not have a sufficient contrast ratio.

**Best Practices:** 100
**SEO:** 100
**Agentic Browsing:** 2/2

## Future Improvements

My next goal is to improve the Next.js version so that its performance is as close as possible to the Astro version, while keeping the benefits of the new architecture.

---

## Future Improvements

- Improve performance
- Improve SEO 
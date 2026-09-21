---
lang: en
title: Portfolio
description: >-
  A multilingual portfolio and lightweight Git-based content management system
  (CMS) with a public CMS trial and local-only source content editing.
status: Live
order: 2
technologies:
  - Next.js
  - TypeScript
  - Tailwind CSS
  - shadcn/ui
  - next-intl
  - GitHub
  - Vercel
links:
  github: 'https://github.com/jiantaoshen/portfolio-dev'
  live: 'https://www.jiantao.dev'
draft: false
---

## Overview

This is a multilingual portfolio and lightweight Git-based content management system built with Next.js 16, TypeScript, Tailwind CSS v4, shadcn/ui and next-intl. The public site supports English, Swedish and Chinese through locale-specific routes and content. Project case studies are stored as Markdown, while structured profile content such as About, Skills and Education is maintained as multilingual JSON.

The project also includes two content editing experiences:

- A public Trial mode for exploring the CMS interface without persistent changes
- A local Dashboard for editing the repository's actual JSON and Markdown source files during development

The current architecture keeps Git as the source of truth, avoids a production content database and uses the same Next.js application for public rendering, CMS interfaces, localization and development-only content APIs.

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

## Result

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

## Trade-offs
Here I'll talk about my decision.

### Multilingual Portfolio

The reason I created a multilingual portfolio is that I want to improve both my language and documentation skills. The downside is that I have to manage a lot of documentation, which means I can't work on too many projects at the same time.

Right now, I don't have many projects to manage, so I'm fine with it. If the number of projects increases in the future, I may switch from a multilingual portfolio to a single-language portfolio to keep things simple and easier to maintain.

### Why I choose Next.js

> HTML/CSS -> React -> Astro -> Astro + C# -> Astro + React -> Next.js (now)

My portfolio project originally started with only HTML and CSS. After I learned React during my studies, I migrated the website to React. Later, I encountered a problem related to JavaScript. When JavaScript was disabled in the browser, the website would not display properly. Because of this, I eventually migrated the project to Astro.

Around the same time, I also added a blog feature so I could publish and share my writing. However, as the blog grew, I found it difficult to manage the content manually. To solve this problem, I created my own CMS using C#. As the project continued to evolve, I wanted to simplify the overall architecture. I therefore replaced the C# CMS with a React-based solution and remove the blog feat. I also noticed another performance issue. My website would sometimes render the HTML first and load the CSS afterward. This was especially noticeable on slower internet connections, because users could briefly see an unstyled version of the page. I tried placing the CSS directly inside the HTML so that both could be delivered together, but this did not solve the problem.

Later, I learned that Next.js supports server-side rendering and can still deliver rendered HTML even when JavaScript is disabled in the browser. Because of this, I decided to migrate the website from Astro to Next.js. The result is worse than Astro in Lighthouse test. Also, it could not reduce the JavaScript code that used in depolyment by using .vercelignore. But, user experience is better. I think better user experience is better than speed. 

#### Lighthouse Results — Astro (Mobile)

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

#### Lighthouse Results — Next.js (Mobile)

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

### JSON and Markdown

Most of my data is documentation-like content, and there are no complex relationships between the data. In this project, we often read the data once and use it directly. We do not need to perform complex queries or manage relationships between different pieces of data. JSON files are easy to set up when they contain a small amount of documentation-like content, so they work well for multilingual content such as the text on a landing page. However, as the documentation grows, JSON files become harder to read and maintain.

For longer documentation, Markdown files are a better choice. They may require more setup at the beginning, but I think the extra effort is worth it. I started using Markdown for project documentation when I began working with Astro. Since then, I have continued using it because Markdown makes documentation easier to write, read, and maintain.

### Public Trial Mode

Trial Mode is used to demonstrate the CMS I built. In the Astro version, it is relatively easy to create and maintain. However, it becomes more complex when the frontend and backend use the same programming language and framework.

This feature may be changed or removed in the future depending on how the project develops.

### Local Content Dashboard

The Local Content Dashboard makes it easier to edit JSON and Markdown documentation without having to open and modify the raw `.json` and `.md` files directly.

### Development-Only Content APIs

Development-only content APIs work well when the frontend and backend use different programming languages because the two parts can be separated more clearly. Now that everything is handled inside Next.js, this approach feels more complex and costly to maintain. Because of that, these APIs may be changed or removed in the future.

### Shared UI System

The Shared UI System makes it easier to maintain themes, CSS styles, and reusable UI elements across the project.

> **UI architecture rule:** shadcn/ui manages UI primitives; Tailwind CSS manages components and layout; CSS variables manage design tokens; regular CSS is only used for cases Tailwind is not well suited for or where dynamic content requires selectors.

The UI follows a clear separation of responsibilities:

```text
shadcn/ui
└── UI primitives

Tailwind CSS
└── Component styling
└── Page layout
└── Responsive behavior
└── Local visual adjustments

CSS variables
└── Design tokens
└── Colors
└── Typography scale
└── Spacing
└── Responsive sizing

Regular CSS
└── Features Tailwind is not well suited for
└── Selector-driven dynamic content
└── Markdown typography
```

In short, shadcn/ui manages UI primitives, Tailwind manages components and layout, CSS variables manage design tokens, and regular CSS is reserved for cases where Tailwind is not a good fit or where dynamic content requires selectors.

The project also follows **DRY (Don't Repeat Yourself)** by keeping shared knowledge and behavior in a single source of truth.

In this context:

- **Knowledge** means rules, definitions, configuration, and facts that the system needs to know. Examples include supported locales, locale labels, design tokens, responsive sizing rules, and shared navigation states.
- **Behavior** means reusable logic or operations that describe how the system does something. Examples include parsing comma-separated values, rendering shared technology badges, or applying the same form-field structure across CMS editors.

For example, supported locales should not be defined independently in several files:

```ts
export const locales = ["en", "sv", "zh"] as const;

export type Locale = (typeof locales)[number];
```

This keeps the list of supported locales as a single source of truth.

Reusable behavior follows the same principle. Instead of repeating the same parsing logic in several editors:

```ts
export function parseCommaList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
```

the shared utility is reused wherever that behavior is needed.

DRY is therefore applied to shared **knowledge and behavior**, rather than mechanically removing every repeated Tailwind class.

For example, two components may both use:

```tsx
<div className="flex flex-wrap gap-2">
```

without needing a shared abstraction if they represent different concepts and may evolve independently.

This avoids over-abstraction while still keeping genuinely shared rules and logic maintainable from a single place.


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

## Overview

This is a multilingual personal portfolio and a lightweight, Git-based content management system built with Next.js 16, TypeScript, Tailwind CSS v4, shadcn/ui, and next-intl.

The public website supports English, Swedish, and Chinese through localized routes and content. Structured profile content such as About, Projects, Skills, and Education is maintained in multilingual JSON files.

The project provides two ways to edit content:

- A public Trial mode for exploring the CMS interface without permanently saving changes
- A local Dashboard for editing the actual JSON source files in the repository during development

The current architecture continues to use Git as the single source of truth. It does not use a production content database, and the same Next.js application is responsible for rendering the public website, providing the CMS interface, handling localization, and exposing development-only content APIs.

The portfolio itself no longer serves as complete project documentation. Each project only keeps essential information such as a short description, technology stack, GitHub repository, and Live Demo. More detailed and frequently changing technical content is maintained in the corresponding project's GitHub repository.

## Problem

A multilingual portfolio contains several different types of content that need to remain well organized and easy to maintain.

This project includes:

- About and CV information
- Skills and education
- Project information
- English, Swedish, and Chinese content
- Public UI translations
- CMS interface translations

Earlier versions also included long-form Project Case Studies. Each Case Study documented the project's architecture, features, technical decisions, and development process.

This worked reasonably well when there were only a few projects and they did not change frequently. However, as the projects continued to evolve, a new problem gradually became clear:

The same project information started to exist in multiple places.

For example, when a project gained a new feature or changed its architecture, I might need to update:

```text
Actual project
↓
GitHub README
↓
Portfolio Project information
↓
Portfolio Case Study
↓
Different language versions
```

As a result, the Case Study gradually changed from something that explained the design process into another copy of the project documentation that had to be kept synchronized.

For projects that are still actively developed, this creates noticeable maintenance overhead. If every new feature, technology change, or architectural change also requires updating a long-form Case Study in the Portfolio, maintaining the Portfolio itself starts to consume time that could otherwise be spent improving the actual projects.

At the same time, this portfolio does not need a traditional production CMS. Content updates are relatively infrequent, and the content naturally fits alongside the application code.

Introducing a database, authentication system, hosted CMS, and permanent write APIs would add extra infrastructure while providing limited value and increasing maintenance costs.

Therefore, my goal gradually changed from:

> Keeping complete project documentation inside the Portfolio

to:

> Making the Portfolio quickly explain who I am, what I have built, and where users can find the most appropriate source for more detailed information.

## Result

The portfolio now uses a single Next.js App Router application.

The core content flow is intentionally simple:

```text
JSON
 ↓
Next.js
 ↓
Public Portfolio
 ↓
Vercel
```

About, Projects, Skills, and Education are all stored in multilingual JSON files.

Project entries only contain relatively stable information such as:

```text
Title
Description
Status
Technologies
GitHub URL
Live Demo URL
```

The Portfolio no longer stores separate long-form Project Case Studies.

During local development, the Dashboard edits these same JSON source files directly:

```text
Local Dashboard
      ↓
Next.js Route Handlers
      ↓
     JSON
      ↓
   Git diff
      ↓
 Git commit
      ↓
   Vercel
```

The public `/trial` route uses the same editing interface, but all modifications are kept only in browser or application state.

Trial mode never performs permanent writes.

This keeps Git as the single source of truth while still providing a visual content-management workflow.

## Trade-offs and Decisions

This section explains the reasoning behind several decisions made in the project.

### Multilingual Portfolio

I created a multilingual portfolio because I wanted to improve both my language skills and my ability to write documentation.

The downside is that every piece of translated content increases maintenance costs.

If a piece of content exists in English, Swedish, and Chinese, adding one long-term section effectively means maintaining three versions of it.

This was also one of the main reasons I later removed the long-form Case Studies.

The content currently kept in the portfolio is relatively short and changes infrequently, so the multilingual structure is still manageable.

If the amount of content grows significantly again in the future, I may reconsider whether every section still needs to be available in all three languages.

### Why I Chose Next.js

> HTML/CSS -> React -> Astro -> Astro + C# -> Astro + React -> Next.js (current)

My portfolio originally used only HTML and CSS.

After learning React, I migrated the website to React.

Later, I encountered an issue related to JavaScript: when JavaScript was disabled in the browser, the website could not render correctly. I eventually moved the project to Astro.

Around the same time, I added a blog for publishing and sharing articles.

As the amount of blog content increased, manually managing that content became more difficult. To solve this, I built my own CMS using C#.

As the project continued to evolve, I wanted to simplify the overall architecture. I replaced the C# CMS with a React-based solution and removed the blog.

I also noticed another performance-related issue: the site would sometimes render HTML first and load CSS afterward. This was especially noticeable on slower network connections because users could briefly see an unstyled page.

I tried inlining CSS directly into the HTML so both could be delivered together, but this did not solve the problem.

Later, I learned that Next.js supports server-side rendering and can still send pre-rendered HTML even when JavaScript is disabled in the browser.

Because of this, I decided to migrate the site from Astro to Next.js.

The Lighthouse results are slightly worse than the Astro version, and using `.vercelignore` also does not reduce the amount of JavaScript used in the deployment. However, the overall user experience is better.

For me, better user experience is more important than optimizing purely for speed.

#### Lighthouse Results — Astro (Mobile)

**First Contentful Paint:** 0.8 s

**Largest Contentful Paint:** 0.8 s

**Total Blocking Time:** 0 ms

**Cumulative Layout Shift:** 0

**Speed Index:** 0.8 s

**Performance:** 100

**Accessibility:** 94

- Background and foreground colors did not have sufficient contrast.

**Best Practices:** 100

**SEO:** 100

**Agentic Browsing:** 2/2

I did not include the desktop results because desktop performance was already better than mobile performance.

#### Lighthouse Results — Next.js (Mobile)

**First Contentful Paint:** 1.2 s

**Largest Contentful Paint:** 1.5 s

**Total Blocking Time:** 270 ms

**Cumulative Layout Shift:** 0

**Speed Index:** 1.9 s

**Performance:** 95

- Some JavaScript was unused.

**Accessibility:** 96

- Background and foreground colors did not have sufficient contrast.

**Best Practices:** 100

**SEO:** 100

**Agentic Browsing:** 2/2

### Why JSON

Most data in the current Portfolio is small-scale structured content without complex relationships.

For example:

```text
About
Projects
Skills
Education
```

This data usually only needs to be loaded once and then used directly during page rendering.

The project does not require:

- Complex queries
- Relationship management between different data models
- Real-time synchronization
- Multi-user concurrent editing

For the current scale, JSON is simple enough and also works well with the multilingual content structure used by next-intl.

Earlier versions used Markdown for longer Project Case Studies.

Markdown works well for long-form documentation because it is easier to read and write than large JSON strings.

However, after removing the Case Studies, the Portfolio no longer contains enough long-form content to justify maintaining a separate Markdown loader, schema, dynamic route, and editor.

Removing this part also makes the content model more consistent:

```text
Portfolio content
      ↓
     JSON
```

### Why I Removed Project Case Studies and the Blog

Earlier versions of the Portfolio included a multilingual technical blog and a separate Case Study for each project.

They were mainly used to document:

- Project background
- Technical decisions
- System architecture
- Implementation process
- Problems encountered
- Future improvements

The original goal was to make the Portfolio show not only the final result, but also how each project was designed and evolved.

However, as the projects continued to develop, I found that although the blog and Case Studies were not exactly the same, they eventually created similar problems:

```text
More long-form content
↓
More translation
↓
More synchronization
↓
More long-term maintenance
```

#### 1. Duplication with GitHub README Files

Projects usually already contain a README.

The README is closer to the actual codebase and can evolve together with the code.

For example:

```text
Architecture
Setup
Features
Technology stack
Deployment
Known limitations
```

If the same information also exists in the GitHub README, the blog, and the Portfolio Case Study, there are now three sources of project documentation.

If they are not updated at the same time, they may eventually describe different versions of the same project.

For technical details, it therefore makes more sense for the project's own repository to remain the primary documentation source.

#### 2. Feature Updates Created Additional Maintenance

Projects that are still actively developed continue to change.

For example:

```text
Adding a new authentication flow
Adding a new API
Changing the database schema
Adding a new UI feature
Changing the deployment architecture
```

These changes already require updates to the code and, when necessary, the README.

If the Portfolio also contains a complete Case Study, the same information has to be updated again.

In a multilingual Portfolio, this problem becomes even larger.

A single change could theoretically become:

```text
Code
↓
README
↓
English Case Study
↓
Swedish Case Study
↓
Chinese Case Study
```

Eventually, I found myself maintaining multiple descriptions of the same system purely to keep the Portfolio documentation synchronized.

The blog created the same kind of problem.

This did not align with my goal of reducing the Portfolio's long-term maintenance cost.

#### 3. Live Demo Already Shows the Product Result

If someone wants to understand what a project actually looks like, a Live Demo is the most direct source.

It shows the currently running version instead of a written snapshot of an older state.

Therefore:

```text
Portfolio
→ Short project introduction

Live Demo
→ What the project currently looks like

GitHub
→ How the project is implemented
```

These three entry points already serve different responsibilities.

Continuing to add Case Studies would create increasing overlap between the Portfolio and GitHub.

#### 4. The Main Purpose of a Portfolio Is Curation, Not Complete Documentation

Maintaining long-form articles in multiple languages creates a large amount of translation and maintenance work while contributing relatively little to the main purpose of the Portfolio.

If the goal of technical writing is professional visibility, platforms such as LinkedIn are more suitable because they already provide content distribution and a professional context.

The Portfolio does not need to store everything about me.

Its more important role is to help a first-time visitor quickly answer:

```text
Who is this person?
↓
What technologies do they mainly use?
↓
What have they built?
↓
Which projects are worth exploring further?
```

The Portfolio therefore works better as a curated entry point rather than a project documentation platform.

Each Project Card only keeps enough information to help users understand the project:

```text
Title
Description
Technologies
Status
Live Demo
GitHub
```

If someone is interested in a project, they can continue to the corresponding GitHub repository or Live Demo.

This also makes the Portfolio content more stable.

As long as the core purpose of a project does not change, adding internal features usually does not require updating the Portfolio.

#### 5. Removing the Blog and Case Studies Also Simplified the Codebase

The blog and Case Studies were not only a content-maintenance cost. Each also required its own implementation architecture.

After removing them, this code no longer needs to be maintained.

Project content can now be represented directly as:

```text
projects[]
├── title
├── description
├── status
├── technologies
├── githubUrl
└── liveUrl
```

This reduces not only the amount of documentation, but also the complexity of the application itself.

Therefore, removing the Blog and Case Studies does not mean they had no value.

For the current size and purpose of this Portfolio:

> **The additional information they provided no longer justified their long-term maintenance cost.**

Detailed and frequently changing information belongs in GitHub. The actual product experience belongs in the Live Demo. The Portfolio itself is responsible for providing a concise, stable, and curated entry point.

The Portfolio is therefore now centered around:

```text
About
→ Who I am

Skills
→ What technologies I use and learn

Projects
→ What I have built

Live Demo
→ What the project currently looks like

GitHub
→ Source code, technical documentation, and development history

LinkedIn
→ Professional writing and communication
```

This reduces duplicated content and translation work while giving each platform a clearer responsibility.

### Public Trial Mode

Trial mode is used to demonstrate the lightweight content-editing interface I built.

In the Astro version, this feature was relatively easy to create and maintain. However, when the frontend and backend use the same programming language and framework, I need to reconsider which editing capabilities are actually worth keeping.

The current Trial mode uses the same UI as the local Dashboard, but changes only exist in application state and are never written to the repository.

This feature may still be adjusted or removed in the future depending on how the project evolves.

### Local Content Dashboard

The local content Dashboard makes it easier to edit JSON content without manually opening and modifying raw `.json` files.

It currently manages:

```text
About
Projects
Skills
Education
```

By merging Projects into the same content-editing workflow, I no longer need a separate Project CMS.

This reduces duplicated logic across different editor pages, data models, and APIs.

### Development-Only Content API

The local Dashboard still needs a way to write edited content back into the JSON files stored in the repository.

Next.js Route Handlers therefore handle development-time file operations.

These APIs are not used for real-time content management in production.

The workflow remains:

```text
Dashboard
↓
Route Handler
↓
JSON
↓
Git
```

Because the Case Studies and Project Markdown have been removed, the API now has fewer content types to manage.

If maintaining the Dashboard itself eventually becomes more expensive than the value it provides, I may simplify this part further in the future.

### Shared UI System

The shared UI system makes it easier to maintain themes, CSS styling, and reusable UI elements consistently across the project.

The project's UI responsibilities are divided clearly:

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
├── Special CSS capabilities that are not well suited to Tailwind
└── Cases that require selectors
```

In simple terms:

> **shadcn/ui manages UI primitives; Tailwind CSS manages components and layout; CSS variables manage design tokens; regular CSS is reserved for special cases that Tailwind does not handle well.**

This prevents page layout, design system rules, and basic UI components from becoming mixed together.

For example, basic UI elements such as Button, Input, Card, Badge, and Checkbox are handled by shadcn/ui primitives.

Grid, Flexbox, spacing, and responsive page layouts are handled with Tailwind CSS.

Colors, typography sizes, spacing scales, and responsive sizing rules are managed through CSS variables.

The project also follows the **DRY (Don't Repeat Yourself)** principle by keeping genuinely shared knowledge and behavior in a single source of truth.

In this context, **Knowledge** and **Behavior** mean:

- **Knowledge:** rules, definitions, configuration, and facts that the system needs to know
- **Behavior:** reusable logic or processing that the system performs

For example, the languages supported by the project are Knowledge:

```ts
export const locales = ["en", "sv", "zh"] as const;

export type Locale = (typeof locales)[number];
```

If multiple files separately define:

```ts
["en", "sv", "zh"]
```

and:

```ts
type Locale = "en" | "sv" | "zh";
```

then the same knowledge — which languages the system supports — exists in multiple places.

By deriving the `Locale` type directly from `locales`, the definition of supported languages remains a single source of truth.

Behavior refers more to reusable logic.

For example, converting a comma-separated string into an array:

```ts
export function parseCommaList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
```

If different editors need the same processing logic, they share this utility instead of implementing the same behavior independently.

DRY is mainly applied to genuinely shared Knowledge and Behavior in the project, including:

- Centralized locale metadata and the `Locale` type
- Shared form Field structures in the Dashboard
- Shared parsing logic for comma-separated values
- Shared semantic components for Technology Badges
- Shared active/inactive navigation variants in the Dashboard
- Centralized design tokens
- Shared control styles and variants in shadcn/ui primitives

However, DRY does not mean eliminating every piece of code that happens to look similar.

For example, two different components may both contain:

```tsx
<div className="flex flex-wrap gap-2">
```

If they represent different business or design concepts and may evolve independently in the future, there is no need to create a shared abstraction simply because the Tailwind classes happen to be the same.

Therefore, the interpretation of DRY in this project is:

> **Avoid maintaining the same knowledge and behavior in multiple places, rather than mechanically eliminating every instance of repeated code.**

This helps preserve a single source of truth without introducing unnecessary abstraction.

### Keeping Content in Git

JSON remains the single source of truth for Portfolio content.

This allows the Portfolio content and application code to be version-controlled together.

Every permanent content change can therefore be reviewed using:

```text
git diff
```

before it is committed.

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
Vercel deployment
```

This provides:

- Complete version history
- Easy rollback
- Reviewable content changes
- No CMS database
- No separate content backup strategy
- Content and application code stored in the same repository

## Current Architecture

```text
                    Git Repository
                         │
                         ↓
                     JSON Content
                         │
                         ↓
                       Next.js
                         │
       ┌─────────────────┼──────────────────┐
       │                 │                  │
 Public Portfolio     Trial CMS       Local Dashboard
       │                 │                  │
       │            Browser State            ↓
       │                               Route Handlers
       │                                    │
       │                                   JSON
       │                                    │
       └──────────────────┬─────────────────┘
                          ↓
                         Git
                          ↓
                       Vercel
```

Throughout the entire workflow, the Git repository remains the single source of truth.

The public Portfolio is responsible for presenting curated information rather than duplicating complete project documentation:

```text
Portfolio
   │
   ├── About
   ├── Skills
   ├── Education
   │
   └── Projects
        │
        ├── Live Demo
        │    └── Current product experience
        │
        └── GitHub
             ├── Source Code
             ├── README
             └── Development History
```

This structure keeps the Portfolio itself simple while avoiding the need to maintain another set of constantly changing technical documentation just for presentation purposes.

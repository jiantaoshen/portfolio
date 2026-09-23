## Overview

This is a multilingual personal portfolio and a lightweight, Git-based content management system built with Next.js 16, TypeScript, Tailwind CSS v4, shadcn/ui, and next-intl.

The public website supports English, Swedish, and Chinese through localized routes and translated content. Structured profile content such as About, Projects, Skills, and Education is maintained in multilingual JSON files.

The project provides two ways to edit content:

- A public Trial mode for exploring the CMS interface without permanently saving changes
- A local Dashboard for editing the actual JSON source files in the repository during development

The current architecture continues to use Git as the single source of truth. It does not use a production content database, and the same Next.js application is responsible for rendering the public website, providing the CMS interface, handling localization, and exposing development-only content APIs.

The portfolio no longer tries to act as complete documentation for every project. Each project only keeps essential information such as a short description, technology stack, GitHub repository, and Live Demo. More detailed and frequently changing technical documentation is maintained in the corresponding project repository instead.

## Problem

A multilingual portfolio contains several different types of content that need to remain well organized and maintainable.

This project includes:

- About and CV information
- Skills and education
- Project information
- English, Swedish, and Chinese content
- Public UI translations
- CMS interface translations

Earlier versions also included long-form Project Case Studies. Each Case Study documented a project's architecture, features, technical decisions, and development process.

This worked reasonably well when there were only a few projects and those projects changed infrequently. However, as the projects continued to evolve, a new problem became increasingly obvious:

The same project information started to exist in multiple places.

For example, when a project gained a new feature or changed its architecture, I might need to update:

```text
Actual project
↓
GitHub README
↓
Portfolio project information
↓
Portfolio Case Study
↓
Different language versions
```

As a result, Case Studies gradually changed from being a useful explanation of project decisions into another copy of the project documentation that had to be kept synchronized.

For projects that are still actively developed, this creates noticeable maintenance overhead. If every new feature, technology change, or architectural change also requires updating a long-form Portfolio Case Study, maintaining the portfolio starts to consume time that could otherwise be spent improving the actual projects.

At the same time, this portfolio does not need a traditional production CMS. Content changes are relatively infrequent, and the content naturally fits alongside the application code.

Introducing a database, authentication system, hosted CMS, and permanent write APIs would increase infrastructure and operational complexity without providing enough value for this use case.

My goal therefore gradually changed from:

> Keeping complete project documentation inside the portfolio

to:

> Making the portfolio quickly explain who I am, what I have built, and where users can find the most appropriate source for more detailed information.

## Result

The portfolio now uses a single Next.js App Router application.

The core content flow is intentionally simple:

```text
JSON
 ↓
Next.js
 ↓
Public portfolio
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

The portfolio no longer stores separate long-form Project Case Studies.

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

This section explains the reasoning behind several architectural and product decisions in the project.

### Multilingual Portfolio

I created a multilingual portfolio because I wanted to improve both my language skills and my ability to write technical documentation.

The downside is that every piece of translated content increases maintenance cost.

If a section exists in English, Swedish, and Chinese, adding one long-term piece of content effectively means maintaining three versions of it.

This was also one of the reasons I eventually removed long-form Project Case Studies.

The portfolio now keeps most content relatively short and stable, which makes the multilingual structure manageable.

If the amount of portfolio content grows significantly again in the future, I may reconsider whether every section still needs to be available in all three languages.

### Why I Chose Next.js

> HTML/CSS -> React -> Astro -> Astro + C# -> Astro + React -> Next.js (current)

My portfolio originally used only HTML and CSS.

After learning React, I migrated the website to React.

Later, I encountered an issue related to JavaScript: when JavaScript was disabled in the browser, the website could not render correctly. I eventually moved the project to Astro.

Around the same time, I added a blog for publishing and sharing articles.

As the amount of blog content increased, manually managing that content became more difficult. To solve this, I built my own CMS using C#.

As the project continued to evolve, I wanted to simplify the architecture. I replaced the C# CMS with a React-based solution and removed the blog.

I also noticed another performance-related issue: the site would sometimes render HTML first and load CSS afterward. This was especially noticeable on slower network connections because users could briefly see an unstyled page.

I tried inlining CSS directly into the HTML so both could be delivered together, but this did not solve the problem.

Later, I learned that Next.js supports server-side rendering and can send pre-rendered HTML even when JavaScript is disabled in the browser.

Because of this, I decided to migrate the site from Astro to Next.js.

The Lighthouse results are slightly worse than the Astro version, and using `.vercelignore` does not reduce the amount of JavaScript used in the deployment. However, the overall user experience is better.

For me, improving the user experience is more important than optimizing purely for benchmark scores.

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

**Largest Contentful Paint:** 2.1 s

**Total Blocking Time:** 40 ms

**Cumulative Layout Shift:** 0

**Speed Index:** 3.9 s

**Performance:** 97

- Some JavaScript was unused.

**Accessibility:** 96

- Background and foreground colors did not have sufficient contrast.

**Best Practices:** 100

**SEO:** 100

**Agentic Browsing:** 2/2

### Why JSON

Most data in the current portfolio is small-scale structured content without complex relationships.

For example:

```text
About
Projects
Skills
Education
```

This data normally only needs to be loaded once and used directly during rendering.

The project does not require:

- Complex queries
- Relationship management between different data models
- Real-time synchronization
- Multi-user concurrent editing

For the current scale, JSON is simple and works well with the multilingual content structure used by next-intl.

Earlier versions used Markdown for longer Project Case Studies.

Markdown is well suited to long-form documentation because it is easier to read and write than large JSON strings.

However, after removing Case Studies, the portfolio no longer contains enough long-form content to justify maintaining a separate Markdown content system.

Keeping a Markdown loader, schema, dynamic routes, and editor would add complexity without providing enough value.

Removing that system makes the content model more consistent:

```text
Portfolio content
      ↓
     JSON
```

### Why I Removed Project Case Studies

Earlier versions of the portfolio included a separate Case Study for each project.

They were mainly used to document:

- Project background
- Technical decisions
- System architecture
- Implementation process
- Problems encountered
- Future improvements

The original goal was to show not only the final result, but also how each project was designed and evolved.

As the projects continued to develop, however, several practical problems became clear.

#### 1. Duplicate Content with GitHub README Files

Projects usually already contain a README.

The README is closer to the actual codebase and can evolve together with the code.

For example, it can document:

```text
Architecture
Setup
Features
Technology stack
Deployment
Known limitations
```

If the same information also exists inside a Portfolio Case Study, there are now two sources of project documentation.

If both are not updated at the same time, they can eventually describe different versions of the same project.

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

If the portfolio also contains a complete Case Study, the same information has to be updated again.

In a multilingual portfolio, this problem becomes even larger.

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

Eventually, I found myself maintaining multiple descriptions of the same system purely to keep the portfolio documentation synchronized.

This conflicted with my goal of reducing the portfolio's long-term maintenance cost.

#### 3. Live Demo Already Shows the Product Result

If someone wants to understand what a project actually looks like and how it behaves, a Live Demo is the most direct source.

It shows the currently deployed version instead of a written snapshot of an older state.

The responsibilities can therefore be separated more clearly:

```text
Portfolio
→ Short project introduction

Live Demo
→ What the project currently looks like

GitHub
→ How the project is implemented
```

These three entry points already cover different needs.

Adding a Case Study on top of them increasingly duplicated information already available elsewhere.

#### 4. The Main Purpose of a Portfolio Is Curation, Not Complete Documentation

I eventually reconsidered the primary responsibility of the portfolio itself.

It does not need to contain everything about me or every technical detail about my projects.

Its more important job is to help a first-time visitor quickly answer:

```text
Who is this person?
↓
What technologies do they work with?
↓
What have they built?
↓
Which projects are worth exploring further?
```

The portfolio therefore works better as a curated entry point rather than a complete project documentation platform.

Each Project Card now contains only enough information to help visitors understand the project:

```text
Title
Description
Technologies
Status
Live Demo
GitHub
```

If someone is interested in a project, they can continue to the corresponding GitHub repository or Live Demo.

This also makes the portfolio content more stable.

As long as the core purpose of a project does not change, adding internal features usually does not require updating the portfolio.

#### 5. Removing Case Studies Also Simplified the Codebase

Case Studies were not only a content-maintenance cost. They also required an entire implementation layer:

```text
Markdown files
↓
Markdown parser
↓
Project schema
↓
Dynamic project routes
↓
Case Study renderer
↓
Project editor
↓
Project content API
```

After removing Case Studies, none of these pieces are necessary anymore.

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

This reduces both documentation overhead and application complexity.

Removing Case Studies does not mean that they have no value.

It means that, for the current size and purpose of this portfolio:

> **The additional information provided by Case Studies no longer justifies their long-term maintenance cost.**

Detailed and frequently changing technical information belongs in GitHub. The current product experience belongs in the Live Demo. The portfolio itself remains a concise, stable, and curated entry point.

### Public Trial Mode

Trial mode exists to demonstrate the lightweight CMS interface I built.

In the Astro version, this feature was relatively easy to create and maintain. After moving the frontend and backend responsibilities into the same framework, I started reconsidering which editing capabilities were actually worth keeping.

The current Trial mode uses the same UI as the local Dashboard, but changes only exist in application state and are never written to the repository.

This feature may still be adjusted or removed in the future depending on how the project evolves.

### Local Content Dashboard

The local content Dashboard makes it easier to edit JSON content without manually opening and changing raw `.json` files.

It currently manages:

```text
About
Projects
Skills
Education
```

By merging Projects into the same content workflow, I no longer need a separate Project CMS.

This reduces duplicated logic across different editor pages, data models, and APIs.

### Development-Only Content API

The local Dashboard still needs a way to write edited content back into the JSON files stored in the repository.

Next.js Route Handlers therefore handle development-time file operations.

These APIs are not used for real-time production content management.

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

Because Project Markdown and Case Studies have been removed, the API now has fewer content types to manage.

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

Plain CSS
├── Special CSS capabilities that are not well suited to Tailwind
└── Cases that require selectors
```

In simple terms:

> **shadcn/ui manages UI primitives; Tailwind CSS manages components and layout; CSS variables manage design tokens; plain CSS is reserved for special cases that Tailwind does not handle well.**

This prevents page layout, design system rules, and low-level UI components from becoming mixed together.

For example, basic UI elements such as Button, Input, Card, Badge, and Checkbox are provided by shadcn/ui primitives.

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

If multiple editors need the same logic, they share this utility instead of implementing the same behavior independently.

DRY is mainly applied to genuinely shared Knowledge and Behavior in the project, including:

- Centralized locale metadata and the `Locale` type
- Shared form Field structures in the Dashboard
- Shared parsing logic for comma-separated values
- Shared semantic components for technology Badges
- Shared active/inactive navigation variants in the Dashboard
- Centralized design tokens
- Shared control styles and variants in shadcn/ui primitives

However, DRY does not mean eliminating every piece of code that happens to look similar.

For example, two unrelated components may both contain:

```tsx
<div className="flex flex-wrap gap-2">
```

If those components represent different product or design concepts and may evolve independently in the future, there is no need to create a shared abstraction simply because the Tailwind classes happen to match.

Therefore, the interpretation of DRY in this project is:

> **Avoid maintaining the same knowledge and behavior in multiple places, rather than mechanically removing every instance of repeated code.**

This helps preserve a single source of truth without introducing unnecessary abstraction.

### Keeping Content in Git

JSON remains the single source of truth for portfolio content.

This allows content and application code to be version-controlled together.

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

### Avoiding a Production CMS Database

This portfolio does not require frequent multi-user publishing or real-time editing in production.

Adding a production CMS database would introduce:

- Additional infrastructure
- Authentication requirements
- API management
- Database hosting
- Content synchronization concerns
- More operational complexity

For the current use case, these additional costs do not provide enough value.

Keeping content directly in the repository is simpler and better aligned with how frequently the portfolio is updated.

### Removing the Blog

Earlier versions of the portfolio included a multilingual technical blog.

Maintaining long-form articles in multiple languages required significant translation and maintenance work while providing relatively limited value to the portfolio's main purpose.

I therefore chose to remove the blog instead of continuing to expand the portfolio into a larger publishing platform.

If the goal of technical writing is professional visibility, platforms such as LinkedIn are more suitable because they already provide content distribution and a professional audience.

Later, I reconsidered Project Case Studies for similar reasons.

Blogs and Case Studies are not identical, but they eventually created a similar pattern:

```text
More long-form content
↓
More translation
↓
More synchronization
↓
More long-term maintenance
```

For individual projects, GitHub README files are a more natural place for technical documentation, while Live Demos show the current state of the product.

The portfolio is therefore now centered around:

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

The public portfolio is responsible for presenting curated information rather than duplicating complete project documentation:

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

This structure keeps the portfolio itself simple while avoiding the need to maintain another set of constantly changing technical documentation just for presentation purposes.
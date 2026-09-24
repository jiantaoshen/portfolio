## Overview

This is a multilingual personal portfolio and a lightweight, Git-based content management system. It supports English, Swedish, and Chinese through localized routes and content. Structured profile content such as About, Projects, Skills, and Education is maintained in multilingual JSON files, which are stored on GitHub and used as the single source of truth[^1].

The project provides a local Dashboard for directly editing the underlying JSON source files.

## Problem

A multilingual portfolio contains several types of content that need to remain well organized and easy to maintain. In this project, both the CV content and the UI/CMS interface text are available in English, Swedish, and Chinese.

The goal of this project is

> Making the Portfolio quickly explain who I am, what I have built, and where users can find the most appropriate source for more detailed information.

## Trade off

### Remove Technical blog and case study of projects

Earlier versions of the Portfolio included a multilingual technical blog and a separate case study for each project. However, as the projects continued to evolve, I found myself maintaining too much documentation at the same time. Whenever I updated a project, I need to write and revise README and case study, as well as write or revise the corresponding technical blog post. Even with the help of ChatGPT, this was still tedious. This went against the goal of the project. Therefore, I removed both the technical blog and the case studies.

The Portfolio is therefore now centered around:

- About -> Who I am
- Skills -> What technologies I use and learn
- Projects -> What I have built
- Live Demo -> What the project currently looks like
- GitHub -> Source code, technical documentation, and development history
- LinkedIn -> Professional writing and communication

## Why I used JSON

Most portfolio data is small-scale, structured content with few relationships, such as About, Projects, Skills, and Education. It is typically loaded once and consumed directly during page rendering.

The current project does not require complex queries, relational data modeling, real-time synchronization, or concurrent multi-user editing. At this scale, JSON provides a simple content model and integrates well with the multilingual structure used by next-intl.

## Why I used Next.js

Earlier versions of this project were also implemented with Astro, which was slightly faster than the version currently built with Next.js. However, since I plan to continue working with Next.js in the future, I chose to use Next.js for this project.

| LightHouse Test (Mobile) | Astro | Next.js (React) |
| --- | ---: | ---: |
| First Contentful Paint | 0.8 s | 1.2 s |
| Largest Contentful Paint | 0.8 s | 1.5 s |
| Total Blocking Time | 0 ms | 270 ms |
| Cumulative Layout Shift | 0 | 0 |
| Speed Index | 0.8 s | 1.9 s |

## Shared UI system

The UI architecture separates responsibilities across three layers:

- shadcn/ui provides UI primitives
- Tailwind CSS handles component styling and layout
- CSS variables define design tokens and cover cases not well suited to Tailwind

Shared UI logic follows the DRY (Don't Repeat Yourself) principle by keeping genuinely shared knowledge[^2] and behavior[^3] in a single source of truth.

## Responsive Design

The portfolio uses a media-query-driven responsive system built around shared CSS design tokens. Components consume responsive sizing tokens without depending on viewport breakpoints directly.

Larger breakpoints introduce targeted large-screen enhancements rather than scaling the interface globally. The layout avoids page-level zoom, scale, and other whole-page transformations; instead, individual elements adapt independently through CSS variables and media-query overrides.

This approach preserves readability and visual balance across phones, tablets, laptops, Full HD, QHD, and larger displays.

[^1]: Single source of truth means one authoritative place where the most accurate and up-to-date information is maintained.
[^2]: Knowledge: rules, definitions, configuration, and facts that the system needs to know
[^3]: Behavior: reusable logic or processing that the system performs

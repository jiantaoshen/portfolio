# Backend Migration Proposal

## Phase 0 — Migration Rationale

### Goal

Replace the existing ASP.NET Core local content editor with an equivalent implementation inside the Next.js application. The migration will consolidate the project into a single TypeScript/Next.js codebase while preserving the current content-editing behavior.

### Motivation

The existing ASP.NET Core backend has a very limited and specialized responsibility.

It is used only as a local development content editor for modifying portfolio source files, including:

- About page content
- Project content
- localized content for English, Swedish, and Chinese
- Markdown and JSON source files

The backend does not provide:

- a production API
- database access
- user authentication
- background jobs
- message queues
- webhooks
- complex server-side business logic

Maintaining a separate ASP.NET Core project for this small amount of functionality introduces unnecessary complexity.

The application already uses Next.js as its primary application framework. Moving the local editing functionality into Next.js allows the project to use a single technology stack and removes the need to maintain a separate .NET runtime, project structure, development server, and configuration.

The purpose of this migration is therefore not to add new functionality or replace .NET because of a technical limitation.

The purpose is to simplify the architecture and improve long-term maintainability.

### Current Architecture

```text
Next.js application
        │
        │ local HTTP requests
        ▼
ASP.NET Core local API
        │
        ▼
Portfolio source files
├── src/i18n/locales/
└── src/content/projects/
```

### Target Architecture

```text
Next.js application
├── UI
├── local content editing logic
├── validation
└── file operations
        │
        ▼
Portfolio source files
├── src/i18n/locales/
└── src/content/projects/
```

This removes the separate ASP.NET Core layer while preserving the same source-file-based content model.

## Scope

The migration includes replacing the current local API functionality:

```text
GET    /api/health
PUT    /api/local/about/{locale}
PUT    /api/local/projects
DELETE /api/local/projects
```

Equivalent Next.js functionality should preserve:

- English, Swedish, and Chinese locale validation
- About content validation
- Project validation
- slug validation
- path traversal protection
- duplicate content-path detection
- GitHub and live URL validation
- Markdown frontmatter generation
- JSON serialization
- atomic file writes
- deletion of old files when a project's slug or language changes
- deletion of project source files

## Non-Goals

This migration will not:

- introduce a database
- redesign the content model
- introduce authentication
- create a production CMS
- change the existing portfolio content format
- add unrelated features
- redesign the UI as part of the backend migration

Future UI improvements can be handled separately after the migration is complete.

## Environment

The current ASP.NET Core API is intentionally restricted to local development.

The Next.js replacement should preserve this constraint.

Content editing must not accidentally become a publicly accessible production API.

The source-file editing functionality is intended for local development because the portfolio content is stored directly in repository files.

Production deployments should continue to consume the generated source content rather than modify repository files at runtime.

## Success Criteria

The migration is complete when:

- the Next.js implementation can update About content correctly
- projects can be created and updated
- projects can be deleted
- changing a project slug or language correctly moves the source file
- generated Markdown remains compatible with the existing content format
- generated JSON remains compatible with the existing content format
- locale, slug, path, and URL validation behave correctly
- invalid paths cannot escape the allowed content directories
- the editing functionality remains development-only
- the existing portfolio works without the ASP.NET Core backend
- the .NET project can be safely removed

## Testing

The migration should verify the behavior that already exists rather than introduce a large new testing infrastructure.

The most important cases are:

### About content

- save English content
- save Swedish content
- save Chinese content
- reject unsupported locales
- reject invalid required content

### Project content

- create a project
- update a project
- change a project slug
- change a project language
- delete a project
- reject duplicate target paths
- reject invalid URLs
- reject invalid slugs
- reject path traversal attempts

### Environment

- editing works during local development
- editing functionality is unavailable in production

## Rollback Strategy

Because the backend is a local development tool rather than a production service, a complex production rollback strategy is unnecessary.

The existing ASP.NET Core project will remain in the repository until the Next.js implementation has passed the required tests.

If a migration issue is discovered during development, the local editor can temporarily continue using the existing .NET implementation.

Once the Next.js implementation is verified, the legacy ASP.NET Core project can be removed.

## Final Decision

The existing ASP.NET Core backend is technically valid, but its capabilities exceed what is required for the current application.

The portfolio only needs a small amount of local server-side functionality for editing source content.

Consolidating this functionality into Next.js reduces:

- technology-stack complexity
- local development setup
- dependency maintenance
- configuration overhead
- duplicated project structure

while preserving the behavior that the application already needs.

For the current scope of the portfolio, a separate ASP.NET Core backend is no longer necessary.
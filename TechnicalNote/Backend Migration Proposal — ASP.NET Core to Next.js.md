# Backend Migration Proposal

## Phase 0 — Migration Rationale

### Goal

Replace the existing ASP.NET Core local content editor with an equivalent TypeScript implementation integrated into the existing Astro application.

The migration will consolidate the project around the existing Astro and TypeScript stack while preserving the current content-editing behavior.

The goal is not to introduce a new backend framework, but to remove an unnecessary application boundary and simplify the overall architecture.

### Motivation

The existing ASP.NET Core backend has a very limited and specialized responsibility.

It is used only as a local development content editor for modifying portfolio source files, including:

* About page content
* Project content
* localized content for English, Swedish, and Chinese
* Markdown and JSON source files

The backend does not provide:

* a production API
* database access
* user authentication
* background jobs
* message queues
* webhooks
* complex server-side business logic

Maintaining a separate ASP.NET Core project for this small amount of functionality introduces unnecessary complexity.

The portfolio already uses Astro and TypeScript as its primary application stack. Astro provides sufficient server-side capabilities for the small amount of local content-editing functionality required by the project.

Moving this functionality into the existing Astro application removes the need to maintain:

* a separate .NET runtime
* a separate C# project
* a separate local backend server
* separate backend configuration
* additional backend dependencies and tooling

The purpose of this migration is therefore not to replace .NET because of a technical limitation.

The existing ASP.NET Core implementation is technically valid and capable.

The purpose is to simplify the architecture, reduce maintenance overhead, and align the implementation with the actual requirements of the project.

---

### Current Architecture

```text
Astro application
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

The current architecture requires two separate application environments:

```text
Astro / TypeScript / Node.js
+
ASP.NET Core / C# / .NET
```

This separation provides little benefit for the current scope of the application because the ASP.NET Core backend is only used for a small number of local file-editing operations.

---

### Target Architecture

```text
Astro application
│
├── UI
│
├── local server endpoints
│
├── content editing logic
│
├── validation
│
├── path safety
│
└── file-system operations
        │
        ▼
Portfolio source files
├── src/i18n/locales/
└── src/content/projects/
```

The target architecture keeps the existing source-file-based content model while removing the separate ASP.NET Core layer.

The content editor will remain server-side and development-only.

The Astro application will be responsible for both the portfolio UI and the small amount of local server-side functionality required to maintain portfolio content.

---

## Scope

The migration includes replacing the current local ASP.NET Core API functionality:

```text
GET    /api/health

PUT    /api/local/about/{locale}

PUT    /api/local/projects

DELETE /api/local/projects
```

Equivalent Astro/TypeScript functionality should preserve:

* English, Swedish, and Chinese locale validation
* About content validation
* Project validation
* slug validation and normalization
* path traversal protection
* duplicate content-path detection
* GitHub and live URL validation
* Markdown frontmatter generation
* JSON serialization
* atomic file writes
* deletion of old files when a project's slug or language changes
* deletion of project source files

Where practical, the existing API paths and behavior should remain compatible during the migration.

The migration should focus on behavior preservation rather than redesign.

---

## Non-Goals

This migration will not:

* introduce a database
* redesign the content model
* introduce authentication
* create a production CMS
* introduce a separate Node.js backend service
* introduce Next.js or another application framework
* change the existing portfolio content format
* add unrelated features
* redesign the UI as part of the backend migration

Future UI improvements can be handled separately after the backend consolidation is complete and stable.

---

## Environment

The current ASP.NET Core API is intentionally restricted to local development.

The Astro replacement must preserve this constraint.

Content editing must not accidentally become a publicly accessible production capability.

The source-file editing functionality exists specifically for local development because portfolio content is stored directly in repository files.

The intended workflow remains:

```text
Local content editor
        ↓
Repository source files
        ↓
Git commit
        ↓
Git push
        ↓
Vercel deployment
```

Production deployments should consume the committed source content.

They should not modify repository content files at runtime.

The production environment must therefore disable the local content-editing functionality before any file write or delete operation can occur.

---

## Success Criteria

The migration is complete when:

* the Astro/TypeScript implementation can update About content correctly
* projects can be created and updated
* projects can be deleted
* changing a project slug or language correctly moves the source file
* generated Markdown remains compatible with the existing content format
* generated JSON remains compatible with the existing content format
* locale validation behaves correctly
* slug validation and normalization behave correctly
* URL validation behaves correctly
* invalid paths cannot escape the allowed content directories
* path traversal attempts are rejected
* file writes remain safe
* the editing functionality remains development-only
* production deployments cannot modify repository content through the local editor
* the existing portfolio works without the ASP.NET Core backend
* the standalone .NET project can be safely removed

---

## Testing

The migration should verify existing behavior rather than introduce unnecessary testing complexity.

Automated tests should focus primarily on behavior that could cause content corruption, unsafe file access, or migration regressions.

The most important cases are:

### Shared Infrastructure

* accept supported locales
* reject unsupported locales
* normalize valid project slugs
* reject unsafe project slugs
* accept valid HTTP/HTTPS URLs
* reject invalid URLs
* reject path traversal attempts
* allow valid content paths
* write files safely
* replace existing files safely
* delete existing files safely
* handle missing files predictably

### About Content

* save English content
* save Swedish content
* save Chinese content
* reject unsupported locales
* reject invalid required content
* preserve the existing JSON structure

### Project Content

* create a project
* update a project
* change a project slug
* change a project language
* delete a project
* remove the previous file when its path changes
* reject duplicate target paths
* reject invalid URLs
* reject invalid slugs
* reject path traversal attempts
* preserve the existing Markdown and frontmatter structure

### Environment

* editing works during explicitly enabled local development
* editing is disabled when the local editor is not enabled
* editing functionality is unavailable in production

---

## Rollback Strategy

Because the backend is a local development tool rather than a production service, a complex production rollback strategy is unnecessary.

The existing ASP.NET Core project will remain in the repository while the Astro/TypeScript replacement is implemented and tested.

During the migration, the ASP.NET Core implementation will continue to serve as the reference implementation for expected behavior.

If a migration issue is discovered during development, the local editor can temporarily continue using the existing ASP.NET Core implementation while the issue is corrected.

The migration will therefore follow this sequence:

```text
Existing ASP.NET Core implementation
        ↓
Build Astro/TypeScript replacement
        ↓
Compare behavior
        ↓
Run automated and manual tests
        ↓
Use the new implementation locally
        ↓
Stabilize
        ↓
Remove legacy ASP.NET Core backend
```

The ASP.NET Core project will only be removed after the replacement implementation has been verified.

---

## Final Decision

The existing ASP.NET Core backend is technically valid, but a standalone backend application is no longer justified by the current requirements of the portfolio.

The project only requires a small amount of local server-side functionality for editing repository-based content.

The existing Astro application already provides an appropriate environment for implementing this functionality with TypeScript.

Consolidating the local content editor into Astro reduces:

* technology-stack complexity
* local development setup
* dependency maintenance
* configuration overhead
* duplicated project structure
* the number of runtimes developers need to understand and maintain

while preserving the behavior that the application already requires.

The migration follows a simple architectural principle:

> Use the simplest architecture that satisfies the requirements.

For the current scope of the portfolio, Astro and TypeScript provide sufficient server-side capability, and maintaining a separate ASP.NET Core backend is no longer necessary.

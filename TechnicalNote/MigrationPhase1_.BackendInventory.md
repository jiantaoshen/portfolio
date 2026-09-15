# Phase 1 — Legacy Backend Inventory

## Objective

Document the current ASP.NET Core backend before beginning the migration to Next.js.

The purpose of this phase is to establish a clear baseline of the backend's existing responsibilities, behavior, validation rules, and file operations.

No functional changes are introduced during this phase.

---

## Current Backend Responsibility

The ASP.NET Core backend is a small development-only content editing service.

Its primary responsibility is to modify portfolio source files during local development.

It does not act as a general-purpose production backend.

### Current capabilities

The backend currently supports:

* health checking
* updating localized About content
* creating and updating project content
* deleting project content
* validating supported locales
* validating project slugs and URLs
* protecting content paths from invalid or unsafe file access
* writing JSON and Markdown source files

---

## Existing API Endpoints

### Health Check

```text
GET /api/health
```

Purpose:

Verify that the local backend is running.

---

### Update About Content

```text
PUT /api/local/about/{locale}
```

Supported locales:

```text
en
sv
zh
```

Purpose:

Update localized About content stored in the portfolio source files.

Responsibilities include:

* locale validation
* request validation
* JSON serialization
* safe file writing

---

### Create or Update Project

```text
PUT /api/local/projects
```

Purpose:

Create or update localized project content.

Responsibilities include:

* validating project data
* validating locale
* validating slug
* validating GitHub and live URLs
* generating Markdown frontmatter
* determining the target content path
* preventing duplicate target paths
* writing the project Markdown file
* removing the previous source file when a slug or locale changes

---

### Delete Project

```text
DELETE /api/local/projects
```

Purpose:

Delete an existing project source file.

Responsibilities include:

* validating the requested project path
* ensuring the path belongs to the permitted project content directory
* deleting the source file

---

## Content Storage

The backend does not use a database.

Content is stored directly in repository source files.

### About content

```text
src/i18n/locales/
```

The About content is stored as localized JSON.

### Project content

```text
src/content/projects/
```

Projects are stored as Markdown files with frontmatter.

---

## Database

No database is currently used by the backend.

Therefore, the migration does not require:

* database migration
* schema migration
* ORM replacement
* data synchronization

The existing source-file-based content model will remain unchanged.

---

## Authentication and Authorization

The backend currently does not implement user authentication.

It is designed to run only during local development.

The Next.js replacement must preserve this constraint.

The local content editing functionality must not accidentally become a publicly accessible production API.

---

## Background Processing

The current backend does not use:

* background workers
* scheduled jobs
* message queues
* event consumers
* asynchronous processing infrastructure

No equivalent infrastructure needs to be migrated.

---

## External Services

The current backend does not depend on external backend services for its core content editing functionality.

There are no migration requirements for:

* payment providers
* email providers
* external authentication providers
* message brokers
* webhook integrations

---

## Validation Rules

The Next.js implementation must preserve the validation behavior of the existing backend.

### Locale Validation

Only the following locales are supported:

```text
en
sv
zh
```

Unsupported locales must be rejected.

### Project Slug Validation

Project slugs must continue to follow the existing accepted format.

Invalid or unsafe slugs must be rejected.

### URL Validation

Where project URLs are provided, values such as GitHub and live-site URLs must continue to be validated.

### Path Safety

File operations must remain restricted to the intended content directories.

User-controlled values must not allow path traversal outside those directories.

For example, values attempting to access paths such as:

```text
../../
```

must never be allowed to escape the configured content directory.

---

## File Operations

The current backend performs direct source-file operations.

The migration must preserve the following behavior:

### About

```text
request
    ↓
validate locale and content
    ↓
serialize JSON
    ↓
write localized source file
```

### Project Create

```text
request
    ↓
validate project
    ↓
generate content path
    ↓
generate Markdown/frontmatter
    ↓
write source file
```

### Project Update

```text
request
    ↓
validate project
    ↓
determine old and new paths
    ↓
write updated source file
    ↓
remove old source file when necessary
```

### Project Delete

```text
request
    ↓
validate path
    ↓
confirm allowed content directory
    ↓
delete source file
```

---

## Environment Constraints

The current ASP.NET Core backend is intended for development use only.

This behavior must remain explicit after migration.

Target behavior:

```text
Development
    → local content editing enabled

Production
    → local source-file editing disabled
```

The production Vercel deployment should consume repository content but should not be treated as persistent storage for content editing.

---

## Current Architecture

```text
Next.js application
        │
        │ HTTP
        ▼
ASP.NET Core local backend
        │
        ▼
Source files
├── src/i18n/locales/
└── src/content/projects/
```

---

## Migration Target

```text
Next.js application
├── UI
├── local editing endpoints
├── validation
├── content services
└── file operations
        │
        ▼
Source files
├── src/i18n/locales/
└── src/content/projects/
```

The migration removes an unnecessary application boundary without changing the underlying content model.

---

## Items Requiring Review

### Blog Model

The legacy backend contains Blog-related code, but the currently exposed API does not provide a Blog editing endpoint.

Before migration, determine whether this code is:

* planned for future use, or
* obsolete legacy code

If it is obsolete, it does not need to be migrated.

### Build Artifacts

Generated .NET directories such as:

```text
bin/
obj/
```

should not be considered part of the migration.

If tracked by Git, they should be removed and ignored.

---

## Migration Behavior Checklist

The following behavior must be verified before the .NET backend is removed.

### About

* English About content can be saved.
* Swedish About content can be saved.
* Chinese About content can be saved.
* Unsupported locales are rejected.
* Invalid content is rejected.
* Existing JSON format remains compatible.

### Projects

* A new project can be created.
* An existing project can be updated.
* A project slug can be changed.
* A project locale can be changed.
* The old file is removed after a path-changing update.
* A project can be deleted.
* Duplicate destination paths are rejected.
* Invalid slugs are rejected.
* Invalid URLs are rejected.
* Path traversal attempts are rejected.
* Existing Markdown/frontmatter format remains compatible.

### Environment

* Editing works locally.
* Editing endpoints are unavailable or protected in production.
* The portfolio continues to build successfully after content changes.

---

## Phase 1 Exit Criteria

Phase 1 is complete when:

* all current API endpoints have been documented
* backend responsibilities have been identified
* content storage locations have been documented
* validation requirements have been identified
* file system behavior has been documented
* unused or questionable legacy code has been identified
* the behavior checklist for the Next.js implementation is complete

No migration implementation should begin until this baseline is understood.

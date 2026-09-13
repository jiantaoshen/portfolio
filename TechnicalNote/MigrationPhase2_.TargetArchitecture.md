# Phase 2 — Target Architecture and API Contract

## Objective

Define the target Next.js architecture and preserve the existing backend behavior before implementation begins.

The migration should simplify the application architecture without changing the existing content model or user-facing behavior.

The primary principle of this phase is:

> Simplify the architecture without changing existing behavior.

---

# Target Architecture

## Current Architecture

```text
Next.js application
        │
        │ HTTP
        ▼
ASP.NET Core local backend
        │
        ▼
Repository content files
├── src/i18n/locales/
└── src/content/projects/
```

The current architecture requires two application runtimes:

* Next.js / Node.js
* ASP.NET Core / .NET

The ASP.NET Core service exists only to provide a small number of development-only content editing operations.

---

## Target Architecture

```text
Next.js application
├── UI
├── Route Handlers
├── validation
├── content services
└── file system utilities
        │
        ▼
Repository content files
├── src/i18n/locales/
└── src/content/projects/
```

The separate ASP.NET Core application will be removed after migration and validation are complete.

The existing source-file-based content model will remain unchanged.

---

# Design Principles

The migration should follow these principles.

## 1. Preserve Existing Behavior

The migration is not a redesign.

Existing content behavior should remain compatible wherever practical.

This includes:

* request behavior
* validation rules
* supported locales
* generated JSON structure
* generated Markdown structure
* file naming
* content paths
* update behavior
* delete behavior

---

## 2. Keep the Backend Lightweight

The application does not require a general-purpose backend architecture.

The Next.js implementation should therefore avoid unnecessary abstractions such as:

* additional backend services
* microservices
* databases
* message queues
* background workers
* repository layers that provide no practical benefit
* complex dependency injection frameworks

The implementation should remain small and easy to understand.

---

## 3. Separate HTTP Handling from Content Logic

Route Handlers should remain thin.

They should primarily:

1. receive requests
2. parse input
3. call validation
4. call the appropriate content service
5. return the HTTP response

Business and file-system logic should not be concentrated inside `route.ts`.

Example:

```text
Request
   ↓
Route Handler
   ↓
Validation
   ↓
Content Service
   ↓
File System
```

---

# Proposed Next.js Structure

A possible target structure is:

```text
src/
├── app/
│   └── api/
│       ├── local/
│       │   ├── about/
│       │   │   └── [locale]/
│       │   │       └── route.ts
│       │   │
│       │   └── projects/
│       │       └── route.ts
│       │
│       └── health/
│           └── route.ts
│
├── lib/
│   └── content-editor/
│       ├── about.ts
│       ├── projects.ts
│       ├── validation.ts
│       ├── paths.ts
│       └── file-system.ts
│
├── content/
│   └── projects/
│
└── i18n/
    └── locales/
```

The exact folder names may change during implementation, but responsibilities should remain separated.

---

# API Contract

The existing API behavior will initially be preserved to minimize migration risk.

The frontend should not need unnecessary changes simply because the implementation moves from ASP.NET Core to Next.js.

---

## Health Endpoint

### Request

```http
GET /api/health
```

### Responsibility

Confirm that the local content editing API is available.

### Expected Result

Successful requests should return an HTTP `200` response.

The exact response format should remain compatible with the existing implementation where required.

---

# About Content API

## Request

```http
PUT /api/local/about/{locale}
```

Supported locales:

```text
en
sv
zh
```

### Responsibilities

The Next.js implementation must:

* validate the locale
* validate the request body
* reject unsupported locales
* serialize the content correctly
* update the correct localized JSON file
* prevent writing outside the expected content directory

---

## About Flow

```text
PUT /api/local/about/{locale}
        ↓
validate environment
        ↓
validate locale
        ↓
parse request
        ↓
validate content
        ↓
resolve safe file path
        ↓
serialize JSON
        ↓
write file
        ↓
return response
```

---

# Project Content API

## Create or Update Project

```http
PUT /api/local/projects
```

The Next.js implementation must preserve the current project editing behavior.

### Responsibilities

* validate request data
* validate locale
* validate slug
* validate project URLs
* determine project content path
* prevent unsafe paths
* prevent duplicate destination paths
* generate compatible Markdown
* generate compatible frontmatter
* create new project files
* update existing project files
* remove the previous file when a slug changes
* remove the previous file when a locale change changes the path

---

## Project Update Flow

```text
PUT /api/local/projects
        ↓
validate environment
        ↓
parse request
        ↓
validate project
        ↓
resolve original path
        ↓
resolve target path
        ↓
check target conflict
        ↓
generate Markdown
        ↓
write target file
        ↓
remove old file if path changed
        ↓
return response
```

---

# Delete Project API

## Request

```http
DELETE /api/local/projects
```

### Responsibilities

* validate the request
* resolve the requested project path
* verify that the path belongs to the allowed project directory
* prevent path traversal
* delete the project source file
* return an appropriate result if the file does not exist

---

## Delete Flow

```text
DELETE /api/local/projects
        ↓
validate environment
        ↓
parse request
        ↓
validate input
        ↓
resolve safe path
        ↓
verify allowed directory
        ↓
delete file
        ↓
return response
```

---

# Validation Contract

Existing validation rules should be treated as part of the migration contract.

They should not be weakened simply because the implementation language changes.

## Supported Locales

Only:

```text
en
sv
zh
```

should be accepted.

---

## Slugs

Project slugs must continue to follow the existing accepted format.

Examples of invalid values should remain rejected.

The implementation must not allow path traversal through values such as:

```text
../
../../
```

---

## URLs

Where provided, project URLs should continue to be validated.

This includes fields such as:

* GitHub URL
* live project URL

Malformed URLs should be rejected rather than written directly into content files.

---

# File-System Safety

The Next.js implementation will interact directly with repository files.

File-system safety is therefore a required part of the migration.

All resolved paths must remain inside explicitly permitted directories.

Conceptually:

```text
requested path
      ↓
resolve absolute path
      ↓
verify allowed root
      ↓
perform operation
```

A request must never be able to escape:

```text
src/content/projects/
```

or the intended locale content directories.

---

# Atomic Writes

Where the existing backend uses safe or atomic file replacement behavior, the Next.js implementation should preserve equivalent protection.

A file should not be left partially written if an operation fails during the write process.

A possible approach is:

```text
write temporary file
        ↓
successful write
        ↓
replace target file
```

The exact implementation will be decided during the migration phase.

---

# Development-Only Constraint

The current backend is intentionally a local development tool.

The Next.js replacement must preserve this architectural boundary.

The editing endpoints must not become publicly usable production endpoints.

Target behavior:

```text
Development
    ↓
content editing available

Production
    ↓
content editing disabled
```

A production request to these editing operations should fail before any file operation is attempted.

---

# Vercel Consideration

The production Vercel deployment should not be used as persistent storage for these source files.

The source content belongs to the repository.

Therefore:

```text
Local editing
      ↓
Repository source files
      ↓
Git commit
      ↓
Vercel deployment
```

is the intended content lifecycle.

Not:

```text
Vercel runtime
      ↓
modify deployed source files
```

---

# Error Handling

The migration should use predictable HTTP status codes.

Examples:

```text
200 / 204
successful operation

400
invalid input

404
requested content does not exist

409
target project path already exists

500
unexpected internal error
```

The exact existing behavior should be preserved where the frontend currently depends on it.

---

# Logging

Only lightweight logging is required.

Useful events include:

* content update succeeded
* project created
* project updated
* project deleted
* validation failed
* unsafe path rejected
* file operation failed

Sensitive or unnecessary request data should not be logged.

---

# Out of Scope

Phase 2 does not introduce:

* a database
* authentication
* cloud content storage
* a full CMS
* new portfolio features
* UI redesign
* Blog functionality
* production content editing
* major changes to the existing Markdown schema

These can be evaluated separately if they are ever required.

---

# Migration Order

The implementation phase should proceed in the following order:

```text
1. shared environment guard
        ↓
2. path and validation utilities
        ↓
3. file-system utilities
        ↓
4. health endpoint
        ↓
5. About editing
        ↓
6. Project creation/update
        ↓
7. Project deletion
        ↓
8. behavior comparison
        ↓
9. tests
```

Low-risk functionality should be migrated before more destructive file operations.

---

# Compatibility Checklist

Before implementation begins, the following contract is considered frozen.

## Environment

* content editing remains development-only
* production cannot modify repository source files

## About

* `en` remains supported
* `sv` remains supported
* `zh` remains supported
* existing JSON structure remains compatible

## Projects

* existing Markdown structure remains compatible
* existing frontmatter remains compatible
* project creation remains supported
* project update remains supported
* project deletion remains supported
* slug changes remain supported
* locale changes remain supported
* old files are removed when paths change

## Validation

* invalid locale is rejected
* invalid slug is rejected
* invalid URL is rejected
* duplicate target path is rejected
* path traversal is rejected

---

# Phase 2 Exit Criteria

Phase 2 is complete when:

* the target Next.js architecture is documented
* responsibilities between Route Handlers and content services are defined
* existing API contracts are documented
* validation requirements are frozen
* source-file behavior is documented
* development-only restrictions are defined
* production file-editing behavior is explicitly prohibited
* the migration implementation order is agreed upon

After these conditions are satisfied, implementation can begin in Phase 3.

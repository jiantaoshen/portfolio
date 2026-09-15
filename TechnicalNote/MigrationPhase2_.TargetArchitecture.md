# Phase 2 — Target Astro Architecture and API Contract

## Objective

Define the target Astro/TypeScript architecture and preserve the existing backend behavior before implementation begins.

The migration should simplify the application architecture without changing the existing content model or user-facing behavior.

The primary principle of this phase is:

> Simplify the architecture without changing existing behavior.

---

# Target Architecture

## Current Architecture

```text
Astro application
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

The current architecture requires two separate application environments:

* Astro / TypeScript / Node.js
* ASP.NET Core / C# / .NET

The ASP.NET Core service exists only to provide a small number of development-only content editing operations.

For the current scope of the portfolio, maintaining a separate backend application provides little practical benefit.

---

## Target Architecture

```text
Astro application
│
├── UI
│
├── server endpoints
│
└── backend/
    └── content-editor/
        ├── environment protection
        ├── validation
        ├── path safety
        ├── content services
        └── file-system utilities
                │
                ▼
Repository content files
├── src/i18n/locales/
└── src/content/projects/
```

The separate ASP.NET Core application will be removed after migration and validation are complete.

The existing source-file-based content model will remain unchanged.

Astro will not be used as a new general-purpose backend platform.

Instead, its server-side capabilities will host the small amount of local functionality already required by the application.

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
* Markdown frontmatter
* file naming
* content paths
* update behavior
* delete behavior
* error behavior where the existing frontend depends on it

The first Astro implementation should prioritize behavioral equivalence with the ASP.NET Core implementation.

Improvements can be made separately after the migration is complete.

---

## 2. Keep the Backend Lightweight

The application does not require a general-purpose backend architecture.

The Astro/TypeScript implementation should therefore avoid unnecessary abstractions such as:

* an additional backend application
* microservices
* databases
* message queues
* background workers
* unnecessary repository layers
* complex dependency injection systems
* a separate Node.js API server
* an additional application framework

The implementation should remain small, explicit, and easy to understand.

---

## 3. Separate HTTP Handling from Content Logic

Astro API endpoints should remain thin.

They should primarily:

1. receive the request
2. verify that local editing is enabled
3. parse input
4. call validation
5. call the appropriate content service
6. convert known errors into HTTP responses
7. return the response

Business logic and file-system operations should not be concentrated inside endpoint files.

Conceptually:

```text
Request
   ↓
Astro API Endpoint
   ↓
Environment Guard
   ↓
Validation
   ↓
Content Service
   ↓
Safe Path Resolution
   ↓
File System
```

This keeps HTTP-specific code separate from reusable content-editing logic.

---

# Proposed Astro Structure

A possible target structure is:

```text
src/
├── pages/
│   └── api/
│       ├── health.ts
│       │
│       └── local/
│           ├── about/
│           │   └── [locale].ts
│           │
│           └── projects.ts
│
├── backend/
│   └── lib/
│       └── content-editor/
│           ├── environment.ts
│           ├── validation.ts
│           ├── paths.ts
│           ├── file-system.ts
│           ├── errors.ts
│           ├── about.ts
│           └── projects.ts
│
├── content/
│   └── projects/
│
└── i18n/
    └── locales/
```

The exact folder names may change during implementation.

The important requirement is that responsibilities remain separated.

### Endpoint Layer

```text
src/pages/api/
```

Responsible for:

* HTTP methods
* request parsing
* response generation
* translating content-editor errors into HTTP responses

### Content Editor Layer

```text
src/backend/lib/content-editor/
```

Responsible for:

* validation
* environment restrictions
* path safety
* content serialization
* Markdown generation
* JSON generation
* file writing
* file deletion
* content-specific behavior

---

# API Contract

The existing API behavior should initially be preserved to minimize migration risk.

The frontend should not require unnecessary changes simply because the implementation moves from ASP.NET Core into Astro.

The existing routes should therefore remain compatible wherever practical.

---

# Health Endpoint

## Request

```http
GET /api/health
```

## Responsibility

Confirm that the local server functionality is available.

## Expected Result

A successful request should return HTTP `200`.

The response body should remain compatible with the existing ASP.NET Core implementation where the current application depends on it.

No content file should be read, written, or deleted by this endpoint.

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

The Astro route may internally represent the dynamic parameter as:

```text
/api/local/about/[locale]
```

while preserving the externally visible URL behavior.

## Responsibilities

The Astro/TypeScript implementation must:

* verify that local content editing is enabled
* validate the locale
* validate the request body
* reject unsupported locales
* serialize content correctly
* update the correct localized JSON file
* use safe path resolution
* prevent writes outside the permitted locale directory
* preserve the existing JSON format
* use safe file writing

---

# About Flow

```text
PUT /api/local/about/{locale}
        ↓
validate environment
        ↓
parse locale
        ↓
validate locale
        ↓
parse request body
        ↓
validate content
        ↓
resolve safe file path
        ↓
serialize JSON
        ↓
atomic file write
        ↓
return response
```

No file operation should occur before the environment and input checks have passed.

---

# Project Content API

## Create or Update Project

```http
PUT /api/local/projects
```

The Astro implementation must preserve the current project editing behavior.

## Responsibilities

The implementation must:

* verify that local editing is enabled
* validate request data
* validate locale
* validate and normalize the project slug
* validate GitHub and live URLs
* determine the project content path
* prevent unsafe paths
* prevent path traversal
* prevent duplicate destination paths
* generate compatible Markdown
* generate compatible frontmatter
* create new project files
* update existing project files
* safely replace existing content
* remove the previous file when the slug changes
* remove the previous file when a locale change changes the file path

---

# Project Update Flow

```text
PUT /api/local/projects
        ↓
validate environment
        ↓
parse request
        ↓
validate project
        ↓
normalize slug
        ↓
resolve original path
        ↓
resolve target path
        ↓
verify safe paths
        ↓
check target conflict
        ↓
generate Markdown
        ↓
atomic write to target file
        ↓
remove old file if path changed
        ↓
return response
```

The old file should only be removed after the new content has been written successfully.

This reduces the risk of losing project content during an update.

---

# Delete Project API

## Request

```http
DELETE /api/local/projects
```

## Responsibilities

The implementation must:

* verify that local editing is enabled
* parse and validate the request
* validate or normalize the requested project path
* resolve the requested file path
* verify that the path belongs to the allowed project directory
* prevent path traversal
* delete the requested project source file safely
* handle a missing file predictably
* return an appropriate HTTP response

---

# Delete Flow

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
verify allowed project root
        ↓
delete file if it exists
        ↓
return response
```

---

# Validation Contract

Existing validation behavior should be treated as part of the migration contract.

Validation must not be weakened simply because the implementation language changes from C# to TypeScript.

---

## Supported Locales

Only:

```text
en
sv
zh
```

should be accepted.

Unsupported locale values must be rejected.

The supported locale definitions should be centralized rather than duplicated across endpoints.

---

## Project Slugs

Project slugs must continue to follow the behavior of the existing ASP.NET Core implementation.

The migration should preserve existing slug normalization behavior, including where applicable:

* trimming surrounding whitespace
* normalizing path separators
* removing unnecessary leading or trailing separators
* handling an optional `.md` suffix
* preserving supported nested slug segments

Unsafe path segments must be rejected.

Examples include:

```text
.
..
```

and traversal attempts such as:

```text
../
../../
project/../../../secret
```

Slug validation is the first layer of protection.

Final path safety must still be verified independently.

---

# URLs

Where provided, project URLs must continue to be validated.

This includes fields such as:

* GitHub URL
* live project URL

The existing behavior should be preserved:

```text
empty value
→ allowed when optional

absolute http:// URL
→ allowed

absolute https:// URL
→ allowed

relative URL
→ rejected

ftp://
→ rejected

file://
→ rejected

javascript:
→ rejected
```

Malformed or unsupported URLs must not be written directly into project content.

---

# File-System Safety

The Astro content editor will interact directly with repository files.

File-system safety is therefore a required architectural boundary.

All resolved paths must remain inside explicitly permitted directories.

Conceptually:

```text
requested relative path
        ↓
resolve absolute target
        ↓
compare target against allowed root
        ↓
reject if target escapes root
        ↓
perform file operation
```

For project content, a request must never escape:

```text
src/content/projects/
```

For localized content, a request must never escape the intended locale content directory.

Path safety must not depend exclusively on earlier input validation.

The implementation should use defense in depth:

```text
Input Validation
        ↓
Slug / Locale Validation
        ↓
Safe Path Resolution
        ↓
File-System Operation
```

---

# Atomic Writes

The existing ASP.NET Core backend uses temporary-file replacement to reduce the risk of leaving partially written content.

The Astro/TypeScript implementation should preserve equivalent protection.

The expected flow is:

```text
target content
      ↓
write temporary file
      ↓
verify write succeeds
      ↓
replace target file
      ↓
remove temporary file
```

If an operation fails, temporary files should be cleaned up where possible.

Both new-file creation and replacement of existing files must be tested.

---

# Safe File Deletion

File deletion should be implemented through a small reusable file-system helper.

Expected behavior:

```text
existing file
→ delete
→ report success

missing file
→ no destructive side effect
→ report that the file did not exist

unexpected file-system error
→ propagate error
```

Path validation must happen before the delete helper is called.

The deletion helper should not independently accept or interpret untrusted relative paths.

---

# Development-Only Constraint

The existing backend is intentionally a local development tool.

The Astro replacement must preserve this architectural boundary.

Content editing must not become a publicly usable production capability.

Target behavior:

```text
Local development
+
content editor explicitly enabled
        ↓
content editing available
```

```text
Production
        ↓
content editing disabled
```

and ideally:

```text
Local development
+
content editor not explicitly enabled
        ↓
content editing disabled
```

The system should fail closed.

A request must be rejected before any write or delete operation is attempted if local editing is not allowed.

---

# Environment Configuration

The local editor should use an explicit configuration switch.

Example:

```env
LOCAL_CONTENT_EDITOR_ENABLED=true
```

This variable should only be enabled in the intended local development environment.

Production should not enable it.

Environment restrictions and endpoint behavior should be tested independently from content logic.

---

# Vercel Consideration

The production Vercel deployment must not be treated as persistent storage for repository content files.

The content belongs to the Git repository.

The intended lifecycle remains:

```text
Local editing
      ↓
Repository source files
      ↓
Git commit
      ↓
Git push
      ↓
Vercel build and deployment
```

Not:

```text
Vercel runtime
      ↓
modify deployed repository files
      ↓
treat runtime file system as persistent content storage
```

The Astro server-side implementation exists to support the local development workflow.

It is not intended to turn the deployed portfolio into a production CMS.

---

# Error Handling

The migration should use predictable application errors and HTTP status codes.

The content-editor layer should define reusable errors independently from Astro HTTP response handling.

Examples:

```text
400
invalid request or validation failure

404
requested content does not exist

409
target project path already exists

500
unexpected internal error
```

Conceptually:

```text
Content Service
      ↓
ContentEditorError
      ↓
Astro Endpoint
      ↓
HTTP Response
```

Known application errors may safely return their intended message.

Unexpected internal errors should:

* be logged server-side
* return a generic client-facing message
* avoid exposing local absolute paths
* avoid exposing internal implementation details

---

# Logging

Only lightweight logging is required.

Useful events may include:

* About content updated
* project created
* project updated
* project deleted
* validation failed
* unsafe path rejected
* duplicate project path detected
* file operation failed

Logging should remain proportional to the size and purpose of the project.

Sensitive or unnecessary request information should not be logged.

---

# Testing Strategy

The migration should introduce focused automated tests for the parts of the system where regressions could corrupt content or weaken file-system safety.

Vitest will be used for the TypeScript content-editor utilities.

Priority areas include:

## Validation

* supported locales
* unsupported locales
* slug normalization
* unsafe slug rejection
* valid HTTP/HTTPS URLs
* invalid URL rejection

## Path Safety

* valid project paths
* valid nested paths
* parent-directory traversal
* deep traversal attempts
* traversal after apparently valid path segments

## File Operations

* writing a new file
* replacing an existing file
* temporary file cleanup
* deleting an existing file
* handling a missing file

## Environment Protection

* explicitly enabled local editing
* disabled local editing
* production rejection

## Content Behavior

Later migration phases should add tests for:

* About JSON generation
* Project Markdown generation
* frontmatter compatibility
* project path changes
* duplicate target handling
* file cleanup after project moves

Automated file-system tests must use temporary test directories.

They must not modify or delete real portfolio content.

---

# Out of Scope

Phase 2 does not introduce:

* a database
* authentication
* cloud content storage
* a production CMS
* a separate Node.js backend server
* Next.js
* another frontend framework
* new portfolio features
* UI redesign
* Blog functionality
* production content editing
* major changes to the existing Markdown schema

These can be evaluated independently if future requirements justify them.

---

# Migration Order

The implementation should proceed incrementally.

Recommended order:

```text
1. development-only environment guard
        ↓
2. shared locale validation
        ↓
3. project slug validation / normalization
        ↓
4. URL validation
        ↓
5. centralized content root paths
        ↓
6. safe path resolution
        ↓
7. path traversal tests
        ↓
8. atomic file writing
        ↓
9. safe file deletion
        ↓
10. shared content-editor errors
        ↓
11. Astro health endpoint
        ↓
12. About editing
        ↓
13. Project create/update
        ↓
14. Project deletion
        ↓
15. behavior comparison with ASP.NET Core
        ↓
16. stabilization
        ↓
17. legacy .NET removal
```

Low-risk and reusable infrastructure should be implemented before destructive content-editing operations.

The existing ASP.NET Core backend should remain available as the reference implementation until behavioral compatibility has been verified.

---

# Compatibility Checklist

Before migrating the actual content endpoints, the following contract is considered frozen.

## Environment

* content editing remains development-only
* editing must be explicitly enabled
* production cannot modify repository source files

## About

* `en` remains supported
* `sv` remains supported
* `zh` remains supported
* existing JSON structure remains compatible
* existing content location remains compatible

## Projects

* existing Markdown structure remains compatible
* existing frontmatter remains compatible
* project creation remains supported
* project update remains supported
* project deletion remains supported
* slug changes remain supported
* locale changes remain supported
* old files are removed when paths change
* duplicate destination paths remain rejected

## Validation

* invalid locale is rejected
* invalid slug/path segments are rejected
* invalid URL is rejected
* duplicate target path is rejected
* path traversal is rejected

## File System

* valid writes remain inside allowed content roots
* file replacement is safe
* missing files are handled predictably
* temporary files are cleaned up
* automated tests never modify production portfolio content

---

# Phase 2 Exit Criteria

Phase 2 is complete when:

* the target Astro/TypeScript architecture is documented
* the standalone ASP.NET Core boundary has a defined replacement
* responsibilities between Astro API endpoints and content services are defined
* existing API contracts are documented
* validation requirements are frozen
* safe path requirements are defined
* file-write behavior is documented
* file-delete behavior is documented
* development-only restrictions are defined
* production file editing is explicitly prohibited
* the intended Vercel content lifecycle is documented
* the automated testing strategy is defined
* the migration implementation order is agreed upon

After these conditions are satisfied, implementation can proceed through Phase 3.

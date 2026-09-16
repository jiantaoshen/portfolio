---
lang: en
title: "LightManager"
description: "A personal task management application built with React, TypeScript, ASP.NET Core and PostgreSQL, featuring daily planning, calendar-based scheduling, JWT authentication, a safe Trial mode and independent cloud deployment."
status: "Live"
order: 2
technologies:
  - "C#"
  - ".NET"
  - "ASP.NET Core"
  - "Entity Framework Core"
  - "PostgreSQL"
  - "React"
  - "TypeScript"
  - "Tailwind CSS"
  - "shadcn/ui"
  - "React Router"
  - "Microsoft Azure"
  - "Vercel"
  - "Neon"
links:
  github: "https://github.com/jiantaoshen/LightManager"
  live: "https://lightmanager.jiantao.dev"
draft: false
---

## Overview

LightManager is a personal task management application designed around a simple daily workflow.

The application allows users to quickly capture tasks, optionally schedule them by date, assign priorities, review daily work, and plan ahead through a calendar.

The current version focuses on:

- Today
- Unscheduled tasks
- Calendar-based planning
- All Tasks
- Optional due dates
- Simple task priorities
- Responsive desktop and mobile layouts
- A safe public Trial mode

The frontend is built with React, TypeScript, Tailwind CSS and shadcn/ui.

The backend is built with ASP.NET Core, Entity Framework Core and ASP.NET Identity, with PostgreSQL hosted on Neon.

---

## Why I Changed the Product Direction

LightManager originally started as a lightweight project management application for small and medium-sized teams.

The first version included:

- Projects
- Project members
- Role-based permissions
- Task assignment
- Kanban workflows
- Drag-and-drop task management

Although the system worked technically, I found that I had little reason to use most of the team-oriented workflow myself.

This created an important product problem: I could continue implementing features, but I could not meaningfully evaluate whether those features were useful in everyday use.

I therefore changed the project from:

```text
Team Project Management
```

to:

```text
Personal Task Management
```

The current application is built around a workflow I can use myself, evaluate continuously, and improve based on actual friction and usage.

---

## Current Workflow

The current LightManager workflow is centered around optional scheduling.

```text
Create Task
    |
    +-- No due date
    |      |
    |      v
    |   Unscheduled
    |
    +-- Due today
    |      |
    |      v
    |    Today
    |
    +-- Future date
           |
           v
        Calendar
```

The Today page acts as the main daily workspace:

```text
Today
├── Today's Tasks
└── Unscheduled
```

A task does not need a due date when it is created.

This keeps task capture fast while allowing scheduling to remain optional.

---

## Priority System

LightManager uses three simple user-facing priority levels:

```text
Must
Priority
Non-priority
```

The backend currently keeps the original enum values:

```text
High   -> Must
Medium -> Priority
Low    -> Non-priority
```

Tasks are automatically sorted in this order:

```text
Must
  ↓
Priority
  ↓
Non-priority
```

Tasks with the same priority are ordered by creation time, with older tasks appearing first.

The same sorting rule is used consistently across task views.

---

## Today

The Today page is the primary daily workspace.

It shows:

- Tasks scheduled for the current day
- Unscheduled tasks
- Open tasks
- Completed tasks

Tasks can be created directly from Today with or without a due date.

This allows quick capture and daily planning to happen in the same place.

---

## Calendar

The Calendar provides both scheduling and a visual overview of task importance.

Each date with unfinished tasks displays an indicator based on the highest-priority unfinished task scheduled for that day.

```text
Green  -> Non-priority
Yellow -> Priority
Red    -> Must
```

For example:

```text
Non-priority tasks only
        ↓
      Green

Includes Priority
        ↓
      Yellow

Includes Must
        ↓
       Red
```

Completed tasks do not affect the Calendar indicator.

If every task for a date is completed, the indicator disappears.

The Calendar also includes an **Unscheduled** task card so tasks without due dates remain visible while planning future work.

---

## Navigation

The primary navigation is intentionally small.

### Desktop

```text
LightManager

Today
Calendar

[Account]
```

### Mobile

The bottom navigation contains:

```text
Today     Calendar
```

Additional actions are available from the avatar menu.

### Account Menu

Clicking or tapping the avatar opens:

```text
Account
├── Settings
├── All Tasks
└── Sign Out
```

All Tasks was moved out of the primary navigation so Today and Calendar remain the two main working views.

The same account menu is available on mobile, providing an easily accessible Sign Out action.

Trial users see:

```text
Trial mode
├── All Tasks
└── Exit Trial
```

---

## Trial Mode

LightManager includes a public Trial mode that allows visitors to explore the application without registering.

The backend exposes a read-only endpoint that loads tasks from a dedicated demo account.

```text
Visitor
   |
   v
Enter Trial
   |
   v
Read Demo Tasks
   |
   v
Create Local Copy
   |
   v
Browser Storage
```

After the initial load, Trial users work only with the local copy.

They can:

- Create tasks
- Update tasks
- Complete and reopen tasks
- Delete tasks
- Change priorities
- Add or remove due dates
- Use Today
- Use Calendar
- Use All Tasks

Trial changes are stored locally in the browser.

```text
Trial Tasks
    |
    +-- Create
    +-- Update
    +-- Complete
    +-- Delete
    |
    v
Local Browser Storage

    X

PostgreSQL
```

Trial users do not receive the demo account password or JWT token.

This prevents visitors from modifying the original demo data through the authenticated task API.

---

## Architecture Redesign

The backend model was simplified significantly when LightManager moved to personal task management.

The original structure was based on projects and collaboration:

```text
User
 └── Project
      ├── Members
      ├── Roles
      └── Tasks
           └── Assignees
```

The current structure is:

```text
User
 ├── Task
 ├── Task
 └── Task
```

Tasks are directly owned by users.

Projects, project memberships, task assignments and project-level roles are no longer part of the current core data model.

This makes the system easier to maintain and provides a cleaner API for future clients.

---

## Backend

The backend is built as an ASP.NET Core Web API.

The main authenticated task API is:

```text
/api/tasks
```

Protected task endpoints use the authenticated user's identity from the JWT token to restrict task queries and modifications.

The task model contains:

- Title
- Description
- Status
- Priority
- Optional due date
- Created timestamp
- Updated timestamp
- Completed timestamp
- User ownership

Task status and priority are represented with enums and stored as readable strings in PostgreSQL.

Trial mode uses a separate anonymous read-only endpoint for retrieving demo task data.

---

## Authentication & Authorization

Authentication is implemented with ASP.NET Identity and JWT.

```text
User Login
    |
    v
ASP.NET Identity Validation
    |
    v
PostgreSQL
    |
    v
JWT Generated
    |
    v
Token Stored by Client
    |
    v
Authenticated API Requests
    |
    v
User-Specific Task Data
```

The Identity model separates login identity and display name:

```text
UserName = Email
DisplayName = FullName
```

This avoids conflicts when multiple users use the same display name.

Authorization is focused on **user data isolation**.

Every protected task query, update and delete operation verifies that the task belongs to the authenticated user.

Trial users do not receive authenticated write access.

---

## Frontend

The frontend is built with:

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- shadcn/ui

The interface is organized around reusable components and shared utility modules.

Repeated application logic such as task sorting, priority handling, API requests, date utilities and navigation components is extracted into shared files rather than duplicated across pages.

---

## UI Theme

The frontend uses semantic theme variables defined centrally in:

```text
src/index.css
```

The theme controls values such as:

- Background
- Foreground text
- Primary action color
- Non-priority color
- Priority color
- Must color

The current semantic colors are:

```text
Primary actions -> Blue
Non-priority    -> Green
Priority        -> Yellow
Must            -> Red
```

Components reference semantic styling instead of defining individual colors directly in TSX files.

This makes it possible to change the visual theme from one central location.

---

## Database

PostgreSQL is used for persistent application data and is hosted with Neon.

Entity Framework Core handles database access and migrations.

The current `Tasks` table includes:

```text
Id
Title
Description
Status
Priority
DueDate
CreatedAt
UpdatedAt
CompletedAt
UserId
```

Indexes include:

```text
(UserId, DueDate)

(UserId, Status)
```

These support common task filtering by date and status.

---

## Deployment

The current production architecture is:

```text
React + TypeScript
        |
        v
      Vercel
        |
        v
https://lightmanager.jiantao.dev
        |
        | HTTPS
        v
ASP.NET Core Web API
        |
        v
Microsoft Azure App Service
        |
        v
PostgreSQL / Neon
```

### Frontend

The React frontend is deployed on Vercel.

Production:

**https://lightmanager.jiantao.dev**

### Backend

The ASP.NET Core Web API is deployed on Microsoft Azure App Service.

### Database

PostgreSQL is hosted with Neon.

Production configuration such as JWT secrets, allowed frontend origins, database connection strings and Trial configuration is provided through environment variables rather than committed to source control.

---

## Challenges & Decisions

### Simplifying the Domain Model

The largest architectural decision was removing the original project, membership and role model.

Instead of keeping unused complexity simply to demonstrate more features, I redesigned the data model around the actual requirements of the personal task workflow.

### User Data Isolation

After moving away from project-based authorization, direct task ownership became the main authorization boundary.

Protected task endpoints verify the authenticated user before accessing or modifying task data.

### Optional Scheduling

Tasks are not required to have a due date.

This allows tasks to be captured quickly while keeping scheduling as a separate decision.

### Safe Public Trial Mode

I wanted visitors to be able to explore the actual application without giving them access to a shared authenticated account.

The Trial mode therefore reads initial demo data from the backend but keeps all visitor modifications local.

This provides a usable demo while protecting the original database data.

### Web First, Mobile Later

I decided to stabilize the web application before starting a mobile client.

The current focus is on stabilizing:

- Product workflow
- API design
- Authentication
- Database structure
- Task behavior
- Responsive UI

Once these are stable, a React Native client can reuse the same backend.

### Independent Frontend and Backend Deployment

The frontend and backend are deployed independently.

This keeps the client and API separated and makes the backend reusable by future applications.

---

## Project Evolution

### Version 1 — Team Project Management

The original LightManager included:

- Projects
- Project members
- Role-based permissions
- Task assignment
- Kanban boards
- Drag-and-drop task workflows

### Version 2 — Personal Task Management

The current version focuses on:

- Personal task ownership
- Today
- Unscheduled tasks
- Calendar planning
- Optional due dates
- Simple priorities
- Priority-based sorting
- All Tasks
- Responsive navigation
- Trial mode

The project has therefore evolved from a demonstration-focused team management system into a smaller application that I can genuinely use and improve based on real experience.

---

## Development Goals

LightManager is not intended to compete with large task management platforms.

The project is primarily a practical environment for building, using, and continuously improving a real full-stack application.

My goals are to:

- Design software around real usage rather than hypothetical requirements
- Keep the product and data model simple as features evolve
- Build reusable and maintainable architecture
- Improve responsive and mobile-first product design
- Explore safe public demo and authentication patterns
- Prepare the architecture for future cross-platform development

The focus is not on adding as many features as possible, but on making deliberate improvements based on actual use.

---

## Future Improvements

Possible future additions include:

- React Native mobile client
- Persistent mobile authentication
- Recurring tasks
- Task notes
- Notifications and reminders
- Offline support
- Local mobile storage
- Cross-device synchronization
- Improved task editing
- Search and filtering
- Optional productivity statistics

---

## Legacy Azure Static Web Apps Deployment — Abandoned

An earlier version of the frontend was hosted on Azure Static Web Apps at:

```text
https://thankful-beach-0211add0f.7.azurestaticapps.net
```

The frontend has since moved to Vercel and now uses:

**https://lightmanager.jiantao.dev**

The old Azure Static Web Apps resource was only needed to preserve the previous URL. After several unsuccessful recovery attempts, I decided to abandon the legacy deployment and focus on the current production architecture.

### Recovery Attempts

| Method | Result |
| --- | --- |
| Azure Static Web Apps CLI | Azure returned `No matching static site found.` |
| Deployment token reset | The same deployment problem remained. |
| GitHub Actions | Azure could not match the deployment to the original Static Web App. |
| Azure Portal configuration | Relevant deployment settings were unavailable or read-only. |
| Azure CLI | Direct resource management did not resolve the issue. |
| Azure Cloud Shell | The same resource problem remained. |
| Source-control reconnect | The existing integration could not be successfully recreated. |

The legacy deployment is no longer part of the active LightManager architecture.

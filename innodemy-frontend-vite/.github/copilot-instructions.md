# GitHub Copilot Instructions — LMS Frontend

This repository follows a strict **enterprise React architecture**.

Copilot MUST follow these rules when generating or modifying code.

---

## Tech Stack

- React (Vite)
- TypeScript (strict mode)
- Tailwind CSS
- React Router DOM
- TanStack Query
- Zustand
- Axios
- React Hook Form
- Zod validation

---

## Application Type

This is a **Full Learning Management System (LMS)** containing:

- Student learning application
- Admin panel (content management)
- Super Admin management system

Backend provides REST APIs and handles authorization.

Frontend handles routing, UI permissions, and data presentation.

---

## User Roles

UserRole enum values:

- super_admin
- admin
- student

Routing rules:

- student → `/app/*`
- admin → `/admin/*`
- super_admin → `/super-admin/*`

Always generate role-safe routing and protected access.

---

## Architecture Rules (MANDATORY)

Always verify backend API availability before implementing frontend features.
Never assume endpoint paths or response shapes.
If backend support is missing, generate an API specification document instead.

### Feature-Based Structure

All new logic MUST be created inside:

features/{feature-name}/

Each feature owns:

- api.ts
- hooks.ts
- types.ts
- pages/
- components/
- forms/ (admin features)

Never place business logic inside global folders.

---

### Data Responsibility

Server State:

- handled ONLY with TanStack Query

Client/UI State:

- handled ONLY with Zustand

NEVER store API response data in Zustand.

---

### Data Flow Rule

Code must follow this flow:

Component → Hook → API → Backend

Components must NEVER:

- call axios directly
- contain async business logic
- transform API responses

---

### API Layer Rule

HTTP calls MUST exist only in:

features/{feature}/api.ts

Use centralized axios instance:

src/api/axios.ts

Do not create new axios instances.

---

### Hook Pattern

Async logic belongs inside:

features/{feature}/hooks.ts

Components must consume hooks only.

Example:

Component
→ useCoursesQuery()
→ coursesApi.getAll()
→ backend

---

### TypeScript Rules

- Avoid `any`
- Always define interfaces/types
- Use shared types from `/types`
- Strongly type API responses

Preferred response format:

ApiResponse<T>

Always use generics when possible.

---

### Routing Rules

Use protected routes with role validation.

Layouts:

- StudentLayout
- AdminLayout
- SuperAdminLayout

Never mix admin and student logic.

---

### Component Rules

Components must be:

- small
- reusable
- presentational when possible

Components must NOT:

- fetch data directly
- contain API logic
- contain large business logic

---

### TanStack Query Rules

Use:

- useQuery → fetching
- useMutation → create/update/delete

After mutations:

invalidate related queries using query keys.

Query keys must be structured:

['course', courseId]
['lessons', courseId]
['progress', courseId]

Avoid generic keys like:
['data'], ['list']

---

### Axios Rules

Use only:

src/api/axios.ts

Token must be attached via interceptor using Zustand auth store.

Never attach tokens manually inside components.

---

### Admin Form Rules (LMS Specific)

Admin forms must follow layered architecture:

Page
→ Form Hook (logic)
→ Validation Schema (Zod)
→ Form UI
→ Field Components

Forms must NOT contain API calls.

Submission must use mutation hooks.

---

### Lesson Viewer Rules (LMS Specific)

Lesson viewer must remain modular.

Never create a single large lesson page.

Expected structure:

LessonPage

- VideoPlayer
- LessonSidebar
- LessonContent
- ProgressTracker

Each component fetches its own data via hooks.

---

### Code Style

Prefer:

- functional components
- arrow functions
- early returns
- descriptive naming
- minimal JSX logic

Avoid deeply nested components.

---

## Forbidden Patterns (DO NOT GENERATE)

Copilot must NOT generate:

- API calls inside components
- global state for server data
- large monolithic components
- duplicated CRUD logic
- inline fetch/axios usage
- business logic inside layouts

---

## Goal

Generate scalable, maintainable, production-level LMS frontend code.

Focus on:

- clean architecture
- separation of concerns
- predictable data flow
- long-term scalability

Avoid beginner patterns.

# LMS Frontend Architecture Guide

You are a senior React + TypeScript architect.

## Overview

This project is a production-level Learning Management System (LMS) frontend built using:

- React (Vite)
- TypeScript
- Tailwind CSS
- React Router DOM
- TanStack Query
- Zustand
- Axios
- React Hook Form + Zod

The backend already exposes REST APIs.

The system includes:

- Courses
- Lessons
- Webinars
- Blogs
- Admin CMS
- Student learning dashboard

---

## User Roles

Backend roles:

- super_admin
- admin
- student (default)

### Routing

/login → login page  
/app/_ → student area  
/admin/_ → admin + super_admin  
/super-admin/\* → super_admin only

### Post Login Redirect

- student → /app/dashboard
- admin → /admin/dashboard
- super_admin → /super-admin/dashboard

---

## Core Architecture Rules

1. Feature-based architecture only.
2. Strict TypeScript typing (avoid any).
3. Server state handled by TanStack Query.
4. Client/UI state handled by Zustand.
5. Components must never call axios.
6. API logic lives inside feature api files.
7. Separate Admin and Student layouts.
8. Role-based protected routing required.
9. Components remain reusable and presentational.
10. Backend handles authorization.

---

## Feature Ownership Rule

Each feature owns:

- api.ts (HTTP communication)
- hooks.ts (React Query logic)
- types.ts (domain types)
- pages/
- components/
- forms/ (admin only)

Features must NOT import internal logic from other features.

Shared logic belongs in:

- features/shared/
- src/utils/

---

## Data Flow Rule

Data must flow in this order:

Component → Feature Hook → API Layer → Backend

Components must never:

- call axios
- contain async logic
- transform API responses

---

## State Management

### Server State (TanStack Query)

Used for:

- courses
- lessons
- enrollments
- progress
- blogs
- webinars
- users

Rules:

- useQuery for fetching
- useMutation for updates
- invalidate queries after mutation

### Client/UI State (Zustand)

Used only for:

- auth session
- sidebar state
- UI toggles
- theme
- video player UI state

Never store API data in Zustand.

---

## Query Key Convention

Use structured keys:

['course', courseId]  
['lessons', courseId]  
['lesson', lessonId]  
['progress', courseId]  
['adminCourses']

Avoid generic keys like:
['data'], ['list'], ['items']

---

## API Layer Architecture

All HTTP calls must exist in:

features/{feature}/api.ts

Components must never call axios directly.

CRUD features must use a shared generic API client:
createApiClient<T>()

---

## Layout System

Layouts define application boundaries:

- StudentLayout
- AdminLayout
- SuperAdminLayout

ProtectedRoute enforces role access.

---

## Performance Rules

- Lazy load admin routes
- Lazy load super admin routes
- Lazy load lesson viewer components
- Students must not download admin bundles

---

## LMS Domain Model

User  
→ Enrollment  
→ Course  
→ Lesson  
→ Progress

Course = learning program  
Lesson = learning unit  
Enrollment = access control  
Progress = completion tracking

---

## Lesson Viewer Architecture

Route:

/app/course/:courseId/lesson/:lessonId

Structure:

LessonPage

- VideoPlayer
- LessonSidebar
- LessonContent
- ProgressTracker

Each component fetches its own data using React Query.

---

## Admin Form Architecture

Forms follow layered design:

Page  
→ Form Hook (logic)  
→ Validation Schema (Zod)  
→ Form UI  
→ Field Components

Rules:

- No API logic inside forms
- Validation via Zod
- Submission via mutation hooks

---

## Project Structure

src/

- api/
    - axios.ts
    - queryClient.ts
- types/
    - auth.types.ts
    - api.types.ts
    - course.types.ts
- routes/
    - router.tsx
    - ProtectedRoute.tsx
- layouts/
    - AdminLayout.tsx
    - StudentLayout.tsx
    - SuperAdminLayout.tsx
- stores/
    - authStore.ts
- components/
    - ui/
- features/
    - auth/
    - admin/
    - student/
    - shared/
- hooks/
- utils/
- App.tsx

---

## Development Principles

- UI components contain no business logic
- Hooks manage async operations
- API layer manages HTTP
- Zustand manages UI state only
- React Query manages server state
- Features remain isolated and scalable

---

## Goal

Provide a clean, scalable LMS frontend architecture suitable for long-term production growth.

# Backend API Request: Admin Courses Listing Endpoint

**Date:** 2026-02-26  
**Requested by:** Frontend Team  
**Status:** Backend implementation required

---

## Summary

The frontend Admin Courses management feature requires a **read-only listing endpoint** for courses visible to admin and super_admin users. This endpoint does not currently exist in the backend.

---

## Current State

### Existing Endpoints in `CoursesAdminController` (`/api/v1/courses`)

| Method | Path                          | Purpose        |
| ------ | ----------------------------- | -------------- |
| POST   | `/api/v1/courses`             | Create course  |
| PATCH  | `/api/v1/courses/:id`         | Update course  |
| PATCH  | `/api/v1/courses/:id/publish` | Publish course |
| DELETE | `/api/v1/courses/:id`         | Soft delete    |

### Existing Public Endpoint (`/courses`)

| Method | Path             | Purpose                 |
| ------ | ---------------- | ----------------------- |
| GET    | `/courses`       | List **published** only |
| GET    | `/courses/:slug` | Get published by slug   |

### Why Existing Endpoints Are Insufficient

- `GET /courses` only returns courses with `status: PUBLISHED` and `isDeleted: false`.
- The public response shape (`PublicCourseResponse`) omits critical admin fields: `id`, `status`, `createdById`, `createdAt`, `updatedAt`.
- Admins need to see **all courses** (DRAFT + PUBLISHED), including soft-deleted status awareness.
- No admin-level pagination/filtering by status exists.

---

## Required Endpoint

### `GET /api/v1/courses`

**Authentication:** Bearer token (JWT)  
**Authorization:** `ADMIN` or `SUPER_ADMIN` role  
**Guards:** `JwtGuard`, `RolesGuard`  
**Interceptor:** `AdminAuditInterceptor` (consistent with other admin endpoints)

### Query Parameters

| Parameter | Type   | Default | Constraints           | Description                        |
| --------- | ------ | ------- | --------------------- | ---------------------------------- |
| `page`    | number | 1       | min: 1                | Page number                        |
| `limit`   | number | 10      | min: 1, max: 100      | Items per page                     |
| `search`  | string | —       | optional              | Case-insensitive title search      |
| `status`  | string | —       | `DRAFT` / `PUBLISHED` | Filter by course status (optional) |

### Expected Response Shape

```json
{
    "success": true,
    "data": [
        {
            "id": "uuid",
            "title": "string",
            "slug": "string",
            "description": "string",
            "bannerImage": "string",
            "price": 0,
            "discountPrice": null,
            "duration": 0,
            "startDate": "2026-01-01T00:00:00.000Z",
            "classDays": "string",
            "classTime": "string",
            "totalModules": 0,
            "totalProjects": 0,
            "totalLive": 0,
            "status": "DRAFT",
            "createdById": "uuid",
            "createdAt": "2026-01-01T00:00:00.000Z",
            "updatedAt": "2026-01-01T00:00:00.000Z"
        }
    ],
    "meta": {
        "page": 1,
        "total": 25,
        "totalPages": 3
    }
}
```

This matches the existing `AdminCourseResponse` type already defined in `courses.service.ts`, wrapped in the same paginated structure as the public listing.

### Response Type Breakdown

Each item in `data` uses the existing `AdminCourseResponse` type:

```typescript
type AdminCourseResponse = {
    id: string;
    title: string;
    slug: string;
    description: string;
    bannerImage: string;
    price: number;
    discountPrice: number | null;
    duration: number;
    startDate: Date;
    classDays: string;
    classTime: string;
    totalModules: number;
    totalProjects: number;
    totalLive: number;
    status: "DRAFT" | "PUBLISHED";
    createdById: string;
    createdAt: Date;
    updatedAt: Date;
};
```

---

## Backend Implementation Notes

The following changes would be needed (for backend team reference only — frontend will NOT modify backend code):

1. **Repository:** Add a `findAll` method in `CoursesRepository` that queries without the `status: PUBLISHED` filter, supports optional status filtering, and excludes soft-deleted records (`isDeleted: false`).

2. **Repository:** Add a `countAll` method for total count with the same optional filters.

3. **Service:** Add a `findAll(query)` method in `CoursesService` that returns a `PaginatedAdminCoursesResponse` using the existing `mapAdminResponse()` helper.

4. **Controller:** Add a `GET` handler in `CoursesAdminController`:

    ```
    @Get()
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    async findAll(@Query() query: AdminListCoursesQueryDto)
    ```

5. **DTO:** Create `AdminListCoursesQueryDto` extending `ListCoursesQueryDto` with an optional `status` filter field.

6. **Authorization:** `ADMIN` users should only see courses they created (`createdById === userId`). `SUPER_ADMIN` users should see all courses. This matches the existing authorization pattern in `ensureExistsAndAuthorized()`.

---

## Frontend Impact

Once this endpoint is available, the frontend will implement:

| File                                                       | Purpose                                              |
| ---------------------------------------------------------- | ---------------------------------------------------- |
| `src/features/admin/courses/types.ts`                      | `AdminCourse` interface matching response            |
| `src/features/admin/courses/api.ts`                        | `getAdminCourses()` calling `GET /api/v1/courses`    |
| `src/features/admin/courses/hooks.ts`                      | `useAdminCoursesQuery()` with key `['adminCourses']` |
| `src/features/admin/courses/components/AdminCourseRow.tsx` | Presentational row component                         |
| `src/features/admin/courses/pages/AdminCoursesPage.tsx`    | Page with loading/error states                       |
| Route update in `router.tsx`                               | `/admin/courses` inside `AdminLayout`                |

---

## Priority

**High** — Admin course management is a core CMS feature. Without a listing endpoint, admins have no visibility into existing courses.

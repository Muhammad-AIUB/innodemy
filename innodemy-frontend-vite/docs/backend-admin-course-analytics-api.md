# Backend API Specification — Admin Course Analytics

> **Status:** Requested  
> **Author:** Frontend Team  
> **Date:** 2026-02-27  
> **Type:** API Contract Document

This document defines the required backend endpoint for admin course analytics.  
Frontend implementation is blocked until this endpoint is available.

---

## 1. Purpose

The admin LMS UI needs a read-only analytics overview for each course.  
This endpoint provides backend-calculated values for:

- enrolled students
- started students
- completed students
- completion rate

The frontend must display backend values directly and must not derive analytics client-side.

---

## 2. Required Endpoint

### `GET /api/v1/admin/courses/:courseId/analytics`

#### Authentication

- Bearer token (JWT) required

#### Authorization

- `ADMIN` and `SUPER_ADMIN` only

#### Path Parameters

| Parameter  | Type   | Required | Description        |
| ---------- | ------ | -------- | ------------------ |
| `courseId` | string | yes      | UUID of the course |

---

## 3. Success Response

### 200 OK

```json
{
    "success": true,
    "data": {
        "enrolledStudents": 120,
        "startedStudents": 96,
        "completedStudents": 48,
        "completionRate": 40
    }
}
```

### Response Fields

| Field               | Type   | Description                                                           |
| ------------------- | ------ | --------------------------------------------------------------------- |
| `enrolledStudents`  | number | Total students enrolled in the course                                 |
| `startedStudents`   | number | Students who started at least one lesson                              |
| `completedStudents` | number | Students who completed the full course                                |
| `completionRate`    | number | Backend-computed completion percentage (0-100), returned as a number  |

---

## 4. Error Responses

| Status | Condition                              |
| ------ | -------------------------------------- |
| 400    | Invalid `courseId` format              |
| 401    | Missing or invalid access token        |
| 403    | Authenticated user lacks admin access  |
| 404    | Course not found                       |
| 500    | Unexpected server error                |

---

## 5. Backend Implementation Notes

- Add analytics handler under admin course routing.
- Reuse existing admin auth/role guards.
- Keep standard response envelope:

```json
{
    "success": true,
    "data": {}
}
```

- `completionRate` must be calculated by backend and returned directly.
- Frontend will not compute analytics values from raw data.

---

## 6. Frontend Unblock Scope (After Backend Is Ready)

Once this endpoint exists and matches contract, frontend will implement:

- `src/features/admin/analytics/types.ts`
- `src/features/admin/analytics/api.ts`
- `src/features/admin/analytics/hooks.ts`
- `src/features/admin/analytics/components/AnalyticsStatCard.tsx`
- `src/features/admin/analytics/pages/CourseAnalyticsPage.tsx`
- Route: `/admin/courses/:courseId/analytics`
- Query key: `['courseAnalytics', courseId]`

---

## 7. Acceptance Criteria

Backend task is complete when:

1. `GET /api/v1/admin/courses/:courseId/analytics` is available.
2. Response shape exactly matches section 3.
3. Admin role protection is enforced.
4. Endpoint appears in backend API docs/swagger.

# Backend API Specification — Lesson Progress Tracking

> **Status:** Requested  
> **Author:** Frontend Team  
> **Date:** 2026-02-25  
> **Type:** API Contract Document

This document defines the required backend endpoints for LMS lesson progress tracking. It serves as a contract between the frontend and backend teams. The backend team should implement these endpoints so the frontend lesson viewer can support progress tracking features.

---

## 1. Purpose

The LMS frontend lesson viewer requires progress tracking to deliver core learning platform behavior. Without backend progress endpoints, the following capabilities are blocked:

- **Track completed lessons** — Students must see which lessons they have finished. The lesson sidebar highlights completed items to give learners a clear sense of accomplishment and orientation within a course.

- **Resume learning** — When a student returns to a course, the frontend must know where they left off and navigate them to the next incomplete lesson automatically.

- **Calculate course completion percentage** — A progress bar on the course page and lesson viewer shows how much of the course the student has completed. This requires the backend to provide both completed lesson count and total lesson count.

- **Enable dashboards and analytics** — The student dashboard displays an overview of all enrolled courses with their completion status. Admin dashboards require aggregated progress data for reporting, student engagement analysis, and content effectiveness metrics.

Progress data is **server state** — it must be persisted on the backend and served via REST endpoints. The frontend does not store progress locally; it relies entirely on backend responses cached via TanStack Query.

---

## 2. Required Endpoints

All endpoints are scoped under the authenticated user derived from the JWT token. The user ID must **never** be passed as a request parameter from the frontend.

---

### 2.1 GET Course Progress

```
GET /progress/:courseId
```

Returns the authenticated user's progress for a specific course.

#### Path Parameters

| Parameter  | Type   | Required | Description        |
| ---------- | ------ | -------- | ------------------ |
| `courseId` | string | yes      | UUID of the course |

#### Response — 200 OK

```json
{
    "success": true,
    "data": {
        "courseId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "completedLessons": 5,
        "totalLessons": 20,
        "percentage": 25,
        "completedLessonIds": [
            "f1e2d3c4-b5a6-7890-abcd-ef1234567890",
            "a9b8c7d6-e5f4-3210-abcd-ef1234567890"
        ]
    }
}
```

#### Response Fields

| Field                | Type     | Description                                             |
| -------------------- | -------- | ------------------------------------------------------- |
| `courseId`           | string   | UUID of the course                                      |
| `completedLessons`   | number   | Count of lessons the user has completed                 |
| `totalLessons`       | number   | Total number of lessons in the course                   |
| `percentage`         | number   | Integer 0–100 representing completion percentage        |
| `completedLessonIds` | string[] | Array of UUIDs for all completed lessons in this course |

#### Error Responses

| Status | Condition                    |
| ------ | ---------------------------- |
| 401    | Missing or invalid JWT token |
| 404    | Course not found             |

#### Frontend Usage

- **Lesson sidebar highlighting** — `completedLessonIds` is used to visually mark completed lessons in the sidebar navigation.
- **Progress bar** — `percentage` drives the course progress bar displayed in the lesson viewer and course overview.
- **Caching** — The frontend caches this response with the query key `['progress', courseId]`. The cache is invalidated after a lesson is marked complete.

---

### 2.2 Mark Lesson Complete

```
POST /progress/complete
```

Marks a lesson as completed for the authenticated user.

#### Request Body

```json
{
    "lessonId": "f1e2d3c4-b5a6-7890-abcd-ef1234567890"
}
```

#### Request Fields

| Field      | Type   | Required | Description                  |
| ---------- | ------ | -------- | ---------------------------- |
| `lessonId` | string | yes      | UUID of the completed lesson |

#### Response — 200 OK

```json
{
    "success": true,
    "data": {
        "lessonId": "f1e2d3c4-b5a6-7890-abcd-ef1234567890",
        "completed": true,
        "lastWatchedAt": "2026-02-25T14:30:00.000Z"
    }
}
```

#### Response Fields

| Field           | Type    | Description                                        |
| --------------- | ------- | -------------------------------------------------- |
| `lessonId`      | string  | UUID of the lesson that was marked complete        |
| `completed`     | boolean | Always `true` on success                           |
| `lastWatchedAt` | string  | ISO 8601 timestamp of when completion was recorded |

#### Error Responses

| Status | Condition                                          |
| ------ | -------------------------------------------------- |
| 400    | Missing or invalid `lessonId`                      |
| 401    | Missing or invalid JWT token                       |
| 403    | User is not enrolled in the course for this lesson |
| 404    | Lesson not found                                   |

#### Behavior Requirements

- **Idempotent** — Calling this endpoint multiple times with the same `lessonId` for the same user must be safe. If the lesson is already marked complete, the endpoint should return a success response with the existing record. It must not create duplicate entries or return an error.
- **Trigger** — The frontend calls this when a student finishes a lesson (e.g., video watched to completion or content scrolled to end).
- **Cache invalidation** — After a successful response, the frontend invalidates the `['progress', courseId]` query to refresh sidebar and progress bar state.

---

## 3. Authentication

All progress endpoints require an authenticated user.

- The JWT access token must be sent in the `Authorization` header as a Bearer token:
    ```
    Authorization: Bearer <access_token>
    ```
- The backend must extract the `userId` from the verified JWT payload. **The frontend never sends a `userId` in the request body, query parameters, or path.**
- The backend must verify that the user has an active enrollment in the relevant course before returning or modifying progress data.
- Role expectations: These endpoints serve the **student** role. Admin and super_admin roles may require separate reporting endpoints in the future, but this specification covers student-facing progress only.

---

## 4. Performance Requirements

Progress endpoints are called frequently during active learning sessions. They must meet the following performance expectations:

| Requirement          | Target                                                 |
| -------------------- | ------------------------------------------------------ |
| **Response time**    | < 100ms typical for both GET and POST                  |
| **Concurrent usage** | Must handle many simultaneous students per course      |
| **Query frequency**  | GET progress is called on every lesson page navigation |
| **Write frequency**  | POST complete is called once per lesson per student    |

### Optimization Recommendations

- **Database indexing** — Create composite indexes on `(userId, courseId)` and `(userId, lessonId)` to ensure fast lookups.
- **Unique constraint** — Add a unique constraint on `(userId, lessonId)` to enforce idempotency at the database level and prevent duplicate records.
- **Avoid N+1 queries** — The GET course progress endpoint should compute `completedLessons`, `totalLessons`, and `percentage` in a single efficient query or a minimal number of queries, not by loading all lesson records individually.
- **Consider caching** — If progress queries become a bottleneck under high load, consider Redis caching with short TTL (e.g., 30–60 seconds) for the GET endpoint.

---

## 5. Data Model Suggestion

The following is a suggested schema for the progress table. The backend team may adapt field names and types to match existing conventions and ORM requirements.

### Progress Table

| Column          | Type      | Constraints                    | Description                                |
| --------------- | --------- | ------------------------------ | ------------------------------------------ |
| `id`            | UUID      | Primary Key, auto-generated    | Unique identifier for the record           |
| `userId`        | UUID      | Foreign Key → User, NOT NULL   | The student who completed the lesson       |
| `lessonId`      | UUID      | Foreign Key → Lesson, NOT NULL | The lesson that was completed              |
| `completed`     | boolean   | NOT NULL, default `true`       | Whether the lesson is complete             |
| `lastWatchedAt` | timestamp | NOT NULL                       | When the lesson was last watched/completed |
| `createdAt`     | timestamp | NOT NULL, auto-generated       | Record creation time                       |
| `updatedAt`     | timestamp | NOT NULL, auto-updated         | Record last update time                    |

### Indexes

| Index                             | Type   | Purpose                                       |
| --------------------------------- | ------ | --------------------------------------------- |
| `(userId, lessonId)`              | UNIQUE | Prevents duplicate progress entries           |
| `(userId, courseId)` (via lesson) | INDEX  | Fast lookup for course-level progress queries |

### Relationships

- `Progress.userId` → `User.id`
- `Progress.lessonId` → `Lesson.id`
- Course-level progress is derived by joining through the `Lesson` → `Course` relationship.

### Notes

- The `courseId` is not stored directly on the progress record. It is derived through the lesson's relationship to its parent course. This avoids data duplication and keeps the source of truth in the lesson–course relationship.
- If performance requires it, a denormalized `courseId` column may be added to the progress table with an appropriate index, but this should be evaluated by the backend team based on actual query patterns.

---

## 6. Notes for Backend Team

### Response Envelope

All responses must follow the existing API response envelope used throughout the application:

```json
{
  "success": true,
  "data": { ... }
}
```

For errors:

```json
{
    "success": false,
    "message": "Human-readable error description"
}
```

### Field Exposure

- Do not expose internal database fields (e.g., internal auto-increment IDs, raw foreign keys beyond UUIDs) in API responses.
- Only return fields explicitly listed in this specification.

### Future Extensibility

The progress system should be designed to support future enhancements without breaking changes:

- **Partial progress** — Future versions may track video watch percentage or reading scroll position (e.g., `watchPercentage: 75`). Design the data model to accommodate additional columns.
- **Analytics aggregation** — Admin dashboards will need aggregated progress data across students and courses. Ensure the data model supports efficient aggregation queries.
- **Bulk progress retrieval** — A future endpoint (e.g., `GET /progress/my-courses`) may return progress summaries for all courses a student is enrolled in, to power the student dashboard.
- **Lesson resume position** — Future versions may store `lastPosition` (e.g., video timestamp) to allow students to resume exactly where they left off.

### Validation

- `lessonId` must be a valid UUID.
- `courseId` path parameter must be a valid UUID.
- The backend should validate that the lesson belongs to the specified course (for the GET endpoint) and that the student is enrolled.

### HTTP Status Codes

Follow standard REST conventions:

| Code | Usage                                   |
| ---- | --------------------------------------- |
| 200  | Successful GET or idempotent POST       |
| 400  | Invalid request body or parameters      |
| 401  | Unauthenticated (missing/expired token) |
| 403  | Unauthorized (not enrolled in course)   |
| 404  | Resource not found (course or lesson)   |
| 500  | Unexpected server error                 |

---

## 7. Summary

| Endpoint             | Method | Path                  | Purpose                         |
| -------------------- | ------ | --------------------- | ------------------------------- |
| Get Course Progress  | GET    | `/progress/:courseId` | Fetch student's course progress |
| Mark Lesson Complete | POST   | `/progress/complete`  | Record lesson completion        |

These two endpoints are the minimum required for the frontend lesson viewer to support progress tracking. Implementation priority is **high** — the lesson sidebar, progress bar, and resume functionality are blocked until these endpoints are available.

---

_This document is a contract between the frontend and backend teams. Any changes to the endpoint signatures or response shapes must be communicated and agreed upon by both teams before implementation._

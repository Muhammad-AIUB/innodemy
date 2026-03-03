# TODO: Switch Progress Feature from Mock Adapter to Real API

> **Created:** 2026-02-26  
> **Trigger:** Backend progress endpoints are now implemented  
> **Priority:** High  
> **Related spec:** [docs/backend-progress-api.md](../backend-progress-api.md)

---

## What happened

The progress feature was built against a **temporary mock adapter** because the backend endpoints were not ready at implementation time. The mock adapter simulates network delay and stores completion data in-memory.

Now that the backend is live, the mock must be replaced with real axios calls.

---

## Files to change

### 1. Create `src/features/student/progress/api.ts`

Create the real API layer using the centralized axios instance:

```ts
import api from "../../../api/axios";
import type {
    CourseProgressResponse,
    MarkLessonCompleteResponse,
} from "./types";

export const progressApi = {
    getCourseProgress: async (
        courseId: string,
    ): Promise<CourseProgressResponse> => {
        const { data } = await api.get<{
            success: boolean;
            data: CourseProgressResponse;
        }>(`/progress/${courseId}`);
        return data.data;
    },

    markLessonComplete: async (
        lessonId: string,
        _courseId: string,
    ): Promise<MarkLessonCompleteResponse> => {
        const { data } = await api.post<{
            success: boolean;
            data: MarkLessonCompleteResponse;
        }>("/progress/complete", { lessonId });
        return data.data;
    },
};
```

### 2. Update `src/features/student/progress/hooks.ts`

Swap the adapter import to use the real API:

```diff
- import { progressAdapter } from "./adapter";
+ import { progressApi as progressAdapter } from "./api";
```

No other changes needed in hooks.ts — the function signatures are identical.

### 3. Delete `src/features/student/progress/adapter.ts`

The mock adapter is no longer needed once api.ts is in place. Remove it.

---

## Files that need NO changes

These files were designed against the final types and will work as-is:

- `src/features/student/progress/types.ts`
- `src/features/student/lessons/pages/LessonPage.tsx`
- `src/features/student/lessons/components/LessonSidebar.tsx`
- `src/features/student/lessons/components/LessonContent.tsx`

---

## Verification checklist

- [ ] Create `progress/api.ts` with real axios calls
- [ ] Update import in `progress/hooks.ts`
- [ ] Delete `progress/adapter.ts`
- [ ] Test `GET /progress/:courseId` returns correct `completedLessonIds`
- [ ] Test `POST /progress/complete` marks lesson and invalidates cache
- [ ] Confirm sidebar shows ✓ on completed lessons
- [ ] Confirm "Mark Complete" button works end-to-end
- [ ] Delete this file when done

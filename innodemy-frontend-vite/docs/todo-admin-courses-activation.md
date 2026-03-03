# TODO: Admin Courses — Backend Activation Checklist

**Feature:** Admin Courses read-only listing  
**Contract:** `docs/backend-admin-courses-api.md`  
**Status:** Frontend scaffold ready, waiting on backend endpoint

---

## Prerequisite

Backend team must ship:

```
GET /api/v1/courses
```

With the exact response shape defined in `docs/backend-admin-courses-api.md`.

---

## Frontend Activation Steps

Once the backend endpoint is live, apply these changes in order:

### 1. Enable the API call in `src/features/admin/courses/api.ts`

- [ ] Uncomment the `import api from '../../../api/axios'` line
- [ ] Replace the throwing stub with the real implementation:

```typescript
getAdminCourses: async (): Promise<PaginatedAdminCoursesResponse> => {
  const { data } = await api.get<{ success: boolean } & PaginatedAdminCoursesResponse>(
    '/api/v1/courses',
  );
  return { data: data.data, meta: data.meta };
},
```

### 2. Enable the query in `src/features/admin/courses/hooks.ts`

- [ ] Remove `enabled: false` from `useAdminCoursesQuery()`

### 3. Activate the page in `src/features/admin/courses/pages/AdminCoursesPage.tsx`

- [ ] Import `useAdminCoursesQuery` from `../hooks`
- [ ] Import `AdminCourseRow` from `../components/AdminCourseRow`
- [ ] Uncomment the `useAdminCoursesQuery()` call
- [ ] Replace the placeholder banner with the commented-out table markup
- [ ] Remove the placeholder `<div>` with the "Pending Backend Integration" message

### 4. Verify

- [ ] Navigate to `/admin/courses` as an ADMIN or SUPER_ADMIN user
- [ ] Confirm course list loads with title, status, and created date columns
- [ ] Confirm loading and error states render correctly
- [ ] Confirm query key `['adminCourses']` appears in React Query DevTools

### 5. Cleanup

- [ ] Remove this file (`docs/todo-admin-courses-activation.md`)
- [ ] Update `docs/backend-admin-courses-api.md` status to "Implemented"

---

## Files Involved

| File                                                       | Change                                      |
| ---------------------------------------------------------- | ------------------------------------------- |
| `src/features/admin/courses/api.ts`                        | Uncomment real axios call                   |
| `src/features/admin/courses/hooks.ts`                      | Remove `enabled: false`                     |
| `src/features/admin/courses/pages/AdminCoursesPage.tsx`    | Activate query + table                      |
| `src/features/admin/courses/types.ts`                      | No change needed                            |
| `src/features/admin/courses/components/AdminCourseRow.tsx` | No change needed                            |
| `src/routes/router.tsx`                                    | No change needed (route already registered) |

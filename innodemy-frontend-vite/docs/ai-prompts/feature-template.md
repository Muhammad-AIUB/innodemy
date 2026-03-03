You are working inside an existing production LMS frontend.

Follow ARCHITECTURE.md and copilot-instructions.md strictly.
Do NOT introduce new patterns.

---

CONTEXT

Existing system already has:

- React + Vite + TypeScript
- TanStack Query (server state)
- Zustand (auth only)
- Feature-based architecture
- API → Hooks → Components pattern
- Central axios instance
- Query invalidation strategy

Reuse existing patterns from similar features.

---

BACKEND CONTRACT CHECK (MANDATORY)

Before writing code:

1. Verify backend endpoint(s) exist.
2. Verify request + response shape.
3. If missing → STOP and generate backend requirement doc.
4. Never assume API shape.

---

SCOPE

Implement only:

<describe EXACT feature>

Do NOT add extra features.
Minimal UI only.

---

FILES TO CREATE / MODIFY

Create inside:

src/features/<feature-name>/

Files:

- types.ts
- api.ts
- hooks.ts
- components/...
- pages/...

Follow structure used in:
src/features/admin/courses/

---

RULES

- No axios inside components
- No Zustand for server data
- No manual refetch()
- Mutations invalidate queries
- Strict TypeScript (no any)
- retry: false for mutations
- KeepPreviousData where pagination exists
- No optimistic updates unless specified
- No new architecture

---

EXPECTED FLOW

User action
→ hook
→ api call
→ backend
→ invalidate query
→ UI updates automatically

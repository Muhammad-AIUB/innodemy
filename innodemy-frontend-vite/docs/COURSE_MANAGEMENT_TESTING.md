# Course Management Testing Guide

## Overview

Complete course creation and management flow for ADMIN and SUPER_ADMIN roles.

## Prerequisites

1. Backend server running: `cd innodemmy-backend-app && pnpm run start:dev`
2. Frontend server running: `cd innodemy-frontend-vite && npm run dev`
3. Logged in as ADMIN or SUPER_ADMIN

## Features Implemented

### ✅ Navigation & Routing

- Sidebar navigation with active state indicators
- Links: Courses, Webinars, Blogs, Enrollment Requests
- Logout functionality
- Back navigation links on forms

### ✅ Course Creation (13 Required Fields)

**Route:** `/admin/courses/create` or `/super-admin/courses/create`

**Field Groups:**

1. **Basic Information**
    - Title (max 200 chars)
    - Description (textarea)
    - Banner Image URL (must be valid URL)

2. **Pricing & Duration**
    - Price (min 0)
    - Discount Price (min 0)
    - Duration in days (min 1)

3. **Schedule**
    - Start Date (datetime-local → ISO-8601)
    - Class Days (e.g., "Mon, Wed, Fri")
    - Class Time (e.g., "6:00 PM - 8:00 PM")

4. **Course Stats**
    - Total Modules (min 0)
    - Total Projects (min 0)
    - Total Live Sessions (min 0)

### ✅ Course Editing

**Route:** `/admin/courses/:id/edit`

- All 13 fields editable
- Pre-filled with existing course data
- Date field properly formatted for datetime-local input

### ✅ Curriculum Builder

**Route:** `/admin/courses/:id/curriculum`

**Modal-Based UI:**

- Create Module → Enter module title
- Edit Module → Update module title
- Create Lesson → Select type (VIDEO/ARTICLE/QUIZ/ASSIGNMENT), enter title, duration, video URL
- Edit Lesson → Update all lesson fields
- Delete Module/Lesson with confirmation

**Lesson Types:**

- VIDEO (with videoUrl field)
- ARTICLE
- QUIZ
- ASSIGNMENT

### ✅ Course List

**Route:** `/admin/courses`

- View all courses
- "+ Create Course" button
- Edit and Curriculum Builder links for each course

## Test Flow

### 1. Create New Course

```
1. Navigate to /super-admin/courses
2. Click "+ Create Course"
3. Fill all 13 fields:
   - Title: "Full Stack Development"
   - Description: "Complete web development course"
   - Banner: https://via.placeholder.com/800x400
   - Price: 999
   - Discount Price: 799
   - Duration: 90
   - Start Date: Pick future datetime
   - Class Days: "Mon, Wed, Fri"
   - Class Time: "6:00 PM - 8:00 PM"
   - Total Modules: 10
   - Total Projects: 5
   - Total Live: 20
4. Click "Create Course"
5. Verify redirect to courses list
6. Confirm new course appears
```

### 2. Build Curriculum

```
1. From courses list, click "Curriculum Builder" for the new course
2. Click "Add Module"
3. Enter: "Introduction to Web Development"
4. Click "Add Lesson" under the module
5. Select: VIDEO
6. Enter:
   - Title: "What is Web Development?"
   - Duration: 15
   - Video URL: https://www.youtube.com/watch?v=example
7. Click "Add Lesson"
8. Verify lesson appears in module
9. Test Edit Module, Edit Lesson, Delete actions
```

### 3. Edit Course

```
1. From courses list, click "Edit" for a course
2. Modify any fields (e.g., change price)
3. Click "Save Changes"
4. Verify redirect and updated data
```

### 4. Navigation Test

```
1. Verify sidebar highlights current section
2. Test "← Back to Courses" links
3. Test logout button
4. Confirm no TypeScript errors in browser console
```

## API Endpoints Used

### Course Management

- `GET /admin/courses` - List all courses
- `GET /admin/courses/:id` - Get single course
- `POST /admin/courses` - Create course
- `PATCH /admin/courses/:id` - Update course

### Curriculum Management

- `GET /admin/courses/:id/modules` - List modules
- `POST /admin/courses/:id/modules` - Create module
- `PATCH /admin/modules/:id` - Update module
- `DELETE /admin/modules/:id` - Delete module
- `POST /admin/modules/:id/lessons` - Create lesson
- `PATCH /admin/lessons/:id` - Update lesson
- `DELETE /admin/lessons/:id` - Delete lesson

## Known Behaviors

### Video Storage

- Currently uses **video URLs** (not direct file uploads)
- Backend expects videoUrl field for VIDEO type lessons
- Future: May add direct file upload via multipart/form-data

### Date Handling

- Frontend uses `<input type="datetime-local">`
- Automatically converts to ISO-8601 format on submit
- Backend stores as DateTime in PostgreSQL

### Validation

- All 13 fields are required in creation form
- Backend uses class-validator with IsNotEmpty decorators
- Frontend uses Zod schema matching backend DTO

### Authorization

- Both ADMIN and SUPER_ADMIN have full course access
- Routes work identically under `/admin/*` and `/super-admin/*`

## Troubleshooting

### "Cannot GET /api/v1/api/v1/courses"

**Fixed** - API paths no longer duplicate `/api/v1`

### "bannerImage is required" validation error

**Fixed** - All 13 fields now in the form

### Start date invalid format

**Fixed** - Now converts datetime-local to ISO-8601

### Modal doesn't close after creation

Check for:

- `onSuccess` callback in mutation
- `invalidateQueries` called properly
- `setShowModal(false)` in the callback

## Next Steps (Optional Enhancements)

1. **Direct File Upload**
    - Add multer/storage support in backend
    - Replace URL input with file picker
    - Show upload progress

2. **Course Preview**
    - View course as student would see it
    - Preview curriculum structure

3. **Bulk Operations**
    - Select multiple courses
    - Bulk delete, bulk publish

4. **Rich Text Editor**
    - Replace description textarea
    - Add formatting options

5. **Image Upload for Banner**
    - Replace URL input with file picker
    - Image optimization/resizing

6. **Course Duplication**
    - Clone existing course
    - Copy curriculum structure

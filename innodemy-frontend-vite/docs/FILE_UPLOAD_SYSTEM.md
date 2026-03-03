# File Upload System Documentation

## Overview

Reusable file upload system supporting both **direct file uploads** and **external URLs** for images and videos.

## Architecture

### Backend

#### Upload Module

Location: `innodemmy-backend-app/src/modules/upload/`

**Files:**

- `upload.service.ts` - File storage logic
- `upload.controller.ts` - API endpoints
- `upload.module.ts` - Module registration

**Endpoints:**

- `POST /api/v1/upload/image` - Upload image (max 5MB)
- `POST /api/v1/upload/video` - Upload video (max 100MB)

**File Storage:**

- Images: `public/uploads/images/`
- Videos: `public/uploads/videos/`
- Naming: UUID-based (e.g., `a1b2c3d4-...-.jpg`)

**Allowed Types:**

- Images: JPEG, JPG, PNG, WEBP
- Videos: MP4, WEBM, OGG

**Security:**

- Role guard: ADMIN and SUPER_ADMIN only
- Size validation
- MIME type validation

#### Configuration

**main.ts additions:**

```typescript
// Multipart support
await app.register(multipart, {
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB
        files: 1,
    },
});

// Static file serving
await app.register(fastifyStatic, {
    root: join(process.cwd(), "public"),
    prefix: "/",
});
```

**Dependencies:**

- `@fastify/multipart` - File upload support
- `@fastify/static` - Static file serving

### Frontend

#### FileUploader Component

Location: `innodemy-frontend-vite/src/features/admin/shared/upload/`

**Files:**

- `FileUploader.tsx` - Reusable upload component
- `api.ts` - Upload API calls
- `hooks.ts` - TanStack Query mutations

**Features:**

- Dual mode: URL input OR file upload
- Live preview for images
- Upload progress indication
- File size validation
- Error handling

**Props:**

```typescript
interface FileUploaderProps {
    value: string; // Current URL
    onChange: (url: string) => void;
    type?: "image" | "video"; // Default: "image"
    label?: string; // Input label
    error?: string; // Validation error
    maxSizeMB?: number; // Max file size
    accept?: string; // File input accept
}
```

## Usage

### In Forms (React Hook Form)

```tsx
import FileUploader from "../../../shared/upload/FileUploader";

const MyForm = () => {
    const {
        register,
        setValue,
        watch,
        formState: { errors },
    } = useForm();

    return (
        <FileUploader
            value={watch("bannerImage")}
            onChange={(url) => setValue("bannerImage", url)}
            type="image"
            label="Banner Image"
            error={errors.bannerImage?.message}
            maxSizeMB={5}
        />
    );
};
```

### API Calls (Direct)

```typescript
import { uploadImage, uploadVideo } from "./api";

// Upload image
const file = event.target.files[0];
const url = await uploadImage(file);
console.log(url); // "http://localhost:5000/uploads/images/uuid.jpg"

// Upload video
const videoUrl = await uploadVideo(videoFile);
```

### With TanStack Query Mutations

```tsx
import { useUploadImageMutation } from "./hooks";

const Component = () => {
    const uploadMutation = useUploadImageMutation();

    const handleUpload = async (file: File) => {
        try {
            const url = await uploadMutation.mutateAsync(file);
            console.log("Uploaded:", url);
        } catch (error) {
            console.error("Upload failed:", error);
        }
    };

    return (
        <input
            type="file"
            onChange={(e) => handleUpload(e.target.files[0])}
            disabled={uploadMutation.isPending}
        />
    );
};
```

## Integration Points

### Course Creation

- **File:** `CreateCoursePage.tsx`
- **Field:** `bannerImage`
- **Behavior:** Supports URL or file upload
- **Max Size:** 5MB

### Course Editing

- **File:** `EditCoursePage.tsx`
- **Field:** `bannerImage`
- **Behavior:** Pre-fills existing URL, allows change
- **Max Size:** 5MB

### Lesson Videos (Future)

Can be integrated into `CreateLessonModal.tsx` and `EditLessonModal.tsx`:

```tsx
<FileUploader
    value={watch("videoUrl")}
    onChange={(url) => setValue("videoUrl", url)}
    type="video"
    label="Video File"
    maxSizeMB={100}
/>
```

## Setup Instructions

### Backend

1. **Install dependencies:**

    ```bash
    cd innodemmy-backend-app
    pnpm add @fastify/multipart
    ```

2. **Create upload directories:**

    ```bash
    mkdir -p public/uploads/images public/uploads/videos
    ```

3. **Start server:**

    ```bash
    pnpm run start:dev
    ```

4. **Verify endpoints:**
    - Swagger: http://localhost:5000/api
    - Test upload: POST http://localhost:5000/api/v1/upload/image

### Frontend

No additional setup required - components are ready to use.

**Environment variable:**
Ensure `VITE_API_URL` is set:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

## Testing

### Manual Testing

1. **Start both servers:**

    ```bash
    # Terminal 1 - Backend
    cd innodemmy-backend-app
    pnpm run start:dev

    # Terminal 2 - Frontend
    cd innodemy-frontend-vite
    npm run dev
    ```

2. **Test course creation:**
    - Navigate to: http://localhost:5173/super-admin/courses/create
    - Scroll to "Banner Image" field
    - Click "Upload File" tab
    - Select an image (max 5MB)
    - Verify upload progress
    - Check preview appears
    - Submit form
    - Verify course created with uploaded image

3. **Test URL mode:**
    - Click "URL" tab
    - Enter: `https://via.placeholder.com/800x400`
    - Submit form
    - Verify course created with external URL

4. **Test file size limit:**
    - Try uploading >5MB image
    - Should see error: "File size exceeds 5MB limit"

5. **Test invalid file type:**
    - Try uploading .txt or .pdf file
    - Should see error: "Invalid file type..."

### API Testing (cURL)

```bash
# Upload image
curl -X POST http://localhost:5000/api/v1/upload/image \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/image.jpg"

# Expected response:
{
  "success": true,
  "data": {
    "url": "/uploads/images/uuid.jpg",
    "filename": "image.jpg",
    "size": 123456
  }
}
```

## File Storage Best Practices

### Current Implementation (Local Storage)

- Files stored in: `public/uploads/`
- Served via Fastify Static
- Accessible at: `http://localhost:5000/uploads/...`

### Production Recommendations

**Option 1: Cloud Storage (Recommended)**

- AWS S3
- Cloudinary
- Google Cloud Storage
- Azure Blob Storage

Benefits:

- Scalable
- CDN integration
- Backup/redundancy
- No server disk space concerns

**Option 2: Network Storage**

- NFS mount
- Separate file server
- Load balancer compatibility

**Migration Steps:**

1. Update `upload.service.ts`:

    ```typescript
    // Replace fs.writeFile with S3 upload
    const s3Result = await s3
        .upload({
            Bucket: "innodemy-uploads",
            Key: filename,
            Body: buffer,
        })
        .promise();

    return s3Result.Location;
    ```

2. Update environment variables:
    ```env
    AWS_S3_BUCKET=innodemy-uploads
    AWS_REGION=us-east-1
    AWS_ACCESS_KEY=...
    AWS_SECRET_KEY=...
    ```

## Security Considerations

### Current Protections

- ✅ Role-based access (ADMIN/SUPER_ADMIN only)
- ✅ File type validation (MIME type)
- ✅ File size limits (5MB images, 100MB videos)
- ✅ UUID-based filenames (prevents overwrites)

### Additional Hardening (Production)

- [ ] Virus scanning (ClamAV)
- [ ] Image optimization/compression
- [ ] Watermarking
- [ ] Rate limiting per user
- [ ] Disk quota per user
- [ ] EXIF data stripping (privacy)

## Troubleshooting

### "Failed to upload file"

**Causes:**

- Backend not running
- @fastify/multipart not installed
- File exceeds size limit
- Invalid auth token

**Solutions:**

- Check backend logs
- Verify pnpm dependencies
- Check network tab for error response
- Re-login to get fresh token

### "Cannot GET /uploads/..."

**Causes:**

- Fastify static not configured
- File doesn't exist on disk
- Incorrect baseURL configuration

**Solutions:**

- Verify `fastifyStatic` registration in main.ts
- Check `public/uploads/` directory exists
- Verify VITE_API_URL doesn't double /api/v1

### Upload succeeds but image doesn't display

**Causes:**

- CORS issue
- Wrong URL format
- File deleted/moved

**Solutions:**

- Check browser console for fetch errors
- Verify URL starts with http://localhost:5000/uploads/
- Check file exists in public/uploads/images/

## Future Enhancements

### Planned Features

- [ ] Drag-and-drop upload
- [ ] Multiple file upload
- [ ] Upload progress bar (percentage)
- [ ] Image cropping/editing
- [ ] Video thumbnail generation
- [ ] Bulk delete unused files
- [ ] File management dashboard

### Code Improvements

- [ ] Retry logic for failed uploads
- [ ] Cancel in-progress uploads
- [ ] Upload queue system
- [ ] File compression before upload
- [ ] Lazy loading for image preview

## API Reference

### POST /api/v1/upload/image

**Headers:**

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body:**

```
file: <File object>
```

**Response (200):**

```json
{
    "success": true,
    "data": {
        "url": "/uploads/images/abc123.jpg",
        "filename": "original-name.jpg",
        "size": 123456
    }
}
```

**Errors:**

- `400` - No file uploaded
- `400` - Invalid file type
- `400` - File size exceeds limit
- `401` - Unauthorized
- `403` - Forbidden (role restriction)

### POST /api/v1/upload/video

Same as `/upload/image` but:

- Max size: 100MB
- Allowed: MP4, WEBM, OGG
- Stored in: `public/uploads/videos/`

## Related Files

### Backend

- `src/modules/upload/upload.service.ts`
- `src/modules/upload/upload.controller.ts`
- `src/modules/upload/upload.module.ts`
- `src/app.module.ts` (module registration)
- `src/main.ts` (multipart + static config)

### Frontend

- `src/features/admin/shared/upload/FileUploader.tsx`
- `src/features/admin/shared/upload/api.ts`
- `src/features/admin/shared/upload/hooks.ts`
- `src/features/admin/courses/create/pages/CreateCoursePage.tsx`
- `src/features/admin/courses/edit/pages/EditCoursePage.tsx`

### Schema

- `src/features/admin/courses/create/schema.ts` (bannerImage validation)
- `src/features/admin/courses/edit/schema.ts` (bannerImage validation)

---

**Last Updated:** March 3, 2026
**Status:** ✅ Implemented and ready for testing

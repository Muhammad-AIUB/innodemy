innodemy-backend/
├── .prettierrc
├── nest-cli.json
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
│
├── prisma/
│   ├── schema.prisma
│   ├── seed-webinars.ts
│   └── migrations/
│       ├── migration_lock.toml
│       ├── 20260224161624_add_webinar_fields/
│       │   └── migration.sql
│       ├── 20260224162327_category_enum/
│       │   └── migration.sql
│       ├── 20260226230654_add_lesson_progress/
│       │   └── migration.sql
│       ├── 20260227120000_add_order_to_modules_and_lessons/
│       │   └── migration.sql
│       ├── 20260227133000_add_lesson_content_json/
│       │   └── migration.sql
│       ├── 20260227192501_add_enrollment_request/
│       │   └── migration.sql
│       ├── 20260227204029_add_webinar_registration/
│       │   └── migration.sql
│       ├── 20260302161239_add_blog_content_blocks/
│       │   └── migration.sql
│       ├── 20260303101723_add_instructor_to_webinars/
│       │   └── migration.sql
│       ├── 20260303131947_add_course_public_sections/
│       │   └── migration.sql
│       ├── 20260308000000_add_refresh_token/
│       │   └── migration.sql
│       └── 20260308120000_optimize_auth_indexes/
│           └── migration.sql
│
├── src/
│   ├── main.ts
│   ├── app.controller.ts
│   ├── app.service.ts
│   ├── app.module.ts
│   ├── fastify-multipart.d.ts
│   │
│   ├── config/
│   │   └── swagger.ts
│   │
│   ├── common/
│   │   ├── constants/
│   │   │   ├── auth-rate-limits.ts
│   │   │   └── user-role.ts
│   │   ├── decorators/
│   │   │   ├── rate-limit.decorator.ts
│   │   │   └── roles.decorators.ts
│   │   ├── guards/
│   │   │   ├── file-size.guard.ts
│   │   │   ├── otp-bruteforce.guard.ts
│   │   │   └── role.guard.ts
│   │   ├── interceptors/
│   │   │   └── admin-audit.interceptor.ts
│   │   └── validators/
│   │       ├── email-domain.validator.ts
│   │       └── url-or-path.validator.ts
│   │
│   ├── shared/
│   │   ├── cache/
│   │   │   └── cache.service.ts
│   │   ├── mail/
│   │   │   └── mail.module.ts
│   │   └── prisma/
│   │       ├── prisma.module.ts
│   │       └── prisma.service.ts
│   │
│   └── modules/
│       ├── auth/
│       │   ├── auth.module.ts
│       │   ├── controllers/
│       │   │   └── auth.controller.ts
│       │   ├── decorators/
│       │   │   └── roles.decorator.ts
│       │   ├── dto/
│       │   │   ├── check-email.dto.ts
│       │   │   ├── create-admin.dto.ts
│       │   │   ├── google-login.dto.ts
│       │   │   ├── login.dto.ts
│       │   │   ├── register.dto.ts
│       │   │   ├── refresh-token.dto.ts
│       │   │   ├── send-otp.dto.ts
│       │   │   └── verify-otp.dto.ts
│       │   ├── guards/
│       │   │   ├── jwt.guard.ts
│       │   │   └── roles.guard.ts
│       │   ├── repositories/
│       │   │   └── auth.repository.ts
│       │   ├── services/
│       │   │   └── auth.service.ts
│       │   └── strategies/
│       │       └── jwt.strategy.ts
│       │
│       ├── assessment/
│       │   ├── assessment.module.ts
│       │   ├── assignment/
│       │   │   ├── controllers/
│       │   │   │   └── assignment.controller.ts
│       │   │   ├── dto/
│       │   │   │   ├── update-assignment.dto.ts
│       │   │   │   └── submit-assignment.dto.ts
│       │   │   ├── repositories/
│       │   │   │   └── assignment.repository.ts
│       │   │   └── services/
│       │   │       └── assignment.service.ts
│       │   └── quiz/
│       │       ├── controllers/
│       │       │   └── quiz.controller.ts
│       │       ├── repositories/
│       │       │   └── quiz.repository.ts
│       │       └── services/
│       │           └── quiz.service.ts
│       │
│       ├── backup/
│       │   ├── backup.module.ts
│       │   ├── backup.controller.ts
│       │   └── backup.service.ts
│       │
│       ├── blogs/
│       │   ├── blogs.module.ts
│       │   ├── blogs.controller.ts
│       │   ├── blogs.service.ts
│       │   ├── blogs.repository.ts
│       │   ├── dto/
│       │   │   ├── create-blog.dto.ts
│       │   │   ├── publish-blog.dto.ts
│       │   │   └── update-blog.dto.ts
│       │   └── validators/
│       │       └── is-valid-content-blocks.validator.ts
│       │
│       ├── categories/
│       │   ├── categories.controller.ts
│       │   ├── categories.service.ts
│       │   ├── categories.repository.ts
│       │   └── dto/
│       │       ├── create-category.dto.ts
│       │       └── update-category.dto.ts
│       │
│       ├── course-content/
│       │   ├── controller/
│       │   │   ├── lesson.controller.ts
│       │   │   └── module.controller.ts
│       │   ├── dto/
│       │   │   ├── create-module.dto.ts
│       │   │   ├── create-lesson.dto.ts
│       │   │   ├── reorder.dto.ts
│       │   │   └── update-lesson.dto.ts
│       │   ├── lessons/
│       │   │   ├── controllers/
│       │   │   │   └── lessons.controller.ts
│       │   │   ├── dto/
│       │   │   │   ├── create-lesson.dto.ts
│       │   │   │   ├── lesson-content-block.type.ts
│       │   │   │   └── update-lesson.dto.ts
│       │   │   ├── repositories/
│       │   │   │   └── lessons.repository.ts
│       │   │   └── services/
│       │   │       └── lessons.service.ts
│       │   ├── modules/
│       │   │   ├── controllers/
│       │   │   │   └── modules.controller.ts
│       │   │   ├── dto/
│       │   │   │   └── update-module.dto.ts
│       │   │   ├── repositories/
│       │   │   │   └── modules.repository.ts
│       │   │   └── services/
│       │   │       └── modules.service.ts
│       │   └── services/
│       │       ├── lesson.repositories.ts
│       │       ├── lesson.service.ts
│       │       └── module.services.ts
│       │
│       ├── course-public-content/
│       │   ├── course-public-content.module.ts
│       │   ├── controller/
│       │   │   └── course-public-content.controller.ts
│       │   ├── dto/
│       │   │   ├── create-course-public-section.dto.ts
│       │   │   └── update-course-public-section.dto.ts
│       │   ├── repositories/
│       │   │   └── course-public-section.repository.ts
│       │   └── services/
│       │       └── course-public-content.service.ts
│       │
│       ├── courses/
│       │   ├── courses.module.ts
│       │   ├── controller/
│       │   │   ├── course-analytics.controller.ts
│       │   │   └── courses.controller.ts
│       │   ├── dto/
│       │   │   ├── create-course.dto.ts
│       │   │   └── update-course.dto.ts
│       │   ├── queries/
│       │   │   ├── admin-course.query.ts
│       │   │   └── course.query.ts
│       │   └── repositories/
│       │       ├── course-analytics.repository.ts
│       │       ├── course-enrollments.repository.ts
│       │       ├── course-lesson-engagement.repository.ts
│       │       ├── course-student-progress.repository.ts
│       │       └── courses.repository.ts
│       │
│       ├── dashboard/
│       │   └── dashboard.controller.ts
│       │
│       ├── enrollment-requests/
│       │   ├── enrollment-request.module.ts
│       │   ├── controllers/
│       │   │   └── enrollment-request.controller.ts
│       │   ├── dto/
│       │   │   ├── create-enrollment-request.dto.ts
│       │   │   └── admin-action.dto.ts
│       │   ├── repositories/
│       │   │   └── enrollment-request.repository.ts
│       │   └── services/
│       │       └── enrollment-request.service.ts
│       │
│       ├── enrollments/
│       │   ├── enrollment.module.ts
│       │   ├── controllers/
│       │   │   └── enrollment.controller.ts
│       │   ├── dto/
│       │   │   └── admin-enroll.dto.ts
│       │   ├── guards/
│       │   │   └── enrollment.guard.ts
│       │   ├── repositories/
│       │   │   └── enrollment.repository.ts
│       │   └── services/
│       │       └── enrollment.service.ts
│       │
│       ├── instructors/
│       │   ├── instructors.module.ts
│       │   ├── instructors.controller.ts
│       │   ├── instructors.service.ts
│       │   ├── instructors.repository.ts
│       │   └── dto/
│       │       ├── create-instructor.dto.ts
│       │       └── update-instructor.dto.ts
│       │
│       ├── notification/
│       │   ├── notification.module.ts
│       │   ├── controllers/
│       │   │   └── notification.controller.ts
│       │   ├── repositories/
│       │   │   └── notification.repository.ts
│       │   └── services/
│       │       └── notification.service.ts
│       │
│       ├── payment/
│       │   ├── payment.module.ts
│       │   ├── controllers/
│       │   │   └── payment.controller.ts
│       │   ├── dto/
│       │   │   └── upload-slip.dto.ts
│       │   ├── repositories/
│       │   │   └── payment.repository.ts
│       │   └── services/
│       │       └── payment.service.ts
│       │
│       ├── progress/
│       │   ├── progress.module.ts
│       │   ├── controllers/
│       │   │   └── progress.controller.ts
│       │   ├── repositories/
│       │   │   └── progress.repository.ts
│       │   └── services/
│       │       └── progress.service.ts
│       │
│       ├── upload/
│       │   ├── upload.controller.ts
│       │   └── upload.service.ts
│       │
│       ├── webinar-registrations/
│       │   ├── webinar-registration.controller.ts
│       │   ├── webinar-registration.service.ts
│       │   ├── webinar-registration.repository.ts
│       │   └── dto/
│       │       └── create-webinar-registration.dto.ts
│       │
│       └── webinars/
│           ├── webinars.module.ts
│           ├── webinars.controller.ts
│           ├── webinars.service.ts
│           ├── webinars.repository.ts
│           └── dto/
│               ├── create-webinar.dto.ts
│               └── update-webinar.dto.ts
│
└── test/
    ├── app.e2e-spec.ts
    └── jest-e2e.json
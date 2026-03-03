import { Module } from '@nestjs/common';
import {
  CoursePublicContentPublicController,
  CoursePublicContentAdminController,
} from './controller/course-public-content.controller';
import { CoursePublicContentService } from './services/course-public-content.service';
import { CoursePublicSectionRepository } from './repositories/course-public-section.repository';

@Module({
  controllers: [
    CoursePublicContentPublicController,
    CoursePublicContentAdminController,
  ],
  providers: [CoursePublicContentService, CoursePublicSectionRepository],
  exports: [CoursePublicContentService],
})
export class CoursePublicContentModule {}

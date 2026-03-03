import { Injectable, NotFoundException } from '@nestjs/common';
import { CoursePublicSectionType, Prisma } from '@prisma/client';
import {
  CoursePublicSectionRepository,
  CoursePublicSection,
} from '../repositories/course-public-section.repository';
import { CreateCoursePublicSectionDto } from '../dto/create-course-public-section.dto';
import { UpdateCoursePublicSectionDto } from '../dto/update-course-public-section.dto';

@Injectable()
export class CoursePublicContentService {
  constructor(private readonly repo: CoursePublicSectionRepository) {}

  // ─── Public Queries ──────────────────────────────────────

  /**
   * Returns only visible sections for a course, ordered by `order`.
   * Used by the public-facing course detail page.
   */
  async findVisibleByCourseId(
    courseId: string,
  ): Promise<CoursePublicSection[]> {
    return this.repo.findVisibleByCourseId(courseId);
  }

  // ─── Admin Queries ───────────────────────────────────────

  /**
   * Returns ALL sections for a course (visible + hidden), ordered by `order`.
   * Used by the admin content editor.
   */
  async findAllByCourseId(courseId: string): Promise<CoursePublicSection[]> {
    return this.repo.findByCourseId(courseId);
  }

  async findOneById(id: string): Promise<CoursePublicSection> {
    const section = await this.repo.findById(id);
    if (!section) {
      throw new NotFoundException('Course public section not found');
    }
    return section;
  }

  // ─── Admin Mutations ─────────────────────────────────────

  async create(
    dto: CreateCoursePublicSectionDto,
  ): Promise<CoursePublicSection> {
    return this.repo.create({
      courseId: dto.courseId,
      type: dto.type,
      title: dto.title,
      subtitle: dto.subtitle,
      order: dto.order,
      content: dto.content as Prisma.InputJsonValue,
      isVisible: dto.isVisible,
    });
  }

  async update(
    id: string,
    dto: UpdateCoursePublicSectionDto,
  ): Promise<CoursePublicSection> {
    // Ensure it exists
    await this.findOneById(id);

    return this.repo.update(id, {
      title: dto.title,
      subtitle: dto.subtitle,
      order: dto.order,
      content: dto.content as Prisma.InputJsonValue,
      isVisible: dto.isVisible,
    });
  }

  /**
   * Upsert a section by course + type.
   * If a section of the given type already exists for the course, it updates it.
   * Otherwise, a new section is created.
   */
  async upsertByType(
    courseId: string,
    type: CoursePublicSectionType,
    dto: UpdateCoursePublicSectionDto,
  ): Promise<CoursePublicSection> {
    return this.repo.upsertByType(courseId, type, {
      title: dto.title,
      subtitle: dto.subtitle,
      order: dto.order,
      content: dto.content as Prisma.InputJsonValue,
      isVisible: dto.isVisible,
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOneById(id);
    await this.repo.delete(id);
  }
}

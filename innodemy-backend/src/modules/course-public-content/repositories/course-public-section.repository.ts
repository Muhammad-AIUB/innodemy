import { Injectable } from '@nestjs/common';
import {
  CoursePublicSection,
  CoursePublicSectionType,
  Prisma,
} from '@prisma/client';
import { PrismaService } from '../../../shared/prisma/prisma.service';

export type { CoursePublicSection };

@Injectable()
export class CoursePublicSectionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    courseId: string;
    type: CoursePublicSectionType;
    title?: string;
    subtitle?: string;
    order?: number;
    content?: Prisma.InputJsonValue;
    isVisible?: boolean;
  }): Promise<CoursePublicSection> {
    return this.prisma.coursePublicSection.create({
      data: {
        courseId: data.courseId,
        type: data.type,
        title: data.title,
        subtitle: data.subtitle,
        order: data.order ?? 0,
        content: data.content ?? [],
        isVisible: data.isVisible ?? true,
      },
    });
  }

  async findById(id: string): Promise<CoursePublicSection | null> {
    return this.prisma.coursePublicSection.findUnique({ where: { id } });
  }

  async findByCourseId(courseId: string): Promise<CoursePublicSection[]> {
    return this.prisma.coursePublicSection.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
    });
  }

  async findVisibleByCourseId(
    courseId: string,
  ): Promise<CoursePublicSection[]> {
    return this.prisma.coursePublicSection.findMany({
      where: { courseId, isVisible: true },
      orderBy: { order: 'asc' },
    });
  }

  async findByCourseAndType(
    courseId: string,
    type: CoursePublicSectionType,
  ): Promise<CoursePublicSection | null> {
    return this.prisma.coursePublicSection.findUnique({
      where: { courseId_type: { courseId, type } },
    });
  }

  async update(
    id: string,
    data: Partial<{
      title: string | null;
      subtitle: string | null;
      order: number;
      content: Prisma.InputJsonValue;
      isVisible: boolean;
    }>,
  ): Promise<CoursePublicSection> {
    return this.prisma.coursePublicSection.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.coursePublicSection.delete({ where: { id } });
  }

  async deleteAllByCourseId(courseId: string): Promise<void> {
    await this.prisma.coursePublicSection.deleteMany({ where: { courseId } });
  }

  async upsertByType(
    courseId: string,
    type: CoursePublicSectionType,
    data: {
      title?: string;
      subtitle?: string;
      order?: number;
      content?: Prisma.InputJsonValue;
      isVisible?: boolean;
    },
  ): Promise<CoursePublicSection> {
    return this.prisma.coursePublicSection.upsert({
      where: { courseId_type: { courseId, type } },
      create: {
        courseId,
        type,
        title: data.title,
        subtitle: data.subtitle,
        order: data.order ?? 0,
        content: data.content ?? [],
        isVisible: data.isVisible ?? true,
      },
      update: {
        title: data.title,
        subtitle: data.subtitle,
        order: data.order,
        content: data.content,
        isVisible: data.isVisible,
      },
    });
  }
}

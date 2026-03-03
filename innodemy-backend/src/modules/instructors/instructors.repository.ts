import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { Instructor, Prisma } from '@prisma/client';

@Injectable()
export class InstructorsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.InstructorCreateInput): Promise<Instructor> {
    return this.prisma.instructor.create({ data });
  }

  async findAll(): Promise<Instructor[]> {
    return this.prisma.instructor.findMany({
      where: {
        isDeleted: false,
        status: 'ACTIVE',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string): Promise<Instructor | null> {
    return this.prisma.instructor.findFirst({
      where: {
        id,
        isDeleted: false,
      },
    });
  }

  async update(
    id: string,
    data: Prisma.InstructorUpdateInput,
  ): Promise<Instructor> {
    return this.prisma.instructor.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string): Promise<Instructor> {
    return this.prisma.instructor.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  async toggleStatus(id: string): Promise<Instructor> {
    const instructor = await this.findById(id);
    const newStatus = instructor?.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

    return this.prisma.instructor.update({
      where: { id },
      data: { status: newStatus },
    });
  }
}

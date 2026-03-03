import { Injectable, NotFoundException } from '@nestjs/common';
import { InstructorsRepository } from './instructors.repository';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import { Instructor } from '@prisma/client';

@Injectable()
export class InstructorsService {
  constructor(private readonly repo: InstructorsRepository) {}

  async create(dto: CreateInstructorDto): Promise<Instructor> {
    return this.repo.create(dto);
  }

  async findAll(): Promise<Instructor[]> {
    return this.repo.findAll();
  }

  async findOne(id: string): Promise<Instructor> {
    const instructor = await this.repo.findById(id);
    if (!instructor) {
      throw new NotFoundException('Instructor not found');
    }
    return instructor;
  }

  async update(id: string, dto: UpdateInstructorDto): Promise<Instructor> {
    await this.findOne(id); // Ensure exists
    return this.repo.update(id, dto);
  }

  async toggleStatus(id: string): Promise<Instructor> {
    await this.findOne(id); // Ensure exists
    return this.repo.toggleStatus(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id); // Ensure exists
    await this.repo.softDelete(id);
  }
}

import { Module } from '@nestjs/common';
import { PrismaModule } from '../../shared/prisma/prisma.module';
import { InstructorsController } from './instructors.controller';
import { InstructorsService } from './instructors.service';
import { InstructorsRepository } from './instructors.repository';

@Module({
  imports: [PrismaModule],
  controllers: [InstructorsController],
  providers: [InstructorsService, InstructorsRepository],
  exports: [InstructorsService],
})
export class InstructorsModule {}

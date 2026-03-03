import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { InstructorsService } from './instructors.service';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('instructors')
@Controller('instructors')
export class InstructorsController {
  constructor(private readonly service: InstructorsService) {}

  @Get()
  @ApiOperation({ summary: 'List all active instructors' })
  @ApiResponse({ status: 200 })
  async findAll() {
    const data = await this.service.findAll();
    return { success: true, data };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get instructor by ID' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404, description: 'Instructor not found' })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const data = await this.service.findOne(id);
    return { success: true, data };
  }

  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create instructor (admin only)' })
  @ApiResponse({ status: 201 })
  async create(@Body() dto: CreateInstructorDto) {
    const data = await this.service.create(dto);
    return { success: true, data };
  }

  @Patch(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update instructor (admin only)' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404, description: 'Instructor not found' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateInstructorDto,
  ) {
    const data = await this.service.update(id, dto);
    return { success: true, data };
  }

  @Patch(':id/toggle-status')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle instructor status (admin only)' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404, description: 'Instructor not found' })
  async toggleStatus(@Param('id', new ParseUUIDPipe()) id: string) {
    const data = await this.service.toggleStatus(id);
    return { success: true, data };
  }

  @Delete(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete instructor (admin only)' })
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 404, description: 'Instructor not found' })
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.service.remove(id);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CoursePublicSectionType, UserRole } from '@prisma/client';
import { CoursePublicContentService } from '../services/course-public-content.service';
import { CreateCoursePublicSectionDto } from '../dto/create-course-public-section.dto';
import { UpdateCoursePublicSectionDto } from '../dto/update-course-public-section.dto';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import {
  AdminAudit,
  AdminAuditInterceptor,
} from '../../../common/interceptors/admin-audit.interceptor';

// ─── Public Controller ──────────────────────────────────────

@ApiTags('course-public-content')
@Controller('courses/:courseId/public-content')
export class CoursePublicContentPublicController {
  constructor(private readonly service: CoursePublicContentService) {}

  @Get()
  @ApiOperation({
    summary: 'Get visible public content sections for a course',
  })
  @ApiResponse({ status: 200 })
  async findVisible(@Param('courseId', new ParseUUIDPipe()) courseId: string) {
    const data = await this.service.findVisibleByCourseId(courseId);
    return { success: true, data };
  }
}

// ─── Admin Controller ───────────────────────────────────────

@ApiTags('course-public-content-admin')
@Controller('admin/courses/:courseId/public-content')
@UseGuards(JwtGuard, RolesGuard)
@UseInterceptors(AdminAuditInterceptor)
@ApiBearerAuth()
export class CoursePublicContentAdminController {
  constructor(private readonly service: CoursePublicContentService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Get all public content sections for a course (admin)',
  })
  @ApiResponse({ status: 200 })
  async findAll(@Param('courseId', new ParseUUIDPipe()) courseId: string) {
    const data = await this.service.findAllByCourseId(courseId);
    return { success: true, data };
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get single public content section by id' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404, description: 'Section not found' })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const data = await this.service.findOneById(id);
    return { success: true, data };
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @AdminAudit({
    action: 'COURSE_PUBLIC_SECTION_CREATED',
    entity: 'CoursePublicSection',
    entityIdFromResponse: 'data.id',
  })
  @ApiOperation({ summary: 'Create a public content section' })
  @ApiResponse({ status: 201 })
  async create(
    @Param('courseId', new ParseUUIDPipe()) courseId: string,
    @Body() dto: CreateCoursePublicSectionDto,
  ) {
    // Ensure courseId from URL is used
    dto.courseId = courseId;
    const data = await this.service.create(dto);
    return { success: true, data };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @AdminAudit({
    action: 'COURSE_PUBLIC_SECTION_UPDATED',
    entity: 'CoursePublicSection',
    entityIdParam: 'id',
  })
  @ApiOperation({ summary: 'Update a public content section' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404, description: 'Section not found' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateCoursePublicSectionDto,
  ) {
    const data = await this.service.update(id, dto);
    return { success: true, data };
  }

  @Patch('upsert/:type')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @AdminAudit({
    action: 'COURSE_PUBLIC_SECTION_UPSERTED',
    entity: 'CoursePublicSection',
    entityIdFromResponse: 'data.id',
  })
  @ApiOperation({ summary: 'Upsert a public content section by type' })
  @ApiResponse({ status: 200 })
  async upsert(
    @Param('courseId', new ParseUUIDPipe()) courseId: string,
    @Param('type') type: CoursePublicSectionType,
    @Body() dto: UpdateCoursePublicSectionDto,
  ) {
    const data = await this.service.upsertByType(courseId, type, dto);
    return { success: true, data };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @AdminAudit({
    action: 'COURSE_PUBLIC_SECTION_DELETED',
    entity: 'CoursePublicSection',
    entityIdParam: 'id',
  })
  @ApiOperation({ summary: 'Delete a public content section' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404, description: 'Section not found' })
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.service.remove(id);
    return { success: true, data: null };
  }
}

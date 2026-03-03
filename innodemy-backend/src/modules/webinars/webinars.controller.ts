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
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { WebinarsService } from './webinars.service';
import { CreateWebinarDto } from './dto/create-webinar.dto';
import { UpdateWebinarDto } from './dto/update-webinar.dto';
import { ListWebinarsQueryDto } from './dto/list-webinars-query.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('webinars-public')
@Controller('webinars')
export class WebinarsPublicController {
  constructor(private readonly service: WebinarsService) {}

  @Get()
  @ApiOperation({
    summary:
      'List published webinars with pagination and optional title search',
  })
  @ApiResponse({ status: 200 })
  async findPublished(@Query() query: ListWebinarsQueryDto) {
    const result = await this.service.findPublished(query);
    return { success: true, ...result };
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get one published webinar by slug' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404, description: 'Webinar not found' })
  async findPublishedBySlug(@Param('slug') slug: string) {
    const data = await this.service.findPublishedBySlug(slug);
    return { success: true, data };
  }
}

@ApiTags('webinars-admin')
@Controller('admin/webinars')
@UseGuards(JwtGuard, RolesGuard)
@ApiBearerAuth()
export class WebinarsAdminController {
  constructor(private readonly service: WebinarsService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'List webinars for admin (DRAFT + PUBLISHED)' })
  @ApiResponse({ status: 200 })
  async findAll(@Query() query: ListWebinarsQueryDto) {
    const result = await this.service.findAll(query);
    return { success: true, ...result };
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get single webinar by UUID (admin)' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404, description: 'Webinar not found' })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const data = await this.service.findOne(id);
    return { success: true, data };
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create webinar as DRAFT' })
  @ApiResponse({ status: 201 })
  async create(@Body() dto: CreateWebinarDto) {
    const data = await this.service.create(dto);
    return { success: true, data };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Partially update webinar by id' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404, description: 'Webinar not found' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateWebinarDto,
  ) {
    const data = await this.service.update(id, dto);
    return { success: true, data };
  }

  @Patch(':id/publish')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Publish webinar by id' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404, description: 'Webinar not found' })
  async publish(@Param('id', new ParseUUIDPipe()) id: string) {
    const data = await this.service.publish(id);
    return { success: true, data };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete webinar by id' })
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 404, description: 'Webinar not found' })
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.service.remove(id);
  }
}

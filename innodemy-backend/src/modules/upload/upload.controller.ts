import {
  Controller,
  Post,
  UseGuards,
  Req,
  BadRequestException,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { UploadService } from './upload.service';
import { AdminAuditInterceptor } from '../../common/interceptors/admin-audit.interceptor';
import type { FastifyRequest } from 'fastify';

@ApiTags('Upload')
@Controller('upload')
@UseGuards(JwtGuard, RolesGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  /**
   * Upload image file
   * POST /api/v1/upload/image
   * Accessible to all authenticated users (students for payment screenshots, admins for course banners)
   */
  @Post('image')
  @Roles(UserRole.STUDENT, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload image file (max 5MB)' })
  async uploadImage(@Req() request: FastifyRequest) {
    try {
      const data = await request.file();

      if (!data) {
        throw new BadRequestException('No file uploaded');
      }

      const buffer = await data.toBuffer();

      const mimetype = data.mimetype;

      const filename = data.filename;

      // Validate file type

      if (!this.uploadService.validateImageType(mimetype)) {
        throw new BadRequestException(
          'Invalid file type. Only JPEG, PNG, and WEBP are allowed.',
        );
      }

      // Validate file size (5MB max for images)

      if (!this.uploadService.validateFileSize(buffer.length, 5)) {
        throw new BadRequestException('File size exceeds 5MB limit');
      }

      const fileUrl = await this.uploadService.saveFile(
        buffer,

        filename,
        'images',
      );

      return {
        success: true,
        data: {
          url: fileUrl,

          filename,

          size: buffer.length,
        },
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to upload file');
    }
  }

  /**
   * Upload video file
   * POST /api/v1/upload/video
   * Restricted to admins only (for course content)
   */
  @Post('video')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseInterceptors(AdminAuditInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload video file (max 100MB)' })
  async uploadVideo(@Req() request: FastifyRequest) {
    try {
      const data = await request.file();

      if (!data) {
        throw new BadRequestException('No file uploaded');
      }

      const buffer = await data.toBuffer();

      const mimetype = data.mimetype;

      const filename = data.filename;

      // Validate file type

      if (!this.uploadService.validateVideoType(mimetype)) {
        throw new BadRequestException(
          'Invalid file type. Only MP4, WEBM, and OGG are allowed.',
        );
      }

      // Validate file size (100MB max for videos)

      if (!this.uploadService.validateFileSize(buffer.length, 100)) {
        throw new BadRequestException('File size exceeds 100MB limit');
      }

      const fileUrl = await this.uploadService.saveFile(
        buffer,

        filename,
        'videos',
      );

      return {
        success: true,
        data: {
          url: fileUrl,

          filename,

          size: buffer.length,
        },
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to upload file');
    }
  }
}

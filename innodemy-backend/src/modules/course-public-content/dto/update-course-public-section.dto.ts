import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateCoursePublicSectionDto {
  @ApiPropertyOptional({ example: 'Course Modules' })
  @IsOptional()
  @IsString({ message: 'title must be a string' })
  @MaxLength(200, { message: 'title must not exceed 200 characters' })
  title?: string;

  @ApiPropertyOptional({ example: 'What you will learn' })
  @IsOptional()
  @IsString({ message: 'subtitle must be a string' })
  @MaxLength(500, { message: 'subtitle must not exceed 500 characters' })
  subtitle?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt({ message: 'order must be an integer' })
  @Min(0, { message: 'order must be at least 0' })
  order?: number;

  @ApiPropertyOptional({
    example: [{ name: 'Module 1', sessions: 5, projects: 1 }],
    description: 'JSON content of the section',
  })
  @IsOptional()
  @IsArray({ message: 'content must be an array' })
  content?: unknown[];

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean({ message: 'isVisible must be a boolean' })
  isVisible?: boolean;
}

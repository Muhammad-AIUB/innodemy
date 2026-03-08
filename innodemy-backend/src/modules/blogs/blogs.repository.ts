import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../shared/prisma/prisma.service';

const BLOG_STATUS_PUBLISHED = 'PUBLISHED' as const;
const BLOG_STATUS_ARCHIVED = 'ARCHIVED' as const;

const blogDetailInclude = {
  author: true,
  category: true,
  tags: {
    include: {
      tag: true,
    },
  },
} satisfies Prisma.BlogInclude;

const publishedListSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  bannerImage: true,
  readDuration: true,
  publishedAt: true,
} satisfies Prisma.BlogSelect;

const adminListSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  bannerImage: true,
  readDuration: true,
  status: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
  isDeleted: true,
  author: {
    select: { id: true, name: true },
  },
  category: {
    select: { id: true, name: true, slug: true },
  },
  tags: {
    select: {
      tag: { select: { id: true, name: true } },
    },
  },
} satisfies Prisma.BlogSelect;

export type BlogEntity = Prisma.BlogGetPayload<{
  include: typeof blogDetailInclude;
}>;

export type PublishedBlogListEntity = Prisma.BlogGetPayload<{
  select: typeof publishedListSelect;
}>;

export type AdminBlogListEntity = Prisma.BlogGetPayload<{
  select: typeof adminListSelect;
}>;

@Injectable()
export class BlogsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.BlogCreateInput): Promise<BlogEntity> {
    return this.prisma.blog.create({
      data,
      include: blogDetailInclude,
    });
  }

  update(id: string, data: Prisma.BlogUpdateInput): Promise<BlogEntity> {
    return this.prisma.blog.update({
      where: { id },
      data,
      include: blogDetailInclude,
    });
  }

  findById(id: string): Promise<BlogEntity | null> {
    return this.prisma.blog.findFirst({
      where: {
        id,
        isDeleted: false,
      },
      include: blogDetailInclude,
    });
  }

  async findPublishedBySlug(slug: string): Promise<BlogEntity | null> {
    const blog = await this.prisma.blog.findUnique({
      where: { slug },
      include: blogDetailInclude,
    });
    if (
      !blog ||
      blog.status !== BLOG_STATUS_PUBLISHED ||
      blog.isDeleted
    ) {
      return null;
    }
    return blog;
  }

  findPublishedPaginated(params: {
    skip: number;
    take: number;
    categoryId?: string;
  }): Promise<PublishedBlogListEntity[]> {
    const { skip, take, categoryId } = params;

    return this.prisma.blog.findMany({
      where: {
        status: BLOG_STATUS_PUBLISHED,
        isDeleted: false,
        ...(categoryId ? { categoryId } : {}),
      },
      skip,
      take,
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      select: publishedListSelect,
    });
  }

  findAdminPaginated(params: {
    skip: number;
    take: number;
    categoryId?: string;
  }): Promise<AdminBlogListEntity[]> {
    const { skip, take, categoryId } = params;

    return this.prisma.blog.findMany({
      where: {
        isDeleted: false,
        ...(categoryId ? { categoryId } : {}),
      },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      select: adminListSelect,
    });
  }

  countPublished(categoryId?: string): Promise<number> {
    return this.prisma.blog.count({
      where: {
        status: BLOG_STATUS_PUBLISHED,
        isDeleted: false,
        ...(categoryId ? { categoryId } : {}),
      },
    });
  }

  countAdmin(categoryId?: string): Promise<number> {
    return this.prisma.blog.count({
      where: {
        isDeleted: false,
        ...(categoryId ? { categoryId } : {}),
      },
    });
  }

  async existsBySlug(slug: string, excludeId?: string): Promise<boolean> {
    const item = await this.prisma.blog.findFirst({
      where: {
        slug,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      select: {
        id: true,
      },
    });

    return Boolean(item);
  }

  softDelete(id: string): Promise<{ id: string }> {
    return this.prisma.blog.update({
      where: { id },
      data: {
        isDeleted: true,
        status: BLOG_STATUS_ARCHIVED,
      },
      select: {
        id: true,
      },
    });
  }
}

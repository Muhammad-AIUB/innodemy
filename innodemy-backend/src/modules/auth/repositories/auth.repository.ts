import { Injectable } from '@nestjs/common';
import { OtpCode, Prisma, User, UserRole } from '@prisma/client';
import { PrismaService } from '../../../shared/prisma/prisma.service';

/** User fields needed for login: auth checks, JWT, and response payload. */
export type UserForLogin = Pick<
  User,
  | 'id'
  | 'name'
  | 'email'
  | 'password'
  | 'phoneNumber'
  | 'role'
  | 'provider'
  | 'isVerified'
  | 'isActive'
  | 'isDeleted'
  | 'createdAt'
>;

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ─── USER QUERIES ─────────────────────────────────────────────────────────

  async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  /** Fetches only fields required for login: auth checks + JWT + response payload. */
  async findUserByEmailForLogin(email: string): Promise<UserForLogin | null> {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        phoneNumber: true,
        role: true,
        provider: true,
        isVerified: true,
        isActive: true,
        isDeleted: true,
        createdAt: true,
      },
    });
  }

  async findUserByGoogleId(googleId: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { googleId } });
  }

  async findUserById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async findAllUsers(options?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    sortBy?: string;
    order?: string;
    isActive?: string;
    isDeleted?: string;
  }): Promise<{ users: User[]; total: number }> {
    const page = options?.page && options.page > 0 ? options.page : 1;
    const limit =
      options?.limit && options.limit > 0 ? Math.min(options.limit, 100) : 20;
    const search = options?.search?.trim();
    const role = options?.role?.toUpperCase();
    const sortBy = options?.sortBy ?? 'createdAt';
    const order =
      options?.order && options.order.toLowerCase() === 'asc' ? 'asc' : 'desc';
    const isActive =
      options?.isActive === 'true'
        ? true
        : options?.isActive === 'false'
          ? false
          : undefined;
    const isDeleted =
      options?.isDeleted === 'true'
        ? true
        : options?.isDeleted === 'false'
          ? false
          : undefined;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : undefined;

    const roleFilter =
      role && Object.values(UserRole).includes(role as UserRole)
        ? { role: role as UserRole }
        : undefined;

    const flagsFilter =
      isActive !== undefined || isDeleted !== undefined
        ? {
            ...(isActive !== undefined ? { isActive } : {}),
            ...(isDeleted !== undefined ? { isDeleted } : {}),
          }
        : undefined;

    const andParts = [where, roleFilter, flagsFilter].filter(Boolean);
    const finalWhere =
      andParts.length > 1 ? { AND: andParts } : (andParts[0] as object);

    const allowedSortFields = new Set(['createdAt', 'email', 'name', 'role']);
    const finalSortBy = allowedSortFields.has(sortBy) ? sortBy : 'createdAt';

    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where: finalWhere,
        orderBy: { [finalSortBy]: order },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.user.count({ where: finalWhere }),
    ]);

    return { users, total };
  }

  async updateUserRole(id: string, role: UserRole): Promise<User> {
    return this.prisma.user.update({ where: { id }, data: { role } });
  }

  async deactivateUser(id: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { isActive: false, isDeleted: true },
    });
  }

  // ─── OTP QUERIES ──────────────────────────────────────────────────────────

  async createOtp(
    email: string,
    code: string,
    expiresAt: Date,
  ): Promise<OtpCode> {
    return this.prisma.otpCode.create({
      data: { email, code, expiresAt, isUsed: false },
    });
  }

  /** Returns the latest valid (unused, unexpired) OTP for the email. Code comparison is done in the service using bcrypt. */
  async findLatestValidOtpByEmail(email: string): Promise<OtpCode | null> {
    return this.prisma.otpCode.findFirst({
      where: {
        email,
        isUsed: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markOtpUsed(id: string): Promise<void> {
    await this.prisma.otpCode.update({
      where: { id },
      data: { isUsed: true },
    });
  }

  async invalidatePreviousOtps(email: string): Promise<void> {
    await this.prisma.otpCode.updateMany({
      where: { email, isUsed: false },
      data: { isUsed: true },
    });
  }

  // ─── REFRESH TOKEN QUERIES ────────────────────────────────────────────────

  async createRefreshToken(
    jti: string,
    userId: string,
    expiresAt: Date,
  ): Promise<void> {
    await this.prisma.refreshToken.create({
      data: { jti, userId, expiresAt },
    });
  }

  /**
   * Finds and deletes a refresh token by jti if it exists and is not expired.
   * Returns the userId if valid and consumed; null otherwise.
   */
  async findAndConsumeRefreshToken(jti: string): Promise<string | null> {
    const now = new Date();
    const token = await this.prisma.refreshToken.findUnique({
      where: { jti },
    });
    if (!token || token.expiresAt <= now) {
      return null;
    }
    await this.prisma.refreshToken.delete({ where: { jti } });
    return token.userId;
  }
}

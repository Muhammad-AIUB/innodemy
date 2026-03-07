import { randomUUID } from 'node:crypto';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthProvider, OtpCode, User, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { AuthRepository } from '../repositories/auth.repository';
import { OtpBruteforceGuard } from '../../../common/guards/otp-bruteforce.guard';
import { SendOtpDto } from '../dto/send-otp.dto';
import { VerifyOtpDto } from '../dto/verify-otp.dto';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { GoogleLoginDto } from '../dto/google-login.dto';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { MailService } from '../../../shared/mail/mail.service';

/** Fields needed for login auth checks, JWT, and sanitized response. */
type LoginUser = Pick<
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
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly otpBruteforce: OtpBruteforceGuard,
    private readonly mailService: MailService,
  ) {}

  // ─── PRIVATE HELPERS ──────────────────────────────────────────────────────

  private generateOtpCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private getOtpExpiry(): Date {
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 5);
    return expiry;
  }

  /** Access token: short-lived (15m). Used for API auth via Bearer header. */
  private signAccessToken(userId: string, role: UserRole): string {
    const payload = { sub: userId, role };
    return this.jwtService.sign(payload, { expiresIn: '15m' });
  }

  /** Refresh token: long-lived (7d). Stored in DB for rotation; exchanged for new access token. */
  private signRefreshToken(userId: string, jti: string): string {
    const payload = { sub: userId, jti, type: 'refresh' };
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }

  /**
   * Creates access + refresh token pair and persists the refresh token for rotation.
   */
  private async createTokenPair(
    userId: string,
    role: UserRole,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const jti = randomUUID();
    const accessToken = this.signAccessToken(userId, role);
    const refreshToken = this.signRefreshToken(userId, jti);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.authRepository.createRefreshToken(jti, userId, expiresAt);

    return { accessToken, refreshToken };
  }

  /** Minimal user shape for login response; also accepts full User. */
  private sanitizeUser(
    user: Pick<
      User,
      | 'id'
      | 'name'
      | 'email'
      | 'phoneNumber'
      | 'role'
      | 'provider'
      | 'isVerified'
      | 'isActive'
      | 'isDeleted'
      | 'createdAt'
    >,
  ) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      provider: user.provider,
      isVerified: user.isVerified,
      isActive: user.isActive,
      isDeleted: user.isDeleted,
      createdAt: user.createdAt,
    };
  }

  // ─── GET CURRENT USER ─────────────────────────────────────────────────────

  async getMe(userId: string): Promise<{ user: object }> {
    const user = await this.authRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    if (!user.isActive) {
      throw new ForbiddenException('Your account has been deactivated.');
    }
    return { user: this.sanitizeUser(user) };
  }

  // ─── CHECK EMAIL EXISTS ───────────────────────────────────────────────────

  async checkEmailExists(dto: { email: string }): Promise<{ exists: boolean }> {
    const { email } = dto;
    const user = await this.authRepository.findUserByEmail(email);
    return { exists: !!user };
  }

  // ─── SEND OTP ─────────────────────────────────────────────────────────────

  async sendOtp(dto: SendOtpDto): Promise<{ message: string }> {
    const { email } = dto;

    // Invalidate any previous unused OTPs for this email
    await this.authRepository.invalidatePreviousOtps(email);

    const code = this.generateOtpCode();
    const expiresAt = this.getOtpExpiry();
    const hashedCode = await bcrypt.hash(code, 10);

    await this.authRepository.createOtp(email, hashedCode, expiresAt);

    // Fire-and-forget: send email in background so API returns immediately.
    // MailService logs errors; .catch() prevents unhandled rejection if it rethrows.
    this.mailService
      .sendOtpEmail(email, code)
      .catch((err) =>
        this.logger.warn(
          `Background OTP email failed for ${email}: ${(err as Error).message}`,
        ),
      );

    return { message: 'OTP sent successfully. Check your email.' };
  }

  // ─── VERIFY OTP ───────────────────────────────────────────────────────────

  async verifyOtp(dto: VerifyOtpDto): Promise<{ message: string }> {
    const { email, code } = dto;

    const otp: OtpCode | null =
      await this.authRepository.findLatestValidOtpByEmail(email);

    if (!otp) {
      this.otpBruteforce.recordFailedAttempt(email);
      throw new BadRequestException('Invalid or expired OTP.');
    }

    const isMatch = await bcrypt.compare(code, otp.code);
    if (!isMatch) {
      this.otpBruteforce.recordFailedAttempt(email);
      throw new BadRequestException('Invalid or expired OTP.');
    }

    await this.authRepository.markOtpUsed(otp.id);
    this.otpBruteforce.clearAttempts(email);

    return { message: 'OTP verified successfully.' };
  }

  // ─── REGISTER ─────────────────────────────────────────────────────────────

  async register(
    dto: RegisterDto,
  ): Promise<{ accessToken: string; refreshToken: string; user: object }> {
    const { name, email, password, phoneNumber } = dto;

    const existing = await this.authRepository.findUserByEmail(email);
    if (existing) {
      throw new ConflictException('An account with this email already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await this.authRepository.createUser({
      name,
      email,
      password: hashedPassword,
      phoneNumber: phoneNumber ?? null,
      role: UserRole.STUDENT,
      provider: AuthProvider.EMAIL,
      isVerified: true,
    });

    const { accessToken, refreshToken } = await this.createTokenPair(
      user.id,
      user.role,
    );
    return { accessToken, refreshToken, user: this.sanitizeUser(user) };
  }

  // ─── LOGIN ────────────────────────────────────────────────────────────────

  async login(
    dto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string; user: object }> {
    const { email, password } = dto;

    // Repository returns UserForLogin | null; typed as LoginUser for lint resolution
    const user = (await this.authRepository.findUserByEmailForLogin(
      email,
    )) as LoginUser | null;
    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    if (!user.password) {
      throw new UnauthorizedException(
        'This account uses social login. Please sign in with Google.',
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Your account has been deactivated.');
    }

    const { accessToken, refreshToken } = await this.createTokenPair(
      user.id,
      user.role,
    );
    return { accessToken, refreshToken, user: this.sanitizeUser(user) };
  }

  // ─── GOOGLE LOGIN ─────────────────────────────────────────────────────────

  async googleLogin(
    dto: GoogleLoginDto,
  ): Promise<{ accessToken: string; refreshToken: string; user: object }> {
    const { email, googleId, name } = dto;

    // Check if user exists by googleId first, then by email
    let user =
      (await this.authRepository.findUserByGoogleId(googleId)) ??
      (await this.authRepository.findUserByEmail(email));

    if (!user) {
      user = await this.authRepository.createUser({
        name,
        email,
        googleId,
        provider: AuthProvider.GOOGLE,
        role: UserRole.STUDENT,
        isVerified: true,
      });
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Your account has been deactivated.');
    }

    const { accessToken, refreshToken } = await this.createTokenPair(
      user.id,
      user.role,
    );
    return { accessToken, refreshToken, user: this.sanitizeUser(user) };
  }

  // ─── REFRESH TOKENS ───────────────────────────────────────────────────────

  async refreshTokens(
    refreshTokenRaw: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    type RefreshPayload = { sub?: string; jti?: string; type?: string };
    let payload: RefreshPayload;
    try {
      payload = this.jwtService.verify<RefreshPayload>(refreshTokenRaw);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token.');
    }

    if (payload.type !== 'refresh' || !payload.sub || !payload.jti) {
      throw new UnauthorizedException('Invalid refresh token.');
    }

    const sub = payload.sub;
    const jti = payload.jti;

    const userId = await this.authRepository.findAndConsumeRefreshToken(jti);
    if (!userId || userId !== sub) {
      throw new UnauthorizedException('Invalid or expired refresh token.');
    }
    const user = await this.authRepository.findUserById(userId);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Account is no longer active.');
    }

    return this.createTokenPair(user.id, user.role);
  }

  // ─── CREATE ADMIN (SUPER_ADMIN only) ─────────────────────────────────────

  async createAdmin(
    dto: CreateAdminDto,
    createdById: string,
  ): Promise<{ user: object }> {
    const { name, email, password, phoneNumber } = dto;

    const existing = await this.authRepository.findUserByEmail(email);
    if (existing) {
      throw new ConflictException('An account with this email already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await this.authRepository.createUser({
      name,
      email,
      password: hashedPassword,
      phoneNumber: phoneNumber ?? null,
      role: UserRole.ADMIN,
      provider: AuthProvider.EMAIL,
      isVerified: true,
      createdBy: { connect: { id: createdById } },
    });

    return { user: this.sanitizeUser(user) };
  }

  // â”€â”€â”€ SUPER ADMIN USER MANAGEMENT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  async listUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    sortBy?: string;
    order?: string;
    isActive?: string;
    isDeleted?: string;
  }): Promise<{
    users: object[];
    page: number;
    limit: number;
    total: number;
    role?: string;
    sortBy: string;
    order: 'asc' | 'desc';
    isActive?: string;
    isDeleted?: string;
  }> {
    const page = params?.page && params.page > 0 ? params.page : 1;
    const limit = params?.limit && params.limit > 0 ? params.limit : 20;

    const { users, total } = await this.authRepository.findAllUsers({
      page,
      limit,
      search: params?.search,
      role: params?.role,
      sortBy: params?.sortBy,
      order: params?.order,
      isActive: params?.isActive,
      isDeleted: params?.isDeleted,
    });

    return {
      users: users.map((u) => this.sanitizeUser(u)),
      page,
      limit,
      total,
      role: params?.role,
      sortBy: params?.sortBy ?? 'createdAt',
      order: params?.order === 'asc' ? 'asc' : 'desc',
      isActive: params?.isActive,
      isDeleted: params?.isDeleted,
    };
  }

  async promoteToAdmin(userId: string): Promise<{ user: object }> {
    const user = await this.authRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (user.role === UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Cannot change role of a SUPER_ADMIN.');
    }

    const updated = await this.authRepository.updateUserRole(
      userId,
      UserRole.ADMIN,
    );
    return { user: this.sanitizeUser(updated) };
  }

  async deleteAdmin(userId: string): Promise<{ message: string }> {
    const user = await this.authRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (user.role === UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Cannot delete a SUPER_ADMIN.');
    }

    if (user.role !== UserRole.ADMIN) {
      throw new BadRequestException('User is not an admin.');
    }

    await this.authRepository.deactivateUser(userId);
    return { message: 'Admin deleted successfully.' };
  }
}

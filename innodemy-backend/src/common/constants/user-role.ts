/**
 * User role constants — must match Prisma schema.prisma UserRole enum.
 * Local definition avoids @prisma/client resolution issues in some environments.
 */
export const UserRole = {
  STUDENT: 'STUDENT',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

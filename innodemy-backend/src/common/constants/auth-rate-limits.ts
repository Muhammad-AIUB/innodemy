/**
 * Rate limit configuration for authentication endpoints.
 * Uses @fastify/rate-limit per-route overrides (via RouteConfig).
 * Limits are per IP, in-memory (no Redis).
 *
 * Rationale:
 * - Login: 3/min — Mitigates brute-force password guessing
 * - OTP send: 3/min — Prevents email spam and abuse
 * - OTP verify: 3/min — Prevents OTP guessing (complements OtpBruteforceGuard)
 * - Register: 3/min — Prevents automated account creation
 * - Google login: 5/min — OAuth flow; slightly higher for UX
 * - Check email: 5/min — Prevents email enumeration abuse
 * - Create admin: 5/min — Defense in depth (already JWT-protected)
 */

const ONE_MINUTE = '1 minute';

export const AuthRateLimits = {
  /** Login attempts per IP per minute. Strict to mitigate brute-force. */
  LOGIN: { max: 3, timeWindow: ONE_MINUTE },

  /** OTP send requests per IP per minute. Prevents email spam. */
  SEND_OTP: { max: 3, timeWindow: ONE_MINUTE },

  /** OTP verification attempts per IP per minute. Prevents OTP guessing. */
  VERIFY_OTP: { max: 3, timeWindow: ONE_MINUTE },

  /** Registration attempts per IP per minute. Prevents automated signups. */
  REGISTER: { max: 3, timeWindow: ONE_MINUTE },

  /** Google OAuth login per IP per minute. */
  GOOGLE_LOGIN: { max: 5, timeWindow: ONE_MINUTE },

  /** Email existence check per IP per minute. Prevents enumeration. */
  CHECK_EMAIL: { max: 5, timeWindow: ONE_MINUTE },

  /** Admin creation per IP per minute. Defense in depth. */
  CREATE_ADMIN: { max: 5, timeWindow: ONE_MINUTE },
} as const;

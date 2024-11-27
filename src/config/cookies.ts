export const COOKIE_OPTIONS = {
    httpOnly: true,
    sameSite: 'strict' as const,
    maxAge: 7 *24 * 60 * 60 * 1000, // 7 days
  };
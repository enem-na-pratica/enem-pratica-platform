const env = {
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret',
} as const;

export default env;
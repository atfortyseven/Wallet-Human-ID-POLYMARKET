/**
 * Prisma 7 Configuration File
 * Migrates DATABASE_URL management and sets adapter defaults.
 */
export default {
  datasource: {
    url: process.env.DATABASE_URL,
  },
  experimental: {
    // Enable performance optimizations if needed
  }
};

import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.js',
  out: './drizzle',
  dialect: 'postgresql',
  driver: 'pglite',
  dbCredentials: {
    connectionString: 'postgresql://yashrastogi:db12345@localhost:5432/medisync',
  },
} satisfies Config;
import type { Config } from 'drizzle-kit'

export default {
  schema: './data/schema/index.ts',
  out: './data/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config

import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/database/schema/index.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    // Migrations connect as the schema owner (metalyde), not the app user (metalyde_app).
    // The app user has DML-only permissions and cannot run DDL.
    url: process.env.DATABASE_URL ?? '',
  },
  verbose: true,
  strict: true,
})

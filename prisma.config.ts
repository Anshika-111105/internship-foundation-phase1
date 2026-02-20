import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    provider: "postgresql",
    url: "postgresql://neondb_owner:npg_AByTzJ7hs0uE@ep-lucky-rice-ai0ity47-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require",
  },
});


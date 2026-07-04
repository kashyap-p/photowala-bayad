import path from "node:path";
import { defineConfig } from "@prisma/config";

/**
 * Prisma v7 moved connection URLs out of schema.prisma into a config file.
 * This config is used by `prisma db push` and `prisma migrate` to connect.
 * The runtime adapter (for PrismaClient) is configured in src/lib/db.ts.
 */
export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: process.env.DATABASE_URL ?? "file:./db/custom.db",
  },
});

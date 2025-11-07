import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { asset } from "./schema/asset";

dotenv.config({
  path: "../../apps/web/.env",
});

export const db = drizzle({
  connection: process.env.DATABASE_URL || "",
  casing: "snake_case",
  schema: {
    asset: asset,
  },
});

export { DrizzleError, DrizzleQueryError, eq } from "drizzle-orm";
export { DatabaseError } from "pg";

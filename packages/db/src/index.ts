import { drizzle } from "drizzle-orm/node-postgres";
import { asset } from "./schema/asset";

export const db = drizzle({
  connection: process.env.DATABASE_URL || "",
  casing: "snake_case",
  schema: {
    asset: asset,
  },
});

export { eq, DrizzleQueryError, DrizzleError } from "drizzle-orm";
export { DatabaseError } from "pg";

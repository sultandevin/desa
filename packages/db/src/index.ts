import { drizzle } from "drizzle-orm/node-postgres";
import { asset } from "./schema/asset";

if (process.env.NODE_ENV === "development")
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

export { DatabaseError } from "pg";

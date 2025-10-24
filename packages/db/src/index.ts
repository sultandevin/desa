import { drizzle } from "drizzle-orm/node-postgres";

export { eq } from "drizzle-orm";
export { createSelectSchema } from "drizzle-zod";

export const db = drizzle({
  connection: process.env.DATABASE_URL || "",
  casing: "snake_case",
});

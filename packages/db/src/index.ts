import { drizzle } from "drizzle-orm/node-postgres";
import { reset, seed } from "drizzle-seed";
import { asset } from "./schema/asset";

export const db = drizzle({
  connection: process.env.DATABASE_URL || "",
  casing: "snake_case",
  schema: {
    asset: asset,
  }
});

async function addDummyData() {
  await reset(db, { asset });
  await seed(db, { asset });
}

addDummyData();

export { eq } from "drizzle-orm";
export { createSelectSchema } from "drizzle-zod";

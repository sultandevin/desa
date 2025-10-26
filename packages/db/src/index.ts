import { drizzle } from "drizzle-orm/node-postgres";
import { reset, seed } from "drizzle-seed";
import { asset } from "./schema/asset";
import { user } from "./schema/auth";

export const db = drizzle({
  connection: process.env.DATABASE_URL || "",
  casing: "snake_case",
  schema: {
    asset: asset,
  },
});

async function addDummyData() {
  const [userInstance] = await db.select().from(user).limit(1);
  if (!userInstance) return;

  await reset(db, { asset });
  await seed(db, { asset }).refine((funcs) => ({
    asset: {
      count: 100,
      columns: {
        createdBy: funcs.valuesFromArray({ values: [userInstance.id] }),
      },
    },
  }));
}

addDummyData();

export { eq } from "drizzle-orm";
export { createSelectSchema } from "drizzle-zod";

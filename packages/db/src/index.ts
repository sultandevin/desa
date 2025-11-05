import { drizzle } from "drizzle-orm/node-postgres";
import { reset, seed } from "drizzle-seed";
import { asset } from "./schema/asset";
import { user } from "./schema/auth";
import { file, peraturan } from "./schema/peraturan";

export const db = drizzle({
  connection: process.env.DATABASE_URL || "",
  casing: "snake_case",
  schema: {
    asset: asset,
  },
});

async function addDummyData() {
  const [userInstance] = await db.select().from(user).limit(1);
  if (!userInstance) {
    console.log(
      "[WARN] Dummy asset data seeding failed due to no user instances found.",
    );
    return;
  }

  await reset(db, { asset });
  await seed(db, { asset }).refine((funcs) => ({
    asset: {
      count: 100,
      columns: {
        valueRp: funcs.number({ minValue: 0 }),
        createdBy: funcs.valuesFromArray({ values: [userInstance.id] }),
      },
    },
  }));
  console.log("[INFO] Dummy asset data seeded.");
}

async function addDummyRegData() {
  const [regInstance] = await db.select().from(peraturan).limit(1);
  if (!regInstance) {
    const [userInstances] = await db.select().from(user);
    const [fileInstances] = await db.select().from(file);

    await reset(db, { peraturan });
    await seed(db, { peraturan }).refine((funcs) => ({
      peraturan: {
        count: 100,
        columns: {
          berlaku_sejak: funcs.date(),
          created_by: funcs.valuesFromArray({ values: [userInstances?.id] }),
          file: funcs.valuesFromArray({ values: [fileInstances?.id] }),
        },
      },
    }));
    console.log("[INFO] Dummy regulation data seeded.");
  } else {
    console.log(
      "[WARN] Dummy regulation data seeding failed due to no user instances found.",
    );
  }
}

if (process.env.NODE_ENV === "development") {
  addDummyData().catch(console.error);
  addDummyRegData().catch(console.error);
}

export { eq } from "drizzle-orm";
export { createSelectSchema } from "drizzle-zod";

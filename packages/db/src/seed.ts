import { seed } from "drizzle-seed";
import { db } from ".";
import { asset } from "./schema/asset";
import { user } from "./schema/auth";

async function main() {
  await addDummyData();
  // await addDummyRegData();
}

async function addDummyData() {
  const [userInstance] = await db.select().from(user).limit(1);
  if (!userInstance) {
    console.error(
      "Table 'asset' seed function failed due to no user instances found.",
    );
    return;
  }

  await seed(db, { asset }).refine((funcs) => ({
    asset: {
      count: 100,
      columns: {
        valueRp: funcs.number({ minValue: 0 }),
        createdBy: funcs.valuesFromArray({ values: [userInstance.id] }),
        deletedAt: funcs.boolean(),
      },
    },
  }));
  console.log("✨ 'asset' table data successfully seeded!");
}

main();

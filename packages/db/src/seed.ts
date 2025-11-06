import { reset, seed } from "drizzle-seed";
import { asset } from "./schema/asset";
import { user } from "./schema/auth";
import { regulation } from "./schema/regulation";
import { file } from "./schema/file";
import { db } from ".";

async function main() {
  await addDummyData();
  await addDummyRegData();
}

async function addDummyData() {
  const [userInstance] = await db.select().from(user).limit(1);
  if (!userInstance) {
    console.error(
      "Table 'asset' seed function failed due to no user instances found.",
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
  console.log("✨ 'asset' table data successfully seeded!");
}

async function addDummyRegData() {
  const [regInstance] = await db.select().from(regulation).limit(1);
  if (!regInstance) {
    const [userInstance] = await db.select().from(user);
    const [fileInstances] = await db.select().from(file);

    if (!userInstance) {
      console.error(
        "Table 'regulation' data seed function failed due to no user instances found.",
      );
      return;
    }

    await reset(db, { regulation });
    await seed(db, { regulation }).refine((funcs) => ({
      regulation: {
        count: 100,
        columns: {
          effectiveBy: funcs.date(),
          createdBy: funcs.valuesFromArray({ values: [userInstance.id] }),
          file: funcs.valuesFromArray({ values: [fileInstances?.id] }),
        },
      },
    }));
    console.log("✨ 'regulation' table data successfully seeded!");
  }
}

main();

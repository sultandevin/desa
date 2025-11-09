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

  await seed(db, { asset })
    .refine((funcs) => ({
      asset: {
        count: 100,
        columns: {
          id: funcs.uuid(),
          valueRp: funcs.number({ minValue: 1_000_000 }),
          brandType: funcs.companyName(),
          createdBy: funcs.valuesFromArray({ values: [userInstance.id] }),
          // leave null for these values below:
          proofOfOwnership: funcs.default({ defaultValue: undefined }),
          status: funcs.default({ defaultValue: undefined }),
          deletedAt: funcs.default({ defaultValue: undefined }),
        },
      },
    }))
    .then(() => {
      console.log("✨ 'asset' table data successfully seeded!");
    });
}

main();

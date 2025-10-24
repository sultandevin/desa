import { createSelectSchema, db, eq } from "@desa/db";
import { asset } from "@desa/db/schema/asset";
import { ORPCError } from "@orpc/client";
import * as z from "zod";
import { publicProcedure } from "..";

const assetSchema = createSelectSchema(asset, {
  id: z.string(),
});

export const assetRouter = {
  list: publicProcedure
    .route({
      method: "GET",
      path: "/assets",
      summary: "List All Assets",
      tags: ["Assets"],
    })
    .output(z.array(assetSchema))
    .handler(async () => {
      const assets = await db.select().from(asset);

      return assets;
    }),
  find: publicProcedure
    .route({
      method: "GET",
      path: "/assets/{id}",
      summary: "Find asset by ID",
      tags: ["Assets"],
    })
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .output(assetSchema)
    .handler(async ({ input }) => {
      const id = input.id;

      const assetItem = await db
        .select()
        .from(asset)
        .where(eq(asset.id, id))
        .limit(1);
      if (assetItem.length === 0) {
        throw new ORPCError("ASSET_NOT_FOUND", {
          message: `Asset with ID ${id} not found`,
        });
      }

      return assetItem[0]!;
    }),
};

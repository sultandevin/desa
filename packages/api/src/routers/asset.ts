import { createSelectSchema, db, eq } from "@desa/db";
import { asset } from "@desa/db/schema/asset";
import { ORPCError } from "@orpc/client";
import * as z from "zod";
import { protectedProcedure, publicProcedure } from "..";

const assetSchema = createSelectSchema(asset, {
  id: z.string(),
});

const list = publicProcedure
  .route({
    method: "GET",
    path: "/assets",
    summary: "List All Assets",
    tags: ["Assets"],
  })
  .input(
    z.object({
      limit: z.number().int().min(1).max(100).optional().default(10),
      offset: z.number().int().min(0).optional().default(0),
    }),
  )
  .output(z.array(assetSchema))
  .handler(async ({ input }) => {
    const assets = await db
      .select()
      .from(asset)
      .limit(input.limit)
      .offset(input.offset);

    return assets;
  });

const find = publicProcedure
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

    const [assetItem] = await db
      .select()
      .from(asset)
      .where(eq(asset.id, id))
      .limit(1);

    if (!assetItem) {
      throw new ORPCError("NOT_FOUND", {
        message: `Asset with ID ${id} not found`,
      });
    }

    return assetItem;
  });

const create = protectedProcedure
  .route({
    method: "POST",
    path: "/assets",
    summary: "Create a new asset",
    tags: ["Assets"],
  })
  .input(
    z.object({
      name: z.string(),
      code: z.string().optional(),
      nup: z.string().optional(),
      valueRp: z.number().min(0).optional(),
      condition: z.string().optional(),
      note: z.string().optional(),
      acquiredAt: z.date().optional(),
    }),
  )
  .output(assetSchema)
  .handler(async ({ input, context }) => {
    const [newAsset] = await db
      .insert(asset)
      .values({
        ...input,
        valueRp: input.valueRp?.toString(),
        createdBy: context.session.user.id,
      })
      .returning();

    if (!newAsset) {
      throw new ORPCError("INTERNAL_ERROR", {
        message: "Failed to create asset",
      });
    }

    return newAsset;
  });

export const assetRouter = {
  list,
  find,
  create,
};

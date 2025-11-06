import { createSelectSchema, db, eq } from "@desa/db";
import { asset } from "@desa/db/schema/asset";
import * as z from "zod";
import { protectedProcedure, publicProcedure } from "..";
import { damageReportSelectSchema } from "./damage-report";
import { damageReport } from "@desa/db/schema/damage-report";

export const assetSelectSchema = createSelectSchema(asset, {
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
  .output(z.array(assetSelectSchema))
  .handler(async ({ input, errors }) => {
    const assets = await db
      .select()
      .from(asset)
      .limit(input.limit)
      .offset(input.offset);

    if (!assets) {
      throw errors.NOT_FOUND();
    }

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
  .output(assetSelectSchema)
  .handler(async ({ input, errors }) => {
    const id = input.id;

    const [assetItem] = await db
      .select()
      .from(asset)
      .where(eq(asset.id, id))
      .limit(1);

    if (!assetItem) {
      throw errors.NOT_FOUND();
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
  .output(assetSelectSchema)
  .handler(async ({ input, errors, context }) => {
    const [newAsset] = await db
      .insert(asset)
      .values({
        ...input,
        valueRp: input.valueRp?.toString(),
        createdBy: context.session.user.id,
      })
      .returning();

    if (!newAsset) {
      throw errors.NOT_FOUND();
    }

    return newAsset;
  });

const remove = protectedProcedure
  .route({
    method: "DELETE",
    path: "/assets/{id}",
    summary: "Delete an asset by ID",
    tags: ["Assets"],
  })
  .input(
    z.object({
      id: z.string(),
    }),
  )
  .output(
    z.object({
      message: z.string(),
    }),
  )
  .handler(async ({ input, errors }) => {
    const [deletedAsset] = await db
      .delete(asset)
      .where(eq(asset.id, input.id))
      .returning();

    if (!deletedAsset) {
      throw errors.NOT_FOUND();
    }

    return {
      message: "Successfully deleted asset with ID " + deletedAsset.id,
    };
  });

const listDamageReports = publicProcedure
  .route({
    method: "GET",
    path: "/assets/{id}/damage-reports",
    summary: "List Damage Reports related to an Asset",
    tags: ["Assets", "Damage Reports"],
  })
  .input(
    z.object({
      id: z.string(),
    }),
  )
  .output(damageReportSelectSchema)
  .handler(async ({ input, errors }) => {
    const [report] = await db
      .select()
      .from(damageReport)
      .where(eq(damageReport.assetId, input.id))
      .limit(1);

    if (!report) throw errors.NOT_FOUND;

    return report;
  });

export const assetRouter = {
  list,
  find,
  create,
  remove,
  listDamageReports,
};

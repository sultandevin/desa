import { db } from "@desa/db";
import { isForeignKeyError } from "@desa/db/lib/errors";
import {
  asset,
  assetInsertSchema,
  assetSelectSchema,
} from "@desa/db/schema/asset";
import {
  damageReport,
  damageReportSelectSchema,
} from "@desa/db/schema/damage-report";
import { ORPCError } from "@orpc/client";
import { and, desc, eq, ilike, isNull, lt, or } from "drizzle-orm";
import * as z from "zod";
import { protectedProcedure, publicProcedure } from "..";
import { cursorOutputSchema, cursorPaginationSchema } from "../schemas";

const healthcheck = publicProcedure.handler(() => {
  return "OK";
});

const list = publicProcedure
  .route({
    method: "GET",
    path: "/assets",
    summary: "List All Assets",
    tags: ["Assets"],
  })
  .input(
    cursorPaginationSchema.extend({
      query: z.string().optional().default(""),
    }),
  )
  .output(
    cursorOutputSchema.extend({
      data: z.array(assetSelectSchema),
    }),
  )
  .handler(async ({ input, errors }) => {
    const assets = await db
      .select()
      .from(asset)
      .where(
        and(
          isNull(asset.deletedAt),
          and(
            input.query.length > 0
              ? or(
                  ilike(asset.name, `%${input.query}%`),
                  or(
                    ilike(asset.code, `%${input.query}%`),
                    or(
                      ilike(asset.nup, `%${input.query}%`),
                      ilike(asset.brandType, `%${input.query}%`),
                    ),
                  ),
                )
              : undefined,
            input.cursor ? lt(asset.updatedAt, input.cursor) : undefined,
          ),
        ),
      )
      .limit(input.pageSize)
      .orderBy(desc(asset.updatedAt));

    if (!assets) {
      throw errors.NOT_FOUND();
    }

    return {
      data: assets,
      nextCursor:
        assets.length === input.pageSize
          ? (assets.at(-1)?.updatedAt ?? null)
          : null,
    };
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
      includeDamageReports: z.boolean().optional().default(false),
    }),
  )
  .output(
    assetSelectSchema.extend({
      damageReports: z.array(damageReportSelectSchema).optional(),
    }),
  )
  .handler(async ({ input, errors }) => {
    const id = input.id;

    const [assetItem] = await db
      .select()
      .from(asset)
      .where(and(eq(asset.id, id), isNull(asset.deletedAt)))
      .limit(1);

    if (!assetItem) {
      throw errors.NOT_FOUND();
    }

    if (input.includeDamageReports) {
      const reports = await db
        .select()
        .from(damageReport)
        .where(eq(damageReport.assetId, id));

      return {
        ...assetItem,
        damageReports: reports,
      };
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
    assetInsertSchema.extend({
      name: z.string().min(3, "Nama aset minimal 3 karakter"),
      code: z.string().min(3, "Kode aset minimal 3 karakter").optional(),
      nup: z.string().min(3, "Kode aset minimal 3 karakter").optional(),
      valueRp: z
        .number()
        .min(0, "Nilai aset harus lebih dari atau sama dengan 0")
        .optional(),
    }),
  )
  .output(assetSelectSchema)
  .handler(async ({ input, context }) => {
    try {
      const [newAsset] = await db
        .insert(asset)
        .values({
          ...input,
          valueRp: input.valueRp ? String(input.valueRp) : null,
          createdBy: context.session.user.id,
        })
        .returning();

      if (!newAsset) {
        throw new ORPCError("BAD_REQUEST");
      }

      return newAsset;
    } catch (err) {
      if (isForeignKeyError(err)) throw new ORPCError("UNAUTHORIZED");
      console.error("Asset creation error:", err);
      throw new ORPCError("INTERNAL_SERVER_ERROR");
    }
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
      .update(asset)
      .set({ deletedAt: new Date() })
      .where(and(eq(asset.id, input.id), isNull(asset.deletedAt)))
      .returning();

    if (!deletedAsset) {
      throw errors.NOT_FOUND();
    }

    return {
      message: `Successfully deleted asset with ID ${deletedAsset.id}`,
    };
  });

export const assetRouter = {
  healthcheck,
  list,
  find,
  create,
  remove,
};

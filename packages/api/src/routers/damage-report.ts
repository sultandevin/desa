import { db } from "@desa/db";
import { isForeignKeyError } from "@desa/db/lib/errors";
import { asset } from "@desa/db/schema/asset";
import { user } from "@desa/db/schema/auth";
import {
  damageReport,
  damageReportInsertSchema,
  damageReportSelectSchema,
} from "@desa/db/schema/damage-report";
import { ORPCError } from "@orpc/client";
import { eq, getTableColumns } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import * as z from "zod";
import { kadesProcedure, protectedProcedure, publicProcedure } from "..";
import { paginationSchema } from "../schemas";

const list = publicProcedure
  .route({
    method: "GET",
    path: "/damage-reports",
    summary: "List All Damage Reports",
    tags: ["Damage Reports"],
  })
  .input(paginationSchema)
  .output(
    z.array(
      damageReportSelectSchema.extend({
        assetName: z.string().nullable(),
        reportedByUser: z
          .object({
            id: z.string(),
            name: z.string(),
          })
          .nullable(),
        verifiedByUser: z
          .object({
            id: z.string(),
            name: z.string(),
          })
          .nullable(),
      }),
    ),
  )
  .handler(async ({ input, errors }) => {
    const reportedByUser = alias(user, "reportedByUser");
    const verifiedByUser = alias(user, "verifiedByUser");

    const reports = await db
      .select({
        ...getTableColumns(damageReport),
        assetName: asset.name,
        reportedByUser: {
          id: reportedByUser.id,
          name: reportedByUser.name,
        },
        verifiedByUser: {
          id: verifiedByUser.id,
          name: verifiedByUser.name,
        },
      })
      .from(damageReport)
      .leftJoin(asset, eq(damageReport.assetId, asset.id))
      .leftJoin(reportedByUser, eq(damageReport.reportedBy, reportedByUser.id))
      .leftJoin(verifiedByUser, eq(damageReport.verifiedBy, verifiedByUser.id))
      .limit(input.limit)
      .offset(input.offset);

    if (!reports) throw errors.NOT_FOUND();

    return reports;
  });

const find = publicProcedure
  .route({
    method: "GET",
    path: "/damage-reports/{id}",
    summary: "Find Damage Report by ID",
    tags: ["Damage Reports"],
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
      .where(eq(damageReport.id, input.id))
      .limit(1);
    if (!report) throw errors.NOT_FOUND();
    return report;
  });

const create = protectedProcedure
  .route({
    method: "POST",
    path: "/damage-reports",
    summary: "Create a new Damage Report",
    tags: ["Damage Reports"],
  })
  .input(damageReportInsertSchema)
  .output(damageReportSelectSchema)
  .handler(async ({ input, context }) => {
    try {
      const [newReport] = await db
        .insert(damageReport)
        .values({
          ...input,
          reportedBy: context.session.user.id,
        })
        .returning();

      if (!newReport) {
        console.error("Failed to create Damage Report: No report returned");
        throw new ORPCError("BAD_REQUEST");
      }

      return newReport;
    } catch (err) {
      if (isForeignKeyError(err)) {
        console.error(
          "Failed to create Damage Report due to foreign key constraint:",
          err,
        );
        throw new ORPCError("BAD_REQUEST", {
          message: "Invalid foreign key reference",
        });
      }
      console.error(
        "Failed to create Damage Report due to unexpected error:",
        err,
      );
      throw new ORPCError("INTERNAL_SERVER_ERROR");
    }
  });

const verify = kadesProcedure
  .route({
    method: "POST",
    path: "/damage-reports/{id}/verify",
    summary: "Verify a Damage Report",
    tags: ["Damage Reports"],
  })
  .input(
    z.object({
      id: z.string(),
    }),
  )
  .handler(async ({ input, context, errors }) => {
    const [report] = await db
      .update(damageReport)
      .set({
        verifiedBy: context.session.user.id,
        verifiedAt: new Date(),
      })
      .where(eq(damageReport.id, input.id))
      .returning();

    if (!report) throw errors.NOT_FOUND();

    await db
      .update(asset)
      .set({
        status: report.status,
      })
      .where(eq(asset.id, report.assetId))
      .returning();

    return report;
  });

export const damageReportRouter = {
  list,
  find,
  create,
  verify,
};

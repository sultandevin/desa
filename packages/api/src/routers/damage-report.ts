import { db, eq } from "@desa/db";
import { isForeignKeyError } from "@desa/db/lib/errors";
import {
  damageReport,
  damageReportInsertSchema,
  damageReportSelectSchema,
} from "@desa/db/schema/damage-report";
import { ORPCError } from "@orpc/client";
import * as z from "zod";
import { protectedProcedure, publicProcedure } from "..";
import { paginationSchema } from "../schemas";

const list = publicProcedure
  .route({
    method: "GET",
    path: "/damage-reports",
    summary: "List All Damage Reports",
    tags: ["Damage Reports"],
  })
  .input(paginationSchema)
  .output(z.array(damageReportSelectSchema))
  .handler(async ({ input, errors }) => {
    const reports = await db
      .select()
      .from(damageReport)
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

export const damageReportRouter = {
  list,
  find,
  create,
};

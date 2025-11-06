import { createSelectSchema, db, eq } from "@desa/db";
import { damageReport } from "@desa/db/schema/damage-report";
import * as z from "zod";
import { protectedProcedure, publicProcedure } from "..";

export const damageReportSelectSchema = createSelectSchema(damageReport, {
  id: z.string(),
  assetId: z.string(),
});

const list = publicProcedure
  .route({
    method: "GET",
    path: "/damage-reports",
    summary: "List All Damage Reports",
    tags: ["Damage Reports"],
  })
  .input(
    z.object({
      limit: z.number().int().min(1).max(100).optional().default(10),
      offset: z.number().int().min(0).optional().default(0),
    }),
  )
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

// const create = protectedProcedure.route({
//   method: "POST",
//   path: "/damage-reports",
//   summary: "Create a new Damage Report for an Asset",
//   tags: ["Damage Reports", "Assets"]
// }).input().output

export const damageReportRouter = {
  list,
  find,
};

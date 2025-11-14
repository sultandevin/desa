import { db } from "@desa/db";
import { file } from "@desa/db/schema/file";
import {
  decision,
  decisionInsertSchema,
  decisionSelectSchema,
} from "@desa/db/schema/decision";
import { eq, like, or } from "drizzle-orm";
import * as z from "zod";
import { protectedProcedure, publicProcedure } from "..";
import { paginationSchema } from "../schemas";

const healthcheck = publicProcedure.handler(() => {
  return "OK";
});

const list = publicProcedure
  .route({
    method: "GET",
    path: "/decisions",
    summary: "List ALL Decisions",
    tags: ["Decisions"],
  })
  .input(paginationSchema)
  .output(z.array(decisionSelectSchema))
  .handler(async ({ input, errors }) => {
    const decisions = await db
      .select()
      .from(decision)
      .limit(input.limit)
      .offset(input.offset);

    if (!decisions) {
      throw errors.NOT_FOUND();
    }

    return decisions;
  });

const find = publicProcedure
  .route({
    method: "GET",
    path: "/decisions/{id}",
    summary: "Find decision by ID",
    tags: ["Decisions"],
  })
  .input(
    z.object({
      id: z.string(),
    }),
  )
  .output(decisionSelectSchema)
  .handler(async ({ input, errors }) => {
    const id = input.id;
    const [decisionItem] = await db
      .select()
      .from(decision)
      .where(eq(decision.id, id))
      .limit(1);

    if (!decisionItem) {
      throw errors.NOT_FOUND();
    }
    return decisionItem;
  });

const search = publicProcedure
  .route({
    method: "POST",
    path: "/decisionsearch",
    summary: "Search decisions",
    tags: ["Decisions"],
  })
  .input(
    z.object({
      query: z.string(),
    }),
  )
  .output(z.array(decisionSelectSchema))
  .handler(async ({ input, errors }) => {
    const query = input.query;
    const decisions = await db
      .select()
      .from(decision)
      .where(
        or(
          like(decision.number, `%${query}%`),
          like(decision.regarding, `%${query}%`),
          like(decision.shortDescription, `%${query}%`),
          like(decision.reportNumber, `%${query}%`),
          like(decision.notes, `%${query}%`),
          like(String(decision.date), `%${query}%`),
          like(String(decision.reportDate), `%${query}%`),
        ),
      );

    if (!decisions) {
      throw errors.NOT_FOUND();
    }
    return decisions;
  });

const create = protectedProcedure
  .route({
    method: "POST",
    path: "/decisions",
    summary: "Create a new decision",
    tags: ["Decisions"],
  })
  .input(
    decisionInsertSchema.omit({ id: true, createdBy: true, createdAt: true }),
  )
  .output(decisionSelectSchema)
  .handler(async ({ input, errors, context }) => {
    if (input.file) {
      const [fileExists] = await db
        .select()
        .from(file)
        .where(eq(file.id, input.file))
        .limit(1);

      if (!fileExists) throw errors.NOT_FOUND({ message: "File not found" });
    }

    const [newDecision] = await db
      .insert(decision)
      .values({
        ...input,
        createdBy: context.session.user.id,
      })
      .returning();

    if (!newDecision) {
      throw errors.NOT_FOUND();
    }
    return newDecision;
  });

const update = protectedProcedure
  .route({
    method: "PUT",
    path: "/decisions/{id}",
    summary: "Update decision by ID",
    tags: ["Decisions"],
  })
  .input(
    z
      .object({ id: z.string() })
      .merge(
        decisionInsertSchema
          .omit({ createdBy: true, createdAt: true })
          .partial(),
      ),
  )
  .output(decisionSelectSchema)
  .handler(async ({ input, errors }) => {
    if (input.file) {
      const [fileExists] = await db
        .select()
        .from(file)
        .where(eq(file.id, input.file))
        .limit(1);

      if (!fileExists) throw errors.NOT_FOUND({ message: "File not found" });
    }

    const { id, ...rest } = input as { id: string } & Record<string, any>;

    const [updatedDecision] = await db
      .update(decision)
      .set({
        ...rest,
      })
      .where(eq(decision.id, id))
      .returning();

    if (!updatedDecision) {
      throw errors.NOT_FOUND();
    }
    return updatedDecision;
  });

const remove = protectedProcedure
  .route({
    method: "DELETE",
    path: "/decisions/{id}",
    summary: "Delete decision by ID",
    tags: ["Decisions"],
  })
  .input(z.object({ id: z.string() }))
  .output(z.object({ message: z.string() }))
  .handler(async ({ input, errors }) => {
    const [deletedDecision] = await db
      .delete(decision)
      .where(eq(decision.id, input.id))
      .returning();

    if (!deletedDecision) {
      throw errors.NOT_FOUND();
    }
    return {
      message: `Successfully deleted decision with ID ${deletedDecision.id}`,
    };
  });

export const decisionRouter = {
  healthcheck,
  list,
  find,
  search,
  create,
  update,
  remove,
};

import { db } from "@desa/db";
import { file } from "@desa/db/schema/file";
import {
  regulation,
  regulationInsertSchema,
  regulationSelectSchema,
} from "@desa/db/schema/regulation";
import { eq, getTableColumns, like, or, sql } from "drizzle-orm";
import * as z from "zod";
import { protectedProcedure, publicProcedure } from "..";
import { paginationSchema } from "../schemas";

const list = publicProcedure
  .route({
    method: "GET",
    path: "/regulations",
    summary: "List ALL Regulations",
    tags: ["Regulations"],
  })
  .input(paginationSchema)
  // .output(z.array(regulationSelectSchema))
  .handler(async ({ input, errors }) => {
    const regulations = await db
      .select()
      .from(regulation)
      .limit(input.limit)
      .offset(input.offset);

    if (!regulations) {
      throw errors.NOT_FOUND();
    }

    return regulations;
  });

const find = publicProcedure
  .route({
    method: "GET",
    path: "/regulations/{id}",
    summary: "Find regulation by ID",
    tags: ["Regulations"],
  })
  .input(
    z.object({
      id: z.string(),
    }),
  )
  .output(
    regulationSelectSchema.extend({
      fileUrl: z.string().nullable().optional(),
    }),
  )
  .handler(async ({ input, errors }) => {
    const id = input.id;
    const [item] = await db
      .select({
        ...getTableColumns(regulation),
        fileUrl: file.path,
      })
      .from(regulation)
      .leftJoin(file, eq(regulation.file, file.id))
      .where(eq(regulation.id, id))
      .limit(1);

    if (!item) {
      throw errors.NOT_FOUND();
    }

    return item;
  });

const search = publicProcedure
  .route({
    method: "POST",
    path: "/regulationsearch",
    summary: "Search regulations",
    tags: ["Regulations"],
  })
  .input(
    z.object({
      query: z.string(),
    }),
  )
  .output(z.array(regulationSelectSchema))
  .handler(async ({ input, errors }) => {
    const query = input.query;
    const regulations = await db
      .select()
      .from(regulation)
      .where(
        or(
          like(regulation.title, `%${query}%`),
          like(regulation.number, `%${query}%`),
          like(regulation.level, `%${query}%`),
          like(regulation.description, `%${query}%`),
          like(sql`${regulation.effectiveBy}::text`, `%${query}%`),
        ),
      );

    if (!regulations) {
      throw errors.NOT_FOUND();
    }
    return regulations;
  });

const create = protectedProcedure
  .route({
    method: "POST",
    path: "/regulations",
    summary: "Create a new regulation",
    tags: ["Regulations"],
  })
  .input(
    regulationInsertSchema.omit({ id: true, createdBy: true, createdAt: true }),
  )
  .output(regulationSelectSchema)
  .handler(async ({ input, errors, context }) => {
    if (input.file) {
      const [fileExists] = await db
        .select()
        .from(file)
        .where(eq(file.id, input.file))
        .limit(1);

      if (!fileExists) throw errors.NOT_FOUND({ message: "File not found" });
    }
    const [newRegulation] = await db
      .insert(regulation)
      .values({
        ...input,
        createdBy: context.session.user.id,
      })
      .returning();
    if (!newRegulation) {
      throw errors.NOT_FOUND();
    }
    return newRegulation;
  });

const update = publicProcedure // hapus line ini kalo auth udah siap
  //const update = protectedProcedure
  .route({
    method: "PUT",
    path: "/regulations/{id}",
    summary: "Update regulation by ID",
    tags: ["Regulations"],
  })
  .input(
    regulationInsertSchema
      .omit({ createdBy: true, createdAt: true })
      .partial()
      .required({ id: true }),
  )
  .output(regulationSelectSchema)
  .handler(async ({ input, errors }) => {
    if (input.file) {
      const [fileExists] = await db
        .select()
        .from(file)
        .where(eq(file.id, input.file))
        .limit(1);

      if (!fileExists) throw errors.NOT_FOUND({ message: "File not found" });
    }

    const { id, file: fileId, ...updateData } = input;

    const [updatedRegulation] = await db
      .update(regulation)
      .set({
        ...updateData,
        file: fileId,
      })
      .where(eq(regulation.id, id))
      .returning();

    if (!updatedRegulation) {
      throw errors.NOT_FOUND();
    }
    return updatedRegulation;
  });
const remove = publicProcedure // hapus line ini kalo auth udah siap
  //const remove = protectedProcedure
  .route({
    method: "DELETE",
    path: "/regulations/{id}",
    summary: "Delete regulation by ID",
    tags: ["Regulations"],
  })
  .input(z.object({ id: z.string() }))
  .output(z.object({ message: z.string() }))
  .handler(async ({ input, errors }) => {
    const [deletedRegulation] = await db
      .delete(regulation)
      .where(eq(regulation.id, input.id))
      .returning();

    if (!deletedRegulation) {
      throw errors.NOT_FOUND();
    }
    return {
      message: `Successfully deleted regulation with ID ${deletedRegulation.id}`,
    };
  });

export const regulationRouter = {
  list,
  find,
  search,
  create,
  update,
  remove,
};

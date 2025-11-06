import { createSelectSchema, db, eq } from "@desa/db";
import { regulation } from "@desa/db/schema/regulation";
import { file } from "@desa/db/schema/file";
import * as z from "zod";
import { publicProcedure } from "..";

const regulationSchema = createSelectSchema(regulation, {
  id: z.string(),
});

const fileSchema = createSelectSchema(file, {
  id: z.string(),
});

const list = publicProcedure
  .route({
    method: "GET",
    path: "/regulations",
    summary: "List ALL Regulations",
    tags: ["Regulations"],
  })
  .input(
    z.object({
      limit: z.number().int().min(1).max(100).optional().default(10),
      offset: z.number().int().min(0).optional().default(0),
    }),
  )
  .output(z.array(regulationSchema))
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
  .output(regulationSchema)
  .handler(async ({ input, errors }) => {
    const id = input.id;
    const [regulationItem] = await db
      .select()
      .from(regulation)
      .where(eq(regulation.id, id))
      .limit(1);

    if (!regulationItem) {
      throw errors.NOT_FOUND();
    }
    return regulationItem;
  });

const create = publicProcedure // hapus line ini kalo auth udah siap
  //const create = protectedProcedure
  .route({
    method: "POST",
    path: "/regulations",
    summary: "Create a new regulation",
    tags: ["Regulations"],
  })
  .input(
    z.object({
      title: z.string(),
      number: z.string(),
      level: z.string(),
      description: z.string().optional(),
      file: z.string().optional(),
      effectiveBy: z.string().optional(),
    }),
  )
  .output(regulationSchema)
  .handler(async ({ input, errors }) => {
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
        id: crypto.randomUUID(),
        //createdBy: context.session.user.id,
        createdBy: crypto.randomUUID(), // hapus line ini kalo auth udah siap
        createdAt: new Date(),
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
    z.object({
      id: z.string(),
      title: z.string().optional(),
      number: z.string().optional(),
      level: z.string().optional(),
      description: z.string().optional(),
      file: z.string().optional(),
      effectiveBy: z.string().optional(),
    }),
  )
  .output(regulationSchema)
  .handler(async ({ input, errors }) => {
    if (input.file) {
      const [fileExists] = await db
        .select()
        .from(file)
        .where(eq(file.id, input.file))
        .limit(1);

      if (!fileExists) throw errors.NOT_FOUND({ message: "File not found" });
    }
    const [updatedRegulation] = await db
      .update(regulation)
      .set({
        title: input.title,
        number: input.number,
        level: input.level,
        description: input.description,
        file: input.file,
        effectiveBy: input.effectiveBy,
      })
      .where(eq(regulation.id, input.id))
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

const upload = publicProcedure // hapus line ini kalo auth udah siap
  //const upload = protectedProcedure
  .route({
    method: "POST",
    path: "/files/upload",
    summary: "Upload file regulation",
    tags: ["File"],
  })
  .input(
    z.object({
      name: z.string(),
      path: z.string(),
    }),
  )
  .output(fileSchema)
  .handler(async ({ input, errors }) => {
    const [uploadedFile] = await db
      .insert(file)
      .values({
        ...input,
        id: crypto.randomUUID(),
        //uploaded_by: context.session.user.id,
        uploaded_by: crypto.randomUUID(), // hapus line ini kalo auth udah siap
        uploaded_at: new Date(),
      })
      .returning();

    if (!uploadedFile) {
      throw errors.NOT_FOUND();
    }

    return uploadedFile;
  });

export const regulationRouter = {
  list,
  find,
  create,
  update,
  remove,
};

export const fileRouter = {
  upload,
};

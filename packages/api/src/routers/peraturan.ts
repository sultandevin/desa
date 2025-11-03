import { createSelectSchema, db, eq } from "@desa/db";
import { peraturan, file } from "@desa/db/schema/peraturan";
import * as z from "zod";
import { publicProcedure } from "..";

const peraturanSchema = createSelectSchema(peraturan, {
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
  .output(z.array(peraturanSchema))
  .handler(async ({ input, errors }) => {
    const regulations = await db
      .select()
      .from(peraturan)
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
  .output(peraturanSchema)
  .handler(async ({ input, errors }) => {
    const id = input.id;
    const [regulationItem] = await db
      .select()
      .from(peraturan)
      .where(eq(peraturan.id, id))
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
      judul: z.string(),
      nomor_peraturan: z.string(),
      tingkat_peraturan: z.string(),
      deskripsi: z.string().optional(),
      file: z.string().optional(),
      berlaku_sejak: z.string().optional(),
    }),
  )
  .output(peraturanSchema)
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
      .insert(peraturan)
      .values({
        ...input,
        id: crypto.randomUUID(),
        //created_by: context.session.user.id,
        created_by: crypto.randomUUID(), // hapus line ini kalo auth udah siap
        created_at: new Date(),
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
      judul: z.string().optional(),
      nomor_peraturan: z.string().optional(),
      tingkat_peraturan: z.string().optional(),
      deskripsi: z.string().optional(),
      file: z.string().optional(),
      berlaku_sejak: z.string().optional(),
    }),
  )
  .output(peraturanSchema)
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
      .update(peraturan)
      .set({
        judul: input.judul,
        nomor_peraturan: input.nomor_peraturan,
        tingkat_peraturan: input.tingkat_peraturan,
        deskripsi: input.deskripsi,
        file: input.file,
        berlaku_sejak: input.berlaku_sejak,
      })
      .where(eq(peraturan.id, input.id))
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
      .delete(peraturan)
      .where(eq(peraturan.id, input.id))
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
    summary: "Upload file peraturan",
    tags: ["File"],
  })
  .input(
    z.object({
      nama_file: z.string(),
      file_path: z.string(),
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

export const peraturanRouter = {
  list,
  find,
  create,
  update,
  remove,
};

export const fileRouter = {
  upload,
};

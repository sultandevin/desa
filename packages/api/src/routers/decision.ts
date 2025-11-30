import { db } from "@desa/db";
import { isForeignKeyError } from "@desa/db/lib/errors";
import {
  decision,
  decisionInsertSchema,
  decisionSelectSchema,
} from "@desa/db/schema/decision";
import { file } from "@desa/db/schema/file";
import { ORPCError } from "@orpc/client";
import { and, eq, getTableColumns, ilike, or, sql } from "drizzle-orm";
import * as z from "zod";
import { protectedProcedure, publicProcedure } from "..";
import { paginationSchema } from "../schemas";

const list = publicProcedure
  .route({
    method: "GET",
    path: "/decisions",
    summary: "List ALL Decisions",
    tags: ["Decisions"],
  })
  .input(
    paginationSchema.extend({
      query: z.string().optional().default(""),
      year: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : undefined))
        .refine((val) => !val || (val >= 1999 && val <= 2100), {
          message: "Year must be between 1999 and 2100",
        }),
      category: z.enum(["anggaran", "personal", "infrastruktur"]).optional(),
    }),
  )
  .output(
    z.array(
      decisionSelectSchema.extend({
        fileUrl: z.string().nullable().optional(),
      }),
    ),
  )
  .handler(async ({ input }) => {
    try {
      const sanitizeSearchTerm = (term: string) => {
        return term.replace(/[%_'"]/g, '').trim();
      };
      const searchTerm = input.query?.trim() ? `%${sanitizeSearchTerm(input.query)}%` : null;

      const categoryCondition = input.category
        ? (() => {
          const categoryKeywords = {
            // Contoh kategori dan kata kunci terkait
            anggaran: [
              "anggaran",
              "dana",
              "budget",
              "keuangan",
              "biaya",
              "apbd",
              "rka",
            ],
            personal: [
              "pegawai",
              "staff",
              "personnel",
              "karyawan",
              "sdm",
              "cpns",
            ],
            infrastruktur: [
              "jalan",
              "bangunan",
              "infrastructure",
              "fasilitas",
              "gedung",
              "jembatan",
            ],
          };

          const keywords =
            categoryKeywords[
            input.category as keyof typeof categoryKeywords
            ] || [];

          const conditions = keywords.map((keyword) =>
            or(
              ilike(decision.number, `%${keyword}%`),
              ilike(decision.regarding, `%${keyword}%`),
              ilike(decision.shortDescription, `%${keyword}%`),
              ilike(decision.reportNumber, `%${keyword}%`),
              ilike(decision.notes, `%${keyword}%`),
            ),
          );

          return conditions.length > 0 ? or(...conditions) : undefined;
        })()
        : undefined;

      const decisions = await db
        .select({
          ...getTableColumns(decision),
          fileUrl: file.path,
        })
        .from(decision)
        .leftJoin(file, eq(decision.file, file.id))
        .where(
          and(
            searchTerm
              ? or(
                ilike(decision.number, searchTerm),
                ilike(decision.regarding, searchTerm),
                ilike(decision.shortDescription, searchTerm),
                ilike(decision.reportNumber, searchTerm),
              )
              : undefined,
            input.year
              ? sql`EXTRACT(YEAR FROM ${decision.date}) = ${input.year}`
              : undefined,
            categoryCondition,
          ),
        )
        .orderBy(sql`${decision.createdAt} DESC`)
        .limit(input.limit)
        .offset(input.offset);

      return decisions;
    } catch (err) {
      console.error("List decisions error:", err);
      throw new ORPCError("INTERNAL_SERVER_ERROR");
    }
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
  .output(
    decisionSelectSchema.extend({
      fileUrl: z.string().nullable().optional(),
    }),
  )
  .handler(async ({ input }) => {
    const id = input.id;
    const [decisionItem] = await db
      .select({
        ...getTableColumns(decision),
        fileUrl: file.path,
      })
      .from(decision)
      .leftJoin(file, eq(decision.file, file.id))
      .where(eq(decision.id, id))
      .limit(1);

    if (!decisionItem) {
      throw new ORPCError("NOT_FOUND");
    }
    return decisionItem;
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
  .handler(async ({ input, context }) => {
    try {
      if (input.file) {
        const [fileExists] = await db
          .select()
          .from(file)
          .where(eq(file.id, input.file))
          .limit(1);

        if (!fileExists) {
          throw new ORPCError("BAD_REQUEST", {
            message: "File not found",
          });
        }
      }

      const inputData = {
        ...input,
        createdBy: context.session.user.id,
      };

      const [newDecision] = await db
        .insert(decision)
        .values(inputData)
        .returning();

      if (!newDecision) {
        throw new ORPCError("BAD_REQUEST");
      }

      return newDecision;
    } catch (err) {
      if (isForeignKeyError(err))
        throw new ORPCError("BAD_REQUEST", {
          message: "Invalid foreign key reference",
        });
      throw new ORPCError("INTERNAL_SERVER_ERROR");
    }
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
  .handler(async ({ input }) => {
    try {
      const { id, ...updateData } = input;

      if (!id) {
        throw new ORPCError("BAD_REQUEST", {
          message: "Decision ID is required",
        });
      }

      if (updateData.file) {
        const [fileExists] = await db
          .select()
          .from(file)
          .where(eq(file.id, updateData.file))
          .limit(1);

        if (!fileExists) {
          throw new ORPCError("BAD_REQUEST", {
            message: "File not found",
          });
        }
      }

      const finalUpdateData = {
        ...updateData,
        shortDescription: updateData.shortDescription?.trim() || null,
        notes: updateData.notes?.trim() || null,
      };

      const [updatedDecision] = await db
        .update(decision)
        .set(finalUpdateData)
        .where(eq(decision.id, id))
        .returning();

      if (!updatedDecision) {
        throw new ORPCError("NOT_FOUND");
      }

      return updatedDecision;
    } catch (err) {
      if (isForeignKeyError(err)) {
        throw new ORPCError("BAD_REQUEST", {
          message: "Invalid foreign key reference",
        });
      }
      throw new ORPCError("INTERNAL_SERVER_ERROR");
    }
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
  .handler(async ({ input }) => {
    try {
      const [deletedDecision] = await db
        .delete(decision)
        .where(eq(decision.id, input.id))
        .returning();

      if (!deletedDecision) {
        throw new ORPCError("NOT_FOUND");
      }

      return {
        message: `Successfully deleted decision with ID ${deletedDecision.id}`,
      };
    } catch (err) {
      if (isForeignKeyError(err)) {
        throw new ORPCError("BAD_REQUEST", {
          message: "Cannot delete decision due to foreign key constraints",
        });
      }
      console.error("Delete decision error:", err);
      throw new ORPCError("INTERNAL_SERVER_ERROR");
    }
  });

export const decisionRouter = {
  list,
  find,
  create,
  update,
  remove,
};

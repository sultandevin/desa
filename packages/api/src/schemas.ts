import * as z from "zod";

export const paginationSchema = z.object({
  limit: z.number().int().min(1).max(100).optional().default(10),
  offset: z.number().int().min(0).optional().default(0),
});

export const cursorPaginationSchema = z.object({
  cursor: z.date().optional(), // use updatedAt field
  pageSize: z.number().optional().default(10),
});

export const cursorOutputSchema = z.object({
  nextCursor: z.date().nullable(),
})

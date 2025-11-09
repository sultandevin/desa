import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import * as z from "zod";
import { user } from "./auth";
import { file } from "./file";

export const regulation = pgTable("regulation", {
  id: uuid().primaryKey().defaultRandom(),
  title: varchar().notNull(),
  number: varchar().notNull(),
  level: varchar().notNull(),
  description: text(),
  file: uuid().references(() => file.id),
  effectiveBy: timestamp("effective_by").defaultNow(),
  createdBy: text("created_by")
    .notNull()
    .references(() => user.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const regulationSelectSchema = createSelectSchema(regulation, {
  id: z.string(),
});

export const regulationInsertSchema = createInsertSchema(regulation);

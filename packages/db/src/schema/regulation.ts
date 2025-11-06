import { pgTable, varchar, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { file } from "./file";
import * as z from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const regulation = pgTable("regulation", {
  id: uuid().primaryKey().defaultRandom(),
  title: varchar().notNull(),
  number: varchar().notNull(),
  level: varchar().notNull(),
  description: text(),
  file: text().references(() => file.id),
  effectiveBy: timestamp("effective_by"),
  createdBy: text("created_by")
    .notNull()
    .references(() => user.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const regulationSelectSchema = createSelectSchema(regulation, {
  id: z.string(),
});

export const regulationInsertSchema = createInsertSchema(regulation);

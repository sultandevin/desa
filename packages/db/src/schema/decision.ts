import { pgTable, text, timestamp, date, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { user } from "./auth";
import { file } from "./file";

export const decision = pgTable("decision", {
  id: uuid().primaryKey().defaultRandom(),
  number: text().notNull(),
  date: date().notNull(),
  regarding: text().notNull(),
  shortDescription: text("short_description"),
  reportNumber: text("report_number").notNull(),
  reportDate: date("report_date").notNull(),
  notes: text("notes"),
  file: uuid("file").references(() => file.id),
  createdBy: text("created_by")
    .notNull()
    .references(() => user.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const decisionSelectSchema = createSelectSchema(decision);
export const decisionInsertSchema = createInsertSchema(decision);

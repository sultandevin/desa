import {
  pgTable,
  text,
  timestamp,
  date,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { file } from "./file";

export const keputusan = pgTable("keputusan", {
  id: text().primaryKey(),
  number: text().notNull(),
  date: date().notNull(),
  regarding: text().notNull(),
  shortDescription: text("short_description"),
  reportNumber: text("report_number").notNull(),
  reportDate: date("report_date").notNull(),
  notes: text("notes"),
  file: text("file").references(() => file.id),
  createdBy: text("created_by")
    .notNull()
    .references(() => user.id),
  createdAt: timestamp("created_at").defaultNow(),
});

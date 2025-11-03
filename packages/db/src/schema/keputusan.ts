import {
  pgTable,
  varchar,
  text,
  timestamp,
  date,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const file = pgTable("file", {
  id: text("id").primaryKey(),
  nama_file: varchar("nama_file").notNull(),
  file_path: varchar("file_path").notNull(),
  uploaded_by: text("uploaded_by")
    .notNull()
    .references(() => user.id),
  uploaded_at: timestamp("uploaded_at").defaultNow(),
});

export const keputusan = pgTable("keputusan", {
  id: text("id").primaryKey(),
  decision_number: varchar("decision_number").notNull(),
  decision_date: date("decision_date").notNull(),
  regarding: varchar("regarding").notNull(),
  short_description: text("short_description"),
  report_number: varchar("report_number").notNull(),
  report_date: date("report_date").notNull(),
  notes: text("notes"),
  file: text("file").references(() => file.id),
  created_by: text("created_by")
    .notNull()
    .references(() => user.id),
  created_at: timestamp("created_at").defaultNow(),
});
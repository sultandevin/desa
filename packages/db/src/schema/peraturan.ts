import {
  pgTable,
  varchar,
  text,
  timestamp,
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

export const peraturan = pgTable("peraturan", {
  id: text("id").primaryKey(),
  judul: varchar("judul").notNull(),
  nomor_peraturan: varchar("nomor_peraturan").notNull(),
  tingkat_peraturan: varchar("tingkat_peraturan").notNull(),
  deskripsi: text("deskripsi"),
  file: text("file").references(() => file.id),
  berlaku_sejak: text("berlaku_sejak"),
  created_by: text("created_by")
    .notNull()
    .references(() => user.id),
  created_at: timestamp("created_at").defaultNow(),
});
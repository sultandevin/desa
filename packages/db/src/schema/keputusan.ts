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
  nomor_keputusan: varchar("nomor_keputusan").notNull(),
  tanggal_keputusan: date("tangal_keputusan").notNull(),
  tentang: varchar("tentang").notNull(),
  uraian_singkat: text("uploaded_by"),
  nomor_laporan: varchar("nomor_laporan").notNull(),
  tanggal_laporan: date("tangal_laporan").notNull(),
  keterangan: text("keterangan"),
  file: text("file").references(() => file.id),
  created_by: text("created_by")
    .notNull()
    .references(() => user.id),
  created_at: timestamp("created_at").defaultNow(),
});
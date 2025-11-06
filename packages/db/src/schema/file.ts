import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const file = pgTable("file", {
  id: uuid().primaryKey().defaultRandom(),
  name: text("nama_file").notNull(),
  path: text("file_path").notNull(),
  uploadedBy: text("uploaded_by")
    .notNull()
    .references(() => user.id),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});


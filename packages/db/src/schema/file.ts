import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const file = pgTable("file", {
  id: text("id").primaryKey(),
  name: text("nama_file").notNull(),
  path: text("file_path").notNull(),
  uploaded_by: text("uploaded_by")
    .notNull()
    .references(() => user.id),
  uploaded_at: timestamp("uploaded_at").defaultNow(),
});


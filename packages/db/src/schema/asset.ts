import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const asset = pgTable("asset", {
  id: uuid().primaryKey(),
  name: text().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

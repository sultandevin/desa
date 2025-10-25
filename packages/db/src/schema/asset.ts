import { decimal, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const asset = pgTable("asset", {
  id: uuid().primaryKey(),
  name: text().notNull(),
  code: text(),
  nup: text(),
  brandType: text("brand_type"),
  acquiredAt: timestamp("acquisition_year"),
  valueRp: decimal("value_rp"),
  condition: text(),
  status: text(),
  note: text(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdBy: text("created_by").references(() => user.id),
});

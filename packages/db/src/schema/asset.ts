import {
  check,
  decimal,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { sql } from "drizzle-orm";

export const asset = pgTable(
  "asset",
  {
    id: uuid().primaryKey().defaultRandom(),
    name: text().notNull(),
    code: text(),
    nup: text(),
    brandType: text("brand_type"),
    valueRp: decimal("value_rp"),
    condition: text(),
    status: text(),
    note: text(),
    acquiredAt: timestamp("acquisition_year"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    deletedAt: timestamp("deleted_at"),
    createdBy: text("created_by").references(() => user.id),
  },
  (t) => [check("price_check", sql`${t.valueRp} >= 0`)],
);

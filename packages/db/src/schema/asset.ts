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
import { file } from "./file";
import * as z from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

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
    proofOfOwnership: uuid("proof_of_ownership").references(() => file.id),
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

export const assetSelectSchema = createSelectSchema(asset, {
  id: z.string(),
});

export const assetInsertSchema = createInsertSchema(asset);

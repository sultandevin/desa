import { sql } from "drizzle-orm";
import {
  check,
  decimal,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import * as z from "zod";
import { user } from "./auth";
import { file } from "./file";
import { damageStatusEnum } from "./damage-report";

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
    note: text(),
    status: damageStatusEnum(),
    acquiredAt: timestamp("acquisition_year"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    deletedAt: timestamp("deleted_at"),
    createdBy: text("created_by")
      .references(() => user.id)
      .notNull(),
  },
  (t) => [
    check("price_check", sql`${t.valueRp} >= 0`),
    index("updated_at_index").on(t.updatedAt),
  ],
);

export const assetSelectSchema = createSelectSchema(asset, {
  id: z.string(),
});

export const assetInsertSchema = createInsertSchema(asset).omit({
  id: true,
  proofOfOwnership: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

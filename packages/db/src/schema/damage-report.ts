import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import * as z from "zod";
import { asset } from "./asset";
import { user } from "./auth";

export const damageStatusEnum = pgEnum("damage_status", [
  "SEVERE",
  "MILD",
  "MINIMAL",
]);

export const damageReport = pgTable("damage_report", {
  id: uuid().primaryKey().defaultRandom(),
  assetId: uuid("asset_id")
    .notNull()
    .references(() => asset.id, { onDelete: "cascade" }),
  description: text().notNull(),
  status: damageStatusEnum().notNull(),
  reportedBy: text("reported_by")
    .notNull()
    .references(() => user.id),
  verifiedBy: text("verified_by").references(() => user.id),
  verifiedAt: timestamp("verified_at"),
  reportedAt: timestamp("reported_at").defaultNow().notNull(),
});

export const damageReportSelectSchema = createSelectSchema(damageReport, {
  id: z.string(),
  assetId: z.string(),
});

export const damageReportInsertSchema = createInsertSchema(damageReport).omit({
  id: true,
  verifiedBy: true,
  reportedAt: true,
  reportedBy: true,
});

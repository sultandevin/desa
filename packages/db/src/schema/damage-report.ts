import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
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
    .references(() => asset.id),
  description: text().notNull(),
  status: damageStatusEnum(),
  reportedBy: text("reported_by")
    .notNull()
    .references(() => user.id),
  verifiedBy: text("verified_by").references(() => user.id),
  reportedAt: timestamp("reported_at").notNull().defaultNow(),
});

import { pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { asset } from "./asset";
import { user } from "./auth";
import { decision } from "./decision";

export const statusEnum = pgEnum("asset_removal_status", [
  "PENDING",
  "APPROVED",
  "REJECTED",
]);

export const assetRemovalRequest = pgTable("asset_removal_request", {
  id: uuid().primaryKey().defaultRandom(),
  assetId: uuid("asset_id")
    .references(() => asset.id)
    .notNull()
    .unique(),
  reason: text().notNull(),
  status: statusEnum(),
  decisionId: uuid("decision_letter").references(() => decision.id),
  reportedBy: text("reported_by")
    .references(() => user.id)
    .notNull(),
  decidedBy: text("decided_by").references(() => user.id),
});

export const assetRemovalRequestSelectSchema =
  createSelectSchema(assetRemovalRequest);
export const assetRemovalRequestInsertSchema =
  createInsertSchema(assetRemovalRequest);

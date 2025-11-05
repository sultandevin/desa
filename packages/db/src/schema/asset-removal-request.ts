import { pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { asset } from "./asset";
import { file } from "./file";
import { user } from "./auth";

export const statusEnum = pgEnum("asset_removal_status", [
  "PENDING",
  "APPROVED",
  "REJECTED",
]);

export const assetRemovalRequest = pgTable("asset_removal_request", {
  id: uuid().primaryKey().defaultRandom(),
  assetId: uuid()
    .references(() => asset.id)
    .notNull(),
  reason: text().notNull(),
  status: statusEnum(),
  decisionLetter: text("decision_letter").references(() => file.id),
  reportedBy: text("reported_by").references(() => user.id).notNull(),
  decidedBy: text("decided_by").references(() => user.id),
});

import {
  integer,
  json,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { asset } from "./asset";
import { user } from "./auth";

export const transactionEnum = pgEnum("transaction", [
  "INSERT",
  "UPDATE",
  "DELETE",
]);

export const assetHistory = pgTable("asset_audit", {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  assetId: uuid("assest_id").references(() => asset.id),
  transaction: transactionEnum(),
  before: json(),
  after: json(),
  userId: text("user_id").references(() => user.id),
  modifiedAt: timestamp("modified_at").notNull().defaultNow().notNull(),
});

ALTER TABLE "asset_removal_request" RENAME COLUMN "assetId" TO "asset_id";--> statement-breakpoint
ALTER TABLE "asset_removal_request" DROP CONSTRAINT "asset_removal_request_assetId_asset_id_fk";
--> statement-breakpoint
ALTER TABLE "asset_removal_request" DROP CONSTRAINT "asset_removal_request_decision_letter_file_id_fk";
--> statement-breakpoint
ALTER TABLE "asset_removal_request" ADD CONSTRAINT "asset_removal_request_asset_id_asset_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."asset"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset_removal_request" ADD CONSTRAINT "asset_removal_request_decision_letter_decision_id_fk" FOREIGN KEY ("decision_letter") REFERENCES "public"."decision"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset" DROP COLUMN "request_deleted_at";--> statement-breakpoint
ALTER TABLE "asset_removal_request" ADD CONSTRAINT "asset_removal_request_asset_id_unique" UNIQUE("asset_id");
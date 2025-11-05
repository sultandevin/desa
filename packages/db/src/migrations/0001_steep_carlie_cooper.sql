CREATE TYPE "public"."asset_removal_status" AS ENUM('PENDING', 'APPROVED', 'REJECTED');--> statement-breakpoint
CREATE TABLE "asset_removal_request" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"assetId" uuid NOT NULL,
	"reason" text NOT NULL,
	"status" "asset_removal_status",
	"decision_letter" text,
	"reported_by" text NOT NULL,
	"decided_by" text
);
--> statement-breakpoint
ALTER TABLE "peraturan" RENAME TO "regulation";--> statement-breakpoint
ALTER TABLE "keputusan" RENAME COLUMN "decision_number" TO "number";--> statement-breakpoint
ALTER TABLE "keputusan" RENAME COLUMN "decision_date" TO "date";--> statement-breakpoint
ALTER TABLE "regulation" RENAME COLUMN "judul" TO "title";--> statement-breakpoint
ALTER TABLE "regulation" RENAME COLUMN "nomor_peraturan" TO "number";--> statement-breakpoint
ALTER TABLE "regulation" RENAME COLUMN "tingkat_peraturan" TO "level";--> statement-breakpoint
ALTER TABLE "regulation" RENAME COLUMN "deskripsi" TO "description";--> statement-breakpoint
ALTER TABLE "regulation" RENAME COLUMN "berlaku_sejak" TO "effective_by";--> statement-breakpoint
ALTER TABLE "regulation" DROP CONSTRAINT "peraturan_file_file_id_fk";
--> statement-breakpoint
ALTER TABLE "regulation" DROP CONSTRAINT "peraturan_created_by_user_id_fk";
--> statement-breakpoint
ALTER TABLE "asset_audit" ALTER COLUMN "modified_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "asset_audit" ALTER COLUMN "modified_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "file" ALTER COLUMN "nama_file" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "file" ALTER COLUMN "file_path" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "keputusan" ALTER COLUMN "regarding" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "keputusan" ALTER COLUMN "report_number" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "asset" ADD COLUMN "proof_of_ownership" text;--> statement-breakpoint
ALTER TABLE "asset_removal_request" ADD CONSTRAINT "asset_removal_request_assetId_asset_id_fk" FOREIGN KEY ("assetId") REFERENCES "public"."asset"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset_removal_request" ADD CONSTRAINT "asset_removal_request_decision_letter_file_id_fk" FOREIGN KEY ("decision_letter") REFERENCES "public"."file"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset_removal_request" ADD CONSTRAINT "asset_removal_request_reported_by_user_id_fk" FOREIGN KEY ("reported_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset_removal_request" ADD CONSTRAINT "asset_removal_request_decided_by_user_id_fk" FOREIGN KEY ("decided_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset" ADD CONSTRAINT "asset_proof_of_ownership_file_id_fk" FOREIGN KEY ("proof_of_ownership") REFERENCES "public"."file"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "regulation" ADD CONSTRAINT "regulation_file_file_id_fk" FOREIGN KEY ("file") REFERENCES "public"."file"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "regulation" ADD CONSTRAINT "regulation_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
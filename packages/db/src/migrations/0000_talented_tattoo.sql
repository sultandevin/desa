CREATE TYPE "public"."transaction" AS ENUM('INSERT', 'UPDATE', 'DELETE');--> statement-breakpoint
CREATE TABLE "asset_audit" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "asset_audit_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"assest_id" uuid,
	"transaction" "transaction",
	"before" json,
	"after" json,
	"user_id" text,
	"modified_at" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "asset" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"code" text,
	"nup" text,
	"brand_type" text,
	"value_rp" numeric,
	"condition" text,
	"status" text,
	"note" text,
	"acquisition_year" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"created_by" text,
	CONSTRAINT "price_check" CHECK ("asset"."value_rp" >= 0)
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "file" (
	"id" text PRIMARY KEY NOT NULL,
	"nama_file" varchar NOT NULL,
	"file_path" varchar NOT NULL,
	"uploaded_by" text NOT NULL,
	"uploaded_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "keputusan" (
	"id" text PRIMARY KEY NOT NULL,
	"decision_number" varchar NOT NULL,
	"decision_date" date NOT NULL,
	"regarding" varchar NOT NULL,
	"short_description" text,
	"report_number" varchar NOT NULL,
	"report_date" date NOT NULL,
	"notes" text,
	"file" text,
	"created_by" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "peraturan" (
	"id" text PRIMARY KEY NOT NULL,
	"judul" varchar NOT NULL,
	"nomor_peraturan" varchar NOT NULL,
	"tingkat_peraturan" varchar NOT NULL,
	"deskripsi" text,
	"file" text,
	"berlaku_sejak" text,
	"created_by" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "asset_audit" ADD CONSTRAINT "asset_audit_assest_id_asset_id_fk" FOREIGN KEY ("assest_id") REFERENCES "public"."asset"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset_audit" ADD CONSTRAINT "asset_audit_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset" ADD CONSTRAINT "asset_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "file" ADD CONSTRAINT "file_uploaded_by_user_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "keputusan" ADD CONSTRAINT "keputusan_file_file_id_fk" FOREIGN KEY ("file") REFERENCES "public"."file"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "keputusan" ADD CONSTRAINT "keputusan_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "peraturan" ADD CONSTRAINT "peraturan_file_file_id_fk" FOREIGN KEY ("file") REFERENCES "public"."file"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "peraturan" ADD CONSTRAINT "peraturan_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
-- Trigger to log asset changes to assset_audit
CREATE OR REPLACE FUNCTION log_asset_changes()
RETURNS TRIGGER AS $$
BEGIN 
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO "asset_audit" (asset_id, transaction, after, user_id)
    VALUES (NEW.id, 'INSERT', to_json(NEW), current_user);
    RETURN OLD;
  ELSIF (TG_OP = 'UPDATE') THEN
    INSERT INTO "asset_audit" (asset_id, transaction, before, after, user_id)
    VALUES (OLD.id, 'UPDATE', to_json(OLD), to_json(NEW), current_user);
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    INSERT INTO "asset_audit" (asset_id, transaction, before, user_id)
    VALUES (OLD.id, 'DELETE', to_json(OLD), current_user);
    RETURN OLD;
  END IF;
RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER asset_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON asset
FOR EACH ROW EXECUTE FUNCTION log_asset_changes();

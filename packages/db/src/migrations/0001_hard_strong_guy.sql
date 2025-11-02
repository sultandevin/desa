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
CREATE TABLE "file" (
	"id" text PRIMARY KEY NOT NULL,
	"nama_file" varchar NOT NULL,
	"file_path" varchar NOT NULL,
	"uploaded_by" text NOT NULL,
	"uploaded_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "log_peraturan" (
	"id" text PRIMARY KEY NOT NULL,
	"peraturan_id" text NOT NULL,
	"aksi" varchar(255) NOT NULL,
	"deskripsi" text,
	"data_lama" text,
	"data_baru" text,
	"modified_by" text NOT NULL,
	"timestamp" timestamp DEFAULT now()
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
ALTER TABLE "asset" ADD CONSTRAINT "asset_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "file" ADD CONSTRAINT "file_uploaded_by_user_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "log_peraturan" ADD CONSTRAINT "log_peraturan_peraturan_id_peraturan_id_fk" FOREIGN KEY ("peraturan_id") REFERENCES "public"."peraturan"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "log_peraturan" ADD CONSTRAINT "log_peraturan_modified_by_user_id_fk" FOREIGN KEY ("modified_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "peraturan" ADD CONSTRAINT "peraturan_file_file_id_fk" FOREIGN KEY ("file") REFERENCES "public"."file"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "peraturan" ADD CONSTRAINT "peraturan_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
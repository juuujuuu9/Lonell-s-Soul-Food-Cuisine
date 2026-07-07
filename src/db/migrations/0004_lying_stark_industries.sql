CREATE TABLE IF NOT EXISTS "pos_orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"phone_number" varchar(20) NOT NULL,
	"subscriber_id" integer,
	"genius_order_id" varchar(100) NOT NULL,
	"items" jsonb,
	"total" varchar(20),
	"promo_code" varchar(50),
	"promo_redeemed" boolean DEFAULT false NOT NULL,
	"order_type" varchar(20),
	"order_source" varchar(50),
	"raw_payload" jsonb,
	"ordered_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pos_orders_genius_order_id_unique" UNIQUE("genius_order_id")
);
--> statement-breakpoint
ALTER TABLE "pos_orders" ADD CONSTRAINT "pos_orders_subscriber_id_subscribers_id_fk" FOREIGN KEY ("subscriber_id") REFERENCES "public"."subscribers"("id") ON DELETE no action ON UPDATE no action;

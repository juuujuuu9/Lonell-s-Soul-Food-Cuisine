CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"date" varchar(100) NOT NULL,
	"description" text,
	"href" varchar(500),
	"cta" varchar(100),
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"subscriber_id" integer,
	"direction" varchar(10) DEFAULT 'outbound' NOT NULL,
	"from_number" varchar(20),
	"to_number" varchar(20),
	"body" text NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"twilio_sid" varchar(100),
	"simulated" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"platform" varchar(50) NOT NULL,
	"reviewer_name" varchar(100),
	"rating" integer NOT NULL,
	"text" text,
	"replied" boolean DEFAULT false NOT NULL,
	"reply_text" text,
	"reply_template" text,
	"url" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "staff" (
	"id" serial PRIMARY KEY NOT NULL,
	"clerk_id" varchar(100) NOT NULL,
	"name" varchar(100),
	"role" varchar(20) DEFAULT 'staff' NOT NULL,
	"email" varchar(255),
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "staff_clerk_id_unique" UNIQUE("clerk_id")
);
--> statement-breakpoint
CREATE TABLE "subscribers" (
	"id" serial PRIMARY KEY NOT NULL,
	"phone_number" varchar(20) NOT NULL,
	"keyword" varchar(20) DEFAULT 'SOUL' NOT NULL,
	"consent_at" timestamp DEFAULT now() NOT NULL,
	"consent_source" varchar(50) DEFAULT 'web_form' NOT NULL,
	"opt_out" boolean DEFAULT false NOT NULL,
	"opt_out_at" timestamp,
	"promo_code" varchar(20) DEFAULT 'SOUL10',
	"promo_redeemed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subscribers_phone_number_unique" UNIQUE("phone_number")
);
--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_subscriber_id_subscribers_id_fk" FOREIGN KEY ("subscriber_id") REFERENCES "public"."subscribers"("id") ON DELETE no action ON UPDATE no action;
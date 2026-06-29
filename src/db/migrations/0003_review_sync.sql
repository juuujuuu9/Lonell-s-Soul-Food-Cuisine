ALTER TABLE "reviews" ADD COLUMN "external_id" varchar(200);
ALTER TABLE "reviews" ADD COLUMN "reviewed_at" timestamp;
ALTER TABLE "reviews" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;
CREATE UNIQUE INDEX "reviews_platform_external_id_idx" ON "reviews" ("platform", "external_id");

CREATE TABLE "review_sync_state" (
  "platform" varchar(50) PRIMARY KEY NOT NULL,
  "rating" varchar(10),
  "review_count" integer,
  "last_synced_at" timestamp NOT NULL,
  "last_error" text
);

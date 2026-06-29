import { db, isDbReady, schema } from "../../db/index";
import { fetchGooglePlaceReviews } from "./google-places";
import { fetchYelpBusinessReviews } from "./yelp";
import type { PlatformSyncResult, ReviewRecord, SyncReviewsResult } from "./types";

async function upsertReviews(records: ReviewRecord[]): Promise<number> {
  if (!records.length) return 0;

  let upserted = 0;
  for (const record of records) {
    await db!
      .insert(schema.reviews)
      .values({
        platform: record.platform,
        externalId: record.externalId,
        reviewerName: record.reviewerName,
        rating: record.rating,
        text: record.text,
        url: record.url,
        reviewedAt: record.reviewedAt,
      })
      .onConflictDoUpdate({
        target: [schema.reviews.platform, schema.reviews.externalId],
        set: {
          reviewerName: record.reviewerName,
          rating: record.rating,
          text: record.text,
          url: record.url,
          reviewedAt: record.reviewedAt,
          updatedAt: new Date(),
        },
      });
    upserted++;
  }
  return upserted;
}

async function saveSyncState(result: PlatformSyncResult): Promise<void> {
  await db!
    .insert(schema.reviewSyncState)
    .values({
      platform: result.platform,
      rating: result.rating != null ? String(result.rating) : null,
      reviewCount: result.reviewCount,
      lastSyncedAt: new Date(),
      lastError: result.error ?? result.skipped ?? null,
    })
    .onConflictDoUpdate({
      target: schema.reviewSyncState.platform,
      set: {
        rating: result.rating != null ? String(result.rating) : null,
        reviewCount: result.reviewCount,
        lastSyncedAt: new Date(),
        lastError: result.error ?? result.skipped ?? null,
      },
    });
}

async function syncGoogle(): Promise<PlatformSyncResult> {
  const base: PlatformSyncResult = {
    platform: "google",
    upserted: 0,
    rating: null,
    reviewCount: null,
  };

  try {
    const { reviews, rating, reviewCount } = await fetchGooglePlaceReviews();
    base.upserted = await upsertReviews(reviews);
    base.rating = rating;
    base.reviewCount = reviewCount;
  } catch (err) {
    base.error = err instanceof Error ? err.message : String(err);
  }

  if (isDbReady()) await saveSyncState(base);
  return base;
}

async function syncYelp(): Promise<PlatformSyncResult> {
  const base: PlatformSyncResult = {
    platform: "yelp",
    upserted: 0,
    rating: null,
    reviewCount: null,
  };

  try {
    const { reviews, rating, reviewCount, skipped, warning } = await fetchYelpBusinessReviews();
    if (skipped) {
      base.skipped = skipped;
    } else {
      base.upserted = await upsertReviews(reviews);
      base.rating = rating;
      base.reviewCount = reviewCount;
      if (warning) base.error = warning;
    }
  } catch (err) {
    base.error = err instanceof Error ? err.message : String(err);
  }

  if (isDbReady()) await saveSyncState(base);
  return base;
}

export async function syncReviews(): Promise<SyncReviewsResult> {
  if (!isDbReady()) {
    const err = "Database not configured";
    const fail = (platform: "google" | "yelp"): PlatformSyncResult => ({
      platform,
      upserted: 0,
      rating: null,
      reviewCount: null,
      error: err,
    });
    return { google: fail("google"), yelp: fail("yelp") };
  }

  const [google, yelp] = await Promise.all([syncGoogle(), syncYelp()]);
  return { google, yelp };
}

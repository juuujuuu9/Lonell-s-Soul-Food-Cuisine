import { createHash } from "node:crypto";
import { serverEnv } from "../env";
import type { ReviewRecord } from "./types";

type GoogleReview = {
  author_name?: string;
  author_url?: string;
  rating?: number;
  text?: string;
  time?: number;
};

type GooglePlaceDetails = {
  status: string;
  error_message?: string;
  result?: {
    name?: string;
    rating?: number;
    user_ratings_total?: number;
    reviews?: GoogleReview[];
  };
};

export function googleReviewExternalId(review: Pick<GoogleReview, "time" | "author_name" | "text">): string {
  const raw = `${review.time ?? 0}|${review.author_name ?? ""}|${review.text ?? ""}`;
  return createHash("sha256").update(raw).digest("hex").slice(0, 32);
}

export async function fetchGooglePlaceReviews(): Promise<{
  reviews: ReviewRecord[];
  rating: number | null;
  reviewCount: number | null;
}> {
  const apiKey = serverEnv("GOOGLE_PLACES_API_KEY");
  const placeId = serverEnv("GOOGLE_PLACE_ID");
  if (!apiKey || !placeId) {
    throw new Error("GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID must be set");
  }

  const params = new URLSearchParams({
    place_id: placeId,
    fields: "name,rating,user_ratings_total,reviews",
    key: apiKey,
  });

  const res = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?${params}`);
  if (!res.ok) {
    throw new Error(`Google Places HTTP ${res.status}`);
  }

  const data = (await res.json()) as GooglePlaceDetails;
  if (data.status !== "OK" || !data.result) {
    throw new Error(data.error_message ?? `Google Places status: ${data.status}`);
  }

  const reviews: ReviewRecord[] = (data.result.reviews ?? [])
    .filter((r) => typeof r.rating === "number" && r.rating >= 1 && r.rating <= 5)
    .map((r) => ({
      platform: "google" as const,
      externalId: googleReviewExternalId(r),
      reviewerName: r.author_name ?? null,
      rating: r.rating!,
      text: r.text ?? null,
      url: r.author_url ?? null,
      reviewedAt: new Date((r.time ?? 0) * 1000),
    }));

  return {
    reviews,
    rating: data.result.rating ?? null,
    reviewCount: data.result.user_ratings_total ?? null,
  };
}

if (import.meta.env?.DEV) {
  const id = googleReviewExternalId({ time: 1700000000, author_name: "Jane", text: "Great food" });
  console.assert(id.length === 32, "google external id is 32-char hash");
  console.assert(
    id === googleReviewExternalId({ time: 1700000000, author_name: "Jane", text: "Great food" }),
    "google external id is stable"
  );
}

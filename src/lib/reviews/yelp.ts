import { serverEnv } from "../env";
import type { ReviewRecord } from "./types";

type YelpErrorBody = {
  error?: { code?: string; description?: string };
};

type YelpReview = {
  id?: string;
  rating?: number;
  text?: string;
  time_created?: string;
  url?: string;
  user?: { name?: string };
};

type YelpReviewsResponse = YelpErrorBody & {
  total?: number;
  reviews?: YelpReview[];
};

type YelpBusinessResponse = YelpErrorBody & {
  rating?: number;
  review_count?: number;
};

function yelpHeaders(apiKey: string): HeadersInit {
  return { Authorization: `Bearer ${apiKey}` };
}

function parseYelpError(status: number, data: YelpErrorBody, fallback: string): string {
  const code = data.error?.code;
  const desc = data.error?.description ?? fallback;

  if (status === 401 || status === 403 || code === "UNAUTHORIZED_API_KEY" || code === "AUTHORIZATION_ERROR") {
    return `${desc} — Yelp Reviews requires Enhanced or Premium plan (Base plan has no review excerpts).`;
  }

  return desc;
}

function parseYelpDate(raw: string | undefined): Date {
  if (!raw) return new Date();
  const normalized = raw.includes("T") ? raw : raw.replace(" ", "T");
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

export async function fetchYelpBusinessReviews(): Promise<{
  reviews: ReviewRecord[];
  rating: number | null;
  reviewCount: number | null;
  skipped?: string;
  warning?: string;
}> {
  const apiKey = serverEnv("YELP_API_KEY");
  const businessId = serverEnv("YELP_BUSINESS_ID");
  if (!apiKey?.trim()) {
    return { reviews: [], rating: null, reviewCount: null, skipped: "YELP_API_KEY not set" };
  }
  if (!businessId?.trim()) {
    return { reviews: [], rating: null, reviewCount: null, skipped: "YELP_BUSINESS_ID not set" };
  }

  const encoded = encodeURIComponent(businessId);
  const headers = yelpHeaders(apiKey);
  const fetchOpts = { headers, signal: AbortSignal.timeout(12_000) };

  const [businessRes, reviewsRes] = await Promise.all([
    fetch(`https://api.yelp.com/v3/businesses/${encoded}`, fetchOpts),
    fetch(`https://api.yelp.com/v3/businesses/${encoded}/reviews`, fetchOpts),
  ]);

  let rating: number | null = null;
  let reviewCount: number | null = null;

  const businessBody = (await businessRes.json()) as YelpBusinessResponse;
  if (!businessRes.ok) {
    throw new Error(parseYelpError(businessRes.status, businessBody, `Yelp business HTTP ${businessRes.status}`));
  }
  rating = businessBody.rating ?? null;
  reviewCount = businessBody.review_count ?? null;

  const reviewsBody = (await reviewsRes.json()) as YelpReviewsResponse;
  if (!reviewsRes.ok) {
    throw new Error(parseYelpError(reviewsRes.status, reviewsBody, `Yelp reviews HTTP ${reviewsRes.status}`));
  }

  const reviews: ReviewRecord[] = (reviewsBody.reviews ?? [])
    .filter((r) => r.id && typeof r.rating === "number")
    .map((r) => ({
      platform: "yelp" as const,
      externalId: r.id!,
      reviewerName: r.user?.name ?? null,
      rating: r.rating!,
      text: r.text ?? null,
      url: r.url ?? null,
      reviewedAt: parseYelpDate(r.time_created),
    }));

  let warning: string | undefined;
  if (reviews.length === 0 && reviewCount && reviewCount > 0) {
    warning = "Yelp returned rating/count but 0 review excerpts — check API plan (Enhanced+ required).";
  }

  if (reviewCount == null && reviewsBody.total != null) {
    reviewCount = reviewsBody.total;
  }

  return { reviews, rating, reviewCount, warning };
}

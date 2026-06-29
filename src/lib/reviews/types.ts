export type ReviewRecord = {
  platform: "google" | "yelp";
  externalId: string;
  reviewerName: string | null;
  rating: number;
  text: string | null;
  url: string | null;
  reviewedAt: Date;
};

export type PlatformSyncResult = {
  platform: "google" | "yelp";
  upserted: number;
  rating: number | null;
  reviewCount: number | null;
  skipped?: string;
  error?: string;
};

export type SyncReviewsResult = {
  google: PlatformSyncResult;
  yelp: PlatformSyncResult;
};

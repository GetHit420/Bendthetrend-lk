// Live Google reviews for the atelier, from Google's official Places API (New).
//
// SETUP (once):
//   1. In Google Cloud Console, enable "Places API (New)" and create an API key
//      (restrict it to the Places API).
//   2. Find your Place ID with Google's Place ID Finder:
//      https://developers.google.com/maps/documentation/places/web-service/place-id
//   3. Add both to a file called .env.local in the project folder (and to your host, e.g. Vercel):
//        GOOGLE_PLACES_API_KEY=your-key
//        GOOGLE_PLACE_ID=ChIJ...
//
// Until both are set, or if Google can't be reached, the site shows the written
// testimonials in lib/site.ts instead, so nothing ever looks broken.

/** How often to check Google for new reviews, in seconds. 3600 = every hour. */
export const REVIEWS_REFRESH_SECONDS = 3600;

/** Hide reviews below this many stars. 0 shows every review Google returns. */
export const MIN_STARS = 0;

export type Review = {
  id: string;
  author: string;
  authorUrl?: string;
  photo?: string;
  rating: number;
  text: string;
  when?: string; // e.g. "2 weeks ago"
  url?: string; // this review on Google Maps
  flagUrl?: string; // report the review to Google
  translated: boolean;
};

export type GoogleReviews = {
  rating: number;
  count: number;
  reviews: Review[];
  reviewsUrl?: string;
  writeUrl?: string;
  placeUrl?: string;
};

type ApiText = { text?: string; languageCode?: string };
type ApiReview = {
  name?: string;
  rating?: number;
  text?: ApiText;
  originalText?: ApiText;
  relativePublishTimeDescription?: string;
  googleMapsUri?: string;
  flagContentUri?: string;
  authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
};
type ApiPlace = {
  rating?: number;
  userRatingCount?: number;
  reviews?: ApiReview[];
  googleMapsUri?: string;
  googleMapsLinks?: { reviewsUri?: string; writeAReviewUri?: string; placeUri?: string };
};

const FIELDS = "rating,userRatingCount,reviews,googleMapsUri,googleMapsLinks";
const BASE = process.env.GOOGLE_PLACES_ENDPOINT || "https://places.googleapis.com/v1";

export async function getGoogleReviews(): Promise<GoogleReviews | null> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!key || !placeId) return null;

  try {
    const res = await fetch(`${BASE}/places/${encodeURIComponent(placeId)}?languageCode=en`, {
      headers: { "X-Goog-Api-Key": key, "X-Goog-FieldMask": FIELDS },
      next: { revalidate: REVIEWS_REFRESH_SECONDS, tags: ["google-reviews"] },
    });
    if (!res.ok) {
      console.error(`[google-reviews] Google returned ${res.status}: ${(await res.text()).slice(0, 300)}`);
      return null;
    }
    const p = (await res.json()) as ApiPlace;

    const reviews: Review[] = (p.reviews ?? [])
      .filter((r) => (r.text?.text || r.originalText?.text) && (r.rating ?? 0) >= MIN_STARS)
      .map((r, i) => ({
        id: r.name || String(i),
        author: r.authorAttribution?.displayName || "Google user",
        authorUrl: r.authorAttribution?.uri,
        photo: r.authorAttribution?.photoUri,
        rating: Math.round(r.rating ?? 5),
        text: (r.text?.text || r.originalText?.text || "").trim(),
        when: r.relativePublishTimeDescription,
        url: r.googleMapsUri,
        flagUrl: r.flagContentUri,
        translated: !!(r.text?.languageCode && r.originalText?.languageCode && r.text.languageCode !== r.originalText.languageCode),
      }));

    if (!p.rating && reviews.length === 0) return null;
    return {
      rating: p.rating ?? 0,
      count: p.userRatingCount ?? 0,
      reviews,
      reviewsUrl: p.googleMapsLinks?.reviewsUri || p.googleMapsUri,
      writeUrl: p.googleMapsLinks?.writeAReviewUri,
      placeUrl: p.googleMapsLinks?.placeUri || p.googleMapsUri,
    };
  } catch (e) {
    console.error("[google-reviews] Could not reach Google:", e);
    return null;
  }
}

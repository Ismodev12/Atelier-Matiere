import { DEMO_REVIEWS } from "@/lib/data/demo-catalog";
import type { PublicReview } from "@/lib/types";

/** Version frontend : avis d'exemple, clairement signalés comme tels. */
export async function getApprovedReviews(opts: { productId?: string | null; limit?: number } = {}): Promise<PublicReview[]> {
  return opts.productId ? [] : DEMO_REVIEWS.slice(0, opts.limit ?? 6);
}

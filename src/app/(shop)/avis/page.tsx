import type { Metadata } from "next";
import { ReviewForm } from "@/components/forms/ReviewForm";
import { Stars } from "@/components/home/Sections";
import { getApprovedReviews } from "@/lib/repo/reviews";
import { getSettings } from "@/lib/repo/settings";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Avis clients" };

export default async function ReviewsPage() {
  const [reviews, settings] = await Promise.all([getApprovedReviews({ limit: 30 }), getSettings()]);
  return (
    <div className="container-x grid gap-12 pt-10 pb-24 lg:grid-cols-12 lg:pt-16 lg:pb-36">
      <div className="lg:col-span-6">
        <p className="eyebrow">Avis</p>
        <h1 className="display-xl mt-6">Paroles de clients</h1>
        <p className="mt-6 max-w-md text-charcoal-soft">Chaque avis est relu par l&apos;atelier avant d&apos;être publié.</p>
        <ul className="mt-12 space-y-8">
          {reviews.length === 0 && <li className="text-ink-muted">Aucun avis publié pour le moment.</li>}
          {reviews.map((r) => (
            <li key={r.id} className="border-t border-line pt-6">
              {r.isDemo && <span className="mb-3 inline-block rounded-full bg-wood/10 px-2.5 py-1 text-[0.62rem] tracking-[0.16em] text-wood uppercase">Avis d&apos;exemple — prototype</span>}
              <Stars rating={r.rating} />
              <p className="mt-3 font-display text-2xl leading-snug">« {r.body} »</p>
              <p className="mt-3 text-sm text-ink-muted">{r.authorName}{r.productName ? ` · ${r.productName}` : ""} · {formatDate(r.createdAt)}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="lg:col-span-5 lg:col-start-8">
        {settings.reviews.siteReviewsEnabled ? <ReviewForm /> : <p className="text-ink-muted">Les avis sont momentanément fermés.</p>}
      </div>
    </div>
  );
}

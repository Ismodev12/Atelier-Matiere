"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { submitReview } from "@/actions/public";
import { Field, FormMessage, PendingContext, SpamGuard, SubmitButton, useFormAction } from "./FormBits";
import type { FormState } from "@/lib/validation";

export function ReviewForm({ productId, productName }: { productId?: string; productName?: string }) {
  const { state, pending, onSubmit } = useFormAction<FormState>(submitReview, {});
  const [rating, setRating] = useState(5);
  const e = state.errors ?? {};
  if (state.ok)
    return (
      <div className="rounded-[1.5rem] border border-line bg-paper p-6">
        <FormMessage state={state} />
      </div>
    );
  return (
    <PendingContext.Provider value={pending}>
    <form onSubmit={onSubmit} className="relative space-y-5 rounded-[1.5rem] border border-line bg-paper p-6 sm:p-8" noValidate>
      <p className="font-display text-2xl">{productName ? `Votre avis sur « ${productName} »` : "Votre avis"}</p>
      <p className="text-sm text-ink-muted">Les avis sont publiés après validation par l&apos;atelier. Votre adresse e-mail n&apos;est pas demandée.</p>
      <SpamGuard />
      {productId && <input type="hidden" name="productId" value={productId} />}
      <fieldset>
        <legend className="field-label">Note</legend>
        <input type="hidden" name="rating" value={rating} />
        <div className="flex gap-1" role="radiogroup" aria-label="Note sur 5">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" role="radio" aria-checked={rating === n} aria-label={`${n} sur 5`} onClick={() => setRating(n)} className="p-1 text-wood">
              <Star size={24} fill={n <= rating ? "currentColor" : "none"} strokeWidth={1.3} aria-hidden />
            </button>
          ))}
        </div>
      </fieldset>
      <Field label="Nom affiché" name="authorName" error={e.authorName} required>
        <input id="authorName" name="authorName" maxLength={60} className="field" aria-invalid={!!e.authorName} autoComplete="given-name" />
      </Field>
      <Field label="Votre avis" name="body" error={e.body} required>
        <textarea id="body" name="body" maxLength={1500} className="field" aria-invalid={!!e.body} />
      </Field>
      <label className="flex items-start gap-3 text-sm text-charcoal-soft">
        <input type="checkbox" name="consent" className="mt-1 h-4 w-4 accent-[var(--color-wood)]" />
        <span>
          J&apos;accepte que mon avis et le nom indiqué soient publiés sur le site après modération (
          <a href="#legal/cgu" className="underline">conditions</a>).
        </span>
      </label>
      {e.consent && <p className="field-error">{e.consent}</p>}
      <FormMessage state={state} />
      <SubmitButton>Envoyer mon avis</SubmitButton>
    </form>
    </PendingContext.Provider>
  );
}

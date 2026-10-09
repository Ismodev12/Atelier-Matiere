"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { AlertTriangle, Lock } from "lucide-react";
import { checkoutAction, type CheckoutState } from "@/actions/public";
import { Field, FormMessage, PendingContext, SubmitButton, useFormAction } from "@/components/forms/FormBits";
import { formatPrice } from "@/lib/money";
import { PersonalizationSummary } from "./CartView";
import { useValidatedCart } from "./useValidatedCart";

const COUNTRY_NAMES: Record<string, string> = { FR: "France", BE: "Belgique", LU: "Luxembourg", CH: "Suisse", MC: "Monaco", DE: "Allemagne", ES: "Espagne", IT: "Italie", NL: "Pays-Bas", PT: "Portugal", GB: "Royaume-Uni", BJ: "Bénin", CA: "Canada" };

export function CheckoutForm({ countries, blockedReason }: { countries: string[]; blockedReason: string | null }) {
  const { lines, ready, priced, pending } = useValidatedCart();
  const { state, pending: submitting, onSubmit } = useFormAction<CheckoutState>(checkoutAction, {});
  const e = state.errors ?? {};

  if (ready && !lines.length)
    return (
      <div className="rounded-[1.75rem] border border-dashed border-line-strong px-6 py-16 text-center">
        <p className="font-display text-3xl">Votre panier est vide.</p>
        <Link href="/boutique" className="btn btn-primary mt-6">Retour à la boutique</Link>
      </div>
    );

  const canPay = !blockedReason && priced?.canCheckout && !pending;

  return (
    <PendingContext.Provider value={submitting}>
    <form onSubmit={onSubmit} className="grid gap-10 lg:grid-cols-12 lg:gap-14" noValidate>
      <input type="hidden" name="lines" value={JSON.stringify(lines.map((l) => ({ productId: l.productId, quantity: l.quantity, personalization: l.personalization })))} />
      <div className="space-y-10 lg:col-span-7">
        {blockedReason && (
          <div className="flex items-start gap-3 rounded-2xl border border-wood/30 bg-wood/10 p-5 text-sm" role="status">
            <AlertTriangle size={18} className="mt-0.5 shrink-0 text-wood" aria-hidden />
            <div>
              <p>{blockedReason}</p>
              <Link href="/personnalisation#demande" className="mt-2 inline-block underline underline-offset-4">Nous contacter pour une demande</Link>
            </div>
          </div>
        )}
        <fieldset className="grid gap-5 sm:grid-cols-2" disabled={!!blockedReason}>
          <legend className="mb-5 font-display text-3xl">Vos coordonnées</legend>
          <Field label="Nom complet" name="name" error={e.name} required className="sm:col-span-2">
            <input id="name" name="name" autoComplete="name" maxLength={120} className="field" aria-invalid={!!e.name} />
          </Field>
          <Field label="Adresse e-mail" name="email" error={e.email} required hint="Pour la confirmation et le suivi.">
            <input id="email" name="email" type="email" autoComplete="email" maxLength={200} className="field" aria-invalid={!!e.email} />
          </Field>
          <Field label="Téléphone" name="phone" error={e.phone} hint="Facultatif, utile au transporteur.">
            <input id="phone" name="phone" type="tel" autoComplete="tel" maxLength={30} className="field" />
          </Field>
        </fieldset>
        <fieldset className="grid gap-5 sm:grid-cols-2" disabled={!!blockedReason}>
          <legend className="mb-5 font-display text-3xl">Livraison</legend>
          <Field label="Adresse" name="line1" error={e.line1} required className="sm:col-span-2">
            <input id="line1" name="line1" autoComplete="address-line1" maxLength={200} className="field" aria-invalid={!!e.line1} />
          </Field>
          <Field label="Complément" name="line2" className="sm:col-span-2">
            <input id="line2" name="line2" autoComplete="address-line2" maxLength={200} className="field" />
          </Field>
          <Field label="Code postal" name="postalCode" error={e.postalCode} required>
            <input id="postalCode" name="postalCode" autoComplete="postal-code" maxLength={12} className="field" aria-invalid={!!e.postalCode} />
          </Field>
          <Field label="Ville" name="city" error={e.city} required>
            <input id="city" name="city" autoComplete="address-level2" maxLength={100} className="field" aria-invalid={!!e.city} />
          </Field>
          <Field label="Pays" name="country" error={e.country} required className="sm:col-span-2">
            <select id="country" name="country" autoComplete="country" className="field" defaultValue={countries[0]}>
              {countries.map((c) => (
                <option key={c} value={c}>{COUNTRY_NAMES[c] ?? c}</option>
              ))}
            </select>
          </Field>
          <Field label="Note pour l'atelier" name="note" className="sm:col-span-2" hint="Facultatif.">
            <textarea id="note" name="note" maxLength={600} className="field !min-h-24" />
          </Field>
        </fieldset>
      </div>

      <aside className="lg:col-span-5">
        <div className="rounded-[1.75rem] border border-line bg-paper p-6 sm:p-8 lg:sticky lg:top-28">
          <h2 className="font-display text-3xl">Votre commande</h2>
          <ul className="mt-6 space-y-4">
            {lines.map((l, i) => {
              const s = priced?.lines[i];
              return (
                <li key={l.key} className="grid grid-cols-[3.5rem_1fr_auto] gap-3 text-sm">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-ivory-deep">
                    {l.image && <img src={l.image} alt="" className="h-full w-full object-cover" />}
                    <span className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-charcoal px-1 text-[0.62rem] text-ivory">{l.quantity}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium">{l.name}</p>
                    <PersonalizationSummary p={l.personalization} />
                    {s?.error && <p className="mt-1 text-xs text-danger">{s.error}</p>}
                  </div>
                  <p className="tabular-nums">{s ? formatPrice(s.lineTotalCents) : "—"}</p>
                </li>
              );
            })}
          </ul>
          <dl className="mt-6 space-y-2 border-t border-line pt-5 text-sm">
            <div className="flex justify-between"><dt>Sous-total</dt><dd className="tabular-nums">{priced ? formatPrice(priced.subtotalCents) : "—"}</dd></div>
            <div className="flex justify-between"><dt>Livraison</dt><dd className="tabular-nums">{priced ? (priced.shippingCents ? formatPrice(priced.shippingCents) : "Offerte") : "—"}</dd></div>
            <div className="flex justify-between border-t border-line pt-3 text-base font-medium"><dt>Total</dt><dd className="tabular-nums">{priced ? formatPrice(priced.totalCents) : "—"}</dd></div>
          </dl>

          {state.cartErrors && state.cartErrors.length > 0 && (
            <ul className="mt-5 space-y-1 rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger" role="alert">
              {state.cartErrors.map((m) => <li key={m}>{m}</li>)}
              <li><Link href="/panier" className="underline">Corriger mon panier</Link></li>
            </ul>
          )}
          {priced && !priced.canCheckout && (
            <p className="mt-5 rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger" role="alert">
              Un article n&apos;est plus disponible. <Link href="/panier" className="underline">Corrigez votre panier</Link> pour continuer.
            </p>
          )}

          <label className="mt-6 flex items-start gap-3 text-sm text-charcoal-soft">
            <input type="checkbox" name="acceptTerms" className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-wood)]" disabled={!!blockedReason} />
            <span>
              J&apos;ai lu et j&apos;accepte les <a href="#legal/cgv" className="underline">conditions générales de vente</a>, y compris l&apos;absence de droit de rétractation pour les objets personnalisés.
            </span>
          </label>
          {e.acceptTerms && <p className="field-error">{e.acceptTerms}</p>}

          <div className="mt-5 space-y-4">
            <FormMessage state={state} />
            {canPay ? (
              <SubmitButton className="w-full" pendingLabel="Redirection vers le paiement…">
                <Lock size={15} aria-hidden /> Payer {priced ? formatPrice(priced.totalCents) : ""}
              </SubmitButton>
            ) : (
              <button type="button" disabled className="btn btn-primary w-full"><Lock size={15} aria-hidden /> Paiement indisponible</button>
            )}
            <p className="text-center text-xs text-ink-muted">
              Paiement sécurisé par Stripe : carte bancaire, Apple Pay ou Google Pay selon votre appareil. Vos données de carte ne transitent pas par ce site.
            </p>
          </div>
        </div>
      </aside>
    </form>
    </PendingContext.Provider>
  );
}

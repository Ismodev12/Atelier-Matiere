"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { AlertTriangle, ArrowRight, Loader2, Minus, Plus, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/money";
import { ENGRAVING_FONTS } from "@/lib/data/defaults";
import type { PersonalizationChoice } from "@/lib/types";
import { useValidatedCart } from "./useValidatedCart";

export function PersonalizationSummary({ p }: { p: PersonalizationChoice | null }) {
  if (!p) return null;
  return (
    <dl className="mt-2 space-y-0.5 rounded-lg bg-ivory-deep/70 px-3 py-2 text-xs text-charcoal-soft">
      {p.text && <div><dt className="inline text-ink-muted">Gravure : </dt><dd className="inline font-medium whitespace-pre-line">« {p.text} »</dd></div>}
      {p.font && <div><dt className="inline text-ink-muted">Police : </dt><dd className="inline">{ENGRAVING_FONTS[p.font]?.label ?? p.font}</dd></div>}
      {p.date && <div><dt className="inline text-ink-muted">Date : </dt><dd className="inline">{new Date(p.date + "T12:00:00").toLocaleDateString("fr-FR")}</dd></div>}
      {p.motif && <div><dt className="inline text-ink-muted">Motif : </dt><dd className="inline">{p.motif}</dd></div>}
      {p.notes && <div><dt className="inline text-ink-muted">Instructions : </dt><dd className="inline">{p.notes}</dd></div>}
      {p.referenceMediaId && <div><dd>Image de référence jointe</dd></div>}
    </dl>
  );
}

export function CartView({ demo }: { demo: boolean }) {
  const { lines, ready, setQuantity, remove, priced, invalid, pending } = useValidatedCart();

  if (!ready) return <div className="h-60 animate-pulse rounded-[1.5rem] bg-ivory-deep" />;

  if (!lines.length)
    return (
      <div className="rounded-[1.75rem] border border-dashed border-line-strong px-6 py-20 text-center">
        <p className="font-display text-4xl">Votre panier est vide.</p>
        <p className="mt-3 text-ink-muted">Prenez le temps de découvrir les créations de l&apos;atelier.</p>
        <Link href="/boutique" className="btn btn-primary mt-8">Découvrir la collection <ArrowRight size={16} aria-hidden /></Link>
      </div>
    );

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
      <ul className="lg:col-span-7" aria-busy={pending}>
        {lines.map((l, i) => {
          const server = priced?.lines[i];
          const error = server?.error;
          const unit = server?.unitPriceCents ?? l.unitPriceCents;
          return (
            <li key={l.key} className="grid grid-cols-[6rem_1fr] gap-5 border-t border-line py-6 last:border-b sm:grid-cols-[8rem_1fr]">
              <Link href={`/boutique/${l.slug}`} className="block aspect-[4/5] overflow-hidden rounded-xl bg-ivory-deep">
                {l.image && <img src={l.image} alt="" className="h-full w-full object-cover" />}
              </Link>
              <div className="min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <Link href={`/boutique/${l.slug}`} className="font-display text-2xl leading-tight hover:underline">{l.name}</Link>
                    <p className="mt-1 text-sm text-ink-muted tabular-nums">{formatPrice(unit)} l&apos;unité</p>
                  </div>
                  <p className="shrink-0 font-medium tabular-nums">{formatPrice(unit * l.quantity)}</p>
                </div>
                <PersonalizationSummary p={l.personalization} />
                {error && (
                  <p className="mt-3 flex items-start gap-2 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger" role="alert">
                    <AlertTriangle size={16} className="mt-0.5 shrink-0" aria-hidden /> {error}
                  </p>
                )}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex h-10 items-center rounded-full border border-line-strong" role="group" aria-label={`Quantité de ${l.name}`}>
                    <button type="button" className="grid h-full w-9 place-items-center disabled:opacity-30" onClick={() => setQuantity(l.key, l.quantity - 1)} disabled={l.quantity <= 1} aria-label="Diminuer">
                      <Minus size={14} aria-hidden />
                    </button>
                    <span className="w-7 text-center text-sm tabular-nums">{l.quantity}</span>
                    <button
                      type="button"
                      className="grid h-full w-9 place-items-center disabled:opacity-30"
                      onClick={() => setQuantity(l.key, l.quantity + 1)}
                      disabled={server ? l.quantity >= server.maxQuantity : false}
                      aria-label="Augmenter"
                    >
                      <Plus size={14} aria-hidden />
                    </button>
                  </div>
                  <button type="button" onClick={() => remove(l.key)} className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-danger">
                    <Trash2 size={15} aria-hidden /> Retirer
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <aside className="lg:col-span-5">
        <div className="rounded-[1.75rem] border border-line bg-paper p-6 sm:p-8 lg:sticky lg:top-28">
          <h2 className="font-display text-3xl">Récapitulatif</h2>
          {invalid && <p className="mt-4 text-sm text-danger">{invalid}</p>}
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between"><dt>Sous-total</dt><dd className="tabular-nums">{priced ? formatPrice(priced.subtotalCents) : "—"}</dd></div>
            <div className="flex justify-between"><dt>Livraison</dt><dd className="tabular-nums">{priced ? (priced.shippingCents ? formatPrice(priced.shippingCents) : "Offerte") : "—"}</dd></div>
            <div className="flex justify-between border-t border-line pt-4 text-base font-medium"><dt>Total</dt><dd className="tabular-nums">{priced ? formatPrice(priced.totalCents) : "—"}</dd></div>
          </dl>
          <p className="mt-2 text-xs text-ink-muted">Montants recalculés par le serveur à chaque modification.</p>
          {priced && !priced.canCheckout && (
            <p className="mt-5 rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger" role="alert">
              Votre panier contient un article indisponible ou invalide. Corrigez-le pour poursuivre.
            </p>
          )}
          {priced?.canCheckout ? (
            <Link href="/commande" className="btn btn-primary mt-6 w-full">Passer la commande <ArrowRight size={16} aria-hidden /></Link>
          ) : (
            <button type="button" disabled className="btn btn-primary mt-6 w-full">
              {pending ? <Loader2 size={16} className="animate-spin" aria-hidden /> : null}
              {pending ? "Vérification…" : "Passer la commande"}
            </button>
          )}
          {demo && <p className="mt-4 text-xs text-ink-muted">Prototype : la commande et le paiement ne sont pas activés.</p>}
          <Link href="/boutique" className="link-u mt-6 text-sm">Continuer mes achats</Link>
        </div>
      </aside>
    </div>
  );
}

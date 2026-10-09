"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { ArrowUpRight, Check, ImagePlus, Loader2, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/components/site/CartProvider";
import { formatPrice } from "@/lib/money";
import { ENGRAVING_FONTS } from "@/lib/data/defaults";
import type { Availability, Personalization, PersonalizationChoice } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  product: {
    id: string;
    slug: string;
    name: string;
    priceCents: number;
    image: string;
    materials: string[];
    personalization: Personalization;
    stock: number;
  };
  availability: Availability;
  demo: boolean;
};

const ALLOWED = /^[\p{L}\p{N} '’\-.,&!?:/()\n]*$/u;

function MotifGlyph({ motif }: { motif?: string }) {
  if (!motif || motif === "Aucun") return null;
  const common = { width: 34, height: 22, viewBox: "0 0 34 22", fill: "none", stroke: "currentColor", strokeWidth: 1.1 } as const;
  if (/olivier|feuille|blé/i.test(motif))
    return (
      <svg {...common} aria-hidden>
        <path d="M3 11h28" />
        {[8, 13, 18, 23].map((x, i) => (
          <g key={x}>
            <ellipse cx={x} cy={i % 2 ? 7 : 15} rx="3.2" ry="1.6" transform={`rotate(${i % 2 ? -30 : 30} ${x} ${i % 2 ? 7 : 15})`} />
          </g>
        ))}
      </svg>
    );
  if (/cœur|coeur/i.test(motif))
    return (
      <svg {...common} aria-hidden>
        <path d="M17 18s-7-4.3-7-9a3.6 3.6 0 0 1 7-1.2A3.6 3.6 0 0 1 24 9c0 4.7-7 9-7 9z" />
      </svg>
    );
  if (/anneau/i.test(motif))
    return (
      <svg {...common} aria-hidden>
        <circle cx="13.5" cy="11" r="6" />
        <circle cx="20.5" cy="11" r="6" />
      </svg>
    );
  return (
    <svg {...common} aria-hidden>
      <path d="M17 3l1.8 5.6H25l-5 3.6 1.9 5.8-4.9-3.6-4.9 3.6 1.9-5.8-5-3.6h6.2z" />
    </svg>
  );
}

export function ProductPurchase({ product, availability, demo }: Props) {
  const { add } = useCart();
  const cfg = product.personalization;
  const online = cfg.enabled && cfg.mode === "options";
  const [qty, setQty] = useState(1);
  const [text, setText] = useState("");
  const [date, setDate] = useState("");
  const [font, setFont] = useState(cfg.fonts[0] ?? "");
  const [motif, setMotif] = useState(cfg.motifs[0] ?? "");
  const [notes, setNotes] = useState("");
  const [ref, setRef] = useState<{ id: string; name: string } | null>(null);
  const uploading = false;
  const [uploadError, setUploadError] = useState("");
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  const lines = text.split("\n");
  const textError =
    lines.length > cfg.textLines
      ? `${cfg.textLines} ligne(s) maximum.`
      : lines.some((l) => [...l].length > cfg.textMaxLength)
        ? `${cfg.textMaxLength} caractères maximum par ligne.`
        : !ALLOWED.test(text)
          ? "Caractères non gravables détectés (emojis, symboles)."
          : "";
  const personalized = online && Boolean(text.trim() || date || (motif && motif !== "Aucun") || notes.trim() || ref);
  const unit = product.priceCents + (personalized ? cfg.extraPriceCents : 0);
  const purchasable = availability === "available";
  const maxQty = Math.min(20, product.stock);
  const isGlass = product.materials.some((m) => /verre/i.test(m)) && !product.materials.some((m) => /bois/i.test(m));
  const fontCss = useMemo(() => {
    const f = ENGRAVING_FONTS[font];
    if (!f) return {};
    const [family, style] = f.css.split(";");
    return {
      fontFamily: family,
      fontStyle: style?.includes("italic") ? "italic" : "normal",
      textTransform: font === "capitales" ? ("uppercase" as const) : undefined,
      letterSpacing: font === "capitales" ? "0.28em" : undefined,
    };
  }, [font]);

  /** Prototype : l'image est seulement sélectionnée, elle n'est envoyée nulle part. */
  function upload(file: File) {
    setUploadError("");
    if (file.size > 5 * 1024 * 1024) return setUploadError("Image trop lourde (5 Mo maximum).");
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return setUploadError("Formats acceptés : JPEG, PNG, WebP.");
    setRef({ id: "", name: file.name });
  }

  function onAdd() {
    setError("");
    if (textError) return setError(textError);
    const choice: PersonalizationChoice | null = personalized
      ? {
          ...(text.trim() ? { text: text.trim(), font } : {}),
          ...(date ? { date } : {}),
          ...(motif && motif !== "Aucun" ? { motif } : {}),
          ...(notes.trim() ? { notes: notes.trim() } : {}),
          ...(ref ? { notes: [notes.trim(), `Image de référence : ${ref.name}`].filter(Boolean).join(" — ") } : {}),
        }
      : null;
    add({ productId: product.id, slug: product.slug, name: product.name, image: product.image, unitPriceCents: unit, quantity: qty, personalization: choice });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  return (
    <div className="space-y-8">
      {/* ── Personnalisation en ligne ── */}
      {online && purchasable && (
        <fieldset className="rounded-[1.5rem] border border-line bg-paper p-5 sm:p-7">
          <legend className="sr-only">Personnalisation</legend>
          <div className="flex items-baseline justify-between gap-4">
            <p className="font-display text-2xl">Personnaliser</p>
            <p className="text-xs text-ink-muted">
              {cfg.extraPriceCents > 0 ? `+ ${formatPrice(cfg.extraPriceCents)}` : "Sans supplément"}
              {cfg.extraDelayDays > 0 && ` · +${cfg.extraDelayDays} j. de préparation`}
            </p>
          </div>
          <p className="mt-1 text-sm text-ink-muted">Facultatif. Laissez vide pour recevoir la pièce sans gravure.</p>

          {/* Aperçu */}
          <div
            className={cn(
              "relative mt-5 grid min-h-40 place-items-center overflow-hidden rounded-2xl px-6 py-8 text-center",
              isGlass
                ? "border border-white/60 bg-[linear-gradient(135deg,#e9eee9_0%,#f8faf7_45%,#dfe6e2_100%)] text-[#6d7a74]"
                : "bg-[repeating-linear-gradient(92deg,#b28a62_0px,#a98058_7px,#b8936c_13px,#a37a52_21px)] text-[#4b3520]",
            )}
            aria-live="polite"
          >
            <span className="absolute top-2 left-3 text-[0.6rem] tracking-[0.2em] uppercase opacity-70">Aperçu indicatif</span>
            <div className={cn("flex flex-col items-center gap-2", !isGlass && "[text-shadow:0_1px_0_rgb(255_255_255/0.25)]")}>
              <MotifGlyph motif={motif} />
              <p className="text-[1.9rem] leading-tight whitespace-pre-line" style={fontCss}>
                {text.trim() || <span className="opacity-40">{cfg.textLabel}</span>}
              </p>
              {date && (
                <p className="text-[0.75rem] tracking-[0.4em] uppercase">
                  {new Date(date + "T12:00:00").toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, " · ")}
                </p>
              )}
            </div>
          </div>
          <p className="mt-2 text-[0.72rem] text-ink-muted">
            Aperçu simulé : la taille, la position et le rendu réels dépendent de la pièce et de la matière.
          </p>

          <div className="mt-6 grid gap-5">
            <div>
              <label htmlFor="p-text" className="field-label">{cfg.textLabel}</label>
              {cfg.textLines > 1 ? (
                <textarea id="p-text" rows={2} className="field !min-h-[5.5rem]" value={text} onChange={(e) => setText(e.target.value)} aria-invalid={!!textError} aria-describedby="p-text-hint" />
              ) : (
                <input id="p-text" className="field" value={text} onChange={(e) => setText(e.target.value.replace(/\n/g, ""))} aria-invalid={!!textError} aria-describedby="p-text-hint" />
              )}
              <p id="p-text-hint" className={cn("field-hint flex justify-between gap-3", textError && "!text-danger")}>
                <span>{textError || cfg.constraints || `${cfg.textMaxLength} caractères maximum.`}</span>
                <span className="tabular-nums">{Math.max(...lines.map((l) => [...l].length))}/{cfg.textMaxLength}</span>
              </p>
            </div>

            {(cfg.fonts.length > 1 || cfg.allowDate) && (
              <div className="grid gap-5 sm:grid-cols-2">
                {cfg.fonts.length > 1 && (
                  <div>
                    <label htmlFor="p-font" className="field-label">Police de gravure</label>
                    <select id="p-font" className="field" value={font} onChange={(e) => setFont(e.target.value)}>
                      {cfg.fonts.map((f) => (
                        <option key={f} value={f}>{ENGRAVING_FONTS[f]?.label ?? f}</option>
                      ))}
                    </select>
                  </div>
                )}
                {cfg.allowDate && (
                  <div>
                    <label htmlFor="p-date" className="field-label">Date (facultatif)</label>
                    <input id="p-date" type="date" className="field" value={date} onChange={(e) => setDate(e.target.value)} />
                  </div>
                )}
              </div>
            )}

            {cfg.motifs.length > 0 && (
              <div role="radiogroup" aria-label="Motif">
                <p className="field-label">Motif</p>
                <div className="flex flex-wrap gap-2">
                  {cfg.motifs.map((m) => (
                    <button
                      key={m}
                      type="button"
                      role="radio"
                      aria-checked={motif === m}
                      onClick={() => setMotif(m)}
                      className={cn("rounded-full border px-3.5 py-2 text-sm transition-colors", motif === m ? "border-charcoal bg-charcoal text-ivory" : "border-line-strong hover:border-charcoal")}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {cfg.allowNotes && (
              <div>
                <label htmlFor="p-notes" className="field-label">Instructions particulières (facultatif)</label>
                <textarea id="p-notes" maxLength={400} rows={2} className="field !min-h-[5rem]" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Position souhaitée, orthographe à respecter…" />
              </div>
            )}

            {cfg.allowImage && (
              <div>
                <p className="field-label">Image de référence (facultatif)</p>
                {ref ? (
                  <p className="flex items-center justify-between gap-3 rounded-xl border border-line bg-ivory px-4 py-3 text-sm">
                    <span className="flex min-w-0 items-center gap-2"><Check size={15} className="shrink-0 text-success" aria-hidden /><span className="truncate">{ref.name}</span></span>
                    <button type="button" onClick={() => setRef(null)} className="text-ink-muted hover:text-charcoal" aria-label="Retirer l'image"><X size={16} aria-hidden /></button>
                  </p>
                ) : (
                  <>
                    <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" id="p-file" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
                    <label htmlFor="p-file" className="btn btn-outline btn-sm cursor-pointer">
                      {uploading ? <Loader2 size={15} className="animate-spin" aria-hidden /> : <ImagePlus size={15} aria-hidden />}
                      {uploading ? "Envoi…" : "Ajouter une image"}
                    </label>
                    <p className="field-hint">JPEG, PNG ou WebP, 5 Mo maximum. Prototype : l&apos;image n&apos;est pas envoyée.</p>
                  </>
                )}
                {uploadError && <p className="field-error">{uploadError}</p>}
              </div>
            )}
          </div>
        </fieldset>
      )}

      {cfg.enabled && cfg.mode === "request" && (
        <div className="rounded-[1.5rem] border border-line bg-paper p-6">
          <p className="font-display text-2xl">Personnalisation sur étude</p>
          <p className="mt-2 text-sm text-charcoal-soft">{cfg.constraints || "Cette pièce demande une étude préalable avant gravure."}</p>
          <Link href={`/personnalisation?produit=${product.slug}#demande`} className="btn btn-outline btn-sm mt-5">
            Demander une personnalisation <ArrowUpRight size={15} aria-hidden />
          </Link>
        </div>
      )}

      {/* ── Achat ── */}
      {purchasable ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-[3.1rem] items-center rounded-full border border-line-strong" role="group" aria-label="Quantité">
              <button type="button" className="grid h-full w-11 place-items-center disabled:opacity-30" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Diminuer la quantité">
                <Minus size={15} aria-hidden />
              </button>
              <span className="w-8 text-center tabular-nums" aria-live="polite">{qty}</span>
              <button type="button" className="grid h-full w-11 place-items-center disabled:opacity-30" onClick={() => setQty((q) => Math.min(maxQty, q + 1))} disabled={qty >= maxQty} aria-label="Augmenter la quantité">
                <Plus size={15} aria-hidden />
              </button>
            </div>
            <button type="button" onClick={onAdd} disabled={!!textError || uploading} className="btn btn-primary min-w-0 flex-1 !px-4">
              {added ? <Check size={17} aria-hidden /> : <ShoppingBag size={17} aria-hidden />}
              {added ? (
                "Ajouté"
              ) : (
                <span className="truncate">
                  Ajouter<span className="hidden xs:inline"> au panier</span> — {formatPrice(unit * qty)}
                </span>
              )}
            </button>
          </div>
          {error && <p className="field-error" role="alert">{error}</p>}
          {demo && <p className="text-xs text-ink-muted">Prototype : le panier fonctionne, le paiement n&apos;est pas activé.</p>}
        </div>
      ) : (
        <div className="space-y-3">
          <button type="button" disabled className="btn btn-primary w-full">
            {availability === "coming_soon" ? "Bientôt disponible" : "Rupture de stock"}
          </button>
          <p className="text-sm text-ink-muted">
            Cette pièce n&apos;est pas disponible à la commande pour le moment.{" "}
            <Link href={`/personnalisation?produit=${product.slug}#demande`} className="underline underline-offset-4">
              Nous écrire pour une création similaire
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  );
}

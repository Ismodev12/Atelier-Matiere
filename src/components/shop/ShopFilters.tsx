"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  categories: { slug: string; name: string }[];
  materials: string[];
  current: { q: string; categorie: string; matiere: string; dispo: string; tri: string };
  total: number;
};

export function ShopFilters({ categories, materials, current, total }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();

  const go = (patch: Partial<Props["current"]>) => {
    const next = { ...current, ...patch };
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(next)) if (v) params.set(k, v);
    start(() => router.push(`/boutique${params.size ? `?${params}` : ""}`, { scroll: false }));
  };

  const activeCount = [current.matiere, current.dispo, current.q].filter(Boolean).length;

  const selects = (
    <>
      <label className="block">
        <span className="field-label">Matériau</span>
        <select className="field !min-h-11 !py-2" value={current.matiere} onChange={(e) => go({ matiere: e.target.value })}>
          <option value="">Tous</option>
          {materials.map((m) => (
            <option key={m} value={m.toLowerCase()}>{m}</option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="field-label">Disponibilité</span>
        <select className="field !min-h-11 !py-2" value={current.dispo} onChange={(e) => go({ dispo: e.target.value })}>
          <option value="">Toutes</option>
          <option value="disponible">En stock</option>
          <option value="personnalisable">Personnalisable</option>
        </select>
      </label>
      <label className="block">
        <span className="field-label">Trier par</span>
        <select className="field !min-h-11 !py-2" value={current.tri} onChange={(e) => go({ tri: e.target.value })}>
          <option value="">Sélection de l&apos;atelier</option>
          <option value="nouveautes">Nouveautés</option>
          <option value="prix-croissant">Prix croissant</option>
          <option value="prix-decroissant">Prix décroissant</option>
        </select>
      </label>
    </>
  );

  return (
    <div className={cn("transition-opacity", pending && "opacity-60")} aria-busy={pending}>
      <nav aria-label="Catégories" className="-mx-4 overflow-x-auto px-4 [&::-webkit-scrollbar]:hidden">
        <ul className="flex w-max gap-2">
          {[{ slug: "", name: "Toutes les créations" }, ...categories].map((c) => {
            const active = current.categorie === c.slug;
            return (
              <li key={c.slug || "all"}>
                <button
                  type="button"
                  onClick={() => go({ categorie: c.slug })}
                  aria-pressed={active}
                  className={cn(
                    "rounded-full border px-4 py-2.5 text-[0.82rem] whitespace-nowrap transition-colors duration-300",
                    active ? "border-charcoal bg-charcoal text-ivory" : "border-line-strong hover:border-charcoal",
                  )}
                >
                  {c.name}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-6 grid gap-4 border-y border-line py-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            go({ q: String(new FormData(e.currentTarget).get("q") ?? "").trim() });
          }}
          className="relative max-w-md"
        >
          <label htmlFor="shop-q" className="field-label">Rechercher</label>
          <input id="shop-q" name="q" type="search" defaultValue={current.q} maxLength={80} placeholder="Nom, matière…" className="field !min-h-11 !py-2 pr-12" />
          <button type="submit" className="absolute right-1.5 bottom-1.5 grid h-8 w-8 place-items-center rounded-full bg-charcoal text-ivory" aria-label="Rechercher">
            <Search size={15} aria-hidden />
          </button>
        </form>
        <div className="hidden gap-4 lg:grid lg:grid-cols-3">{selects}</div>
        <details className="group lg:hidden">
          <summary className="btn btn-outline btn-sm w-full cursor-pointer list-none [&::-webkit-details-marker]:hidden">
            <SlidersHorizontal size={15} aria-hidden /> Filtres et tri {activeCount > 0 && `(${activeCount})`}
          </summary>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">{selects}</div>
        </details>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-ink-muted">
        <p aria-live="polite">
          {total} création{total > 1 ? "s" : ""}
          {current.q && <> pour « <span className="text-charcoal">{current.q}</span> »</>}
        </p>
        {(activeCount > 0 || current.categorie) && (
          <Link href="/boutique" scroll={false} className="inline-flex items-center gap-1 underline-offset-4 hover:underline">
            <X size={14} aria-hidden /> Réinitialiser
          </Link>
        )}
      </div>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { RichText } from "./RichText";

export type LegalDocProp = { slug: string; title: string; content: string; updatedAt: string | null };

/**
 * Documents légaux en grande fenêtre modale, ouverte par lien profond « #legal/<slug> ».
 * - fermeture par bouton visible ou Échap (pas par clic extérieur, pour éviter les fermetures accidentelles) ;
 * - focus piégé dans la fenêtre puis restitué à la fermeture.
 */
export function LegalModal({ docs }: { docs: LegalDocProp[] }) {
  const [slug, setSlug] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const sync = useCallback(() => {
    const m = window.location.hash.match(/^#legal\/([\w-]+)$/);
    const found = m && docs.some((d) => d.slug === m[1]) ? m[1] : null;
    if (found && !slug) lastFocus.current = document.activeElement as HTMLElement;
    setSlug(found);
  }, [docs, slug]);

  useEffect(() => {
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [sync]);

  const close = useCallback(() => {
    history.replaceState(null, "", window.location.pathname + window.location.search);
    setSlug(null);
    lastFocus.current?.focus?.();
  }, []);

  useEffect(() => {
    if (!slug) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
      if (e.key === "Tab" && dialogRef.current) {
        const f = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [slug, close]);

  const doc = docs.find((d) => d.slug === slug);
  if (!doc) return null;

  return (
    <div className="anim-fade fixed inset-0 z-[80] flex items-end justify-center bg-charcoal/55 p-0 backdrop-blur-[2px] sm:items-center sm:p-6">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-title"
        className="anim-modal flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-paper shadow-2xl sm:max-h-[86vh] sm:rounded-3xl"
      >
        <header className="flex items-start justify-between gap-6 border-b border-line px-5 py-5 sm:px-10 sm:py-7">
          <div>
            <p className="eyebrow eyebrow-plain">Informations légales</p>
            <h2 id="legal-title" className="mt-2 font-display text-3xl sm:text-4xl">
              {doc.title}
            </h2>
            {doc.updatedAt && (
              <p className="mt-1 text-xs text-ink-muted">
                Mis à jour le {new Date(doc.updatedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            )}
          </div>
          <button
            ref={closeRef}
            onClick={close}
            className="btn btn-outline btn-sm shrink-0 !px-3"
            aria-label="Fermer la fenêtre"
          >
            <X size={18} aria-hidden />
            <span className="hidden sm:inline">Fermer</span>
          </button>
        </header>
        <div className="overflow-y-auto overscroll-contain px-5 pt-2 pb-[calc(2rem+env(safe-area-inset-bottom))] sm:px-10 sm:pb-10" tabIndex={0}>
          <RichText text={doc.content} />
        </div>
      </div>
    </div>
  );
}

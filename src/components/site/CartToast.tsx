"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect } from "react";
import { Check, X } from "lucide-react";
import { useCart } from "./CartProvider";

export function CartToast() {
  const { toast, dismissToast } = useCart();
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(dismissToast, 5000);
    return () => clearTimeout(t);
  }, [toast, dismissToast]);
  if (!toast) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="anim-modal fixed inset-x-3 top-24 z-[65] mx-auto flex max-w-sm items-center gap-4 rounded-2xl border border-line bg-paper p-3 pr-4 shadow-[0_20px_50px_-20px_rgb(36_36_31/0.45)] lg:top-28 lg:right-6 lg:left-auto lg:mx-0"
    >
      {toast.image && <img src={toast.image} alt="" className="h-16 w-14 rounded-lg object-cover" />}
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 text-xs tracking-wider text-sage uppercase">
          <Check size={14} aria-hidden /> Ajouté au panier
        </p>
        <p className="truncate font-display text-lg">{toast.name}</p>
        <Link href="/panier" className="link-u text-sm" onClick={dismissToast}>
          Voir le panier
        </Link>
      </div>
      <button onClick={dismissToast} aria-label="Fermer" className="self-start p-1 text-ink-muted hover:text-charcoal">
        <X size={16} aria-hidden />
      </button>
    </div>
  );
}

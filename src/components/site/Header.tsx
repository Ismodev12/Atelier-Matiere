"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Search, ShoppingBag, X } from "lucide-react";
import { Logo } from "./Logo";
import { useCart } from "./CartProvider";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Accueil" },
  { href: "/boutique", label: "Boutique" },
  { href: "/personnalisation", label: "Personnalisation" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

type Props = {
  brandName: string;
  logoUrl: string;
  announcement: { enabled: boolean; text: string; link: string };
};

export function Header({ brandName, logoUrl, announcement }: Props) {
  const pathname = usePathname();
  const { count, ready } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setSearchOpen(false), [pathname]);

  return (
    <>
      {announcement.enabled && announcement.text && (
        <div className="bg-charcoal text-ivory">
          <div className="container-x flex min-h-9 items-center justify-center py-2 text-center text-[0.72rem] tracking-[0.08em]">
            {announcement.link ? (
              <Link href={announcement.link} className="inline-flex items-center gap-1.5 hover:text-wood-light">
                {announcement.text} <ArrowUpRight size={13} aria-hidden />
              </Link>
            ) : (
              <span>{announcement.text}</span>
            )}
          </div>
        </div>
      )}
      <header
        className={cn(
          "sticky top-0 z-50 transition-[background-color,box-shadow,border-color] duration-500",
          scrolled ? "border-b border-line bg-ivory/85 backdrop-blur-md" : "border-b border-transparent bg-ivory",
        )}
      >
        <div className="container-x flex h-[4.5rem] items-center justify-between gap-6 lg:h-20">
          <Link href="/" aria-label={`${brandName} — accueil`} className="shrink-0">
            <Logo name={brandName} logoUrl={logoUrl} />
          </Link>

          <nav aria-label="Navigation principale" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {NAV.map((item) => {
                const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative py-2 text-[0.82rem] tracking-[0.06em] transition-colors hover:text-wood",
                        active && "text-charcoal after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-wood",
                        !active && "text-charcoal-soft",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="grid h-11 w-11 place-items-center rounded-full transition-colors hover:bg-ivory-deep"
              aria-label="Rechercher"
            >
              <Search size={19} strokeWidth={1.6} aria-hidden />
            </button>
            <Link
              href="/panier"
              className="relative grid h-11 w-11 place-items-center rounded-full transition-colors hover:bg-ivory-deep"
              aria-label={`Panier, ${count} article${count > 1 ? "s" : ""}`}
            >
              <ShoppingBag size={19} strokeWidth={1.6} aria-hidden />
              {ready && count > 0 && (
                <span className="absolute top-1 right-0.5 grid h-[1.15rem] min-w-[1.15rem] place-items-center rounded-full bg-wood px-1 text-[0.62rem] font-semibold text-ivory">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  );
}

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);
  return (
    <div className="anim-fade fixed inset-0 z-[70] bg-ivory/97 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Recherche">
      <div className="container-x flex h-full flex-col pt-6">
        <div className="flex justify-end">
          <button onClick={onClose} className="btn btn-outline btn-sm !px-3" aria-label="Fermer la recherche">
            <X size={18} aria-hidden /> Fermer
          </button>
        </div>
        <form action="/boutique" className="anim-modal mx-auto mt-[12vh] w-full max-w-3xl">
          <label htmlFor="q" className="eyebrow">
            Rechercher une création
          </label>
          <div className="mt-6 flex items-end gap-4 border-b border-charcoal pb-3">
            <input
              ref={inputRef}
              id="q"
              name="q"
              type="search"
              maxLength={80}
              placeholder="Coffret, verre gravé, planche…"
              className="w-full bg-transparent font-display text-4xl placeholder:text-ink-muted/50 focus:outline-none sm:text-6xl"
            />
            <button type="submit" className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-charcoal text-ivory" aria-label="Lancer la recherche">
              <Search size={20} aria-hidden />
            </button>
          </div>
          <div className="mt-8 flex flex-wrap gap-2 text-sm">
            {["Bois", "Verre", "Coffret", "Verres gravés", "Planche"].map((s) => (
              <Link key={s} href={`/boutique?q=${encodeURIComponent(s)}`} className="chip !text-[0.72rem] hover:border-charcoal">
                {s}
              </Link>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
}

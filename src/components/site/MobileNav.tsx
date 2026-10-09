"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, PenLine, ShoppingBag, Store } from "lucide-react";
import { useCart } from "./CartProvider";
import { cn } from "@/lib/utils";

/** Barre de navigation flottante (mobile & tablette), respectant la zone de sécurité inférieure. */
export function MobileNav() {
  const pathname = usePathname();
  const { count, ready } = useCart();
  const items = [
    { href: "/", label: "Accueil", icon: House, active: pathname === "/" },
    { href: "/boutique", label: "Boutique", icon: Store, active: pathname.startsWith("/boutique") },
    { href: "/personnalisation", label: "Personnaliser", icon: PenLine, active: pathname.startsWith("/personnalisation") },
    { href: "/panier", label: "Panier", icon: ShoppingBag, active: pathname.startsWith("/panier") || pathname.startsWith("/commande"), badge: ready ? count : 0 },
  ];
  return (
    <nav
      aria-label="Navigation rapide"
      className="fixed inset-x-0 z-50 flex justify-center px-3 lg:hidden"
      style={{ bottom: "calc(0.85rem + env(safe-area-inset-bottom))" }}
    >
      <ul className="flex w-full max-w-md items-stretch justify-between rounded-full border border-white/10 bg-charcoal/95 p-1.5 text-ivory shadow-[0_18px_40px_-14px_rgb(36_36_31/0.6)] backdrop-blur-md">
        {items.map(({ href, label, icon: Icon, active, badge }) => (
          <li key={href} className="flex-1">
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex h-[3.4rem] flex-col items-center justify-center gap-0.5 rounded-full text-[0.64rem] tracking-[0.04em] transition-colors duration-300",
                active ? "bg-ivory text-charcoal" : "text-ivory/80 hover:text-ivory",
              )}
            >
              <span className="relative">
                <Icon size={19} strokeWidth={1.6} aria-hidden />
                {!!badge && (
                  <span className="absolute -top-1.5 -right-2.5 grid h-4 min-w-4 place-items-center rounded-full bg-wood px-1 text-[0.58rem] font-semibold text-ivory">
                    {badge}
                  </span>
                )}
              </span>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

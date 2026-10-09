import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatPrice } from "@/lib/money";
import type { Availability, Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export const AVAILABILITY_LABEL: Record<Availability, string> = {
  available: "Disponible",
  coming_soon: "Bientôt disponible",
  out_of_stock: "Rupture de stock",
  on_request: "Sur demande",
};

export function AvailabilityDot({ availability, stock, showStock, threshold }: { availability: Availability; stock?: number; showStock?: boolean; threshold?: number }) {
  const color =
    availability === "available" ? "bg-sage" : availability === "coming_soon" ? "bg-wood" : "bg-danger";
  const low = availability === "available" && stock !== undefined && threshold !== undefined && stock <= threshold;
  return (
    <span className="inline-flex items-center gap-2 text-[0.78rem] text-charcoal-soft">
      <span className={cn("h-1.5 w-1.5 rounded-full", color)} aria-hidden />
      {availability === "available" && showStock && stock !== undefined
        ? `${stock} en stock`
        : low
          ? "Plus que quelques pièces"
          : AVAILABILITY_LABEL[availability]}
    </span>
  );
}

export function ProductCard({
  product,
  availability,
  priority = false,
  size = "default",
  index,
}: {
  product: Product;
  availability: Availability;
  priority?: boolean;
  size?: "default" | "large";
  index?: number;
}) {
  const image = product.images[0];
  const p = product.personalization;
  return (
    <article className="group relative flex h-full flex-col">
      <Link href={`/boutique/${product.slug}`} className="flex h-full flex-col" aria-label={`${product.name}, ${formatPrice(product.priceCents)}`}>
        <div
          className={cn(
            "img-zoom relative overflow-hidden rounded-[1.25rem] bg-ivory-deep",
            size === "large" ? "aspect-[4/5] lg:aspect-[5/6]" : "aspect-[4/5]",
          )}
        >
          {image && (
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority={priority}
              sizes={size === "large" ? "(min-width:1024px) 45vw, 100vw" : "(min-width:1024px) 30vw, (min-width:640px) 50vw, 100vw"}
              className={cn("object-cover", availability === "out_of_stock" && "grayscale-[35%]")}
            />
          )}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {p.enabled && <span className="chip">{p.mode === "request" ? "Gravure sur demande" : "Personnalisable"}</span>}
            {availability === "out_of_stock" && <span className="chip !bg-charcoal !text-ivory !border-charcoal">Rupture</span>}
            {availability === "coming_soon" && <span className="chip !bg-wood !text-ivory !border-wood">Bientôt</span>}
          </div>
          {index !== undefined && (
            <span className="absolute right-4 bottom-3 font-display text-sm text-ivory/90 italic drop-shadow">
              N° {String(index + 1).padStart(2, "0")}
            </span>
          )}
          <span className="absolute right-3 top-3 grid h-10 w-10 translate-y-1 place-items-center rounded-full bg-ivory/90 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight size={17} aria-hidden />
          </span>
        </div>
        <div className="flex flex-1 flex-col pt-5">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className={cn("font-display leading-tight", size === "large" ? "text-[1.9rem]" : "text-[1.55rem]")}>{product.name}</h3>
            <p className="shrink-0 text-[0.95rem] font-medium tabular-nums">{formatPrice(product.priceCents)}</p>
          </div>
          <p className="mt-1.5 line-clamp-2 text-sm text-ink-muted">{product.shortDescription}</p>
          <div className="mt-auto flex items-center justify-between pt-4">
            <AvailabilityDot availability={availability} stock={product.stock} showStock={product.showStock} threshold={product.lowStockThreshold} />
            <span className="text-[0.72rem] tracking-[0.14em] text-charcoal uppercase underline-offset-4 group-hover:underline">Voir la pièce</span>
          </div>
        </div>
      </Link>
    </article>
  );
}

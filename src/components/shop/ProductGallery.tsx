"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductImage } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, name }: { images: ProductImage[]; name: string }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];
  if (!current) return null;
  return (
    <div className="lg:sticky lg:top-28">
      <div className="img-zoom relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-ivory-deep">
        <Image key={current.src} src={current.src} alt={current.alt || name} fill priority sizes="(min-width:1024px) 55vw, 100vw" className="anim-fade object-cover" />
        {(current.src.includes("images.unsplash.com") || current.src.startsWith("/assets/images/")) && (
        <p className="absolute bottom-4 left-4 rounded-full bg-ivory/85 px-3 py-1 text-[0.62rem] tracking-[0.16em] text-charcoal-soft uppercase backdrop-blur">
          Photo d&apos;illustration
        </p>
        )}
      </div>
      {images.length > 1 && (
        <ul className="mt-4 flex gap-3" aria-label="Autres vues">
          {images.map((img, i) => (
            <li key={img.src + i}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Afficher la vue ${i + 1}`}
                aria-current={i === active}
                className={cn("relative block h-24 w-20 overflow-hidden rounded-xl border-2 transition-all", i === active ? "border-charcoal" : "border-transparent opacity-70 hover:opacity-100")}
              >
                <Image src={img.src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

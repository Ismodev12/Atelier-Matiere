"use client";

import { useEffect, useState, useTransition } from "react";
import { validateCart } from "@/actions/public";
import type { PricedCart } from "@/lib/commerce/pricing";
import { useCart } from "@/components/site/CartProvider";

/** Revalide le panier côté serveur (prix, stock, personnalisation) à chaque modification. */
export function useValidatedCart() {
  const cart = useCart();
  const [priced, setPriced] = useState<PricedCart | null>(null);
  const [invalid, setInvalid] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const signature = JSON.stringify(cart.lines.map((l) => [l.productId, l.quantity, l.personalization]));
  useEffect(() => {
    if (!cart.ready) return;
    if (!cart.lines.length) {
      setPriced(null);
      setInvalid(null);
      return;
    }
    start(async () => {
      const res = await validateCart(
        cart.lines.map((l) => ({ productId: l.productId, quantity: l.quantity, personalization: l.personalization })),
      );
      if ("invalid" in res) {
        setInvalid(res.invalid);
        setPriced(null);
      } else {
        setInvalid(null);
        setPriced(res);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature, cart.ready]);

  return { ...cart, priced, invalid, pending };
}

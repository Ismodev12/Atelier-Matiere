"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { CartLine, PersonalizationChoice } from "@/lib/types";

const KEY = "am_cart_v1";

type Toast = { name: string; image: string } | null;

type CartCtx = {
  lines: CartLine[];
  count: number;
  ready: boolean;
  add: (line: Omit<CartLine, "key">) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  toast: Toast;
  dismissToast: () => void;
};

const Ctx = createContext<CartCtx | null>(null);

function lineKey(productId: string, p: PersonalizationChoice | null) {
  return `${productId}::${p ? JSON.stringify(p) : ""}`;
}

function read(): CartLine[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.slice(0, 30) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState<Toast>(null);

  useEffect(() => {
    setLines(read());
    setReady(true);
    const onStorage = (e: StorageEvent) => e.key === KEY && setLines(read());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const persist = useCallback((next: CartLine[]) => {
    setLines(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* stockage indisponible : le panier reste en mémoire */
    }
  }, []);

  const add: CartCtx["add"] = useCallback(
    (line) => {
      const key = lineKey(line.productId, line.personalization);
      const stored = read();
      const current = stored.length ? stored : lines;
      const existing = current.find((l) => l.key === key);
      const next = existing
        ? current.map((l) => (l.key === key ? { ...l, quantity: Math.min(20, l.quantity + line.quantity) } : l))
        : [...current, { ...line, key }];
      persist(next);
      setToast({ name: line.name, image: line.image });
    },
    [lines, persist],
  );

  const value = useMemo<CartCtx>(
    () => ({
      lines,
      ready,
      count: lines.reduce((s, l) => s + l.quantity, 0),
      add,
      setQuantity: (key, q) => persist(lines.map((l) => (l.key === key ? { ...l, quantity: Math.max(1, Math.min(20, q)) } : l))),
      remove: (key) => persist(lines.filter((l) => l.key !== key)),
      clear: () => persist([]),
      toast,
      dismissToast: () => setToast(null),
    }),
    [lines, ready, add, persist, toast],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart doit être utilisé dans <CartProvider>");
  return c;
}

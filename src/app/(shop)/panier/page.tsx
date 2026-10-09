import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = { title: "Panier", robots: { index: false } };

export default function CartPage() {
  return (
    <div className="container-x pt-10 pb-24 lg:pt-16 lg:pb-36">
      <p className="eyebrow">Votre sélection</p>
      <h1 className="display-lg mt-5 mb-10 lg:mb-14">Panier</h1>
      <CartView demo />
    </div>
  );
}

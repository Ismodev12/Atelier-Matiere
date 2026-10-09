import type { Metadata } from "next";
import { CheckoutForm } from "@/components/cart/CheckoutForm";
import { getSettings } from "@/lib/repo/settings";

export const metadata: Metadata = { title: "Commande", robots: { index: false } };

export default async function CheckoutPage() {
  const settings = await getSettings();
  return (
    <div className="container-x pt-10 pb-24 lg:pt-16 lg:pb-36">
      <p className="eyebrow">Finaliser</p>
      <h1 className="display-lg mt-5 mb-6">Commande</h1>
      <p className="mb-10 max-w-2xl rounded-xl border border-wood/30 bg-wood/10 px-4 py-3 text-sm lg:mb-14">
        Prototype : le parcours est complet, mais le paiement en ligne n&apos;est pas encore branché. Aucun montant ne sera débité.
      </p>
      <CheckoutForm countries={settings.shipping.countries} blockedReason={null} />
    </div>
  );
}

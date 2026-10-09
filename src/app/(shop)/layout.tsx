import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { MobileNav } from "@/components/site/MobileNav";
import { CartProvider } from "@/components/site/CartProvider";
import { CartToast } from "@/components/site/CartToast";
import { LegalModal } from "@/components/site/LegalModal";
import { DemoRibbon } from "@/components/site/DemoRibbon";
import { getContent, getLegalDocs, getSettings } from "@/lib/repo/settings";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const [settings, content, legal] = await Promise.all([getSettings(), getContent(), getLegalDocs()]);
  return (
    <CartProvider>
      <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[90] focus:rounded-full focus:bg-charcoal focus:px-4 focus:py-2 focus:text-ivory">
        Aller au contenu
      </a>
      <DemoRibbon />
      <Header brandName={settings.brandName} logoUrl={settings.logoUrl} announcement={settings.announcement} />
      <main id="contenu" className="min-h-[60vh]">
        {children}
      </main>
      <Footer settings={settings} content={content} paymentsLive={false} legalTitles={legal.map(({ slug, title }) => ({ slug, title }))} />
      <MobileNav />
      <CartToast />
      <LegalModal docs={legal.map((d) => ({ ...d, updatedAt: d.updatedAt ? d.updatedAt.toISOString() : null }))} />
    </CartProvider>
  );
}

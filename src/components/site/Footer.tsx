import Link from "next/link";
import { Logo } from "./Logo";
import { SocialIcon, SOCIAL_LABELS } from "./SocialIcons";
import type { SiteContent, SiteSettings, SocialKey } from "@/lib/types";
import { safeHref } from "@/lib/utils";

export function Footer({
  settings,
  content,
  paymentsLive,
  legalTitles,
}: {
  settings: SiteSettings;
  content: SiteContent;
  paymentsLive: boolean;
  legalTitles: { slug: string; title: string }[];
}) {
  const socials = (Object.keys(settings.socials) as SocialKey[]).filter(
    (k) => settings.socials[k].enabled && settings.socials[k].url,
  );
  return (
    <footer className="paper-grain relative overflow-hidden bg-charcoal text-ivory">
      <div className="container-x relative pt-20 pb-10 lg:pt-28">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo name={settings.brandName} logoUrl={settings.logoUrl} light />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-ivory/70">{content.footer.presentation}</p>
            {socials.length > 0 && (
              <ul className="mt-8 flex gap-2" aria-label="Réseaux sociaux">
                {socials.map((k) => (
                  <li key={k}>
                    <a
                      href={safeHref(settings.socials[k].url, "#")}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${SOCIAL_LABELS[k]} (nouvelle fenêtre)`}
                      className="grid h-11 w-11 place-items-center rounded-full border border-ivory/20 text-ivory/80 transition-colors hover:border-ivory hover:text-ivory"
                    >
                      <SocialIcon name={k} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <nav aria-label="Pied de page" className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
            <div>
              <p className="text-[0.68rem] tracking-[0.22em] text-wood-light uppercase">Explorer</p>
              <ul className="mt-5 space-y-3 text-sm text-ivory/80">
                <li><Link className="hover:text-ivory" href="/boutique">Boutique</Link></li>
                <li><Link className="hover:text-ivory" href="/personnalisation">Personnalisation</Link></li>
                <li><Link className="hover:text-ivory" href="/a-propos">À propos</Link></li>
                <li><Link className="hover:text-ivory" href="/contact">Contact</Link></li>
                <li><Link className="hover:text-ivory" href="/avis">Laisser un avis</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-[0.68rem] tracking-[0.22em] text-wood-light uppercase">Contact</p>
              <ul className="mt-5 space-y-3 text-sm text-ivory/80">
                {settings.contactEmail && (
                  <li><a className="break-all hover:text-ivory" href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a></li>
                )}
                {settings.contactPhone && (
                  <li><a className="hover:text-ivory" href={`tel:${settings.contactPhone.replace(/\s/g, "")}`}>{settings.contactPhone}</a></li>
                )}
                {settings.address && <li className="text-ivory/60">{settings.address}</li>}
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-[0.68rem] tracking-[0.22em] text-wood-light uppercase">Informations</p>
              <ul className="mt-5 space-y-3 text-sm text-ivory/80">
                {legalTitles.map((d) => (
                  <li key={d.slug}>
                    <a className="hover:text-ivory" href={`#legal/${d.slug}`}>{d.title}</a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <p aria-hidden className="pointer-events-none mt-20 font-display text-[18vw] leading-[0.8] font-light tracking-tight text-ivory/[0.06] select-none lg:text-[11rem]">
          {settings.brandName}
        </p>

        <div className="mt-6 flex flex-col gap-4 border-t border-ivory/15 pt-6 text-xs text-ivory/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {settings.brandName}. Tous droits réservés.</p>
          {paymentsLive ? (
            <p className="flex flex-wrap items-center gap-2">
              Paiement sécurisé via Stripe
              {["Carte bancaire", "Apple Pay", "Google Pay"].map((m) => (
                <span key={m} className="rounded border border-ivory/20 px-2 py-0.5 text-[0.65rem] tracking-wider text-ivory/75">{m}</span>
              ))}
            </p>
          ) : (
            <p>Paiement en ligne : à venir (Stripe — carte, Apple Pay, Google Pay)</p>
          )}
        </div>
        <div className="pb-mobile-nav" />
      </div>
    </footer>
  );
}

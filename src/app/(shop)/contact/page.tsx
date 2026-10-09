import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";
import { getSettings } from "@/lib/repo/settings";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const s = await getSettings();
  return (
    <div className="container-x grid gap-12 pt-10 pb-24 lg:grid-cols-12 lg:pt-16 lg:pb-36">
      <div className="lg:col-span-5">
        <p className="eyebrow anim-hero">Contact</p>
        <h1 className="display-xl anim-hero mt-6 [animation-delay:80ms]">Écrivez&#8209;nous</h1>
        <p className="anim-hero mt-8 max-w-md text-[1.05rem] text-charcoal-soft [animation-delay:160ms]">
          Une question sur une pièce, une commande ou un délai ? Nous répondons par e-mail. Pour un projet de gravure, préférez le formulaire sur mesure.
        </p>
        <ul className="mt-10 space-y-4 border-t border-line pt-8 text-sm">
          {s.contactEmail && (
            <li className="flex items-center gap-3"><Mail size={17} className="text-wood" aria-hidden /><a href={`mailto:${s.contactEmail}`} className="break-all hover:underline">{s.contactEmail}</a></li>
          )}
          {s.contactPhone && (
            <li className="flex items-center gap-3"><Phone size={17} className="text-wood" aria-hidden /><a href={`tel:${s.contactPhone.replace(/\s/g, "")}`}>{s.contactPhone}</a></li>
          )}
          {s.address && (
            <li className="flex items-center gap-3"><MapPin size={17} className="text-wood" aria-hidden />{s.address}</li>
          )}
        </ul>
        <Link href="/personnalisation#demande" className="btn btn-outline mt-10">
          Demande sur mesure <ArrowUpRight size={16} aria-hidden />
        </Link>
      </div>
      <div className="lg:col-span-7">
        <ContactForm />
      </div>
    </div>
  );
}

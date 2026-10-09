import type { Metadata, Viewport } from "next";
import "@fontsource-variable/dm-sans";
import "@fontsource/cormorant-garamond/300.css";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/300-italic.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "./globals.css";
import { getSettings } from "@/lib/repo/settings";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return {
    metadataBase: new URL(base),
    title: { default: `${s.brandName} — Créations en bois et en verre gravées`, template: `%s · ${s.brandName}` },
    description: s.tagline,
    openGraph: { siteName: s.brandName, locale: "fr_FR", type: "website" },
  };
}

export const viewport: Viewport = {
  themeColor: "#F7F4ED",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}

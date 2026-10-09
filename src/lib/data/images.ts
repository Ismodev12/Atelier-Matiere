import manifest from "./image-manifest.json";

type Entry = { path: string; unsplash: string; alt: string };
const images = manifest.images as Record<string, Entry>;

const useLocal = process.env.NEXT_PUBLIC_LOCAL_IMAGES === "true";

/** Construit l'URL d'un visuel du registre (local après `npm run images:download`, sinon Unsplash). */
export function imageSrc(key: string, width = 1800): string {
  const e = images[key];
  if (!e) throw new Error(`Visuel inconnu : ${key}`);
  return useLocal
    ? `/assets/images/${e.path}`
    : `https://images.unsplash.com/photo-${e.unsplash}?auto=format&fit=crop&w=${width}&q=80`;
}

export function imageAlt(key: string): string {
  return images[key]?.alt ?? "";
}

export function img(key: string, width?: number) {
  return { src: imageSrc(key, width), alt: imageAlt(key) };
}

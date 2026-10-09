#!/usr/bin/env node
/**
 * Télécharge les visuels de démonstration (Unsplash) dans public/assets/images/…
 * Usage : npm run images:download   (puis NEXT_PUBLIC_LOCAL_IMAGES=true dans .env)
 *
 * Licence : https://unsplash.com/license — usage commercial autorisé, sans redistribution
 * des photos en tant que banque d'images. Pensez à remplacer ces visuels illustratifs
 * par les photographies réelles des produits.
 */
import { mkdir, writeFile, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import manifest from "../src/lib/data/image-manifest.json" with { type: "json" };

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const force = process.argv.includes("--force");
const entries = Object.entries(manifest.images);
let ok = 0;
let skipped = 0;
let failed = 0;

for (const [key, img] of entries) {
  const target = join(root, "public", "assets", "images", img.path);
  if (!force) {
    try {
      await access(target);
      skipped++;
      continue;
    } catch {
      /* absent : on télécharge */
    }
  }
  const url = `https://images.unsplash.com/photo-${img.unsplash}?auto=format&fit=crop&w=2200&q=82&fm=jpg`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const type = res.headers.get("content-type") ?? "";
    if (!type.startsWith("image/")) throw new Error(`type inattendu ${type}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, buf);
    ok++;
    console.log(`✓ ${key.padEnd(28)} → ${img.path} (${Math.round(buf.length / 1024)} Ko)`);
  } catch (e) {
    failed++;
    console.error(`✗ ${key} : ${e.message}`);
  }
}

console.log(`\n${ok} téléchargée(s), ${skipped} déjà présente(s), ${failed} échec(s).`);
if (ok + skipped === entries.length) {
  console.log("Ajoutez NEXT_PUBLIC_LOCAL_IMAGES=true dans .env pour servir les fichiers locaux.");
}
process.exit(failed ? 1 : 0);

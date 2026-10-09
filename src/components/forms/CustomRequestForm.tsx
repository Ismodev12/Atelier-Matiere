"use client";

import { useState } from "react";
import { ImagePlus } from "lucide-react";
import { submitCustomRequest } from "@/actions/public";
import { Field, FormMessage, PendingContext, SpamGuard, SubmitButton, useFormAction } from "./FormBits";
import type { FormState } from "@/lib/validation";

export function CustomRequestForm({ defaultObject = "" }: { defaultObject?: string }) {
  const { state, pending, onSubmit } = useFormAction<FormState>(submitCustomRequest, {});
  const [fileName, setFileName] = useState("");
  const e = state.errors ?? {};

  if (state.ok && !state.demo)
    return (
      <div className="rounded-[1.75rem] border border-line bg-paper p-8 sm:p-12">
        <p className="eyebrow">Demande envoyée</p>
        <p className="mt-4 font-display text-4xl">Merci, nous avons bien reçu votre projet.</p>
        <div className="mt-6"><FormMessage state={state} /></div>
      </div>
    );

  return (
    <PendingContext.Provider value={pending}>
    <form onSubmit={onSubmit} className="relative grid gap-6 rounded-[1.75rem] border border-line bg-paper p-6 sm:grid-cols-2 sm:p-10" noValidate>
      <SpamGuard />
      <Field label="Nom" name="name" error={e.name} required>
        <input id="name" name="name" autoComplete="name" maxLength={120} className="field" aria-invalid={!!e.name} />
      </Field>
      <Field label="Adresse e-mail" name="email" error={e.email} required>
        <input id="email" name="email" type="email" autoComplete="email" maxLength={200} className="field" aria-invalid={!!e.email} />
      </Field>
      <Field label="Type d'objet souhaité" name="objectType" error={e.objectType} required>
        <input id="objectType" name="objectType" maxLength={120} defaultValue={defaultObject} placeholder="Coffret, verres, plaque, trophée…" className="field" aria-invalid={!!e.objectType} />
      </Field>
      <Field label="Matériau envisagé" name="material" error={e.material} required>
        <select id="material" name="material" className="field" defaultValue="" aria-invalid={!!e.material}>
          <option value="" disabled>Choisir…</option>
          <option value="bois">Bois</option>
          <option value="verre">Verre</option>
          <option value="bois-et-verre">Bois et verre</option>
          <option value="a-definir">À définir ensemble</option>
        </select>
      </Field>
      <Field label="Description du projet" name="description" error={e.description} required className="sm:col-span-2" hint="Occasion, dimensions approximatives, style, contraintes…">
        <textarea id="description" name="description" maxLength={3000} className="field !min-h-40" aria-invalid={!!e.description} />
      </Field>
      <Field label="Texte ou motif souhaité" name="engravingText" error={e.engravingText} className="sm:col-span-2" hint="Facultatif. Indiquez l'orthographe exacte.">
        <input id="engravingText" name="engravingText" maxLength={300} className="field" />
      </Field>
      <Field label="Quantité estimée" name="quantity" error={e.quantity} required>
        <input id="quantity" name="quantity" type="number" min={1} max={10000} defaultValue={1} inputMode="numeric" className="field" aria-invalid={!!e.quantity} />
      </Field>
      <Field label="Budget indicatif" name="budget" error={e.budget} hint="Facultatif">
        <select id="budget" name="budget" className="field" defaultValue="">
          <option value="">Je ne sais pas encore</option>
          <option value="< 50 €">Moins de 50 €</option>
          <option value="50 – 150 €">50 – 150 €</option>
          <option value="150 – 400 €">150 – 400 €</option>
          <option value="> 400 €">Plus de 400 €</option>
        </select>
      </Field>
      <Field label="Date souhaitée" name="desiredDate" error={e.desiredDate} hint="Facultatif">
        <input id="desiredDate" name="desiredDate" type="date" className="field" />
      </Field>
      <Field label="Image de référence" name="reference" error={e.reference} hint="Facultatif — JPEG, PNG, WebP, 5 Mo max.">
        <label htmlFor="reference" className="field flex cursor-pointer items-center gap-3 text-ink-muted">
          <ImagePlus size={18} aria-hidden />
          <span className="truncate">{fileName || "Choisir une image"}</span>
        </label>
        <input id="reference" name="reference" type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="sr-only" onChange={(ev) => setFileName(ev.target.files?.[0]?.name ?? "")} />
      </Field>

      <div className="sm:col-span-2">
        <label className="flex items-start gap-3 text-sm text-charcoal-soft">
          <input type="checkbox" name="consent" className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-wood)]" aria-invalid={!!e.consent} />
          <span>
            J&apos;accepte que les informations saisies soient utilisées pour étudier ma demande et me recontacter. Voir la{" "}
            <a href="#legal/confidentialite" className="underline underline-offset-2">politique de confidentialité</a>.
          </span>
        </label>
        {e.consent && <p className="field-error">{e.consent}</p>}
      </div>

      <div className="space-y-4 sm:col-span-2">
        <FormMessage state={state} />
        <SubmitButton className="w-full sm:w-auto">Envoyer ma demande</SubmitButton>
        <p className="text-xs text-ink-muted">Les champs marqués * sont obligatoires. Aucune demande n&apos;engage à une commande.</p>
      </div>
    </form>
    </PendingContext.Provider>
  );
}

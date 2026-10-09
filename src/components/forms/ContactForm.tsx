"use client";

import { submitContact } from "@/actions/public";
import { Field, FormMessage, PendingContext, SpamGuard, SubmitButton, useFormAction } from "./FormBits";
import type { FormState } from "@/lib/validation";

export function ContactForm() {
  const { state, pending, onSubmit } = useFormAction<FormState>(submitContact, {});
  const e = state.errors ?? {};
  if (state.ok && !state.demo)
    return (
      <div className="rounded-[1.75rem] border border-line bg-paper p-8">
        <FormMessage state={state} />
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
      <Field label="Objet" name="subject" error={e.subject} required className="sm:col-span-2">
        <input id="subject" name="subject" maxLength={150} className="field" aria-invalid={!!e.subject} />
      </Field>
      <Field label="Message" name="message" error={e.message} required className="sm:col-span-2">
        <textarea id="message" name="message" maxLength={3000} className="field !min-h-40" aria-invalid={!!e.message} />
      </Field>
      <div className="sm:col-span-2">
        <label className="flex items-start gap-3 text-sm text-charcoal-soft">
          <input type="checkbox" name="consent" className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-wood)]" />
          <span>
            J&apos;accepte que mes informations soient utilisées pour répondre à mon message (
            <a href="#legal/confidentialite" className="underline underline-offset-2">politique de confidentialité</a>).
          </span>
        </label>
        {e.consent && <p className="field-error">{e.consent}</p>}
      </div>
      <div className="space-y-4 sm:col-span-2">
        <FormMessage state={state} />
        <SubmitButton>Envoyer le message</SubmitButton>
      </div>
    </form>
    </PendingContext.Provider>
  );
}

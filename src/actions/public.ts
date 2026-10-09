"use server";

/**
 * Actions serveur — VERSION FRONTEND / PROTOTYPE.
 * Les formulaires sont validés côté serveur, mais rien n'est enregistré ni envoyé :
 * aucune base de données, aucun e-mail, aucun paiement. Un message l'indique clairement.
 * Pour brancher un vrai envoi (e-mail, CRM, base…), c'est ici qu'il faut intervenir.
 */
import { priceCart, type PricedCart } from "@/lib/commerce/pricing";
import {
  checkoutSchema,
  contactSchema,
  customRequestSchema,
  reviewSchema,
  zodErrors,
  type FormState,
} from "@/lib/validation";

const DEMO_MSG =
  "Prototype : votre saisie est valide, mais le formulaire n'est pas encore relié à un envoi. Aucune donnée n'a été transmise.";

function entries(form: FormData) {
  return Object.fromEntries([...form.entries()].filter(([, v]) => typeof v === "string"));
}

function check<T>(schema: { safeParse: (v: unknown) => { success: true; data: T } | { success: false; error: import("zod").ZodError } }, form: FormData): FormState {
  const parsed = schema.safeParse(entries(form));
  if (!parsed.success) return { ok: false, errors: zodErrors(parsed.error), message: "Merci de vérifier les champs indiqués." };
  return { ok: true, demo: true, message: DEMO_MSG };
}

export async function submitCustomRequest(_prev: FormState, form: FormData): Promise<FormState> {
  const file = form.get("reference");
  if (file instanceof File && file.size > 5 * 1024 * 1024) return { ok: false, errors: { reference: "Image trop lourde (5 Mo maximum)." } };
  return check(customRequestSchema, form);
}

export async function submitContact(_prev: FormState, form: FormData): Promise<FormState> {
  return check(contactSchema, form);
}

export async function submitReview(_prev: FormState, form: FormData): Promise<FormState> {
  return check(reviewSchema, form);
}

export async function validateCart(lines: unknown): Promise<PricedCart | { invalid: string }> {
  return priceCart(lines);
}

export type CheckoutState = FormState & { cartErrors?: string[] };

export async function checkoutAction(_prev: CheckoutState, form: FormData): Promise<CheckoutState> {
  const parsed = checkoutSchema.safeParse(entries(form));
  if (!parsed.success) return { ok: false, errors: zodErrors(parsed.error), message: "Merci de vérifier les champs indiqués." };
  return { ok: false, demo: true, message: "Prototype : le paiement en ligne n'est pas activé. Aucune commande n'a été créée ni débitée." };
}

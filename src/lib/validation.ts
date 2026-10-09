import { z } from "zod";

const trimmed = (max: number) => z.string().trim().max(max);
const optionalTrimmed = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : undefined));

export const emailSchema = z.string().trim().toLowerCase().email("Adresse e-mail invalide.").max(200);

export const personalizationChoiceSchema = z
  .object({
    text: optionalTrimmed(200),
    date: optionalTrimmed(10),
    font: optionalTrimmed(40),
    motif: optionalTrimmed(60),
    notes: optionalTrimmed(400),
    referenceMediaId: z.string().uuid().optional(),
  })
  .strict();

export const cartLineInputSchema = z.object({
  productId: z.string().min(1).max(64),
  quantity: z.coerce.number().int().min(1).max(20),
  personalization: personalizationChoiceSchema.nullable().optional(),
});

export const cartInputSchema = z.array(cartLineInputSchema).min(1, "Votre panier est vide.").max(30);

export const checkoutSchema = z.object({
  name: trimmed(120).min(2, "Indiquez votre nom."),
  email: emailSchema,
  phone: optionalTrimmed(30),
  line1: trimmed(200).min(3, "Indiquez votre adresse."),
  line2: optionalTrimmed(200),
  postalCode: trimmed(12).min(3, "Code postal invalide."),
  city: trimmed(100).min(1, "Indiquez la ville."),
  country: z.string().trim().length(2),
  note: optionalTrimmed(600),
  acceptTerms: z.literal("on", { errorMap: () => ({ message: "Veuillez accepter les conditions générales de vente." }) }),
});

export const customRequestSchema = z.object({
  name: trimmed(120).min(2, "Indiquez votre nom."),
  email: emailSchema,
  objectType: trimmed(120).min(2, "Précisez le type d'objet souhaité."),
  material: z.enum(["bois", "verre", "bois-et-verre", "a-definir"], { errorMap: () => ({ message: "Choisissez un matériau." }) }),
  description: trimmed(3000).min(20, "Décrivez votre projet en quelques phrases (20 caractères minimum)."),
  engravingText: optionalTrimmed(300),
  quantity: z.coerce.number().int().min(1, "Quantité invalide.").max(10000),
  budget: optionalTrimmed(60),
  desiredDate: optionalTrimmed(10),
  consent: z.literal("on", { errorMap: () => ({ message: "Votre accord est nécessaire pour traiter la demande." }) }),
});

export const contactSchema = z.object({
  name: trimmed(120).min(2, "Indiquez votre nom."),
  email: emailSchema,
  subject: trimmed(150).min(2, "Indiquez un objet."),
  message: trimmed(3000).min(10, "Votre message est trop court."),
  consent: z.literal("on", { errorMap: () => ({ message: "Votre accord est nécessaire pour traiter la demande." }) }),
});

export const reviewSchema = z.object({
  authorName: trimmed(60).min(2, "Indiquez un nom (ou un prénom)."),
  rating: z.coerce.number().int().min(1).max(5),
  body: trimmed(1500).min(10, "Votre avis est trop court."),
  productId: optionalTrimmed(64),
  consent: z.literal("on", { errorMap: () => ({ message: "Veuillez accepter les conditions de publication." }) }),
});

export type FormState = {
  ok?: boolean;
  demo?: boolean;
  message?: string;
  errors?: Record<string, string>;
};

export function zodErrors(err: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    const k = issue.path.join(".") || "_";
    if (!out[k]) out[k] = issue.message;
  }
  return out;
}

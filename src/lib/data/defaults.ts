import type { Personalization, SiteContent, SiteSettings } from "@/lib/types";
import { imageSrc, imageAlt } from "./images";

export const DEFAULT_SETTINGS: SiteSettings = {
  brandName: "Atelier Matière",
  logoUrl: "",
  tagline: "Créations en bois et en verre, gravées pour durer.",
  contactEmail: "bonjour@atelier-matiere.example",
  contactPhone: "",
  address: "Adresse de l'atelier à compléter",
  announcement: {
    enabled: true,
    text: "Gravure personnalisée sur une sélection de pièces — chaque objet est préparé à la commande.",
    link: "/personnalisation",
  },
  socials: {
    instagram: { url: "https://www.instagram.com/", enabled: true },
    facebook: { url: "https://www.facebook.com/", enabled: true },
    tiktok: { url: "", enabled: false },
    pinterest: { url: "https://www.pinterest.com/", enabled: true },
    linkedin: { url: "", enabled: false },
  },
  shipping: {
    flatFeeCents: 690,
    freeThresholdCents: 12000,
    info: "Expédition soignée sous emballage protecteur. Délais indicatifs à confirmer par l'atelier.",
    countries: ["FR", "BE", "LU", "CH", "MC"],
  },
  commerce: {
    paymentsEnabled: true,
    guestCheckout: true,
    comingSoonEnabled: true,
    pausedMessage:
      "Les commandes en ligne sont momentanément suspendues. Vous pouvez toujours nous écrire pour une création sur mesure.",
  },
  reviews: { siteReviewsEnabled: true, productReviewsEnabled: true },
  security: {
    // Désactivés par défaut, conformément au cahier des charges ; réactivables par le propriétaire.
    passwordRecoveryEnabled: false,
    twoFactorAvailable: false,
    twoFactorRequired: false,
  },
  analytics: { enabled: true },
  publicUrl: "",
};

export const DEFAULT_CONTENT: SiteContent = {
  hero: {
    label: "Des objets qui ont du sens",
    titleLine1: "La beauté de la matière.",
    titleLine2: "L'émotion de la gravure.",
    text: "Des créations en bois et en verre pensées pour durer, personnalisées pour raconter votre histoire.",
    primaryCta: "Découvrir la collection",
    primaryHref: "/boutique",
    secondaryCta: "Créer un objet personnalisé",
    secondaryHref: "/personnalisation",
    image: imageSrc("hero.main", 2400),
    imageAlt: imageAlt("hero.main"),
    secondaryImage: imageSrc("hero.glass", 900),
    secondaryImageAlt: imageAlt("hero.glass"),
  },
  sections: [
    { key: "categories", visible: true },
    { key: "featured", visible: true },
    { key: "personalization", visible: true },
    { key: "craft", visible: true },
    { key: "process", visible: true },
    { key: "reviews", visible: true },
    { key: "finalCta", visible: true },
  ],
  categoriesIntro: { label: "Les collections", title: "Quatre familles, une même exigence" },
  featured: {
    label: "Sélection",
    title: "Les créations du moment",
    text: "Des pièces choisies pour leur matière, leurs proportions et la place qu'elles laissent à la gravure.",
  },
  personalization: {
    label: "Gravure sur demande",
    title: "Votre idée. Notre savoir-faire.",
    text: "Un prénom, une date, quelques mots, un motif ou un projet entier : certaines pièces peuvent être gravées à votre demande, dans la limite de ce que la matière et nos outils permettent.",
    examples: "Prénom · Date · Message · Motif · Logo · Projet sur mesure",
    cta: "Imaginer mon projet",
    href: "/personnalisation#demande",
    image: imageSrc("workshop.trace", 1600),
    imageAlt: imageAlt("workshop.trace"),
  },
  craft: {
    label: "Le savoir-faire",
    title: "Le temps de bien faire",
    text: "[Contenu provisoire à compléter par l'atelier] Présentez ici votre manière de travailler : le choix des essences, la provenance du verre, les étapes de finition et le soin apporté à chaque pièce.",
    wood: "[À compléter] Essences utilisées, séchage, ponçage, finitions à l'huile ou à la cire…",
    glass: "[À compléter] Origine du verre, épaisseurs, techniques de gravure ou de sablage…",
    engraving: "[À compléter] Procédé de gravure, profondeur, polices disponibles, contrôle avant expédition…",
    image: imageSrc("workshop.rabot", 2000),
    imageAlt: imageAlt("workshop.rabot"),
    secondaryImage: imageSrc("workshop.ciseau", 1000),
    secondaryImageAlt: imageAlt("workshop.ciseau"),
  },
  process: {
    label: "Commander",
    title: "Simple, du choix à la réception",
    steps: [
      { title: "Choisissez votre création.", text: "Parcourez la boutique et trouvez la pièce qui vous ressemble." },
      { title: "Personnalisez votre objet.", text: "Si l'option est disponible : texte, date, police ou motif." },
      { title: "Validez votre commande.", text: "Paiement sécurisé par carte, Apple Pay ou Google Pay." },
      { title: "Recevez votre création.", text: "Préparée à l'atelier puis expédiée avec soin." },
    ],
  },
  reviewsIntro: { label: "Ils en parlent", title: "Paroles de clients" },
  finalCta: {
    title: "Une idée à graver ?",
    text: "Décrivez-nous votre projet. Nous vous aiderons à imaginer une création qui vous ressemble.",
    cta: "Parler de mon projet",
    href: "/personnalisation#demande",
    image: imageSrc("workshop.etageres", 2000),
    imageAlt: imageAlt("workshop.etageres"),
  },
  about: {
    title: "Un atelier, deux matières",
    intro:
      "[Contenu provisoire] Atelier Matière conçoit et grave des objets en bois et en verre, pensés pour être offerts, gardés et transmis.",
    story:
      "[À compléter par le responsable] Racontez la naissance de l'atelier, les personnes qui y travaillent, ce qui vous a amené au bois et au verre.",
    methods:
      "[À compléter] Décrivez vos méthodes de fabrication, vos outils, vos fournisseurs et vos contrôles qualité.",
    commitments:
      "[À compléter] Vos engagements : provenance des matériaux, emballages, réparation, délais, service après-vente.",
    image: imageSrc("workshop.copeaux", 2000),
    imageAlt: imageAlt("workshop.copeaux"),
  },
  footer: {
    presentation:
      "Objets en bois et en verre, gravés à la demande. Des pièces simples et durables, préparées avec attention.",
  },
};

export const DEFAULT_PERSONALIZATION: Personalization = {
  enabled: false,
  mode: "options",
  textLabel: "Texte à graver",
  textMaxLength: 24,
  textLines: 1,
  allowDate: false,
  fonts: [],
  motifs: [],
  allowNotes: true,
  allowImage: false,
  extraPriceCents: 0,
  extraDelayDays: 0,
  constraints: "",
};

export const ENGRAVING_FONTS: Record<string, { label: string; css: string }> = {
  serif: { label: "Garamond (classique)", css: "'Cormorant Garamond', Georgia, serif" },
  "serif-italic": { label: "Garamond italique", css: "'Cormorant Garamond', Georgia, serif; font-style: italic" },
  sans: { label: "Linéale (moderne)", css: "'DM Sans Variable', 'DM Sans', system-ui, sans-serif" },
  capitales: { label: "Capitales espacées", css: "'DM Sans Variable', 'DM Sans', system-ui, sans-serif" },
};

export const LEGAL_SLUGS = ["confidentialite", "cgu", "cgv", "mentions-legales"] as const;
export type LegalSlug = (typeof LEGAL_SLUGS)[number];

const draft =
  "Modèle à compléter et à faire valider par un professionnel du droit. Ce texte ne garantit pas à lui seul la conformité juridique du site.";

export const DEFAULT_LEGAL: Record<LegalSlug, { title: string; content: string }> = {
  confidentialite: {
    title: "Politique de confidentialité",
    content: `> ${draft}

## Responsable du traitement
[Raison sociale], [forme juridique], [adresse], [e-mail de contact]. Le responsable du traitement des données collectées sur ce site est [nom].

## Données collectées et finalités
- Commandes : nom, e-mail, téléphone (facultatif), adresse de livraison, contenu de la commande et personnalisations. Finalité : exécution du contrat de vente. Base légale : contrat.
- Demandes sur mesure et contact : nom, e-mail, description du projet et, si vous la fournissez, une image de référence. Finalité : répondre à votre demande. Base légale : mesures précontractuelles / consentement.
- Avis et commentaires : nom affiché et message. Ils ne sont publiés qu'après modération. Base légale : consentement.
- Mesure d'audience : uniquement si vous l'acceptez, des compteurs agrégés par jour (pages vues, produits consultés, ajouts au panier). Aucune adresse IP ni identifiant n'est conservé dans ces statistiques.

## Paiement
Les paiements sont traités par Stripe. Les numéros de carte ne transitent pas par nos serveurs et ne sont jamais stockés par le site.

## Destinataires
Les données sont destinées à [l'atelier] et à ses sous-traitants techniques : hébergeur [nom], prestataire de paiement Stripe, prestataire d'envoi d'e-mails [nom, le cas échéant].

## Durées de conservation
- Commandes : [durée légale de conservation des pièces comptables, à préciser].
- Demandes sans suite : [ex. 3 ans à compter du dernier contact].
- Avis refusés : supprimés sous [délai].

## Vos droits
Vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité. Écrivez à [e-mail]. Vous pouvez introduire une réclamation auprès de l'autorité de contrôle compétente (en France : la CNIL).

## Cookies
Le site utilise un cookie technique pour le panier et la session d'administration, et ne dépose de traceur de mesure d'audience qu'après votre accord.`,
  },
  cgu: {
    title: "Conditions générales d'utilisation",
    content: `> ${draft}

## Objet
Les présentes conditions encadrent l'accès et l'utilisation du site [nom du site].

## Accès au site
Le site est accessible gratuitement. [L'atelier] peut en suspendre l'accès pour maintenance.

## Contributions des visiteurs
Les avis et commentaires sont modérés avant publication. Sont refusés notamment les contenus injurieux, diffamatoires, publicitaires ou sans rapport avec nos créations.

## Propriété intellectuelle
Les textes, photographies et créations présentés sur le site sont protégés. Toute reproduction sans autorisation est interdite.

## Responsabilité
[À compléter]

## Droit applicable
[À compléter]`,
  },
  cgv: {
    title: "Conditions générales de vente",
    content: `> ${draft}

## Vendeur
[Raison sociale, adresse, SIRET, TVA intracommunautaire].

## Produits
Les caractéristiques essentielles sont présentées sur chaque fiche produit. Les photographies sont aussi fidèles que possible ; le bois et le verre étant des matières naturelles, chaque pièce peut présenter de légères variations.

## Prix
Les prix sont indiqués en euros, toutes taxes comprises [à vérifier selon votre régime de TVA]. Les frais de livraison sont précisés avant la validation de la commande.

## Commande et paiement
La commande est définitive après confirmation du paiement par notre prestataire Stripe. Moyens acceptés : carte bancaire, Apple Pay, Google Pay (selon l'éligibilité de votre appareil).

## Produits personnalisés
Les objets gravés selon vos indications sont confectionnés à la demande. Conformément à la réglementation applicable [article L221-28 du Code de la consommation, à vérifier], le droit de rétractation ne s'applique pas aux biens nettement personnalisés. Vérifiez attentivement le texte saisi avant de valider.

## Droit de rétractation
Pour les produits non personnalisés : [délai et modalités à compléter].

## Livraison
[Zones, délais indicatifs, transporteurs, modalités en cas de colis endommagé.]

## Garanties
Garantie légale de conformité et garantie des vices cachés : [à compléter].

## Litiges et médiation
[Médiateur de la consommation à désigner.]`,
  },
  "mentions-legales": {
    title: "Mentions légales",
    content: `> ${draft}

## Éditeur du site
[Raison sociale] — [forme juridique] au capital de [montant] — [adresse] — [RCS / SIRET] — Directeur de la publication : [nom] — Contact : [e-mail].

## Hébergement
[Nom de l'hébergeur], [adresse], [téléphone].

## Crédits photographiques
Visuels de démonstration provenant d'Unsplash (licence Unsplash). À remplacer par les photographies des créations de l'atelier.`,
  },
};

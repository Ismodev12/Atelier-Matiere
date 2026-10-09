/* Types partagés entre le site public, l'administration et la base de données. */

export type ProductImage = { src: string; alt: string };

export type Personalization = {
  enabled: boolean;
  /** options : gravure configurable en ligne ; request : étude préalable via formulaire. */
  mode: "options" | "request";
  textLabel: string;
  textMaxLength: number;
  textLines: 1 | 2;
  allowDate: boolean;
  fonts: string[];
  motifs: string[];
  allowNotes: boolean;
  allowImage: boolean;
  extraPriceCents: number;
  extraDelayDays: number;
  /** Rappel affiché au client sur les limites techniques. */
  constraints: string;
};

export type PersonalizationChoice = {
  text?: string;
  date?: string;
  font?: string;
  motif?: string;
  notes?: string;
  referenceMediaId?: string;
};

export type ShippingAddress = {
  line1: string;
  line2?: string;
  postalCode: string;
  city: string;
  country: string;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  sortOrder: number;
  isVisible: boolean;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  categoryId: string | null;
  materials: string[];
  priceCents: number;
  dimensions: string;
  care: string;
  status: "draft" | "published" | "archived";
  comingSoon: boolean;
  isFeatured: boolean;
  featuredOrder: number;
  stock: number;
  lowStockThreshold: number;
  showStock: boolean;
  personalization: Personalization;
  images: ProductImage[];
  createdAt: Date;
  updatedAt: Date;
};

export type Availability = "available" | "coming_soon" | "out_of_stock" | "on_request";

export type PublicReview = {
  id: string;
  authorName: string;
  rating: number;
  body: string;
  createdAt: Date;
  productName?: string | null;
  isDemo?: boolean;
};

export type SocialKey = "instagram" | "facebook" | "tiktok" | "pinterest" | "linkedin";

export type SiteSettings = {
  brandName: string;
  logoUrl: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  announcement: { enabled: boolean; text: string; link: string };
  socials: Record<SocialKey, { url: string; enabled: boolean }>;
  shipping: { flatFeeCents: number; freeThresholdCents: number; info: string; countries: string[] };
  commerce: {
    paymentsEnabled: boolean;
    guestCheckout: boolean;
    comingSoonEnabled: boolean;
    pausedMessage: string;
  };
  reviews: { siteReviewsEnabled: boolean; productReviewsEnabled: boolean };
  security: {
    passwordRecoveryEnabled: boolean;
    twoFactorAvailable: boolean;
    twoFactorRequired: boolean;
  };
  analytics: { enabled: boolean };
  publicUrl: string;
};

export type SectionKey =
  | "categories"
  | "featured"
  | "personalization"
  | "craft"
  | "process"
  | "reviews"
  | "finalCta";

export type SiteContent = {
  hero: {
    label: string;
    titleLine1: string;
    titleLine2: string;
    text: string;
    primaryCta: string;
    primaryHref: string;
    secondaryCta: string;
    secondaryHref: string;
    image: string;
    imageAlt: string;
    secondaryImage: string;
    secondaryImageAlt: string;
  };
  sections: { key: SectionKey; visible: boolean }[];
  categoriesIntro: { label: string; title: string };
  featured: { label: string; title: string; text: string };
  personalization: {
    label: string;
    title: string;
    text: string;
    examples: string;
    cta: string;
    href: string;
    image: string;
    imageAlt: string;
  };
  craft: {
    label: string;
    title: string;
    text: string;
    wood: string;
    glass: string;
    engraving: string;
    image: string;
    imageAlt: string;
    secondaryImage: string;
    secondaryImageAlt: string;
  };
  process: { label: string; title: string; steps: { title: string; text: string }[] };
  reviewsIntro: { label: string; title: string };
  finalCta: { title: string; text: string; cta: string; href: string; image: string; imageAlt: string };
  about: {
    title: string;
    intro: string;
    story: string;
    methods: string;
    commitments: string;
    image: string;
    imageAlt: string;
  };
  footer: { presentation: string };
};

export type CartLine = {
  key: string;
  productId: string;
  slug: string;
  name: string;
  image: string;
  unitPriceCents: number;
  quantity: number;
  personalization: PersonalizationChoice | null;
};

export type AdminRole = "owner" | "manager" | "editor";

export type AdminIdentity = {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  totpEnabled: boolean;
  isDemo: boolean;
};

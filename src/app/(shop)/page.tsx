import { Hero } from "@/components/home/Hero";
import {
  CategoriesSection,
  CraftSection,
  FeaturedSection,
  FinalCtaSection,
  PersonalizationSection,
  ProcessSection,
  ReviewsSection,
} from "@/components/home/Sections";
import { availabilityOf, getFeaturedProducts, listCategories } from "@/lib/repo/catalog";
import { getApprovedReviews } from "@/lib/repo/reviews";
import { getContent, getSettings } from "@/lib/repo/settings";
import type { SectionKey } from "@/lib/types";

export default async function HomePage() {
  const [content, settings, categories, featured, reviews] = await Promise.all([
    getContent(),
    getSettings(),
    listCategories({ visibleOnly: true }),
    getFeaturedProducts(6),
    getApprovedReviews({ limit: 3 }),
  ]);

  const render: Record<SectionKey, React.ReactNode> = {
    categories: <CategoriesSection intro={content.categoriesIntro} categories={categories} />,
    featured: (
      <FeaturedSection
        content={content.featured}
        products={featured.map((p) => ({ product: p, availability: availabilityOf(p, settings) }))}
      />
    ),
    personalization: <PersonalizationSection content={content.personalization} />,
    craft: <CraftSection content={content.craft} />,
    process: <ProcessSection content={content.process} />,
    reviews: <ReviewsSection intro={content.reviewsIntro} reviews={reviews} />,
    finalCta: <FinalCtaSection content={content.finalCta} />,
  };

  return (
    <>
      <Hero hero={content.hero} />
      {content.sections
        .filter((s) => s.visible && render[s.key])
        .map((s) => (
          <div key={s.key}>{render[s.key]}</div>
        ))}
    </>
  );
}

import { notFound } from "next/navigation";
import {
  BASE_CITY_MARKETS,
  getCityBySlug,
  getIndustryFromCity,
  getIndustrySlugs,
} from "@/data/markets";
import CategoryPageClient from "./pageClient";

export function generateStaticParams() {
  return BASE_CITY_MARKETS.flatMap((city) =>
    Object.keys(city.industries).map((industrySlug) => ({
      city: city.slug,
      category: industrySlug,
    })),
  );
}

export default function CityCategoryPage({ params }) {
  const citySlug = params.city.toLowerCase();
  const categorySlug = params.category.toLowerCase();

  const city = getCityBySlug(citySlug);
  if (!city) {
    notFound();
  }

  const industry = getIndustryFromCity(city, categorySlug);
  if (!industry) {
    notFound();
  }

  const categories = getIndustrySlugs(city);

  return (
    <CategoryPageClient
      city={{
        name: city.name,
        slug: city.slug,
        image: city.image,
        detailImage: city.detailImage ?? city.image,
      }}
      industry={{
        name: industry.name,
        slug: categorySlug,
        sellers: industry.sellers,
      }}
      categories={categories}
    />
  );
}

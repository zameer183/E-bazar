import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  BASE_CITY_MARKETS,
  getCityBySlug,
  getIndustryFromCity,
} from "@/data/markets";
import SellerPageClient from "./pageClient";

export const dynamicParams = true;

export function generateStaticParams() {
  const params = [];
  BASE_CITY_MARKETS.forEach((city) => {
    Object.entries(city.industries).forEach(([categorySlug, industry]) => {
      industry.sellers.forEach((seller) => {
        params.push({
          city: city.slug,
          category: categorySlug,
          seller: seller.slug,
        });
      });
    });
  });
  return params;
}

export default async function SellerPage({ params }) {
  const { city: cityParam, category: categoryParam, seller: sellerParam } =
    await params;

  const citySlug = cityParam.toLowerCase();
  const categorySlug = categoryParam.toLowerCase();
  const sellerSlug = sellerParam.toLowerCase();

  const city = getCityBySlug(citySlug);
  if (!city) {
    notFound();
  }

  const industry = getIndustryFromCity(city, categorySlug);
  if (!industry) {
    notFound();
  }

  const baseSeller =
    industry.sellers?.find((seller) => seller.slug === sellerSlug) ?? null;

  return (
    <Suspense fallback={<div>Loading seller details...</div>}>
      <SellerPageClient
        city={{
          name: city.name,
          slug: city.slug,
          image: city.image,
          detailImage: city.detailImage ?? city.image,
        }}
        industry={{ name: industry.name, slug: categorySlug }}
        baseSeller={baseSeller}
        slugs={{ city: city.slug, category: categorySlug, seller: sellerSlug }}
      />
    </Suspense>
  );
}

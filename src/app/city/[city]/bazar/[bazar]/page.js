import { notFound } from "next/navigation";
import {
  BASE_CITY_MARKETS,
  BAZAAR_ORDER,
  getBazaarDefinition,
  getCityBySlug,
  getBazaarHeroImage,
  getPerfumeSellersForCity,
} from "@/data/markets";
import BazaarPageClient from "./pageClient";

export function generateStaticParams() {
  const params = [];
  BASE_CITY_MARKETS.forEach((city) => {
    BAZAAR_ORDER.forEach((bazaar) => {
      params.push({ city: city.slug, bazar: bazaar });
    });
  });
  return params;
}

export default async function CityBazaarPage({ params }) {
  const { city: cityParam, bazar: bazarParam } = await params;
  const citySlug = cityParam.toLowerCase();
  const bazaarSlug = bazarParam.toLowerCase();

  const city = getCityBySlug(citySlug);
  if (!city) {
    notFound();
  }

  const bazaar = getBazaarDefinition(bazaarSlug);
  if (!bazaar) {
    notFound();
  }

  const fragranceSellers =
    bazaar.slug === "fragrance"
      ? getPerfumeSellersForCity(city.slug, 6)
      : [];
  const heroImage = getBazaarHeroImage(city.slug, bazaar.slug);

  return (
    <BazaarPageClient
      city={{
        name: city.name,
        slug: city.slug,
        image: city.image,
        detailImage: city.detailImage ?? city.image,
      }}
      bazaar={bazaar}
      fragranceSellers={fragranceSellers}
      heroImage={heroImage}
    />
  );
}

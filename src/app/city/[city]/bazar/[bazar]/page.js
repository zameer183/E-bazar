"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import BazaarPageClient from "./pageClient";
import { findCityBySlug, useCities } from "@/lib/cities";
import { getBazaarDefinition, getBazaarHeroImage } from "@/data/markets";
import { useI18n } from "@/lib/i18n";

const deriveFragranceSellers = (city) => city?.industries?.perfumes?.sellers || [];

export default function CityBazaarPage() {
  const params = useParams();
  const citySlug = (params?.city || "").toLowerCase();
  const bazaarSlug = (params?.bazar || "").toLowerCase();
  const cities = useCities();
  const { t } = useI18n();

  const city = useMemo(() => findCityBySlug(cities, citySlug), [cities, citySlug]);
  const bazaar = useMemo(() => getBazaarDefinition(bazaarSlug), [bazaarSlug]);

  if (!city || !bazaar) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white via-bazar-background to-white px-4 py-16 text-center dark:from-bazar-darkBg dark:via-bazar-darkCard dark:to-bazar-darkBg">
        <div className="max-w-xl rounded-3xl border border-bazar-primary/20 bg-white/90 px-8 py-12 shadow-bazar-card backdrop-blur dark:border-white/10 dark:bg-bazar-darkCard/90">
          <h1 className="text-3xl font-bold text-bazar-text dark:text-white">
            {t("bazaar.notAvailable.title")}
          </h1>
          <p className="mt-4 text-sm text-bazar-text/70 dark:text-bazar-darkText/70">
            {t("bazaar.notAvailable.subtitle")}
          </p>
        </div>
      </main>
    );
  }

  const heroImage = getBazaarHeroImage(city.slug, bazaar.slug) || city.detailImage || city.image;
  const fragranceSellers = bazaar.slug === "fragrance" ? deriveFragranceSellers(city) : [];

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

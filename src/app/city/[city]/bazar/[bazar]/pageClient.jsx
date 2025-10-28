"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import SearchBar from "@/components/search-bar/SearchBar";
import BazaarFooter from "@/components/bazaar-footer/BazaarFooter";
import { getBazaarDefinition } from "@/data/markets";
import { buildImageProps } from "@/lib/images";
import { useI18n } from "@/lib/i18n";

export default function BazaarPageClient({ city, bazaar, fragranceSellers, heroImage }) {
  const { t } = useI18n();
  const definition = getBazaarDefinition(bazaar.slug);
  const heroVisual = heroImage || city.detailImage || city.image;
  const heroImageProps = buildImageProps(heroVisual, city.detailImage || city.image || undefined);
  const serviceNote = t("service.note");
  const homeLabel = t("nav.home");

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-white via-bazar-background to-white py-16 dark:from-bazar-darkBg dark:via-bazar-darkCard dark:to-bazar-darkBg"
      suppressHydrationWarning
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 md:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4 text-xs font-semibold uppercase tracking-[0.35em] text-bazar-text/60 dark:text-bazar-darkText/60">
          <nav className="flex flex-wrap items-center gap-2" aria-label="Breadcrumb">
            <Link href="/" className="transition duration-200 hover:text-bazar-primary dark:hover:text-white">
              {homeLabel}
            </Link>
            <span className="opacity-40">/</span>
            <Link
              href={`/city/${city.slug}/bazar/${bazaar.slug}`}
              className="transition duration-200 hover:text-bazar-primary dark:hover:text-white"
            >
              {city.name}
            </Link>
            <span className="opacity-40">/</span>
            <span className="text-bazar-primary dark:text-white">{definition?.title ?? bazaar.title}</span>
          </nav>
        </header>

        <section className="overflow-hidden rounded-3xl border border-bazar-primary/20 bg-white/90 shadow-bazar-card backdrop-blur dark:border-white/10 dark:bg-bazar-darkCard/90">
          <div className="grid gap-6 lg:grid-cols-[3fr,2fr]">
            <div className="relative h-72 overflow-hidden rounded-[28px] lg:h-full">
              <Image
                {...heroImageProps}
                alt={`${city.name} bazaar visuals`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 65vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 space-y-3 text-white">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em]">
                  {city.name} • {bazaar.slug.toUpperCase()}
                </span>
                <h1 className="text-3xl font-bold drop-shadow-sm lg:text-4xl">
                  {definition?.title ?? bazaar.title}
                </h1>
                <p className="text-sm text-white/80 lg:text-base">{definition?.description}</p>
                <FocusNote />
              </div>
            </div>
            <div className="flex flex-col gap-6 px-6 pb-8 pt-6 lg:px-8 lg:pt-8">
              <SearchBar citySlug={city.slug} lockCity />
              <div className="rounded-3xl border border-bazar-primary/15 bg-bazar-primary/5 p-6 text-sm text-bazar-text/70 shadow-inner dark:border-white/10 dark:bg-white/5 dark:text-bazar-darkText/70">
                <p className="font-semibold text-bazar-primary dark:text-white">
                  {city.name} {definition?.title ?? bazaar.title}
                </p>
                <p className="mt-3 leading-relaxed">
                  {definition?.description ||
                    "Discover curated wholesale vendors and verified suppliers delivering nationwide from this bazaar hub."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {bazaar.slug === "fragrance" ? (
          <>
            <section className="rounded-3xl border border-bazar-primary/15 bg-white/90 p-8 shadow-bazar-card dark:border-white/10 dark:bg-bazar-darkCard/90">
              <header className="space-y-2">
                <h2 className="text-2xl font-bold text-bazar-text dark:text-white">{t("bazaar.fragrance.highlights")}</h2>
                <p className="text-sm text-bazar-text/70 dark:text-bazar-darkText/70">
                  {t("bazaar.fragrance.highlights.subtitle", { city: city.name })}
                </p>
              </header>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {(definition?.highlights || []).map((item) => (
                  <article
                    key={item.name}
                    className="rounded-2xl border border-bazar-primary/10 bg-bazar-primary/5 p-5 shadow-inner dark:border-white/10 dark:bg-white/5"
                  >
                    <h3 className="text-lg font-semibold text-bazar-text dark:text-white">{item.name}</h3>
                    <p className="mt-1 text-xs uppercase tracking-[0.3em] text-bazar-text/60 dark:text-bazar-darkText/60">
                      {item.origin}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-bazar-primary/15 bg-white/90 p-8 shadow-bazar-card dark:border-white/10 dark:bg-bazar-darkCard/90">
              <header className="space-y-2">
                <h2 className="text-2xl font-bold text-bazar-text dark:text-white">{t("bazaar.fragrance.featured")}</h2>
                <p className="text-sm text-bazar-text/70 dark:text-bazar-darkText/70">
                  {t("bazaar.fragrance.featured.subtitle", { city: city.name })}
                </p>
              </header>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {fragranceSellers.map((seller) => {
                  const ratingLabel = seller.rating ? `${seller.rating.toFixed(1)} ★` : "New Store";
                  const reviewsLabel = seller.reviews ? `${seller.reviews} reviews` : "Awaiting reviews";

                  return (
                    <Link
                      key={seller.slug}
                      href={`/city/${city.slug}/perfumes/${seller.slug}`}
                      className="group block rounded-3xl border border-bazar-primary/10 bg-white p-6 shadow-bazar-card transition duration-200 hover:-translate-y-1 hover:shadow-bazar-hover dark:border-white/10 dark:bg-bazar-darkCard"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-bazar-text dark:text-white">{seller.name}</h3>
                          <p className="mt-2 text-sm text-bazar-text/60 dark:text-bazar-darkText/70">{seller.address}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.3em] text-bazar-text/50 dark:text-bazar-darkText/60">
                            {seller.contact}
                          </p>
                        </div>
                        <span className="rounded-full bg-bazar-primary/10 px-3 py-1 text-xs font-semibold text-bazar-primary dark:bg-white/10 dark:text-white">
                          {seller.plan}
                        </span>
                      </div>
                      <div className="mt-4 flex items-center justify-between text-sm text-bazar-text/70 dark:text-bazar-darkText/70">
                        <span>{ratingLabel}</span>
                        <span>{reviewsLabel}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          </>
        ) : (
          <section className="rounded-3xl border border-bazar-primary/15 bg-white/90 p-8 shadow-bazar-card dark:border-white/10 dark:bg-bazar-darkCard/90">
            <header className="space-y-2">
              <h2 className="text-2xl font-bold text-bazar-text dark:text-white">{t("bazaar.chooseLane")}</h2>
              <p className="text-sm text-bazar-text/70 dark:text-bazar-darkText/70">
                {t("bazaar.chooseLane.subtitle", {
                  bazaar: definition?.title ?? bazaar.title ?? bazaar.slug,
                  city: city.name,
                })}
              </p>
            </header>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(definition?.subcategories || []).map((sub) => (
                <Link
                  key={sub.label}
                  href={`/city/${city.slug}/${sub.categorySlug}?focus=${sub.focus}`}
                  className="group rounded-2xl border border-bazar-primary/10 bg-bazar-primary/5 px-5 py-6 text-sm font-semibold text-bazar-text transition duration-200 hover:-translate-y-1 hover:border-bazar-primary/40 hover:bg-bazar-primary/10 dark:border-white/10 dark:bg-white/5 dark:text-bazar-darkText dark:hover:bg-white/10"
                >
                  <span>{sub.label}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <BazaarFooter note={serviceNote} />
      </div>
    </div>
  );
}

function FocusNote() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const focus = searchParams.get("focus");
  if (!focus) return null;
  return (
    <p className="inline-flex rounded-full bg-black/60 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-md backdrop-blur">
      {t("bazaar.focusNote", { focus: focus.replaceAll("-", " ") })}
    </p>
  );
}


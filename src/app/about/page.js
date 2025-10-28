"use client";

const WHY_POINTS = [
  "List your shop in the lanes Pakistanis already trust - no complicated onboarding.",
  "Reach city-wide buyers searching by industry, subcategory, and bazaar culture.",
  "Keep full control of pricing and payments while we surface your story to new customers.",
];

const FUTURE_POINTS = [
  "More verified seller badges powered by buyer feedback from every province.",
  "City-specific discovery feeds highlighting seasonal trends and festival collections.",
  "Logistics partners so you can promise fast delivery without building your own network.",
];

const VALUES = [
  {
    title: "Built With Bazaar Rhythm",
    description:
      "Every flow honours how Pakistani markets already work — quick questions, rapid decisions, and trust earned stall by stall.",
  },
  {
    title: "Stories Before Listings",
    description:
      "We prioritise your shop’s narrative so buyers connect with the people behind the counter, not just a product grid.",
  },
  {
    title: "Access For Every City",
    description:
      "Multilingual experiences and low-bandwidth optimisations mean even smaller towns can showcase wholesale strength.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-bazar-background to-white py-16 dark:from-bazar-darkBg dark:via-bazar-darkCard dark:to-bazar-darkBg">
      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-4 md:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-3xl bg-bazar-primary text-white shadow-bazar-card">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,107,0,0.35),_transparent_55%)] opacity-90" />
          <div className="relative grid gap-10 px-8 py-12 md:grid-cols-[1.3fr_1fr] md:px-12 md:py-16 lg:px-16">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white/90">
                We are marketplace storytellers
              </span>
              <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                About E-Bazar
              </h1>
              <p className="text-sm text-white/85 sm:text-base lg:text-lg">
                E-Bazar celebrates Pakistan&apos;s marketplace heritage — from Karachi&apos;s buzzing
                streets to the artisans of Bahawalpur. We organise that energy into a digital bazaar so buyers
                can explore confidently, without losing the culture that makes every stall special.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/90">
                  Wholesale first
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/90">
                  City centric
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/90">
                  People powered
                </span>
              </div>
            </div>
            <div className="grid gap-6 rounded-3xl border border-white/15 bg-white/10 p-6 text-sm backdrop-blur-lg">
              <div className="rounded-2xl bg-black/15 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
                  Platform Snapshot
                </p>
                <p className="mt-3 text-2xl font-semibold text-white">20+ active bazaars</p>
                <p className="text-white/80"> curated across 12 major cities</p>
              </div>
              <ul className="grid gap-4">
                <li className="flex items-start gap-3 rounded-2xl border border-white/15 bg-black/10 p-4">
                  <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-xs font-semibold text-white">
                    01
                  </span>
                  <p className="text-white/85">
                    Verified seller profiles highlight trusted dealings and delivery histories.
                  </p>
                </li>
                <li className="flex items-start gap-3 rounded-2xl border border-white/15 bg-black/10 p-4">
                  <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-xs font-semibold text-white">
                    02
                  </span>
                  <p className="text-white/85">
                    Buyer feedback loops power lane-level recommendations for better sourcing.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="grid gap-8 rounded-3xl border border-bazar-primary/10 bg-white/80 px-8 py-10 shadow-bazar-card backdrop-blur dark:border-white/10 dark:bg-bazar-darkCard/90 md:px-12 md:py-12">
          <div className="grid gap-4 md:max-w-3xl">
            <h2 className="text-2xl font-bold uppercase tracking-[0.25em] text-bazar-text dark:text-white">
              Why wholesale communities choose us
            </h2>
            <p className="text-sm text-bazar-text/70 dark:text-bazar-darkText/70">
              We understand that bazaar trade is powered by reputation. E-Bazar gives sellers a polished digital
              front without changing the hustle that keeps their lanes moving.
            </p>
          </div>
          <ul className="grid gap-6 md:grid-cols-3">
            {VALUES.map((value) => (
              <li
                key={value.title}
                className="group flex flex-col gap-3 rounded-3xl border border-bazar-primary/10 bg-white/70 p-6 shadow-bazar-card transition duration-200 hover:-translate-y-1 hover:shadow-bazar-hover dark:border-white/10 dark:bg-bazar-darkCard/80"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-bazar-primary dark:text-white">
                  {value.title}
                </p>
                <p className="text-sm text-bazar-text/70 dark:text-bazar-darkText/70">{value.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <article className="rounded-3xl border border-bazar-primary/10 bg-white/90 p-8 shadow-bazar-card backdrop-blur dark:border-white/10 dark:bg-bazar-darkCard/90">
            <h2 className="text-2xl font-bold uppercase tracking-[0.18em] text-bazar-text dark:text-white">
              Grow without extra overheads
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-bazar-text/70 dark:text-bazar-darkText/70">
              Buyers don&apos;t demand a personal website or fancy marketing campaign here. Just bring your best
              dealing, honest prices, quality products, and timely delivery. Earn trust, respond quickly, and your
              lane stays busy. We provide the discovery and storytelling layer so your team can stay focused on
              packing orders.
            </p>
            <div className="mt-6 grid gap-4 rounded-2xl border border-bazar-primary/10 bg-bazar-primary/5 p-6 text-sm text-bazar-text/70 dark:border-white/10 dark:bg-white/5 dark:text-bazar-darkText/70">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-bazar-primary/10 text-sm font-semibold text-bazar-primary dark:bg-white/10 dark:text-white">
                  ✓
                </span>
                <p className="font-semibold text-bazar-text dark:text-white">Verified profiles and catalogues</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-bazar-primary/10 text-sm font-semibold text-bazar-primary dark:bg-white/10 dark:text-white">
                  ✓
                </span>
                <p>No upfront SaaS fees — pay only when you scale into value-added services.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-bazar-primary/10 text-sm font-semibold text-bazar-primary dark:bg-white/10 dark:text-white">
                  ✓
                </span>
                <p>Guided onboarding with Urdu and English support for every city team.</p>
              </div>
            </div>
          </article>

          <aside className="rounded-3xl border border-bazar-primary/10 bg-white/90 p-6 shadow-bazar-card backdrop-blur dark:border-white/10 dark:bg-bazar-darkCard/90">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-bazar-primary dark:text-white/80">
              Why sellers join
            </h3>
            <ul className="mt-4 grid gap-4 text-sm text-bazar-text/70 dark:text-bazar-darkText/70">
              {WHY_POINTS.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 rounded-2xl border border-bazar-primary/5 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5"
                >
                  <span className="mt-1 h-2 w-2 rounded-full bg-bazar-primary" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </aside>
        </section>

        <section className="rounded-3xl border border-bazar-primary/10 bg-gradient-to-br from-white via-bazar-background to-white p-8 shadow-bazar-card dark:border-white/10 dark:from-bazar-darkCard dark:via-bazar-darkBg dark:to-bazar-darkCard">
          <h2 className="text-2xl font-bold uppercase tracking-[0.2em] text-bazar-text dark:text-white">
            The road ahead
          </h2>
          <p className="mt-3 max-w-3xl text-sm text-bazar-text/70 dark:text-bazar-darkText/70">
            We&apos;re continuously widening the bazaar so sellers can sell smarter today and tomorrow.
            These are the initiatives we&apos;re rolling out next:
          </p>
          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {FUTURE_POINTS.map((point, index) => (
              <li
                key={point}
                className="flex flex-col gap-3 rounded-3xl border border-bazar-primary/10 bg-white/80 p-6 shadow-bazar-card transition duration-200 hover:-translate-y-1 hover:shadow-bazar-hover dark:border-white/10 dark:bg-bazar-darkCard/80"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-bazar-primary/10 text-base font-semibold uppercase tracking-[0.2em] text-bazar-primary dark:bg-white/10 dark:text-white">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-sm text-bazar-text/70 dark:text-bazar-darkText/70">{point}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}

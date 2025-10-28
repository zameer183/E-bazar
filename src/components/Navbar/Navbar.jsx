"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import clsx from "clsx";
import LanguageToggle from "@/components/LanguageToggle";
import { onAuthChange } from "@/lib/auth";
import { STORAGE_KEY } from "@/data/markets";
import { useI18n } from "@/lib/i18n";

const NAV_LINKS = [
  { href: "/", labelKey: "nav.home", fallback: "Home" },
  { href: "/about", labelKey: "nav.about", fallback: "About Us" },
  { href: "/reviews", labelKey: "nav.reviews", fallback: "Customer Reviews" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useI18n();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasShop, setHasShop] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setIsLoggedIn(Boolean(user));
      if (user && typeof window !== "undefined") {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            const shops = JSON.parse(stored);
            setHasShop(Array.isArray(shops) && shops.length > 0);
          } catch {
            setHasShop(false);
          }
        }
      } else {
        setHasShop(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handlePrimaryCta = () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    router.push(hasShop ? "/dashboard" : "/register");
  };

  const primaryLabel = !isLoggedIn
    ? t("nav.auth.login")
    : hasShop
    ? t("nav.dashboard")
    : t("nav.registerShop");

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50">
      <div className="border-b border-white/20 bg-white/90 backdrop-blur-md transition dark:border-white/10 dark:bg-bazar-darkCard/80">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4 md:px-6">
          <Link href="/" className="group flex items-center gap-2 text-lg font-bold uppercase tracking-wide">
            <span className="rounded-lg bg-bazar-primary px-2 py-1 text-white shadow-sm transition group-hover:shadow-bazar-card">
              E-
            </span>
            <span className="text-bazar-gold drop-shadow">Bazar</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <div className="flex items-center gap-6 text-sm font-semibold text-bazar-text/80 dark:text-bazar-darkText/80">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    "rounded-full px-3 py-1 transition duration-200 hover:text-bazar-text dark:hover:text-white",
                    pathname === link.href && "bg-bazar-primary/10 text-bazar-primary",
                  )}
                >
                  {t(link.labelKey) || link.fallback}
                </Link>
              ))}
            </div>
            <LanguageToggle />
            <button
              type="button"
              onClick={handlePrimaryCta}
              className="rounded-full bg-bazar-gradient px-6 py-2 text-sm font-semibold text-white shadow-bazar-card transition duration-200 hover:shadow-bazar-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bazar-primary"
            >
              {primaryLabel}
            </button>
          </div>

          <button
            type="button"
            className="md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70 shadow-inner ring-1 ring-black/5 transition hover:bg-white dark:bg-bazar-darkBg/70 dark:ring-white/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-bazar-text dark:text-bazar-darkText"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5m-16.5 5.25h16.5m-16.5 5.25h16.5" />
                )}
              </svg>
            </span>
          </button>
        </nav>

        {mobileOpen && (
          <div className="md:hidden">
            <div className="mx-4 mb-4 flex flex-col gap-4 rounded-2xl bg-white/95 p-4 shadow-bazar-card dark:bg-bazar-darkCard/95">
              <LanguageToggle className="self-start" />
              <div className="flex flex-col gap-3 text-sm font-semibold text-bazar-text/80 dark:text-bazar-darkText/80">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-lg px-3 py-2 transition duration-200 hover:bg-bazar-primary/10 hover:text-bazar-primary dark:hover:bg-white/10 dark:hover:text-white"
                  >
                    {t(link.labelKey) || link.fallback}
                  </Link>
                ))}
              </div>
              <button
                type="button"
                onClick={handlePrimaryCta}
                className="rounded-full bg-bazar-gradient px-6 py-3 text-sm font-semibold text-white shadow-bazar-card transition duration-200 hover:shadow-bazar-hover"
              >
                {primaryLabel}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}


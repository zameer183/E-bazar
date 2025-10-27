"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BASE_CITY_MARKETS,
  BAZAAR_ORDER,
  CATEGORY_TO_BAZAAR,
  STORAGE_KEY,
  createProductShowcase,
  getBazaarDefinition,
  getCitySellers,
} from "@/data/markets";
import styles from "./SearchBar.module.css";

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const cityOptions = BASE_CITY_MARKETS.map((city) => ({
  label: city.name,
  value: city.slug,
}));

const mapCategoryToBazaar = (categorySlug) =>
  CATEGORY_TO_BAZAAR[categorySlug] || null;

export default function SearchBar({ citySlug, lockCity = false, enableCityFilter = false, bazaarSlug = null }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cityFromUrl = searchParams.get("city");

  const [query, setQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState(
    citySlug && cityOptions.some((c) => c.value === citySlug)
      ? citySlug
      : cityFromUrl && cityOptions.some((c) => c.value === cityFromUrl)
      ? cityFromUrl
      : cityOptions[0]?.value,
  );
  const [showResults, setShowResults] = useState(false);
  const [storedShops, setStoredShops] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [searchMessage, setSearchMessage] = useState("");

  // Initialize selectedCity from URL when enableCityFilter is true
  useEffect(() => {
    if (enableCityFilter && cityFromUrl && cityOptions.some((c) => c.value === cityFromUrl)) {
      setSelectedCity(cityFromUrl);
    }
  }, [cityFromUrl, enableCityFilter]);

  useEffect(() => {
    if (!citySlug) return;
    setSelectedCity(citySlug);
  }, [citySlug]);

  // Handle city change for bazaar page
  useEffect(() => {
    if (enableCityFilter && bazaarSlug && selectedCity) {
      router.push(`/bazar/${bazaarSlug}?city=${selectedCity}`);
    }
  }, [selectedCity, enableCityFilter, bazaarSlug, router]);

  // Load search history from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const history = window.localStorage.getItem("eBazarSearchHistory");
      if (history) {
        setSearchHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error("Unable to load search history", error);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setStoredShops([]);
        return;
      }
      const shops = JSON.parse(stored) || [];
      setStoredShops(
        shops.filter(
          (shop) =>
            shop.citySlug?.toLowerCase?.() === selectedCity?.toLowerCase?.(),
        ),
      );
    } catch (error) {
      console.error("Unable to load stored shops", error);
      setStoredShops([]);
    }
  }, [selectedCity]);

  const bazaarEntries = useMemo(
    () =>
      BAZAAR_ORDER.map((slug) => {
        const bazaar = getBazaarDefinition(slug);
        return {
          id: `${selectedCity}-${slug}-bazaar`,
          type: "bazaar",
          label: bazaar?.title ?? slug,
          meta: "Bazaar",
          path: `/city/${selectedCity}/bazar/${slug}`,
          keywords: [bazaar?.title ?? slug, slug, "bazaar"],
        };
      }),
    [selectedCity],
  );

  // Removed subcategoryEntries - no longer showing subcategories in search
  // const subcategoryEntries = useMemo(
  //   () =>
  //     BAZAAR_ORDER.flatMap((slug) => {
  //       const bazaar = getBazaarDefinition(slug);
  //       return (bazaar?.subcategories || []).map((sub) => ({
  //         id: `${selectedCity}-${slug}-${slugify(sub.label)}`,
  //         type: "subcategory",
  //         label: sub.label,
  //         meta: `${bazaar?.title ?? "Bazaar"} - Subcategory`,
  //         path: `/city/${selectedCity}/bazar/${slug}?focus=${sub.focus}`,
  //         keywords: [sub.label, slug, bazaar?.title ?? ""],
  //       }));
  //     }),
  //   [selectedCity],
  // );

  // Search history entries
  const searchHistoryEntries = useMemo(
    () =>
      searchHistory.slice(0, 5).map((item, index) => ({
        id: `history-${index}`,
        type: "history",
        label: item.query,
        meta: "Recent search",
        path: item.path,
        keywords: [item.query],
      })),
    [searchHistory],
  );

  const baseSellers = useMemo(
    () => getCitySellers(selectedCity),
    [selectedCity],
  );

  const dynamicSellers = useMemo(() =>
    storedShops.map((shop) => {
      const bazaarSlug = mapCategoryToBazaar(shop.categorySlug);
      const products =
        shop.products && shop.products.length > 0
          ? shop.products
          : createProductShowcase(shop.categorySlug || "clothes", 3);
      return {
        ...shop,
        bazaarSlug,
        products,
      };
    }),
  [storedShops]);

  const sellerEntries = useMemo(() => {
    const combined = [...baseSellers, ...dynamicSellers];
    return combined.map((seller) => {
      const categorySlug = seller.categorySlug || "clothes";
      const bazaarSlug = seller.bazaarSlug || mapCategoryToBazaar(categorySlug);
      const sellerSlug = seller.slug || slugify(`${selectedCity}-${seller.name}`);
      const path = `/city/${selectedCity}/${categorySlug}/${sellerSlug}`;
      return {
        id: `${selectedCity}-${categorySlug}-${sellerSlug}`,
        type: "seller",
        label: seller.name,
        meta: `${getBazaarDefinition(bazaarSlug)?.title ?? "Bazaar"} - Seller`,
        path,
        keywords: [
          seller.name,
          categorySlug,
          bazaarSlug || "",
          ...(seller.products || []).map((product) => product.name),
        ],
        categorySlug,
        bazaarSlug,
        products: seller.products || [],
      };
    });
  }, [selectedCity, baseSellers, dynamicSellers]);

  const productEntries = useMemo(() => {
    const entries = [];
    sellerEntries.forEach((seller) => {
      seller.products.forEach((product) => {
        const productSlug = product.slug || slugify(product.name);
        entries.push({
          id: `${seller.id}-product-${productSlug}`,
          type: "product",
          label: `${product.name} (${seller.label})`,
          meta: "Product",
          path: `${seller.path}?product=${productSlug}`,
          keywords: [product.name, seller.label, seller.categorySlug, seller.bazaarSlug],
        });
      });
    });
    return entries;
  }, [sellerEntries]);

  const highlightEntries = useMemo(() => {
    const fragrance = getBazaarDefinition("fragrance");
    if (!fragrance?.highlights) return [];
    return fragrance.highlights.map((item) => ({
      id: `${selectedCity}-fragrance-highlight-${slugify(item.name)}`,
      type: "highlight",
      label: item.name,
      meta: "Fragrance Highlight",
      path: `/city/${selectedCity}/bazar/fragrance?focus=${slugify(item.name)}`,
      keywords: [item.name, item.origin, "fragrance", "perfume", "attar"],
    }));
  }, [selectedCity]);

  const allEntries = useMemo(
    () => [
      ...bazaarEntries,
      ...highlightEntries,
      ...sellerEntries,
      ...productEntries,
    ],
    [bazaarEntries, highlightEntries, sellerEntries, productEntries],
  );

  const defaultResults = useMemo(
    () => [
      ...searchHistoryEntries,
      ...bazaarEntries.slice(0, 3),
      ...sellerEntries.slice(0, 5),
    ],
    [searchHistoryEntries, bazaarEntries, sellerEntries],
  );

  const { derivedResults, hasMatches, showFallbackMessage } = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return {
        derivedResults: defaultResults,
        hasMatches: true,
        showFallbackMessage: false,
      };
    }

    const filtered = allEntries.filter((entry) =>
      entry.keywords.some((word) => word?.toLowerCase?.().includes(trimmed)),
    );

    if (filtered.length > 0) {
      return {
        derivedResults: filtered.slice(0, 12),
        hasMatches: true,
        showFallbackMessage: false,
      };
    }

    return {
      derivedResults: defaultResults,
      hasMatches: false,
      showFallbackMessage: true,
    };
  }, [query, allEntries, defaultResults]);

  useEffect(() => {
    if (!query.trim()) {
      setSearchMessage("");
      return;
    }
    if (showFallbackMessage) {
      setSearchMessage("Product Will Be Listed Soon InshAllah");
    } else {
      setSearchMessage("");
    }
  }, [query, showFallbackMessage]);

  const handleNavigate = (entry) => {
    if (!entry?.path) return;

    // Save to search history
    if (entry.type !== "history" && query.trim()) {
      const newHistory = [
        { query: query.trim(), path: entry.path, timestamp: Date.now() },
        ...searchHistory.filter(item => item.query !== query.trim())
      ].slice(0, 10); // Keep only last 10 searches

      setSearchHistory(newHistory);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("eBazarSearchHistory", JSON.stringify(newHistory));
      }
    }

    router.push(entry.path);
    setShowResults(false);
    setSearchMessage("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validation: ensure both city and search query are provided
    const trimmedQuery = query.trim();
    if (!selectedCity) {
      alert("Please select a city first");
      return;
    }

    if (!trimmedQuery) {
      alert("Please enter a category, subcategory, seller, or product to search");
      return;
    }

    if (!hasMatches) {
      setShowResults(true);
      setSearchMessage("Product Will Be Listed Soon InshAllah");
      return;
    }

    if (derivedResults.length > 0) {
      handleNavigate(derivedResults[0]);
    }
  };

  return (
    <div className={styles.wrapper} suppressHydrationWarning>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.citySelect} suppressHydrationWarning>
          <label htmlFor="search-city">City</label>
          <select
            id="search-city"
            value={selectedCity}
            onChange={(event) => setSelectedCity(event.target.value)}
            disabled={lockCity}
          >
            {cityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.inputGroup} suppressHydrationWarning>
          <label htmlFor="search-query">Search the bazaar</label>
          <input
            id="search-query"
            type="search"
            placeholder="Enter category, subcategory, seller, or product name..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 150)}
            required
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          Search
        </button>
      </form>

      {showResults && derivedResults.length > 0 && (
        <div className={styles.resultsPanel} role="listbox">
          {searchMessage && (
            <div className={styles.resultNotice} role="status">
              {searchMessage}
            </div>
          )}
          {derivedResults.map((entry) => (
            <button
              key={entry.id}
              type="button"
              className={styles.resultItem}
              onClick={() => handleNavigate(entry)}
            >
              <span className={styles.resultLabel}>{entry.label}</span>
              <span className={styles.resultMeta}>{entry.meta}</span>
            </button>
          ))}
        </div>
      )}

      {showResults && derivedResults.length === 0 && (
        <div className={styles.resultsPanel}>
          <span className={styles.empty}>
            {searchMessage || "Product Will Be Listed Soon InshAllah"}
          </span>
        </div>
      )}
    </div>
  );
}

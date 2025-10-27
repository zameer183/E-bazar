"use client";

import { useEffect, useState } from "react";
import {
  BASE_CITY_MARKETS,
  CATEGORY_OPTIONS,
  CITIES_STORAGE_KEY,
  createEmptyIndustries,
  mergeCityCollections,
} from "@/data/markets";

const STORAGE_KEY = CITIES_STORAGE_KEY;

const sanitizeCityInput = (city) => {
  if (!city || typeof city !== "object") {
    return null;
  }

  const slug = typeof city.slug === "string" ? city.slug.toLowerCase().trim() : "";
  const name = typeof city.name === "string" ? city.name.trim() : "";
  if (!slug || !name) {
    return null;
  }

  const defaultCategory =
    typeof city.defaultCategory === "string" && city.defaultCategory.trim()
      ? city.defaultCategory.trim()
      : "clothes";

  const industries =
    typeof city.industries === "object" && city.industries
      ? city.industries
      : createEmptyIndustries();

  return {
    name,
    slug,
    image: city.image || "/images/placeholder-image.svg",
    detailImage: city.detailImage || city.image || "/images/placeholder-image.svg",
    defaultCategory,
    industries,
  };
};

export const readStoredCities = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(sanitizeCityInput).filter(Boolean);
  } catch (error) {
    console.warn("Unable to read stored cities", error);
    return [];
  }
};

const writeStoredCities = (cities) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
};

const dispatchUpdateEvent = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("ebazar:cities-updated"));
};

export const upsertCity = (cityPayload) => {
  const entry = sanitizeCityInput(cityPayload);
  if (!entry) {
    throw new Error("Invalid city payload");
  }

  const current = readStoredCities();
  const existingIndex = current.findIndex((city) => city.slug === entry.slug);
  if (existingIndex >= 0) {
    current[existingIndex] = entry;
  } else {
    current.push(entry);
  }
  writeStoredCities(current);
  dispatchUpdateEvent();
  return entry;
};

export const deleteCityBySlug = (slug) => {
  if (typeof slug !== "string" || !slug.trim()) return;
  const normalizedSlug = slug.toLowerCase().trim();
  const current = readStoredCities();
  const next = current.filter((city) => city.slug !== normalizedSlug);
  writeStoredCities(next);
  dispatchUpdateEvent();
};

export const buildCityPayload = ({ name, slug, image, detailImage, defaultCategory }) => {
  const normalizedSlug =
    typeof slug === "string" && slug.trim().length > 0
      ? slug.trim().toLowerCase()
      : name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");

  const allowedCategory = CATEGORY_OPTIONS.some((option) => option.slug === defaultCategory)
    ? defaultCategory
    : "clothes";

  return {
    name: name.trim(),
    slug: normalizedSlug,
    image: image?.trim() || "/images/placeholder-image.svg",
    detailImage: detailImage?.trim() || image?.trim() || "/images/placeholder-image.svg",
    defaultCategory: allowedCategory,
    industries: createEmptyIndustries(),
  };
};

export const useCities = () => {
  const [cities, setCities] = useState(() =>
    mergeCityCollections(BASE_CITY_MARKETS, readStoredCities()),
  );

  useEffect(() => {
    const syncCities = () => {
      setCities(mergeCityCollections(BASE_CITY_MARKETS, readStoredCities()));
    };

    syncCities();

    const handleStorage = (event) => {
      if (event.key === STORAGE_KEY || event.key === null) {
        syncCities();
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("ebazar:cities-updated", syncCities);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("ebazar:cities-updated", syncCities);
    };
  }, []);

  return cities;
};

export const useStoredCities = () => {
  const [cities, setCities] = useState(() => readStoredCities());

  useEffect(() => {
    const sync = () => {
      setCities(readStoredCities());
    };
    sync();

    const handleStorage = (event) => {
      if (event.key === STORAGE_KEY || event.key === null) {
        sync();
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("ebazar:cities-updated", sync);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("ebazar:cities-updated", sync);
    };
  }, []);

  return cities;
};

export const findCityBySlug = (cities, slug) => {
  if (!slug) return null;
  const normalized = slug.toLowerCase();
  return cities.find((city) => city.slug === normalized) || null;
};

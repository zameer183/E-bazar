import { createProductShowcase } from "@/data/markets";

const FALLBACK_CATEGORY = "clothes";
const DEFAULT_PRICE = "Price on request";

const slugify = (text = "") =>
  text
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const ensureArray = (value) => (Array.isArray(value) ? value : []);

const pickFallbackProduct = (categorySlug = FALLBACK_CATEGORY, index = 0) => {
  const safeSlug = categorySlug || FALLBACK_CATEGORY;
  const candidates = ensureArray(createProductShowcase(safeSlug, index));
  if (candidates.length > 0) {
    return candidates[index % candidates.length];
  }
  const fallbackCandidates = ensureArray(createProductShowcase(FALLBACK_CATEGORY, index));
  return fallbackCandidates[index % fallbackCandidates.length] || {};
};

const normalizeProduct = (rawProduct, categorySlug = FALLBACK_CATEGORY, index = 0) => {
  if (!rawProduct && rawProduct !== 0) {
    return null;
  }

  const usingString = typeof rawProduct === "string";
  const baseObject = typeof rawProduct === "object" && rawProduct !== null ? rawProduct : {};
  const fallback = pickFallbackProduct(categorySlug, index);

  const nameSource =
    usingString
      ? rawProduct
      : baseObject.name || fallback.name || `Product ${index + 1}`;
  const name = nameSource.trim() || `Product ${index + 1}`;

  const productSlug =
    baseObject.slug ||
    fallback.slug ||
    slugify(`${categorySlug || FALLBACK_CATEGORY}-${name}`);

  const price =
    baseObject.price ??
    (usingString ? DEFAULT_PRICE : fallback.price ?? DEFAULT_PRICE);

  const rating =
    typeof baseObject.rating === "number"
      ? baseObject.rating
      : usingString
      ? null
      : typeof fallback.rating === "number"
      ? fallback.rating
      : null;

  const reviews =
    typeof baseObject.reviews === "number"
      ? baseObject.reviews
      : usingString
      ? 0
      : typeof fallback.reviews === "number"
      ? fallback.reviews
      : 0;

  const image = baseObject.image || fallback.image || null;
  const description =
    baseObject.description ??
    (usingString ? "" : fallback.description || "");

  return {
    ...fallback,
    ...baseObject,
    name,
    slug: productSlug,
    price,
    rating,
    reviews,
    image,
    description,
    isCustom: baseObject.isCustom ?? usingString,
  };
};

export const normalizeProducts = (products, categorySlug = FALLBACK_CATEGORY) => {
  if (!products) return [];
  return ensureArray(products)
    .map((product, index) => normalizeProduct(product, categorySlug, index))
    .filter(Boolean);
};

export const createProductEntry = (name, categorySlug = FALLBACK_CATEGORY, index = 0) =>
  normalizeProduct(name.trim(), categorySlug, index);

export const deriveCategorySlug = (source, fallback = FALLBACK_CATEGORY) => {
  if (!source) return fallback;
  if (typeof source === "string") {
    const slug = slugify(source);
    return slug || fallback;
  }
  if (source.categorySlug) {
    const slug = slugify(source.categorySlug);
    return slug || fallback;
  }
  if (source.category) {
    const slug = slugify(source.category);
    return slug || fallback;
  }
  return fallback;
};

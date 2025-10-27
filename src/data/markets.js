export const STORAGE_KEY = "eBazarShops";
export const CITIES_STORAGE_KEY = "eBazarCities";

const PRIMARY_CATEGORIES = [
  { name: "Clothes", slug: "clothes" },
  { name: "Perfumes", slug: "perfumes" },
  { name: "Electronics", slug: "electronics" },
];

const EXTENDED_CATEGORIES = [
  ...PRIMARY_CATEGORIES,
  { name: "Furniture", slug: "furniture" },
  { name: "Jewelry", slug: "jewelry" },
  { name: "Books & Stationery", slug: "books-stationery" },
  { name: "Home Decor", slug: "home-decor" },
  { name: "Sports & Fitness", slug: "sports-fitness" },
  { name: "Toys & Games", slug: "toys-games" },
  { name: "Automotive", slug: "automotive" },
  { name: "Mobile Phones", slug: "mobile-phones" },
  { name: "Computers & Laptops", slug: "computers-laptops" },
  { name: "Kitchen Appliances", slug: "kitchen-appliances" },
  { name: "Footwear", slug: "footwear" },
  { name: "Beauty & Cosmetics", slug: "beauty-cosmetics" },
  { name: "Bags & Luggage", slug: "bags-luggage" },
  { name: "Watches", slug: "watches" },
  { name: "Groceries", slug: "groceries" },
  { name: "Pet Supplies", slug: "pet-supplies" },
  { name: "Baby Products", slug: "baby-products" },
  { name: "Medical Equipment", slug: "medical-equipment" },
  { name: "Art & Craft", slug: "art-craft" },
  { name: "Photography", slug: "photography" },
  { name: "Garden & Outdoor", slug: "garden-outdoor" },
];

const createAllIndustries = (categories) => {
  const industries = {};
  categories.forEach((category) => {
    industries[category.slug] = {
      name: category.name,
      sellers: [],
    };
  });
  return industries;
};

export const createEmptyIndustries = () => createAllIndustries(EXTENDED_CATEGORIES);

export const BASE_CITY_MARKETS = [];

export const CATEGORY_OPTIONS = EXTENDED_CATEGORIES;

export const CATEGORY_TO_BAZAAR = {
  clothes: "fashion",
  electronics: "tech",
  perfumes: "fragrance",
};

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const createSellerSlug = (city, name) => slugify(`${city} ${name}`);

export const HERO_SLIDES = [
  { src: "/images/mazar-e-quaid.png", alt: "Mazar-e-Quaid, Karachi skyline" },
  { src: "/images/lahore.jpg", alt: "Minar-e-Pakistan, Lahore landmark" },
  { src: "/images/faisalabad-hero.jpg", alt: "Ghanta Ghar, Faisalabad clock tower" },
  { src: "/images/bahawalpur.jpg", alt: "Bahawalpur heritage landmark" },
];

export const BAZAAR_DEFINITIONS = {
  fashion: {
    slug: "fashion",
    title: "Fashion Bazaar",
    description:
      "Stroll through stitched couture, fabrics, and accessories inspired by Pakistan's heritage.",
    subcategories: [
      { label: "Fashion & Clothing", categorySlug: "clothes", focus: "fashion-clothing" },
      { label: "Footwear", categorySlug: "clothes", focus: "footwear" },
      { label: "Jewelry & Accessories", categorySlug: "clothes", focus: "jewelry-accessories" },
      { label: "Beauty & Cosmetics", categorySlug: "clothes", focus: "beauty-cosmetics" },
      {
        label: "Fashion Designers & Boutiques",
        categorySlug: "clothes",
        focus: "fashion-designers",
      },
      { label: "Textile & Fabric", categorySlug: "clothes", focus: "textile-fabric" },
      { label: "Tailoring & Stitching", categorySlug: "clothes", focus: "tailoring-stitching" },
    ],
  },
  tech: {
    slug: "tech",
    title: "Tech Bazaar",
    description: "Discover the latest devices, repair hubs, and home tech powering local bazaars.",
    subcategories: [
      { label: "Electronics & Gadgets", categorySlug: "electronics", focus: "electronics-gadgets" },
      {
        label: "Mobile Phones & Accessories",
        categorySlug: "electronics",
        focus: "mobile-accessories",
      },
      { label: "Computers & Laptops", categorySlug: "electronics", focus: "computers-laptops" },
      { label: "Home Appliances", categorySlug: "electronics", focus: "home-appliances" },
      {
        label: "Electronic Repair & Maintenance",
        categorySlug: "electronics",
        focus: "electronic-repair",
      },
    ],
  },
  fragrance: {
    slug: "fragrance",
    title: "Fragrance Bazaar",
    description:
      "Experience signature attars, luxury sprays, and scent artisans rooted in city tradition.",
    subcategories: [
      { label: "Attars & Oils", categorySlug: "perfumes", focus: "attars-oils" },
      { label: "Signature Sprays", categorySlug: "perfumes", focus: "signature-sprays" },
      { label: "Arabian Blends", categorySlug: "perfumes", focus: "arabian-blends" },
      { label: "Gift Sets", categorySlug: "perfumes", focus: "gift-sets" },
      { label: "Artisan Collections", categorySlug: "perfumes", focus: "artisan-collections" },
    ],
    highlights: [
      { name: "Oud-e-Sindh Blend", origin: "Karachi Coastal Distillers" },
      { name: "Rose-Itar Lahore", origin: "Anarkali Floral Houses" },
      { name: "Sandal Classic", origin: "Faisalabad Heritage Labs" },
      { name: "Amber Wilderness", origin: "Quetta Aroma Guild" },
    ],
  },
};

export const BAZAAR_ORDER = ["fashion", "tech", "fragrance"];

export const getBazaarDefinition = (slug) => BAZAAR_DEFINITIONS[slug] ?? null;

export const getBazaarSubcategories = (slug) => {
  const def = getBazaarDefinition(slug);
  return def?.subcategories || [];
};

export const BAZAAR_HERO_IMAGES = {
  fashion: {
    default:
      "https://images.pexels.com/photos/1854876/pexels-photo-1854876.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  tech: {
    default:
      "https://images.pexels.com/photos/243698/pexels-photo-243698.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  fragrance: {
    default:
      "https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
};

export const getBazaarHeroImage = (citySlug, bazaarSlug) => {
  const images = BAZAAR_HERO_IMAGES[bazaarSlug];
  if (!images) return null;
  return images[citySlug] || images.default || null;
};

export const getCityBySlug = (slug) =>
  BASE_CITY_MARKETS.find((city) => city.slug === slug.toLowerCase());

export const getIndustryFromCity = (city, industrySlug) =>
  city?.industries?.[industrySlug] || null;

export const getIndustrySlugs = (city) =>
  Object.keys(city.industries || {}).map((slug) => ({
    slug,
    name: city.industries[slug].name,
  })).sort((a, b) => a.name.localeCompare(b.name));

export const getCitySellersFromCollection = (cities, citySlug) => {
  const city = cities.find((entry) => entry.slug === citySlug.toLowerCase());
  if (!city) return [];
  const sellers = [];
  Object.entries(city.industries || {}).forEach(([categorySlug, industry]) => {
    const bazaarSlug = CATEGORY_TO_BAZAAR[categorySlug];
    if (!bazaarSlug) return;
    (industry.sellers || []).forEach((seller) => {
      sellers.push({
        ...seller,
        categorySlug,
        bazaarSlug,
      });
    });
  });
  return sellers;
};

export const getCitySellers = (citySlug) => {
  const city = BASE_CITY_MARKETS.find((entry) => entry.slug === citySlug.toLowerCase());
  if (!city) return [];
  return getCitySellersFromCollection([city], citySlug);
};

export const getPerfumeSellersForCity = () => [];
export const mergeCityCollections = (base, additions) => {
  const map = new Map();
  base.forEach((city) => {
    if (city?.slug) {
      map.set(city.slug.toLowerCase(), city);
    }
  });
  additions.forEach((city) => {
    if (city?.slug) {
      map.set(city.slug.toLowerCase(), city);
    }
  });
  return Array.from(map.values()).sort((a, b) =>
    (a.name || "").localeCompare(b.name || "", undefined, { sensitivity: "base" })
  );
};

export const createProductShowcase = () => [];

export const getTopRatedSellers = () => [];

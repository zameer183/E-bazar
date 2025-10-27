export const STORAGE_KEY = "eBazarShops";

const plans = ["Featured Store", "Standard Partner", "Premium Partner", "Free Partner"];

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const createSellerSlug = (city, name) => slugify(`${city} ${name}`);

const productCatalog = {
  clothes: [
    {
      name: "Handcrafted Ajrak Kurta",
      image:
        "https://images.pexels.com/photos/1159670/pexels-photo-1159670.jpeg?auto=compress&cs=tinysrgb&w=1200",
      price: "Rs. 4,850",
    },
    {
      name: "Embroidered Bridal Lehnga",
      image:
        "https://images.pexels.com/photos/307008/pexels-photo-307008.jpeg?auto=compress&cs=tinysrgb&w=1200",
      price: "Rs. 135,000",
    },
    {
      name: "Signature Lawn Three Piece",
      image:
        "https://images.pexels.com/photos/428338/pexels-photo-428338.jpeg?auto=compress&cs=tinysrgb&w=1200",
      price: "Rs. 6,950",
    },
  ],
  perfumes: [
    {
      name: "Oud Royale Attar",
      image:
        "https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=1200",
      price: "Rs. 8,400",
    },
    {
      name: "Rose Musk Signature Spray",
      image:
        "https://images.pexels.com/photos/965994/pexels-photo-965994.jpeg?auto=compress&cs=tinysrgb&w=1200",
      price: "Rs. 5,950",
    },
    {
      name: "Amber Resin Gift Set",
      image:
        "https://images.pexels.com/photos/965992/pexels-photo-965992.jpeg?auto=compress&cs=tinysrgb&w=1200",
      price: "Rs. 4,200",
    },
  ],
  electronics: [
    {
      name: "Smart LED 55\" Display",
      image:
        "https://images.pexels.com/photos/5081387/pexels-photo-5081387.jpeg?auto=compress&cs=tinysrgb&w=1200",
      price: "Rs. 124,999",
    },
    {
      name: "Gaming Laptop Pro 15",
      image:
        "https://images.pexels.com/photos/6432105/pexels-photo-6432105.jpeg?auto=compress&cs=tinysrgb&w=1200",
      price: "Rs. 189,500",
    },
    {
      name: "Wireless ANC Headphones",
      image:
        "https://images.pexels.com/photos/3394657/pexels-photo-3394657.jpeg?auto=compress&cs=tinysrgb&w=1200",
      price: "Rs. 22,900",
    },
  ],
};

const generateProducts = (sellerIndex, categorySlug) => {
  const catalog = productCatalog[categorySlug] || [];
  return catalog.map((product, idx) => {
    const rating = Math.min(5, +(4.2 + ((sellerIndex + idx) % 5) * 0.12).toFixed(1));
    const reviews = 24 + (sellerIndex + idx) * 9;
    return {
      ...product,
      slug: slugify(`${categorySlug}-${product.name}`),
      rating,
      reviews,
    };
  });
};

const createSellerList = ({ city, mobileCode, names, areas, categorySlug }) =>
  names.map((name, index) => {
    const area = areas[index % areas.length];
    const baseNumber = 5000000 + index * 137;
    const contact = `+92 3${mobileCode} ${String(baseNumber).padStart(7, "0")}`;
    const rating = Math.min(4.9, +(4.1 + (index * 0.07)).toFixed(1));
    const reviews = 60 + index * 13;
    const plan = plans[index % plans.length];

    return {
      name,
      slug: createSellerSlug(city, name),
      address: `${area}, ${city}`,
      contact,
      rating,
      reviews,
      plan,
      description: `${name} curates authentic ${categorySlug} selections that echo the heritage of ${city}.`,
      products: generateProducts(index, categorySlug),
    };
  });

export const createProductShowcase = (categorySlug, seed = 0) =>
  generateProducts(seed, categorySlug).map((product) => ({ ...product }));

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
    description:
      "Discover the latest devices, repair hubs, and home tech powering local bazaars.",
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

export const HERO_SLIDES = [
  { src: "/images/karachi.jpg", alt: "Mazar-e-Quaid, Karachi skyline" },
  { src: "/images/lahore.jpg", alt: "Minar-e-Pakistan, Lahore landmark" },
  { src: "/images/faisalabad-hero.jpg", alt: "Ghanta Ghar, Faisalabad clock tower" },
  { src: "/images/quetta.jpg", alt: "Miri Fort, Quetta hill view" },
  {
    src: "https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Faisal Mosque framed by Margalla Hills in Islamabad",
  },
  {
    src: "https://images.pexels.com/photos/724919/pexels-photo-724919.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Badshahi Mosque courtyard during golden hour in Lahore",
  },
  {
    src: "https://images.pexels.com/photos/1481457/pexels-photo-1481457.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Hunza Valley and Karakoram peaks",
  },
  {
    src: "https://images.pexels.com/photos/1133383/pexels-photo-1133383.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Desert dunes reminiscent of Cholistan near Derawar Fort",
  },
  {
    src: "https://images.pexels.com/photos/2422256/pexels-photo-2422256.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Gwadar-style coastline opening to the Arabian Sea",
  },
  {
    src: "https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Shah Jahan Mosque inspired tile work in interior view",
  },
];

export const BASE_CITY_MARKETS = [
  {
    name: "Karachi",
    slug: "karachi",
    image: "/images/karachi.jpg",
    detailImage: "/images/karachi.jpg",
    defaultCategory: "clothes",
    industries: {
      clothes: {
        name: "Clothes",
        sellers: createSellerList({
          city: "Karachi",
          mobileCode: "21",
          categorySlug: "clothes",
          names: [
            "Zainab Couture Collective",
            "Clifton Silk House",
            "Empress Market Fabrics",
            "Bolton Heritage Drapes",
            "Sea View Linen Loft",
            "Defence Bridal Gallery",
            "PECHS Boutique Street",
            "Lyari Artisan Weaves",
            "Nazimabad Textile Nook",
            "Saddar Vintage Drapes",
            "Korangi Classic Tailors",
          ],
          areas: [
            "Zainab Market, Saddar",
            "Clifton Block 3",
            "Empress Market, Saddar",
            "Bolton Market",
            "Seaview Commercial",
            "DHA Phase 6",
            "PECHS Block 2",
            "Lyari Quarter",
            "Nazimabad No. 3",
            "Garden East",
            "Korangi Industrial Area",
          ],
        }),
      },
      perfumes: {
        name: "Perfumes",
        sellers: createSellerList({
          city: "Karachi",
          mobileCode: "21",
          categorySlug: "perfumes",
          names: [
            "Tariq Road Fragrance Lane",
            "Saddar Attar Ghar",
            "Clifton Essence Vault",
            "Bohri Bazaar Aroma Studio",
            "Burns Road Oud Lounge",
            "Defence Perfume Atelier",
            "Bahadurabad Scent Loft",
            "Gulshan Essence Emporium",
            "Khayaban-e-Bukhari Aroma Hub",
            "Kharadar Musk Gallery",
            "City Centre Oud House",
          ],
          areas: [
            "Dolmen Mall Tariq Road",
            "Bohri Bazaar, Saddar",
            "Clifton Block 5",
            "Burns Road Market",
            "DHA Phase 4",
            "Bahadurabad Chowrangi",
            "Gulshan Block 3",
            "Khayaban-e-Bukhari",
            "Kharadar Market",
            "Lucky One Mall",
          ],
        }),
      },
      electronics: {
        name: "Electronics",
        sellers: createSellerList({
          city: "Karachi",
          mobileCode: "21",
          categorySlug: "electronics",
          names: [
            "Gadget Hub Karachi",
            "TechSquare Saddar",
            "Nishat Road Digital Mart",
            "Shahrah-e-Faisal Device Loft",
            "Clifton Smart Plaza",
            "DHA Tech Galleria",
            "Gulistan Gizmo Centre",
            "Nazimabad Circuit House",
            "Hyderi Gadget Arcade",
            "Techno Saddar Bazaar",
            "I.I. Chundrigar Tech Works",
          ],
          areas: [
            "Nishat Road, I.I. Chundrigar",
            "Shahrah-e-Liaquat, Saddar",
            "Techno City, Saddar",
            "Shahrah-e-Faisal",
            "Clifton Block 2",
            "DHA Phase 5",
            "Gulistan-e-Johar",
            "Nazimabad No. 2",
            "Hyderi Market",
            "Bolton Market",
          ],
        }),
      },
    },
  },
  {
    name: "Lahore",
    slug: "lahore",
    image: "/images/lahore.jpg",
    detailImage: "/images/lahore.jpg",
    defaultCategory: "clothes",
    industries: {
      clothes: {
        name: "Clothes",
        sellers: createSellerList({
          city: "Lahore",
          mobileCode: "22",
          categorySlug: "clothes",
          names: [
            "Anarkali Heritage Looms",
            "Liberty Pret Studio",
            "Gulberg Couture House",
            "Shahi Qila Handlooms",
            "Mall Road Silk Atelier",
            "DHA Bridal Pavilion",
            "Ichhra Trendsetters",
            "Model Town Textile Loft",
            "Emporium Fashion Lane",
            "Fortress Boutique Arcade",
            "Lahore Cantonment Drapes",
          ],
          areas: [
            "Anarkali Bazaar",
            "Liberty Market, Gulberg",
            "MM Alam Road",
            "Walled City Lahore",
            "The Mall, Lahore",
            "DHA Phase 3",
            "Ichhra Bazaar",
            "Model Town Link Road",
            "Johar Town, Emporium",
            "Fortress Stadium",
            "Lahore Cantt",
          ],
        }),
      },
      perfumes: {
        name: "Perfumes",
        sellers: createSellerList({
          city: "Lahore",
          mobileCode: "22",
          categorySlug: "perfumes",
          names: [
            "Walled City Attar House",
            "Mall Road Essence Bar",
            "Liberty Fragrance Lounge",
            "Cantt Oud Studio",
            "Gulberg Aroma Lab",
            "Shalimar Scent Gallery",
            "Fort Road Musk Corner",
            "Askari Perfume Loft",
            "MM Alam Essence Works",
            "Emporium Aroma Suite",
            "Barki Road Fragrance Hub",
          ],
          areas: [
            "Shahi Mohallah, Walled City",
            "The Mall, Lahore",
            "Liberty Market",
            "Lahore Cantt",
            "Gulberg Main Boulevard",
            "Shalimar Link Road",
            "Fort Road Food Street",
            "Askari 10 Commercial",
            "MM Alam Road",
            "Johar Town, Emporium",
          ],
        }),
      },
      electronics: {
        name: "Electronics",
        sellers: createSellerList({
          city: "Lahore",
          mobileCode: "22",
          categorySlug: "electronics",
          names: [
            "Hall Road Digital Centre",
            "TechHub Fortress",
            "Cantt Smart Devices",
            "Model Town Circuit Store",
            "Johar Town Gizmo Gallery",
            "Liberty Tech Arcade",
            "Shadman Electronics Plaza",
            "Township Digital Depot",
            "Gari Shahu Gadget Loft",
            "Gulshan-e-Ravi Tech Spot",
            "MM Alam Smart Studio",
          ],
          areas: [
            "Hall Road, Lahore",
            "Fortress Stadium, Cantt",
            "Lahore Cantt",
            "Model Town Link Road",
            "Johar Town Main Boulevard",
            "Liberty Market",
            "Shadman Chowk",
            "Township Commercial Area",
            "Gari Shahu Main Road",
            "Gulshan-e-Ravi",
          ],
        }),
      },
    },
  },
  {
    name: "Faisalabad",
    slug: "faisalabad",
    image: "/images/faisalabad.jpg",
    detailImage: "/images/faisalabad-hero.jpg",
    defaultCategory: "clothes",
    industries: {
      clothes: {
        name: "Clothes",
        sellers: createSellerList({
          city: "Faisalabad",
          mobileCode: "33",
          categorySlug: "clothes",
          names: [
            "Clock Tower Textile Arcade",
            "Liaqat Road Fabric Mart",
            "D Ground Drapers",
            "Katchery Couture House",
            "Madina Town Weaves",
            "Jhang Bazaar Tailors",
            "Peoples Colony Fashion Loft",
            "Jaranwala Linen Works",
            "Rail Bazaar Handloom",
            "Sargodha Road Boutique",
            "Susan Road Bridal Studio",
          ],
          areas: [
            "Ghanta Ghar, Faisalabad",
            "Liaqat Road",
            "D Ground, Peoples Colony",
            "Katchery Bazaar",
            "Madina Town Main Road",
            "Jhang Bazaar",
            "Peoples Colony No. 1",
            "Jaranwala Road",
            "Rail Bazaar",
            "Sargodha Road",
          ],
        }),
      },
      perfumes: {
        name: "Perfumes",
        sellers: createSellerList({
          city: "Faisalabad",
          mobileCode: "33",
          categorySlug: "perfumes",
          names: [
            "Jinnah Colony Attar Studio",
            "D Ground Fragrance Lane",
            "Satiana Essence Bar",
            "Peoples Colony Musk House",
            "Rail Bazaar Perfume Loft",
            "ChenOne Aroma Suite",
            "Millat Road Oud Works",
            "Kohinoor Essence Corner",
            "Madina Town Scent Avenue",
            "Iqbal Stadium Fragrance Hub",
            "Allied Scent Gallery",
          ],
          areas: [
            "Jinnah Colony",
            "D Ground",
            "Satiana Road",
            "Peoples Colony No. 2",
            "Rail Bazaar",
            "ChenOne Road",
            "Millat Road",
            "Kohinoor City",
            "Madina Town",
            "Iqbal Stadium",
          ],
        }),
      },
      electronics: {
        name: "Electronics",
        sellers: createSellerList({
          city: "Faisalabad",
          mobileCode: "33",
          categorySlug: "electronics",
          names: [
            "Rail Bazaar Tech Point",
            "Susan Road Gadget Shoppe",
            "Kohinoor Digital Hub",
            "D Type Colony Tech Works",
            "Faisalabad Circuit Plaza",
            "Lari Adda Smart Store",
            "Peoples Colony Device Loft",
            "Jaranwala Tech Junction",
            "Samanabad Electronics Mall",
            "Ghulam Mohammad Tech Lane",
            "Iqbal Town Gadget House",
          ],
          areas: [
            "Rail Bazaar",
            "Susan Road",
            "Kohinoor City",
            "D Type Colony",
            "Circular Road",
            "Lari Adda Market",
            "Peoples Colony",
            "Jaranwala Road",
            "Samanabad Main Road",
            "Ghulam Mohammad Abad",
            "Iqbal Town",
          ],
        }),
      },
    },
  },
  {
    name: "Quetta",
    slug: "quetta",
    image: "/images/quetta.jpg",
    detailImage: "/images/quetta.jpg",
    defaultCategory: "clothes",
    industries: {
      clothes: {
        name: "Clothes",
        sellers: createSellerList({
          city: "Quetta",
          mobileCode: "34",
          categorySlug: "clothes",
          names: [
            "Liaquat Bazaar Wool Works",
            "Kandhari Shawl House",
            "Prince Road Drapery",
            "Jinnah Town Couture Loft",
            "Shahrah-e-Iqbal Fabric Mart",
            "Satellite Town Weaves",
            "Sariab Road Textile Hub",
            "Quetta Cantonment Drapes",
            "Mission Road Apparel",
            "Brewery Road Boutique",
            "Circular Road Handloom",
          ],
          areas: [
            "Liaquat Bazaar",
            "Kandhari Bazaar",
            "Prince Road Market",
            "Jinnah Town",
            "Shahrah-e-Iqbal",
            "Satellite Town",
            "Sariab Road",
            "Quetta Cantt",
            "Mission Road",
            "Brewery Road",
          ],
        }),
      },
      perfumes: {
        name: "Perfumes",
        sellers: createSellerList({
          city: "Quetta",
          mobileCode: "34",
          categorySlug: "perfumes",
          names: [
            "Hanna Lake Essence Co.",
            "Prince Road Attar Gallery",
            "Circular Road Oud Loft",
            "Airport Road Fragrance Bar",
            "Sariab Scent Studio",
            "Hazara Town Musk House",
            "Chiltan Perfume Works",
            "Cantt Aroma Lounge",
            "Mission Road Essence Lab",
            "Kasi Road Fragrance Hub",
            "Spinny Road Attar Court",
          ],
          areas: [
            "Airport Road",
            "Prince Road",
            "Circular Road",
            "Sariab Road",
            "Hazara Town",
            "Chiltan Housing",
            "Quetta Cantonment",
            "Mission Road",
            "Kasi Road",
            "Spinny Road",
          ],
        }),
      },
      electronics: {
        name: "Electronics",
        sellers: createSellerList({
          city: "Quetta",
          mobileCode: "34",
          categorySlug: "electronics",
          names: [
            "Circular Road Digital Mart",
            "Jinnah Road Tech Lounge",
            "Prince Road Gadget Hub",
            "Millennium Smart Plaza",
            "Samungli Device Centre",
            "Airport Road Tech Depot",
            "Hazara Town Circuit Works",
            "Spinny Road Electronics Loft",
            "Cantt Digital Bay",
            "Fatima Jinnah Tech Square",
            "Liaquat Bazaar Gadget House",
          ],
          areas: [
            "Circular Road",
            "Jinnah Road",
            "Prince Road",
            "Millennium Mall",
            "Samungli Road",
            "Airport Road",
            "Hazara Town",
            "Spinny Road",
            "Quetta Cantonment",
            "Fatima Jinnah Road",
          ],
        }),
      },
    },
  },
];

export const getCityBySlug = (slug) =>
  BASE_CITY_MARKETS.find((city) => city.slug === slug);

export const getIndustryFromCity = (city, industrySlug) =>
  city?.industries?.[industrySlug] || null;

export const getIndustrySlugs = (city) =>
  Object.keys(city.industries || {}).map((slug) => ({
    slug,
    name: city.industries[slug].name,
  }));


export const getPerfumeSellersForCity = (citySlug, limit = 6) => {
  const city = BASE_CITY_MARKETS.find((entry) => entry.slug === citySlug.toLowerCase());
  if (!city) return [];
  const perfumes = city.industries?.perfumes?.sellers || [];
  return perfumes.slice(0, limit);
};

export const getBazaarSubcategories = (slug) => {
  const def = getBazaarDefinition(slug);
  return def?.subcategories || [];
};

export const CATEGORY_OPTIONS = [
  { name: "Clothes", slug: "clothes" },
  { name: "Perfumes", slug: "perfumes" },
  { name: "Electronics", slug: "electronics" },
];

export const CITY_OPTIONS = BASE_CITY_MARKETS.map((city) => ({
  name: city.name,
  slug: city.slug,
}));
export const CATEGORY_TO_BAZAAR = {
  clothes: "fashion",
  electronics: "tech",
  perfumes: "fragrance",
};

export const BAZAAR_HERO_IMAGES = {
  fashion: {
    karachi:
      "https://images.pexels.com/photos/1374124/pexels-photo-1374124.jpeg?auto=compress&cs=tinysrgb&w=1600",
    lahore:
      "https://images.pexels.com/photos/1082502/pexels-photo-1082502.jpeg?auto=compress&cs=tinysrgb&w=1600",
    faisalabad:
      "https://images.pexels.com/photos/668423/pexels-photo-668423.jpeg?auto=compress&cs=tinysrgb&w=1600",
    quetta:
      "https://images.pexels.com/photos/3115179/pexels-photo-3115179.jpeg?auto=compress&cs=tinysrgb&w=1600",
    default:
      "https://images.pexels.com/photos/1854876/pexels-photo-1854876.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  tech: {
    karachi:
      "https://images.pexels.com/photos/267394/pexels-photo-267394.jpeg?auto=compress&cs=tinysrgb&w=1600",
    lahore:
      "https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=1600",
    faisalabad:
      "https://images.pexels.com/photos/243698/pexels-photo-243698.jpeg?auto=compress&cs=tinysrgb&w=1600",
    quetta:
      "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1600",
    default:
      "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  fragrance: {
    karachi:
      "https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=1600",
    lahore:
      "https://images.pexels.com/photos/965993/pexels-photo-965993.jpeg?auto=compress&cs=tinysrgb&w=1600",
    faisalabad:
      "https://images.pexels.com/photos/965994/pexels-photo-965994.jpeg?auto=compress&cs=tinysrgb&w=1600",
    quetta:
      "https://images.pexels.com/photos/965992/pexels-photo-965992.jpeg?auto=compress&cs=tinysrgb&w=1600",
    default:
      "https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
};

export const getBazaarHeroImage = (citySlug, bazaarSlug) => {
  const images = BAZAAR_HERO_IMAGES[bazaarSlug];
  if (!images) return null;
  return images[citySlug] || images.default || null;
};

export const getCitySellers = (citySlug) => {
  const city = BASE_CITY_MARKETS.find((entry) => entry.slug === citySlug.toLowerCase());
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

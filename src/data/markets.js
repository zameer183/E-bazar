export const STORAGE_KEY = "eBazarShops";

const plans = ["Featured Store", "Standard Partner", "Premium Partner", "Free Partner"];

const SUBCATEGORY_FOCUS = {
  clothes: [
    "fashion-clothing",
    "footwear",
    "jewelry-accessories",
    "beauty-cosmetics",
    "fashion-designers",
    "textile-fabric",
    "tailoring-stitching",
  ],
  electronics: [
    "electronics-gadgets",
    "mobile-accessories",
    "computers-laptops",
    "home-appliances",
    "electronic-repair",
  ],
  perfumes: [
    "attars-oils",
    "signature-sprays",
    "arabian-blends",
    "gift-sets",
    "artisan-collections",
  ],
};

const NAME_TEMPLATES = {
  clothes: [
    "{city} Couture Collective",
    "{city} Silk House",
    "{city} Heritage Drapes",
    "{city} Boutique Lane",
    "{city} Artisanal Weaves",
    "{city} Bridal Gallery",
    "{city} Textile Nook",
    "{city} Tailor Studio",
    "{city} Fashion Emporium",
    "{city} Designer Fabrics",
    "{city} Royal Wardrobe",
    "{city} Elite Stitching",
    "{city} Luxury Linens",
    "{city} Premium Pret",
    "{city} Embroidery Works",
    "{city} Haute Couture Hub",
    "{city} Wedding Collections",
    "{city} Shawl Specialists",
    "{city} Traditional Attire",
    "{city} Modern Drapes",
  ],
  perfumes: [
    "{city} Fragrance Loft",
    "{city} Attar Ghar",
    "{city} Essence Vault",
    "{city} Aroma Atelier",
    "{city} Musk Gallery",
    "{city} Oud House",
    "{city} Signature Scents",
    "{city} Perfume Arcade",
    "{city} Scent Studio",
    "{city} Attar Bazaar",
    "{city} Fragrance Palace",
    "{city} Oud Emporium",
    "{city} Aroma House",
    "{city} Perfume Gallery",
    "{city} Essence Corner",
    "{city} Musk Atelier",
    "{city} Scent Lounge",
    "{city} Attar Collection",
    "{city} Fragrance World",
    "{city} Oud Artisans",
  ],
  electronics: [
    "{city} Gadget Hub",
    "{city} Tech Plaza",
    "{city} Digital Mart",
    "{city} Device Loft",
    "{city} Smart Galleria",
    "{city} Circuit House",
    "{city} Tech Arcade",
    "{city} Innovation Bay",
    "{city} Electronics World",
    "{city} Mobile Center",
    "{city} Computer Bazaar",
    "{city} Tech Solutions",
    "{city} Gadget Gallery",
    "{city} Digital Zone",
    "{city} Smart Devices",
    "{city} Tech Emporium",
    "{city} Electronics Hub",
    "{city} Mobile Accessories",
    "{city} Laptop Store",
    "{city} Repair Center",
  ],
};

const generateNames = (city, templates) =>
  templates.map((template) => template.replace("{city}", city));

const createStandardIndustries = ({ city, mobileCode, areas }) => ({
  clothes: {
    name: "Clothes",
    sellers: createSellerList({
      city,
      mobileCode,
      categorySlug: "clothes",
      names: generateNames(city, NAME_TEMPLATES.clothes),
      areas: areas.clothes ?? areas.default ?? areas,
    }),
  },
  perfumes: {
    name: "Perfumes",
    sellers: createSellerList({
      city,
      mobileCode,
      categorySlug: "perfumes",
      names: generateNames(city, NAME_TEMPLATES.perfumes),
      areas: areas.perfumes ?? areas.default ?? areas,
    }),
  },
  electronics: {
    name: "Electronics",
    sellers: createSellerList({
      city,
      mobileCode,
      categorySlug: "electronics",
      names: generateNames(city, NAME_TEMPLATES.electronics),
      areas: areas.electronics ?? areas.default ?? areas,
    }),
  },
});

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

const shopImages = {
  clothes: [
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=800&q=80",
  ],
  perfumes: [
    "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80",
  ],
  electronics: [
    "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1593640495390-cb217b398fcb?auto=format&fit=crop&w=800&q=80",
  ],
};

const createSellerList = ({ city, mobileCode, names, areas, categorySlug }) =>
  names.map((name, index) => {
    const area = areas[index % areas.length];
    const baseNumber = 5000000 + index * 137;
    const contact = `+92 3${mobileCode} ${String(baseNumber).padStart(7, "0")}`;
    const rating = Math.min(4.9, +(4.1 + (index * 0.07)).toFixed(1));
    const reviews = 60 + index * 13;
    const plan = plans[index % plans.length];
    const focusList = SUBCATEGORY_FOCUS[categorySlug] || [];
    const subcategoryFocus =
      focusList.length > 0 ? focusList[index % focusList.length] : null;
    const images = shopImages[categorySlug] || shopImages.clothes;
    const shopImage = images[index % images.length];

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
      subcategoryFocus,
      shopImage,
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

export const HERO_SLIDES = [
  { src: "/images/karachi.jpg", alt: "Mazar-e-Quaid, Karachi skyline" },
  { src: "/images/lahore.jpg", alt: "Minar-e-Pakistan, Lahore landmark" },
  { src: "/images/faisalabad-hero.jpg", alt: "Ghanta Ghar, Faisalabad clock tower" },
  { src: "/images/quetta.jpg", alt: "Miri Fort, Quetta hill view" },
  {
    src: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1600&q=80",
    alt: "Traditional Pakistani textiles and fabrics in a bazaar",
  },
  {
    src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80",
    alt: "Fashion retail display with modern clothing",
  },
  {
    src: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1600&q=80",
    alt: "Electronics and technology gadgets showcase",
  },
  {
    src: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=1600&q=80",
    alt: "Luxury perfumes and fragrances collection",
  },
  {
    src: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1600&q=80",
    alt: "Traditional marketplace shopping experience",
  },
  {
    src: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1600&q=80",
    alt: "Smartphone and mobile accessories display",
  },
  {
    src: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1600&q=80",
    alt: "Designer jewelry and accessories boutique",
  },
  {
    src: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=80",
    alt: "Footwear and shoe collection in retail store",
  },
];

export const BASE_CITY_MARKETS = [
  {
    name: "Karachi",
    slug: "karachi",
    image: "/images/mazar-e-quaid.png",
    detailImage: "/images/mazar-e-quaid.png",
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
  {
    name: "Islamabad",
    slug: "islamabad",
    image:
      "https://images.unsplash.com/photo-1544986581-efac024faf62?auto=format&fit=crop&w=1600&q=80",
    detailImage:
      "https://images.unsplash.com/photo-1544986581-efac024faf62?auto=format&fit=crop&w=1600&q=80",
    defaultCategory: "clothes",
    industries: createStandardIndustries({
      city: "Islamabad",
      mobileCode: "51",
      areas: {
        default: [
          "Blue Area",
          "F-7 Markaz",
          "Centaurus Mall",
          "I-8 Markaz",
          "Super Market F-6",
          "Giga Mall DHA-II",
          "F-10 Markaz",
          "Bahria Town Civic Center",
          "F-11 Markaz",
          "G-9 Markaz",
          "G-10 Markaz",
          "G-11 Markaz",
          "F-8 Markaz",
          "I-10 Markaz",
          "Saidpur Village",
          "F-6 Super Market",
          "Melody Food Park",
          "Zero Point",
          "Pakistan Monument",
          "Faisal Mosque Area",
        ],
      },
    }),
  },
  {
    name: "Rawalpindi",
    slug: "rawalpindi",
    image:
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1600&q=80",
    detailImage:
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1600&q=80",
    defaultCategory: "clothes",
    industries: createStandardIndustries({
      city: "Rawalpindi",
      mobileCode: "51",
      areas: {
        default: [
          "Raja Bazaar",
          "Saddar Commercial",
          "Commercial Market",
          "Bahria Town Phase 7",
          "Chandni Chowk",
          "Murree Road",
          "Peshawar Road",
          "Satellite Town",
          "Bahria Town Phase 4",
          "Civic Center",
          "Committee Chowk",
          "Liaquat Bagh",
          "Chaklala",
          "Westridge",
          "Muslim Town",
          "Adiala Road",
          "IJP Road",
          "PWD Housing",
          "Gordon College Road",
          "Mall Road",
        ],
      },
    }),
  },
  {
    name: "Peshawar",
    slug: "peshawar",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80",
    detailImage:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80",
    defaultCategory: "clothes",
    industries: createStandardIndustries({
      city: "Peshawar",
      mobileCode: "91",
      areas: {
        default: [
          "Khyber Bazaar",
          "Qissa Khwani Bazaar",
          "Saddar Road",
          "University Town",
          "Hayatabad Phase 3",
          "Karkhano Market",
          "Cantt Board",
          "Tehkal Payan",
          "Hayatabad Phase 1",
          "Hayatabad Phase 5",
          "Warsak Road",
          "Ring Road",
          "Bara Road",
          "GT Road",
          "Shaheen Town",
          "Gulbahar",
          "Board Bazaar",
          "Cinema Road",
          "Firdous",
          "Phase 7 Hayatabad",
        ],
      },
    }),
  },
  {
    name: "Multan",
    slug: "multan",
    image:
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1600&q=80",
    detailImage:
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1600&q=80",
    defaultCategory: "clothes",
    industries: createStandardIndustries({
      city: "Multan",
      mobileCode: "61",
      areas: {
        default: [
          "Hussain Agahi Bazaar",
          "Cantt Sabzi Mandi",
          "Dera Adda",
          "Gulgasht Colony",
          "Nawan Shehr Chowk",
          "Shah Rukn-e-Alam Colony",
          "Old Shujabad Road",
          "Chowk Kumharanwala",
          "New Multan",
          "Bosan Road",
          "Vehari Chowk",
          "Suraj Miani Road",
          "MDA Chowk",
          "Shershah Road",
          "Gardezi Chowk",
          "Abdali Road",
          "Model Town A",
          "Khanewal Road",
          "Mattital Road",
          "Shah Shams",
        ],
      },
    }),
  },
  {
    name: "Hyderabad",
    slug: "hyderabad",
    image:
      "https://images.unsplash.com/photo-1610296669228-602fa827fc1f?auto=format&fit=crop&w=1600&q=80",
    detailImage:
      "https://images.unsplash.com/photo-1610296669228-602fa827fc1f?auto=format&fit=crop&w=1600&q=80",
    defaultCategory: "clothes",
    industries: createStandardIndustries({
      city: "Hyderabad",
      mobileCode: "22",
      areas: {
        default: [
          "Shahi Bazaar",
          "Auto Bhan Road",
          "Qasimabad Main",
          "Latifabad No. 6",
          "Station Road",
          "Saddar Bazaar",
          "Hala Naka",
          "Citizen Colony",
          "Latifabad No. 8",
          "Latifabad No. 12",
          "Hussainabad",
          "Liaquat Colony",
          "Market Tower",
          "Tilak Incline",
          "Cantonment Road",
          "Hirabad",
          "Jamshoro Road",
          "Old Hyderabad",
          "Thandi Sarak",
          "Risala Road",
        ],
      },
    }),
  },
  {
    name: "Sialkot",
    slug: "sialkot",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
    detailImage:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
    defaultCategory: "clothes",
    industries: createStandardIndustries({
      city: "Sialkot",
      mobileCode: "52",
      areas: {
        default: [
          "Paris Road",
          "Cantt Avenue",
          "Ugoki Road",
          "Daska Road",
          "Allama Iqbal Chowk",
          "Murray College Road",
          "Wazirabad Road",
          "Shahabpura",
          "Pasrur Road",
          "Sambrial Road",
          "Kashmir Road",
          "City Road",
          "Kutchery Road",
          "Sialkot Bypass",
          "Circular Road",
          "Defence Road",
          "Airport Road",
          "Ranger Road",
          "Civil Lines",
          "Jamia Mosque Road",
        ],
      },
    }),
  },
  {
    name: "Gujranwala",
    slug: "gujranwala",
    image:
      "https://images.unsplash.com/photo-1543165796-5426273eaab3?auto=format&fit=crop&w=1600&q=80",
    detailImage:
      "https://images.unsplash.com/photo-1543165796-5426273eaab3?auto=format&fit=crop&w=1600&q=80",
    defaultCategory: "clothes",
    industries: createStandardIndustries({
      city: "Gujranwala",
      mobileCode: "55",
      areas: {
        default: [
          "Model Town",
          "Satellite Town",
          "Peoples Colony",
          "Railway Road",
          "Gujranwala Cantt",
          "Dhulla Bhutta",
          "Civil Lines",
          "G.T. Road",
          "Jinnah Road",
          "Kacha Pacca Road",
          "Gondlanwala",
          "Rahwali Cantt",
          "New Civil Lines",
          "Khokhar Chowk",
          "Eminabad Road",
          "Wazirabad Road",
          "Sialkot Road",
          "Sheranwala Gate",
          "Aroop Road",
          "Cooper Road",
        ],
      },
    }),
  },
  {
    name: "Bahawalpur",
    slug: "bahawalpur",
    image:
      "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1600&q=80",
    detailImage:
      "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1600&q=80",
    defaultCategory: "clothes",
    industries: createStandardIndustries({
      city: "Bahawalpur",
      mobileCode: "62",
      areas: {
        default: [
          "Farid Gate",
          "Model Town A",
          "DC Chowk",
          "University Road",
          "Cantt Commercial",
          "Ahmedpur Road",
          "Karachi Morr",
          "Bahawalpur Saddar",
          "Model Town B",
          "Model Town C",
          "Railway Road",
          "Satellite Town",
          "Baghdad-ul-Jadeed",
          "Circular Road",
          "Darapur",
          "Yazman Road",
          "Hasilpur Road",
          "Dubai Chowk",
          "Channi Goth",
          "Mall Road",
        ],
      },
    }),
  },
  {
    name: "Sargodha",
    slug: "sargodha",
    image:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80",
    detailImage:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80",
    defaultCategory: "clothes",
    industries: createStandardIndustries({
      city: "Sargodha",
      mobileCode: "48",
      areas: {
        default: [
          "Kachery Bazaar",
          "Iqbal Colony",
          "University Road",
          "Satellite Town",
          "Shaheen Chowk",
          "Qainchi Mor",
          "Jail Road",
          "New Satellite Town",
          "Faisalabad Road",
          "Khushab Road",
          "Bhera Road",
          "Bhalwal Road",
          "Shahpur Road",
          "Sillanwali Road",
          "Malakwal Road",
          "Mianwali Road",
          "Civil Lines",
          "Old Satellite Town",
          "Cantt Area",
          "PAF Road",
        ],
      },
    }),
  },
  {
    name: "Sukkur",
    slug: "sukkur",
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80",
    detailImage:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80",
    defaultCategory: "clothes",
    industries: createStandardIndustries({
      city: "Sukkur",
      mobileCode: "71",
      areas: {
        default: [
          "Minara Road",
          "Shikarpur Road",
          "Barrister House Market",
          "Clock Tower",
          "Military Road",
          "Barrage Colony",
          "Frere Road",
          "Lansdowne Bridge Market",
          "Airpor Road",
          "Railway Station Road",
          "Circular Road",
          "New Civil Hospital Road",
          "Ghanta Ghar",
          "Jackson Bazaar",
          "Station Road",
          "Lab-e-Mehran",
          "Rohri Road",
          "Pano Akil Road",
          "Jacobabad Road",
          "Saleh Pat Road",
        ],
      },
    }),
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

const flattenAllSellers = () => {
  const sellers = [];
  BASE_CITY_MARKETS.forEach((city) => {
    Object.entries(city.industries || {}).forEach(([categorySlug, industry]) => {
      (industry.sellers || []).forEach((seller) => {
        sellers.push({
          ...seller,
          cityName: city.name,
          citySlug: city.slug,
          categorySlug,
          categoryName: industry.name,
        });
      });
    });
  });
  return sellers;
};

const sortByRatingAndReviews = (a, b) => {
  const ratingDiff = (b.rating || 0) - (a.rating || 0);
  if (ratingDiff !== 0) return ratingDiff;
  const reviewsDiff = (b.reviews || 0) - (a.reviews || 0);
  if (reviewsDiff !== 0) return reviewsDiff;
  return a.name.localeCompare(b.name);
};

export const getTopRatedSellers = (limit = 12) => {
  return flattenAllSellers()
    .filter((seller) => (seller.rating || 0) >= 4.2)
    .sort(sortByRatingAndReviews)
    .slice(0, limit)
    .map((seller) => ({
      name: seller.name,
      rating: seller.rating,
      reviews: seller.reviews,
      slug: seller.slug,
      cityName: seller.cityName,
      citySlug: seller.citySlug,
      categorySlug: seller.categorySlug,
      categoryName: seller.categoryName,
      plan: seller.plan,
      path: `/city/${seller.citySlug}/${seller.categorySlug}/${seller.slug}`,
    }));
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

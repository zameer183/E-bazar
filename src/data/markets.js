export const STORAGE_KEY = "eBazarShops";

const plans = ["Featured Store", "Standard Partner", "Premium Partner", "Free Partner"];

const createSellerList = ({ city, mobileCode, names, areas }) =>
  names.map((name, index) => {
    const area = areas[index % areas.length];
    const baseNumber = 5000000 + index * 137;
    const contact = `+92 3${mobileCode} ${String(baseNumber).padStart(7, "0")}`;
    const rating = Math.min(4.9, +(4.1 + (index * 0.07)).toFixed(1));
    const reviews = 60 + index * 13;
    const plan = plans[index % plans.length];

    return {
      name,
      address: `${area}, ${city}`,
      contact,
      rating,
      reviews,
      plan,
    };
  });

export const HERO_SLIDES = [
  { src: "/images/karachi.jpg", alt: "Mazar-e-Quaid, Karachi skyline" },
  { src: "/images/lahore.jpg", alt: "Minar-e-Pakistan, Lahore landmark" },
  { src: "/images/faisalabad-hero.jpg", alt: "Ghanta Ghar, Faisalabad clock tower" },
  { src: "/images/quetta.jpg", alt: "Miri Fort, Quetta hill view" },
  {
    src: "https://images.unsplash.com/photo-1606667366575-0400d7e3d34b?auto=format&fit=crop&w=1920&q=95",
    alt: "Faisal Mosque framed by Margalla Hills in Islamabad",
  },
  {
    src: "https://images.unsplash.com/photo-1615479635748-3b6a9839a9fd?auto=format&fit=crop&w=1920&q=95",
    alt: "Badshahi Mosque courtyard during golden hour in Lahore",
  },
  {
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1920&q=95",
    alt: "Hunza Valley with snow capped peaks",
  },
  {
    src: "https://images.unsplash.com/photo-1584367369853-8b966cf22b76?auto=format&fit=crop&w=1920&q=95",
    alt: "Derawar Fort standing tall in Cholistan Desert",
  },
  {
    src: "https://images.unsplash.com/photo-1578924548120-52185f8a0b23?auto=format&fit=crop&w=1920&q=95",
    alt: "Boats anchored at Gwadar coastline",
  },
  {
    src: "https://images.unsplash.com/photo-1625040925275-61ef17b6a76f?auto=format&fit=crop&w=1920&q=95",
    alt: "Shah Jahan Mosque domes in Thatta",
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

export const CATEGORY_OPTIONS = [
  { name: "Clothes", slug: "clothes" },
  { name: "Perfumes", slug: "perfumes" },
  { name: "Electronics", slug: "electronics" },
];

export const CITY_OPTIONS = BASE_CITY_MARKETS.map((city) => ({
  name: city.name,
  slug: city.slug,
}));

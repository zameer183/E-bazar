export const STORAGE_KEY = "eBazarShops";
export const CITIES_STORAGE_KEY = "eBazarCities";

const slugify = (text = "") =>
  text
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const createSellerSlug = (city, name) => slugify(`${city} ${name}`);

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

export const CATEGORY_OPTIONS = EXTENDED_CATEGORIES;

export const CATEGORY_TO_BAZAAR = {
  clothes: "fashion",
  electronics: "tech",
  perfumes: "fragrance",
};

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

const buildSellerEntry = (cityContext, categorySlug, seller, index = 0) => {
  if (!seller?.name) {
    throw new Error(`Seller at position ${index} in ${cityContext.slug}/${categorySlug} is missing a name.`);
  }

  const slug = (seller.slug && slugify(seller.slug)) || createSellerSlug(cityContext.slug, seller.name);
  const products = Array.isArray(seller.products)
    ? seller.products.map((product, productIndex) => {
        if (typeof product === "string") {
          return {
            name: product,
            price: "Price on request",
            slug: slugify(`${slug}-${product}`),
          };
        }
        if (!product?.name) {
          return {
            name: `Product ${productIndex + 1}`,
            price: product?.price ?? "Price on request",
            slug: slugify(`${slug}-product-${productIndex + 1}`),
          };
        }
        return {
          ...product,
          name: product.name,
          price: product.price ?? "Price on request",
          slug: product.slug ? slugify(product.slug) : slugify(`${slug}-${product.name}`),
        };
      })
    : [];

  return {
    ...seller,
    slug,
    plan: seller.plan || "Premium",
    address: seller.address || `${cityContext.name} city center`,
    contact: seller.contact || "+92 300 0000000",
    description:
      seller.description ||
      `${seller.name} curates trusted ${categorySlug.replace(/-/g, " ")} vendors serving ${cityContext.name}.`,
    products,
    rating: typeof seller.rating === "number" ? seller.rating : 0,
    reviews: typeof seller.reviews === "number" ? seller.reviews : 0,
    shopImage: seller.shopImage || cityContext.detailImage || cityContext.image,
    categorySlug,
    bazaarSlug: CATEGORY_TO_BAZAAR[categorySlug] ?? null,
    citySlug: cityContext.slug,
    cityName: cityContext.name,
  };
};

const assignIndustries = (city, assignments) => {
  const industries = createEmptyIndustries();
  Object.entries(assignments || {}).forEach(([categorySlug, sellers]) => {
    if (!industries[categorySlug]) {
      industries[categorySlug] = {
        name: slugify(categorySlug)
          .split("-")
          .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
          .join(" "),
        sellers: [],
      };
    }
    industries[categorySlug] = {
      ...industries[categorySlug],
      sellers: (sellers || []).map((seller, index) => buildSellerEntry(city, categorySlug, seller, index)),
    };
  });
  return industries;
};

const createCityMarket = ({ name, slug, image, detailImage, defaultCategory = "clothes", industries = {} }) => {
  const normalizedSlug = slugify(slug || name);
  const cityContext = {
    name,
    slug: normalizedSlug,
    image,
    detailImage: detailImage || image,
  };

  return {
    ...cityContext,
    defaultCategory,
    industries: assignIndustries(cityContext, industries),
  };
};

export const BASE_CITY_MARKETS = [
  createCityMarket({
    name: "Karachi",
    slug: "karachi",
    image: "/images/mazar-e-quaid.png",
    detailImage: "/images/mazar-e-quaid.png",
    defaultCategory: "clothes",
    industries: {
      clothes: [
        {
          name: "Clifton Couture Cooperative",
          plan: "Premium",
          address: "Block 5, Clifton, Karachi",
          contact: "+92 300 8212456",
          description:
            "Signature bridal couture, luxury pret, and artisan craftwork curated from Karachi's heritage ateliers.",
          shopImage: "/images/mazar-e-quaid.png",
          rating: 4.9,
          reviews: 132,
          products: [
            {
              name: "Hand-Embellished Bridal Lehenga",
              price: "PKR 185,000",
              image: "/images/mazar-e-quaid.png",
              description: "Mirrorwork couture layered with resham and zardozi detailing.",
            },
            {
              name: "Coastal Pret Collection",
              price: "PKR 14,500",
              image: "/images/mazar-e-quaid.png",
              description: "Lightweight lawn silhouettes finished in airy seaside palettes.",
            },
          ],
        },
        {
          name: "Zamzama Streetwear Loft",
          plan: "Standard",
          address: "Zamzama Commercial Lane 5, Karachi",
          contact: "+92 321 5529102",
          description:
            "Contemporary separates, smart-casual kurtas, and ready-to-wear capsules for city professionals.",
          rating: 4.6,
          reviews: 89,
          products: [
            {
              name: "Monsoon Linen Kurta",
              price: "PKR 6,950",
              description: "Breathable summer staple with contrast piping and hand-finished cuffs.",
            },
            {
              name: "Business Casual Capsule",
              price: "PKR 22,500",
              description: "Three-piece mix-and-match set tailored for hybrid work routines.",
            },
          ],
        },
      ],
      electronics: [
        {
          name: "Saddar Smart Hub",
          plan: "Premium",
          address: "Electronic Market, Saddar, Karachi",
          contact: "+92 308 7784210",
          description:
            "Flagship electronics and repair collective stocking flagship phones, gaming rigs, and smart-home installs.",
          rating: 4.8,
          reviews: 174,
          products: [
            {
              name: "Gaming PC Assembly (RTX Series)",
              price: "PKR 285,000",
              description: "Custom water-cooled gaming desktop with 3-year service support.",
            },
            {
              name: "Smart Apartment Automation Kit",
              price: "PKR 54,999",
              description: "App controlled lighting, security, and climate modules installed in 48 hours.",
            },
          ],
        },
      ],
      perfumes: [
        {
          name: "Makli Attar Atelier",
          plan: "Standard",
          address: "Burns Road Heritage Strip, Karachi",
          contact: "+92 333 4419001",
          description:
            "Small-batch attars inspired by coastal botanicals with bespoke layering consultations on-site.",
          rating: 4.7,
          reviews: 63,
          products: [
            {
              name: "Oud-e-Sindh Oil",
              price: "PKR 9,800",
              description: "Signature oud distillation aged in terracotta for 18 months.",
            },
            {
              name: "Seabreeze Musk Roller",
              price: "PKR 3,200",
              description: "Travel-friendly musk blend with sea salt accords and citrus zest.",
            },
          ],
        },
      ],
    },
  }),
  createCityMarket({
    name: "Lahore",
    slug: "lahore",
    image: "/images/lahore.jpg",
    detailImage: "/images/lahore.jpg",
    defaultCategory: "perfumes",
    industries: {
      perfumes: [
        {
          name: "Anarkali Itar Gallery",
          plan: "Premium",
          address: "Anarkali Bazaar Main Spine, Lahore",
          contact: "+92 321 8807645",
          description:
            "Heritage scent studio reviving Mughal-era attars with rosewater hydrosols and hand-crushed botanicals.",
          rating: 4.9,
          reviews: 151,
          products: [
            {
              name: "Rose Itar Royale",
              price: "PKR 7,200",
              description: "Bulgarian rose petals distilled at low heat for velvety projection.",
            },
            {
              name: "Amber Saffron Blend",
              price: "PKR 9,950",
              description: "Warm amber resin layered with Kashmiri saffron threads for winter evenings.",
            },
          ],
        },
        {
          name: "Walled City Essence Lab",
          plan: "Standard",
          address: "Delhi Gate, Lahore",
          contact: "+92 302 9901188",
          rating: 4.5,
          reviews: 54,
          products: [
            {
              name: "Itr-e-Sandal Supreme",
              price: "PKR 6,500",
              description: "Sandalwood distillate matured in cedar barrels for richer depth.",
            },
            {
              name: "Citrus Courtyard Mist",
              price: "PKR 2,950",
              description: "Uplifting spray blending kinnow zest with jasmine absolute.",
            },
          ],
        },
      ],
      clothes: [
        {
          name: "Liberty Silk Pavilion",
          plan: "Premium",
          address: "Liberty Market, Lahore",
          contact: "+92 343 7785001",
          description:
            "High-fashion drapery, handcrafted shawls, and bridal wear stitched by master karigars across Lahore.",
          rating: 4.8,
          reviews: 142,
          products: [
            {
              name: "Kashmiri Pashmina Shawl",
              price: "PKR 32,000",
              description: "Handwoven in muted jewel tones with ari embroidery borders.",
            },
            {
              name: "Heritage Bridal Maxi",
              price: "PKR 165,000",
              description: "Velvet panel work embellished with dabka, naqshi, and sequins.",
            },
          ],
        },
      ],
      electronics: [
        {
          name: "Hall Road Tech Collective",
          plan: "Standard",
          address: "Hall Road, Lahore",
          contact: "+92 345 1122245",
          description:
            "Laptop refurb, DSLR gear, and smart accessory bundles with on-site technician support.",
          rating: 4.4,
          reviews: 97,
          products: [
            {
              name: "Creator Laptop Bundle",
              price: "PKR 187,500",
              description: "Calibrated laptop, color-accurate monitor, and editing accessories with warranty.",
            },
            {
              name: "Mirrorless Starter Kit",
              price: "PKR 138,000",
              description: "Entry-level mirrorless camera paired with prime lens and gimbal stabilizer.",
            },
          ],
        },
      ],
    },
  }),
  createCityMarket({
    name: "Faisalabad",
    slug: "faisalabad",
    image: "/images/faisalabad.jpg",
    detailImage: "/images/faisalabad-hero.jpg",
    industries: {
      clothes: [
        {
          name: "Ghanta Ghar Textile Row",
          plan: "Standard",
          address: "Clock Tower Eight Bazaars, Faisalabad",
          contact: "+92 303 6642201",
          description:
            "Wholesale and retail textile specialists offering power-loom yardage, khaddar, and jacquard blends.",
          rating: 4.6,
          reviews: 118,
          products: [
            {
              name: "Winter Khaddar Suit Length",
              price: "PKR 3,850",
              description: "Three-piece unstitched khaddar set with digital shawl print.",
            },
            {
              name: "Mill-Dyed Lawn Bundle",
              price: "PKR 2,650",
              description: "Everyday lawn fabric in summer palette, sold per 3-meter bundle.",
            },
          ],
        },
      ],
      electronics: [
        {
          name: "D Ground Gadget Studio",
          plan: "Standard",
          address: "D Ground Commercial, Faisalabad",
          contact: "+92 345 2200912",
          description:
            "Smartphone, tablet repair, and accessory lounge with same-day service guarantees.",
          rating: 4.3,
          reviews: 64,
          products: [
            {
              name: "iPhone Display Replacement",
              price: "PKR 18,500",
              description: "OEM-grade panel change with complimentary battery health diagnostics.",
            },
            {
              name: "Android Power Bundle",
              price: "PKR 5,400",
              description: "Fast charger, power bank, and rugged case for daily commute protection.",
            },
          ],
        },
      ],
    },
  }),
  createCityMarket({
    name: "Islamabad",
    slug: "islamabad",
    image: "/images/islamabad.jpg",
    detailImage: "/images/islamabad.jpg",
    defaultCategory: "electronics",
    industries: {
      electronics: [
        {
          name: "Blue Area Innovation Hub",
          plan: "Premium",
          address: "Jinnah Avenue, Blue Area, Islamabad",
          contact: "+92 333 0099911",
          description:
            "Enterprise IT deployments, co-working hardware labs, and smart-home integrations for the capital's tech community.",
          rating: 4.8,
          reviews: 88,
          products: [
            {
              name: "Remote Office Power Pack",
              price: "PKR 145,000",
              description: "Enterprise laptop, docking station, and noise-cancelling headset bundle.",
            },
            {
              name: "Smart Villa Automation",
              price: "PKR 195,000",
              description: "Modular automation kit with multi-zone climate and security control.",
            },
          ],
        },
      ],
      clothes: [
        {
          name: "Saidpur Artisan Collective",
          plan: "Standard",
          address: "Saidpur Village, Islamabad",
          contact: "+92 300 6654321",
          description:
            "Handcrafted shawls, truck-art inspired casuals, and ethically sourced accessories from Potohar artisans.",
          rating: 4.5,
          reviews: 52,
          products: [
            {
              name: "Potohari Wool Shawl",
              price: "PKR 15,500",
              description: "Undyed lambswool with hand-embroidered motifs inspired by Margalla flora.",
            },
            {
              name: "Truck Art Denim Jacket",
              price: "PKR 9,200",
              description: "Statement outerwear painted by local artists using weather-sealed pigments.",
            },
          ],
        },
      ],
      perfumes: [
        {
          name: "Margalla Botanical Perfumery",
          plan: "Standard",
          address: "F-7 Markaz, Islamabad",
          contact: "+92 312 4478901",
          description:
            "Nature-forward perfume oils, reed diffusers, and candle blends inspired by the Margalla foothills.",
          rating: 4.6,
          reviews: 47,
          products: [
            {
              name: "Pine Mist Diffuser",
              price: "PKR 4,600",
              description: "Evergreen diffuser blend layered with vetiver and Himalayan cedar.",
            },
            {
              name: "Lotus Dawn Attar",
              price: "PKR 6,800",
              description: "Morning lotus accord balanced with neroli for daytime wear.",
            },
          ],
        },
      ],
    },
  }),
  createCityMarket({
    name: "Multan",
    slug: "multan",
    image: "/images/multan.jpg",
    detailImage: "/images/multan.jpg",
    industries: {
      clothes: [
        {
          name: "Hussain Agahi Handloom House",
          plan: "Standard",
          address: "Hussain Agahi Bazaar, Multan",
          contact: "+92 300 7766120",
          description:
            "Handloomed cotton, ajrak-inspired prints, and embroidered kurtas rooted in Multani craft traditions.",
          rating: 4.4,
          reviews: 72,
          products: [
            {
              name: "Multani Ajrak Shawl",
              price: "PKR 4,200",
              description: "Indigo hand-block print finished with vegetable dye borders.",
            },
            {
              name: "Desert Bloom Kurta",
              price: "PKR 5,950",
              description: "Tone-on-tone threadwork inspired by desert florals.",
            },
          ],
        },
      ],
      perfumes: [
        {
          name: "Shrine Courtyard Oud",
          plan: "Standard",
          address: "Near Shah Rukn-e-Alam Shrine, Multan",
          contact: "+92 331 4557811",
          description:
            "Pilgrimage-inspired attars blending oud, rose, and amber perfected through generations of perfumers.",
          rating: 4.7,
          reviews: 58,
          products: [
            {
              name: "Shrine Amber Blend",
              price: "PKR 8,400",
              description: "Amber and saffron accords matured in earthenware for a smoky finish.",
            },
            {
              name: "Multani Rose Oil",
              price: "PKR 6,100",
              description: "Rose petals infused with sandalwood for a soft daily wear fragrance.",
            },
          ],
        },
      ],
    },
  }),
  createCityMarket({
    name: "Peshawar",
    slug: "peshawar",
    image: "/images/peshawar.jpg",
    detailImage: "/images/peshawar.jpg",
    industries: {
      clothes: [
        {
          name: "Qissa Khwani Heritage Looms",
          plan: "Standard",
          address: "Qissa Khwani Bazaar, Peshawar",
          contact: "+92 312 9056678",
          description:
            "Warm woolens, karakul caps, and tribal embroideries sourced from the valleys surrounding Khyber Pass.",
          rating: 4.5,
          reviews: 81,
          products: [
            {
              name: "Chitrali Wool Cap",
              price: "PKR 2,100",
              description: "Handfelted cap with removable embroidered band crafted in Chitral.",
            },
            {
              name: "Swati Phulkari Shawl",
              price: "PKR 8,750",
              description: "Intricate geometric phulkari patterns stitched on raw silk.",
            },
          ],
        },
      ],
      electronics: [
        {
          name: "University Road Tech Arcade",
          plan: "Standard",
          address: "University Road, Peshawar",
          contact: "+92 336 4411200",
          description:
            "Student-focused gadget and repair arcade offering study laptops, e-learning tablets, and accessories.",
          rating: 4.2,
          reviews: 49,
          products: [
            {
              name: "Student Laptop Bundle",
              price: "PKR 96,500",
              description: "Lightweight laptop, backpack, and antivirus subscription pack.",
            },
            {
              name: "STEM Tablet Kit",
              price: "PKR 42,000",
              description: "Educational tablet preloaded with STEM learning modules and stylus.",
            },
          ],
        },
      ],
      perfumes: [
        {
          name: "Khyber Oud Merchants",
          plan: "Standard",
          address: "Ander Shehar Market, Peshawar",
          contact: "+92 333 8804422",
          description:
            "Deep oud blends and dry fruit inspired fragrances crafted for northern winters.",
          rating: 4.5,
          reviews: 53,
          products: [
            {
              name: "Khyber Oud Majestic",
              price: "PKR 10,400",
              description: "Intense oud accord balanced with saffron and cardamom.",
            },
            {
              name: "Dry Fruit Souk Mist",
              price: "PKR 4,950",
              description: "Warm gourmand body mist echoing Peshawar's famed dry fruit stalls.",
            },
          ],
        },
      ],
    },
  }),
  createCityMarket({
    name: "Bahawalpur",
    slug: "bahawalpur",
    image: "/images/bahawalpur.jpg",
    detailImage: "/images/bahawalpur.jpg",
    defaultCategory: "perfumes",
    industries: {
      perfumes: [
        {
          name: "Noor Mahal Essence Atelier",
          plan: "Standard",
          address: "Circular Road, Bahawalpur",
          contact: "+92 345 6601122",
          description:
            "Desert-inspired attars distilled with rose, amber, and indigenous botanicals from Cholistan artisans.",
          rating: 4.6,
          reviews: 41,
          products: [
            {
              name: "Cholistan Amber Oil",
              price: "PKR 8,200",
              image: "/images/bahawalpur.jpg",
              description: "Amber resin matured under desert sun with saffron and musk infusions.",
            },
            {
              name: "Noor Mahal Rose Mist",
              price: "PKR 4,350",
              image: "/images/lahore.jpg",
              description: "Hydrosol spray that blends rose petals with cooling vetiver for summer evenings.",
            },
          ],
        },
      ],
      clothes: [
        {
          name: "Cholistani Craft Collective",
          plan: "Standard",
          address: "Farid Gate Heritage Lane, Bahawalpur",
          contact: "+92 312 7710045",
          description:
            "Handloom embroidery, mirror work shawls, and desert-influenced fashion made by Bahawalpur cooperatives.",
          rating: 4.5,
          reviews: 52,
          products: [
            {
              name: "Mirrorwork Desert Shawl",
              price: "PKR 7,600",
              image: "/images/multan.jpg",
              description: "Hand-stitched mirror embellishments on sand-tone khaddar.",
            },
            {
              name: "Cholistan Ajrak Kurta",
              price: "PKR 5,200",
              image: "/images/faisalabad.jpg",
              description: "Vegetable dyed ajrak print tailored with modern silhouettes.",
            },
          ],
        },
      ],
    },
  }),
  createCityMarket({
    name: "Gujranwala",
    slug: "gujranwala",
    image: "/images/gujranwala.webp",
    detailImage: "/images/gujranwala.webp",
    defaultCategory: "electronics",
    industries: {
      electronics: [
        {
          name: "Sialkot Road Tech Plaza",
          plan: "Standard",
          address: "Sialkot Road Commercial Strip, Gujranwala",
          contact: "+92 300 4459813",
          description:
            "Gaming rigs, smart appliances, and industrial grade tools with in-house installation services.",
          rating: 4.4,
          reviews: 58,
          products: [
            {
              name: "Industrial Inverter Bundle",
              price: "PKR 118,000",
              image: "/images/gujranwala.webp",
              description: "Hybrid inverter kit tailored for workshops with three-year maintenance support.",
            },
            {
              name: "Smart Factory Surveillance Kit",
              price: "PKR 94,500",
              image: "/images/islamabad.jpg",
              description: "IP cameras, NVR, and remote monitoring tuned for Gujranwala industrial estates.",
            },
          ],
        },
      ],
      clothes: [
        {
          name: "Brandreth Street Textile Loft",
          plan: "Standard",
          address: "Brandreth Market, Gujranwala",
          contact: "+92 323 7704411",
          description:
            "Athleisure and denim production hub with direct-to-consumer drops from Gujranwala stitching units.",
          rating: 4.3,
          reviews: 44,
          products: [
            {
              name: "Heritage Denim Jacket",
              price: "PKR 8,950",
              image: "/images/mazar-e-quaid.png",
              description: "Stonewashed jacket finished with truck-art inspired cuff accents.",
            },
            {
              name: "Active Wear Capsule",
              price: "PKR 11,400",
              image: "/images/sialkot.jpg",
              description: "Four-piece athleisure set made with moisture-wicking export fabric.",
            },
          ],
        },
      ],
    },
  }),
  createCityMarket({
    name: "Sialkot",
    slug: "sialkot",
    image: "/images/sialkot.jpg",
    detailImage: "/images/sialkot.jpg",
    defaultCategory: "electronics",
    industries: {
      electronics: [
        {
          name: "Exporter Tech Labs",
          plan: "Standard",
          address: "Airport Road, Sialkot",
          contact: "+92 302 6651945",
          description:
            "Product design studios offering CAD equipment, 3D printing, and smart logistics tools for exporters.",
          rating: 4.7,
          reviews: 63,
          products: [
            {
              name: "3D Prototyping Suite",
              price: "PKR 215,000",
              image: "/images/sialkot.jpg",
              description: "Industrial 3D printer, scanner, and filament package optimized for sports goods makers.",
            },
            {
              name: "Exporter Analytics Console",
              price: "PKR 146,000",
              image: "/images/gujranwala.webp",
              description: "Touchscreen console with shipment tracking, QA dashboards, and RFID reader support.",
            },
          ],
        },
      ],
      clothes: [
        {
          name: "Cantt Sportswear Foundry",
          plan: "Standard",
          address: "Sialkot Cantt Sports Cluster",
          contact: "+92 333 8804217",
          description:
            "High-performance sports kits, goalkeeper gloves, and leather goods crafted for export leagues.",
          rating: 4.8,
          reviews: 71,
          products: [
            {
              name: "Elite Football Kit",
              price: "PKR 9,200",
              image: "/images/faisalabad-hero.jpg",
              description: "Breathable jersey, shorts, and socks tailored to FIFA compliance standards.",
            },
            {
              name: "Pro Keeper Gloves",
              price: "PKR 6,500",
              image: "/images/peshawar.jpg",
              description: "Hybrid latex palms with customizable grip zones used by national league players.",
            },
          ],
        },
      ],
    },
  }),
  createCityMarket({
    name: "Quetta",
    slug: "quetta",
    image: "/images/peshawar.jpg",
    detailImage: "/images/peshawar.jpg",
    defaultCategory: "perfumes",
    industries: {
      perfumes: [
        {
          name: "Hanna Lake Aroma House",
          plan: "Standard",
          address: "Jinnah Road, Quetta",
          contact: "+92 333 2241908",
          description:
            "Mountain-inspired attars blending juniper, pine, and saffron sourced from Balochistan valleys.",
          rating: 4.7,
          reviews: 59,
          products: [
            {
              name: "Juniper Ridge Attar",
              price: "PKR 7,950",
              image: "/images/peshawar.jpg",
              description: "Fresh juniper accord layered with cedar and patchouli for crisp highland mornings.",
            },
            {
              name: "Saffron Ember Elixir",
              price: "PKR 11,400",
              image: "/images/bahawalpur.jpg",
              description: "Saffron threads infused with amber and oud for ceremonial evenings.",
            },
          ],
        },
      ],
      clothes: [
        {
          name: "Ziarat Wool Collective",
          plan: "Standard",
          address: "M.A. Jinnah Road Bazaar, Quetta",
          contact: "+92 312 4418890",
          description:
            "Handwoven shawls, Balochi mirrorwork, and nomadic textiles crafted in the Ziarat hills.",
          rating: 4.6,
          reviews: 47,
          products: [
            {
              name: "Balochi Mirrorwork Shawl",
              price: "PKR 12,800",
              image: "/images/multan.jpg",
              description: "Traditional mirror embroidery stitched onto charcoal lambswool.",
            },
            {
              name: "Ziarat Pine Poncho",
              price: "PKR 9,400",
              image: "/images/faisalabad.jpg",
              description: "Handloomed poncho dyed with natural pine pigments for alpine evenings.",
            },
          ],
        },
      ],
    },
  }),
];

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

export const getPerfumeSellersForCity = (citySlug) => {
  if (!citySlug) return [];
  const city = getCityBySlug(citySlug);
  return city?.industries?.perfumes?.sellers || [];
};
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

const flattenBaseSellers = () =>
  BASE_CITY_MARKETS.flatMap((city) =>
    Object.entries(city.industries || {}).flatMap(([categorySlug, industry]) =>
      (industry.sellers || []).map((seller) => ({
        ...seller,
        citySlug: city.slug,
        cityName: city.name,
        categorySlug,
        categoryName: industry.name,
        bazaarSlug: CATEGORY_TO_BAZAAR[categorySlug] ?? seller.bazaarSlug ?? null,
        path: `/city/${city.slug}/${categorySlug}/${seller.slug}`,
      }))
    )
  );

export const createProductShowcase = (limit = 12) => {
  const entries = [];
  const sellers = flattenBaseSellers();
  sellers.forEach((seller) => {
    (seller.products || []).slice(0, 2).forEach((product) => {
      entries.push({
        name: product.name,
        price: product.price,
        sellerName: seller.name,
        sellerPath: seller.path,
        cityName: seller.cityName,
        citySlug: seller.citySlug,
        image: product.image || seller.shopImage,
        rating: product.rating ?? seller.rating ?? 0,
        reviews: product.reviews ?? seller.reviews ?? 0,
      });
    });
  });
  return entries.slice(0, limit);
};

export const getTopRatedSellers = (limit = 12) => {
  const sellers = flattenBaseSellers();
  return sellers
    .sort((a, b) => {
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }
      if (b.reviews !== a.reviews) {
        return b.reviews - a.reviews;
      }
      return a.name.localeCompare(b.name);
    })
    .slice(0, limit)
    .map((seller) => ({
      name: seller.name,
      slug: seller.slug,
      citySlug: seller.citySlug,
      cityName: seller.cityName,
      categorySlug: seller.categorySlug,
      categoryName: seller.categoryName,
      rating: seller.rating,
      reviews: seller.reviews,
      path: `/city/${seller.citySlug}/${seller.categorySlug}/${seller.slug}`,
      shopImage: seller.shopImage,
    }));
};

"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const DEFAULT_LANGUAGE = "en";

const DICTIONARIES = {
  en: {
    "nav.logo": "E-Bazar",
    "nav.home": "Home",
    "nav.about": "About Us",
    "nav.reviews": "Customer Reviews",
    "nav.dashboard": "My Dashboard",
    "nav.registerShop": "Register Shop",
    "nav.login": "Login",
    "nav.logout": "Logout",
    "nav.logout.confirmTitle": "Logout Confirmation",
    "nav.logout.confirmMessage": "Are you sure you want to logout?",
    "nav.logout.cancel": "Cancel",
    "nav.logout.confirm": "Yes, Logout",
    "nav.accountControls.title": "Account Controls",
    "nav.accountControls.subtitle": "Manage your profile and sessions.",
    "nav.account.profile": "Profile Settings",
    "nav.account.profile.cta": "Update details, avatar, and password.",
    "nav.account.logout.cta": "Sign out from this device.",
    "nav.auth.signUp": "Sign Up",
    "nav.auth.login": "Login",
    "nav.language.english": "English",
    "nav.language.urdu": "اردو",
    "common.close": "Close",
    "home.hero.title": "Shop Islamabad's Aabpara Market Online",
    "home.hero.subtitle":
      "Discover Islamabad's oldest wholesale bazaar with verified vendors ready to ship across Pakistan.",
    "home.topRated.title": "Top Rated Sellers Across Pakistan",
    "home.topRated.subtitle":
      "Discover the stalls buyers trust the most for service, quality, and fast delivery no matter where they order from.",
    "home.topRated.empty":
      "Listings will appear here once verified sellers start collecting real reviews. Add your shop to begin building trust with buyers.",
    "home.topRated.cta": "Browse Pakistan-wide champions",
    "home.city.viewAll": "View All Cities",
    "home.city.viewAllHint": "See every marketplace across Pakistan",
    "cities.title": "Pakistan Bazaar Directory",
    "cities.subtitle":
      "Explore wholesale hubs from Islamabad to Karachi and connect with trusted market associations across the country.",
    "cities.card.cta": "View marketplace",
    "footer.marketplaceDirectory": "Marketplace Directory",
    "footer.marketplaceDirectory.subtitle":
      "Explore Pakistan's bazaar taxonomy to find the category you need.",
    "footer.empty": "No bazaar categories match that search. Try another keyword.",
    "search.cityLabel": "City",
    "search.bazaarLabel": "Search the bazaar",
    "search.placeholder": "Enter category, subcategory, seller, or product name...",
    "search.submit": "Search",
    "search.recent": "Recent search",
    "search.bazaar": "Bazaar",
    "search.product": "Product",
    "search.fragranceHighlight": "Fragrance Highlight",
    "search.noResults": "Product will be listed soon InshAllah",
    "search.validation.city": "Please select a city first",
    "search.validation.query": "Please enter a category, subcategory, seller, or product to search",
    "search.validation.noMatches": "Product will be listed soon InshAllah",
    "service.note": "We only provide an online bazaar. Sellers handle payments & delivery directly.",
    "bazaar.chooseLane": "Choose Your Lane",
    "bazaar.chooseLane.subtitle":
      "Select the subcategory that fits your need and dive straight into the {bazaar} listings for {city}.",
    "bazaar.focusNote": 'Showing options related to "{focus}".',
    "bazaar.fragrance.highlights": "Signature Fragrance Highlights",
    "bazaar.fragrance.highlights.subtitle": "Discover iconic scent profiles adored by shoppers across {city}.",
    "bazaar.fragrance.featured": "Featured Fragrance Houses",
    "bazaar.fragrance.featured.subtitle":
      "Explore reputed perfume houses within {city} offering attars, sprays, and bespoke scent services.",
    "bazaar.notAvailable.title": "Marketplace Not Available",
    "bazaar.notAvailable.subtitle": "This bazaar is not configured for the selected city yet.",
    "dashboard.payments.title": "Payments & Delivery",
    "dashboard.payments.subtitle":
      "Generate payment links and request delivery quotes directly from your seller workspace.",
    "dashboard.payments.paymentTitle": "Collect a Payment",
    "dashboard.payments.amount": "Amount (PKR)",
    "dashboard.payments.provider": "Payment Provider",
    "dashboard.payments.submit": "Create Payment Link",
    "dashboard.payments.pending": "Processing payment request...",
    "dashboard.payments.success": "Payment link ready",
    "dashboard.payments.result.reference": "Reference",
    "dashboard.payments.result.amount": "Amount",
    "dashboard.payments.result.status": "Status",
    "dashboard.payments.result.url": "Checkout URL",
    "dashboard.payments.deliveryTitle": "Book a Delivery",
    "dashboard.payments.weight": "Parcel Weight (kg)",
    "dashboard.payments.origin": "Pickup Area",
    "dashboard.payments.destination": "Delivery Area",
    "dashboard.payments.deliveryProvider": "Courier",
    "dashboard.payments.deliverySubmit": "Get Delivery Quote",
    "dashboard.payments.deliveryPending": "Requesting delivery quote...",
    "dashboard.payments.deliverySuccess": "Delivery quote received",
    "dashboard.payments.result.estimate": "Estimated Cost",
    "dashboard.payments.result.transit": "Transit Time",
    "dashboard.payments.result.provider": "Provider",
    "dashboard.payments.error": "Unable to complete the request. Please try again later.",
  },
  ur: {
    "nav.logo": "ای بازار",
    "nav.home": "ہوم",
    "nav.about": "ہمارے بارے میں",
    "nav.reviews": "صارفین کی آراء",
    "nav.dashboard": "میرا ڈیش بورڈ",
    "nav.registerShop": "دوکان رجسٹر کریں",
    "nav.login": "لاگ اِن",
    "nav.logout": "لاگ آؤٹ",
    "nav.logout.confirmTitle": "لاگ آؤٹ کی تصدیق",
    "nav.logout.confirmMessage": "کیا آپ واقعی لاگ آؤٹ کرنا چاہتے ہیں؟",
    "nav.logout.cancel": "منسوخ کریں",
    "nav.logout.confirm": "جی ہاں، لاگ آؤٹ کریں",
    "nav.accountControls.title": "اکاؤنٹ کنٹرول",
    "nav.accountControls.subtitle": "اپنی پروفائل اور سیشنز کا انتظام کریں۔",
    "nav.account.profile": "پروفائل سیٹنگز",
    "nav.account.profile.cta": "تفصیلات، تصویر اور پاس ورڈ اپ ڈیٹ کریں۔",
    "nav.account.logout.cta": "اس ڈیوائس سے لاگ آؤٹ کریں۔",
    "nav.auth.signUp": "سائن اَپ",
    "nav.auth.login": "لاگ اِن",
    "nav.language.english": "English",
    "nav.language.urdu": "اردو",
    "common.close": "بند کریں",
    "home.hero.title": "اسلام آباد کا آبپارہ بازار اب آن لائن",
    "home.hero.subtitle":
      "اسلام آباد کے قدیم ہول سیل بازار کی تصدیق شدہ دوکانیں اب پورے پاکستان میں ڈیلیور کے لیے دستیاب ہیں۔",
    "home.topRated.title": "پاکستان بھر کے اعلیٰ درجہ فروش",
    "home.topRated.subtitle":
      "جہاں سے بھی آرڈر کریں، بہترین خدمت، معیار اور تیز ترسیل کے لیے معتبر دوکانیں دریافت کریں۔",
    "home.topRated.empty":
      "جیسے ہی تصدیق شدہ فروش حقیقی جائزے حاصل کریں گے، یہاں فہرست ظاہر ہوگی۔ اعتماد بنانے کے لیے اپنی دوکان شامل کریں۔",
    "home.topRated.cta": "پاکستان بھر کے چیمپئنز دیکھیں",
    "home.city.viewAll": "تمام شہر دیکھیں",
    "home.city.viewAllHint": "پاکستان کے تمام بازار دیکھیں",
    "cities.title": "پاکستان بازار ڈائریکٹری",
    "cities.subtitle":
      "اسلام آباد سے کراچی تک ہول سیل مراکز دریافت کریں اور ملک بھر کے قابلِ اعتماد تاجروں سے جڑیں۔",
    "cities.card.cta": "بازار دیکھیں",
    "footer.marketplaceDirectory": "بازار ڈائریکٹری",
    "footer.marketplaceDirectory.subtitle":
      "اپنی ضرورت کے مطابق پاکستان کے بازاروں کی درجہ بندی دیکھیں۔",
    "footer.empty": "اس تلاش سے کوئی بازار نہیں ملا۔ براہ کرم دوسرا لفظ آزمائیں۔",
    "search.cityLabel": "شہر",
    "search.bazaarLabel": "بازار میں تلاش کریں",
    "search.placeholder": "زمرہ، ذیلی زمرہ، دوکان یا مصنوعات کا نام درج کریں...",
    "search.submit": "تلاش کریں",
    "search.recent": "حالیہ تلاش",
    "search.bazaar": "بازار",
    "search.product": "مصنوع",
    "search.fragranceHighlight": "خوشبو کی جھلک",
    "search.noResults": "مصنوع جلد شامل کر دی جائے گی ان شاء اللہ",
    "search.validation.city": "براہ کرم پہلے شہر منتخب کریں",
    "search.validation.query": "براہ کرم تلاش کے لیے زمرہ، ذیلی زمرہ، دوکان یا مصنوع درج کریں",
    "search.validation.noMatches": "مصنوع جلد شامل کر دی جائے گی ان شاء اللہ",
    "service.note": "ہم صرف آن لائن بازار فراہم کرتے ہیں۔ ادائیگی اور ڈیلیوری فروش خود سنبھالتے ہیں۔",
    "bazaar.chooseLane": "اپنی لین منتخب کریں",
    "bazaar.chooseLane.subtitle":
      "{city} کے لیے {bazaar} کی فہرستوں میں براہ راست جائیں اور اپنی ضرورت کے مطابق ذیلی زمرہ منتخب کریں۔",
    "bazaar.focusNote": '"{focus}" سے متعلق آپشنز دکھائے جا رہے ہیں۔',
    "bazaar.fragrance.highlights": "خوشبو کی نمایاں جھلکیاں",
    "bazaar.fragrance.highlights.subtitle": "{city} کے خریداروں کی پسندیدہ خوشبوؤں سے لطف اٹھائیں۔",
    "bazaar.fragrance.featured": "نمایاں خوشبویات کی دوکانیں",
    "bazaar.fragrance.featured.subtitle":
      "{city} کے اندر اطر، اسپرے اور خصوصی خوشبو خدمات پیش کرنے والی معتبر دوکانیں تلاش کریں۔",
    "bazaar.notAvailable.title": "بازار دستیاب نہیں",
    "bazaar.notAvailable.subtitle": "یہ بازار فی الحال منتخب شہر کے لیے دستیاب نہیں ہے۔",
    "dashboard.payments.title": "ادائیگیاں اور ڈیلیوری",
    "dashboard.payments.subtitle":
      "اپنے فروش ڈیش بورڈ سے ادائیگی کے لنک بنائیں اور ڈیلیوری کوٹس حاصل کریں۔",
    "dashboard.payments.paymentTitle": "ادائیگی وصول کریں",
    "dashboard.payments.amount": "رقم (روپے)",
    "dashboard.payments.provider": "ادائیگی فراہم کنندہ",
    "dashboard.payments.submit": "ادائیگی کا لنک بنائیں",
    "dashboard.payments.pending": "ادائیگی کی درخواست پر عمل ہو رہا ہے...",
    "dashboard.payments.success": "ادائیگی کا لنک تیار ہے",
    "dashboard.payments.result.reference": "حوالہ نمبر",
    "dashboard.payments.result.amount": "رقم",
    "dashboard.payments.result.status": "حالت",
    "dashboard.payments.result.url": "چیک آؤٹ لنک",
    "dashboard.payments.deliveryTitle": "ڈیلیوری بک کریں",
    "dashboard.payments.weight": "پارسل وزن (کلوگرام)",
    "dashboard.payments.origin": "پک اپ علاقہ",
    "dashboard.payments.destination": "ڈیلیوری علاقہ",
    "dashboard.payments.deliveryProvider": "کورئیر",
    "dashboard.payments.deliverySubmit": "ڈیلیوری کوٹ حاصل کریں",
    "dashboard.payments.deliveryPending": "ڈیلیوری کوٹ حاصل کیا جا رہا ہے...",
    "dashboard.payments.deliverySuccess": "ڈیلیوری کوٹ موصول ہوا",
    "dashboard.payments.result.estimate": "متوقع خرچ",
    "dashboard.payments.result.transit": "سفر کا وقت",
    "dashboard.payments.result.provider": "فراہم کنندہ",
    "dashboard.payments.error": "درخواست مکمل نہیں ہو سکی۔ براہ کرم دوبارہ کوشش کریں۔",
  },
};

const DirectionMap = {
  en: "ltr",
  ur: "rtl",
};

const LanguageContext = createContext({
  language: DEFAULT_LANGUAGE,
  setLanguage: () => {},
  t: (key, fallback, replacements) => (replacements, fallback, key),
});

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    if (typeof window === "undefined") {
      return DEFAULT_LANGUAGE;
    }
    try {
      const stored = window.localStorage.getItem("ebazar:language");
      if (stored && DICTIONARIES[stored]) {
        return stored;
      }
    } catch (error) {
      console.warn("Unable to read stored language", error);
    }
    return DEFAULT_LANGUAGE;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem("ebazar:language", language);
    } catch (error) {
      console.warn("Unable to persist language preference", error);
    }
    const html = document.documentElement;
    html.setAttribute("lang", language);
    html.setAttribute("dir", DirectionMap[language] || "ltr");
  }, [language]);

  const translate = useMemo(
    () => (key, fallback, replacements = {}) => {
      const dictionary = DICTIONARIES[language] || {};
      const template = dictionary[key] ?? fallback ?? key;
      if (!template) {
        return "";
      }
      return template.replace(/\{(\w+)\}/g, (_, token) => {
        const replacement = replacements[token];
        return replacement !== undefined ? replacement : `{${token}}`;
      });
    },
    [language],
  );

  const contextValue = useMemo(
    () => ({
      language,
      setLanguage,
      t: translate,
    }),
    [language, translate],
  );

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>;
};

export const useI18n = () => useContext(LanguageContext);

"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import styles from "./page.module.css";

const SELLER_REVIEWS = [
  {
    id: 1,
    name: "Ahmed Khan",
    business: "Karachi Silk House",
    city: "Karachi",
    rating: 5,
    review: "E-Bazar gave my small textile shop a digital presence overnight. Now customers from Lahore and Islamabad find me easily. The platform is simple to use and brings real buyers.",
  },
  {
    id: 2,
    name: "Fatima Noor",
    business: "Anarkali Heritage Looms",
    city: "Lahore",
    rating: 5,
    review: "I was hesitant about going digital, but E-Bazar made it effortless. The bazaar-style categorization helps customers discover my traditional clothing without me spending on ads.",
  },
  {
    id: 3,
    name: "Muhammad Bilal",
    business: "Faisalabad Tech Point",
    city: "Faisalabad",
    rating: 5,
    review: "Within weeks of listing my electronics shop, I started receiving inquiries from all over Punjab. E-Bazar understands how Pakistani markets work - it's like bringing the bazaar online.",
  },
  {
    id: 4,
    name: "Ayesha Malik",
    business: "Clifton Essence Vault",
    city: "Karachi",
    rating: 5,
    review: "As a perfume seller, reaching the right audience was always a challenge. E-Bazar's category system connects me with customers specifically looking for attars and fragrances.",
  },
  {
    id: 5,
    name: "Hassan Raza",
    business: "Gulberg Couture House",
    city: "Lahore",
    rating: 5,
    review: "The best part? No complicated setup or monthly fees eating into my profits. Just list your products and start selling. E-Bazar respects the traditional seller-buyer relationship.",
  },
  {
    id: 6,
    name: "Zainab Qureshi",
    business: "Quetta Shawl Specialists",
    city: "Quetta",
    rating: 5,
    review: "Living in Quetta, I thought online selling was only for big cities. E-Bazar proved me wrong - now my handmade shawls reach customers in Karachi and beyond.",
  },
  {
    id: 7,
    name: "Imran Siddiqui",
    business: "Saddar Digital Mart",
    city: "Karachi",
    rating: 4,
    review: "E-Bazar brings visibility without forcing me to change how I do business. I handle my own payments and delivery - the platform just connects me with serious buyers.",
  },
  {
    id: 8,
    name: "Sana Ashraf",
    business: "Liberty Fragrance Lounge",
    city: "Lahore",
    rating: 5,
    review: "I appreciate how E-Bazar organizes everything by city and industry. Customers trust the familiar bazaar layout, which means they trust us sellers too.",
  },
  {
    id: 9,
    name: "Tariq Mahmood",
    business: "Rail Bazaar Tech Junction",
    city: "Faisalabad",
    rating: 5,
    review: "After trying expensive platforms with hidden fees, E-Bazar was refreshing. Straightforward, honest, and actually designed for Pakistani businesses.",
  },
  {
    id: 10,
    name: "Mariam Shah",
    business: "Bahawalpur Boutique Lane",
    city: "Bahawalpur",
    rating: 4,
    review: "E-Bazar helped my boutique reach customers I never could have accessed otherwise. The platform feels authentic to our culture and business traditions.",
  },
  {
    id: 11,
    name: "Usman Ali",
    business: "Peshawar Electronics Hub",
    city: "Peshawar",
    rating: 5,
    review: "I was struggling to compete with online giants. E-Bazar leveled the playing field - now my local shop gets the same visibility while I keep my margins.",
  },
  {
    id: 12,
    name: "Nida Farooq",
    business: "Multan Fashion Emporium",
    city: "Multan",
    rating: 5,
    review: "What I love most is how E-Bazar preserves the personal touch of bazaar shopping while giving us a digital reach. Best of both worlds for sellers like me.",
  },
];

const BUYER_REVIEWS = [
  {
    id: 1,
    name: "Saad Ahmed",
    city: "Islamabad",
    rating: 5,
    review: "Finding authentic traditional clothing was always a hassle. E-Bazar's city-wise organization helped me discover amazing sellers in Lahore's Anarkali area without traveling.",
  },
  {
    id: 2,
    name: "Hira Waseem",
    city: "Karachi",
    rating: 5,
    review: "I love how E-Bazar feels like walking through a real bazaar - organized by lanes and industries. Found the perfect perfume shop in my own city that I didn't know existed!",
  },
  {
    id: 3,
    name: "Kamran Hussain",
    city: "Lahore",
    rating: 5,
    review: "The seller ratings and reviews give me confidence. I bought electronics from a Karachi shop and the seller was professional and delivered exactly what was promised.",
  },
  {
    id: 4,
    name: "Rabia Khan",
    city: "Faisalabad",
    rating: 4,
    review: "E-Bazar brings transparency to online shopping in Pakistan. I can see actual shops, contact details, and genuine reviews - no fake listings or scams.",
  },
  {
    id: 5,
    name: "Ali Hassan",
    city: "Rawalpindi",
    rating: 5,
    review: "Finally, a platform that understands how Pakistanis actually shop! The bazaar categories make it so easy to find what I need without endless scrolling.",
  },
  {
    id: 6,
    name: "Mehwish Tariq",
    city: "Multan",
    rating: 5,
    review: "I discovered so many local sellers I never knew about. E-Bazar supports our local businesses while giving buyers like me convenience and variety.",
  },
  {
    id: 7,
    name: "Bilal Akram",
    city: "Karachi",
    rating: 5,
    review: "Shopping on E-Bazar feels safe and trustworthy. The top-rated sellers section helped me find reliable shops for my clothing business purchases.",
  },
  {
    id: 8,
    name: "Samina Iqbal",
    city: "Lahore",
    rating: 5,
    review: "The search is so intuitive! I found exactly the boutique I was looking for in my preferred neighborhood. E-Bazar makes local shopping accessible from home.",
  },
  {
    id: 9,
    name: "Waqas Ahmed",
    city: "Sialkot",
    rating: 4,
    review: "As someone who values quality, E-Bazar's verified sellers and honest reviews help me make informed decisions. No more gambling with unknown online stores.",
  },
  {
    id: 10,
    name: "Farah Naz",
    city: "Peshawar",
    rating: 5,
    review: "E-Bazar connected me with heritage textile sellers from across Pakistan. The platform celebrates our bazaar culture while offering modern convenience.",
  },
  {
    id: 11,
    name: "Danish Malik",
    city: "Hyderabad",
    rating: 5,
    review: "I appreciate that E-Bazar doesn't interfere with payments - I deal directly with sellers, which builds trust. It's a marketplace, not a middleman.",
  },
  {
    id: 12,
    name: "Amna Rauf",
    city: "Quetta",
    rating: 4,
    review: "Living in Quetta, accessing variety was difficult. E-Bazar opened up sellers from all over Pakistan while still highlighting local Quetta businesses too!",
  },
];

export default function ReviewsPage() {
  const [activeTab, setActiveTab] = useState("all");

  const displayReviews = activeTab === "sellers"
    ? SELLER_REVIEWS
    : activeTab === "buyers"
    ? BUYER_REVIEWS
    : [...SELLER_REVIEWS, ...BUYER_REVIEWS].sort(() => Math.random() - 0.5);

  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <div className={styles.page}>
      <Navbar />

      <header className={styles.header}>
        <nav className={styles.breadcrumbs}>
          <Link href="/">Home</Link>
          <span>/</span>
          <span>Reviews</span>
        </nav>
      </header>

      <div className={styles.hero}>
        <h1>What Pakistan Says About E-Bazar</h1>
        <p>
          Real voices from sellers and buyers across the nation. From Karachi to Quetta,
          hear how E-Bazar is transforming the way Pakistan does business online.
        </p>
      </div>

      <div className={styles.tabBar}>
        <button
          className={activeTab === "all" ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab("all")}
        >
          All Reviews ({SELLER_REVIEWS.length + BUYER_REVIEWS.length})
        </button>
        <button
          className={activeTab === "sellers" ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab("sellers")}
        >
          Seller Stories ({SELLER_REVIEWS.length})
        </button>
        <button
          className={activeTab === "buyers" ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab("buyers")}
        >
          Buyer Experiences ({BUYER_REVIEWS.length})
        </button>
      </div>

      <div className={styles.masonryGrid}>
        {displayReviews.map((review) => (
          <article key={`${review.id}-${review.business || review.city}`} className={styles.reviewCard}>
            <div className={styles.reviewHeader}>
              <div className={styles.reviewAvatar}>
                {review.name.charAt(0)}
              </div>
              <div className={styles.reviewInfo}>
                <h3>{review.name}</h3>
                {review.business && (
                  <p className={styles.business}>{review.business}</p>
                )}
                <p className={styles.location}>{review.city}</p>
              </div>
            </div>
            <div className={styles.reviewRating}>
              {renderStars(review.rating)}
            </div>
            <p className={styles.reviewText}>{review.review}</p>
            <div className={styles.reviewBadge}>
              {review.business ? "Verified Seller" : "Verified Buyer"}
            </div>
          </article>
        ))}
      </div>

      <div className={styles.cta}>
        <h2>Join Thousands of Happy Sellers & Buyers</h2>
        <p>Start your journey with E-Bazar today and experience the difference.</p>
        <div className={styles.ctaButtons}>
          <Link href="/register" className={styles.ctaButton}>
            Register Your Business
          </Link>
          <Link href="/" className={styles.ctaButtonSecondary}>
            Start Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

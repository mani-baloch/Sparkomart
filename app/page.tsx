import React from "react";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/home/Hero";
import { CategorySection } from "@/components/home/CategorySection";
import { ProductSection } from "@/components/home/ProductSection";
import { BenefitsSection } from "@/components/home/BenefitsSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { Footer } from "@/components/layout/Footer";
import { products } from "@/data/products";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Fixed Top Header System (Announcement Bar + Blurry Navbar) */}
      <div className="sticky top-0 z-40 w-full shadow-xs">
        <AnnouncementBar />
        <Navbar />
      </div>

      <main className="flex-1">
        {/* 3. Hero Section */}
        <Hero />

        {/* 4. Shop by Category Section */}
        <CategorySection />

        {/* 5. Top Rated Products */}
        <ProductSection
          id="top-rated"
          title="Top Rated Products"
          subtitle="Highly rated items across all categories with excellent customer reviews"
          products={products}
        />

        {/* 6. Featured Products */}
        <ProductSection
          id="featured"
          title="Featured Products"
          subtitle="Discover amazing deals across all categories – from health & beauty to automotive parts."
          products={products}
          showCtaButton={true}
        />

        {/* 7. Benefits / Trust Section */}
        <BenefitsSection />

        {/* 8. Newsletter Section */}
        <NewsletterSection />
      </main>

      {/* 9. Footer */}
      <Footer />
    </div>
  );
}

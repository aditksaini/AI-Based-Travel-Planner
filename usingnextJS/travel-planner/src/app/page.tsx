"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MapPlaceholder from "@/components/MapPlaceholder";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      {/* Global Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 hero-glow opacity-60"></div>
        <div className="absolute top-0 left-1/4 w-[1000px] h-[1000px] bg-cyber/5 blur-[160px] rounded-full -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-violet/5 blur-[140px] rounded-full translate-y-1/2"></div>
      </div>

      <Navbar />
      <HeroSection />
      <MapPlaceholder />
      <FeaturesSection />
      <Footer />
    </>
  );
}

"use client";

import React, { useState, useEffect } from "react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    // Check on mount as well
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
        ? "bg-black/40 backdrop-blur-md border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
        : "bg-transparent border-b border-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="font-outfit text-2xl font-extrabold tracking-tighter text-white relative z-50">
          AERO<span className="text-cyber">STRIDE</span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium tracking-wide">
          <a href="#features" className="text-slate-300 hover:text-cyber transition-colors uppercase">Features</a>

          {/* Trips Dropdown */}
          <div className="relative group">
            <button className="text-slate-300 hover:text-cyber transition-colors uppercase flex items-center gap-1">
              Trips
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div className="absolute top-full left-0 mt-2 w-48 bg-black/80 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top translate-y-2 group-hover:translate-y-0">
              <div className="p-2 flex flex-col space-y-1">
                <a href="#trip-mussoorie" className="px-4 py-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-md transition-colors text-sm font-medium">Mussoorie</a>
                <a href="#trip-goa" className="px-4 py-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-md transition-colors text-sm font-medium">Goa</a>
                <a href="#trip-kerala" className="px-4 py-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-md transition-colors text-sm font-medium">Kerala</a>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6 pl-6 border-l border-white/10">
            <a href="#login" className="text-slate-300 hover:text-white transition-colors font-semibold uppercase">Log In</a>
            <a href="#start" className="px-6 py-2.5 bg-white text-black font-bold rounded-sm border border-transparent hover:bg-transparent hover:text-white hover:border-white hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all duration-300">
              PLAN A TRIP
            </a>
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden text-white z-50 p-2 relative"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="sr-only">Toggle menu</span>
          {isMobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`
        fixed inset-0 bg-black/95 backdrop-blur-xl z-40 transition-all duration-300 md:hidden overflow-y-auto
        flex flex-col items-center justify-center py-20 space-y-6
        ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}
      `}>
        <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-outfit font-bold text-white hover:text-cyber transition-colors uppercase tracking-widest">Features</a>

        <div className="flex flex-col items-center space-y-4 pt-4">
          <span className="text-sm font-mono text-slate-500 uppercase tracking-[0.3em] mb-2">Demo Trips</span>
          <a href="#trip-mussoorie" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-outfit font-bold text-white hover:text-cyber transition-colors uppercase tracking-widest">Mussoorie</a>
          <a href="#trip-goa" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-outfit font-bold text-white hover:text-cyber transition-colors uppercase tracking-widest">Goa</a>
          <a href="#trip-kerala" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-outfit font-bold text-white hover:text-cyber transition-colors uppercase tracking-widest">Kerala</a>
        </div>

        <div className="h-px w-24 bg-white/10 my-4"></div>

        <a href="#login" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-outfit font-bold text-slate-300 hover:text-white transition-colors uppercase tracking-widest">Log In</a>
        <a href="#start" onClick={() => setIsMobileMenuOpen(false)} className="px-8 py-4 bg-white text-black font-bold rounded-sm border border-transparent hover:bg-transparent hover:text-white hover:border-white transition-all tracking-widest text-lg w-64 text-center mt-4">
          PLAN A TRIP
        </a>
      </div>
    </nav>
  );
}

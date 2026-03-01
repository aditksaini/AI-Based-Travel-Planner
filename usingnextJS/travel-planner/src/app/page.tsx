"use client";

import React from "react";

export default function Home() {
  return (
    <>
      {/* Global Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 hero-glow opacity-60"></div>
        <div className="absolute top-0 left-1/4 w-[1000px] h-[1000px] bg-cyber/5 blur-[160px] rounded-full -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-violet/5 blur-[140px] rounded-full translate-y-1/2"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href="#" className="font-outfit text-2xl font-extrabold tracking-tighter text-white">
            AERO<span className="text-cyber">STRIDE</span>
          </a>
          <div className="hidden md:flex items-center space-x-10 text-sm font-medium tracking-wide">
            <a href="#features" className="hover:text-cyber transition-colors uppercase">Intelligence</a>
            <a href="#pricing" className="hover:text-cyber transition-colors uppercase">Access</a>
            <a href="#about" className="hover:text-cyber transition-colors uppercase">Manifesto</a>
            <a href="#" className="px-5 py-2.5 bg-white text-deep font-bold rounded-sm border border-white hover:bg-transparent hover:text-white transition-all duration-300">
              GET STARTED
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative min-h-screen flex items-center pt-20 overflow-hidden z-10">
        <div className="relative max-w-7xl mx-auto px-6 w-full grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 px-3 py-1 glass rounded-full border border-white/10">
              <span className="w-1.5 h-1.5 bg-cyber rounded-full animate-pulse"></span>
              <span className="text-[10px] uppercase tracking-widest font-bold text-white/60">System Online / v2.0.4</span>
            </div>
            <h1 className="font-outfit text-6xl md:text-8xl font-black leading-[0.9] text-white tracking-tight">
              AI-BASED TRAVEL <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber to-violet">PLANNING</span>
            </h1>
            <p className="max-w-md text-lg text-slate-400 leading-relaxed font-light">
              Next-generation pathfinding for the world's most ambitious travelers. Precision itineraries crafted through deep spatial logic.
            </p>
            <div className="flex items-center space-x-6">
              <a href="#planner" className="px-8 py-4 bg-cyber text-deep font-black tracking-widest uppercase text-xs hover:shadow-[0_0_30px_rgba(0,245,255,0.4)] transition-all">
                Begin Sequence
              </a>
            </div>
          </div>

          {/* Planner Widget */}
          <div id="planner" className="glass p-8 rounded-2xl border border-white/10 shadow-2xl relative animate-float">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-cyber/20 blur-2xl"></div>
            <h2 className="font-outfit font-bold text-xl text-white mb-6 uppercase tracking-widest">Input Parameters</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2 font-bold">Destination</label>
                <input type="text" placeholder="ENTER DESTINATION" className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-md focus:outline-none focus:border-cyber transition-colors text-white placeholder:text-white/20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2 font-bold">Departure</label>
                  <input type="text" onFocus={(e) => (e.target.type = 'date')} onBlur={(e) => (e.target.type = 'text')} placeholder="START DATE" className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-md focus:outline-none focus:border-cyber transition-colors text-white placeholder:text-white/20" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2 font-bold">Return</label>
                  <input type="text" onFocus={(e) => (e.target.type = 'date')} onBlur={(e) => (e.target.type = 'text')} placeholder="END DATE" className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-md focus:outline-none focus:border-cyber transition-colors text-white placeholder:text-white/20" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2 font-bold">Budget</label>
                <input type="text" placeholder="INDIAN RUPEES (₹)" className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-md focus:outline-none focus:border-cyber transition-colors text-white placeholder:text-white/20" />
              </div>
              <button className="w-full py-4 border border-cyber text-cyber font-bold tracking-widest uppercase hover:bg-cyber hover:text-deep transition-all duration-300">
                Submit
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass p-10 rounded-2xl border border-white/10 hover:border-cyber/30 transition-all group">
              <div className="w-12 h-12 bg-cyber/10 rounded-lg flex items-center justify-center mb-8 border border-cyber/20 group-hover:bg-cyber/20 transition-all">
                <svg className="w-6 h-6 text-cyber" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="font-outfit text-xl font-bold text-white mb-4 uppercase tracking-wide">Pathfinding Engine</h3>
              <p className="text-sm leading-relaxed text-slate-400">High-fidelity itineraries generated via neural correlation, optimized for minimal drag and maximum discovery.</p>
            </div>
            <div className="glass p-10 rounded-2xl border border-white/10 hover:border-violet/30 transition-all group">
              <div className="w-12 h-12 bg-violet/10 rounded-lg flex items-center justify-center mb-8 border border-violet/20 group-hover:bg-violet/20 transition-all">
                <svg className="w-6 h-6 text-violet" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <h3 className="font-outfit text-xl font-bold text-white mb-4 uppercase tracking-wide">Cost Optimization</h3>
              <p className="text-sm leading-relaxed text-slate-400">Variable-rate monitoring across 8,000+ data nodes to ensure optimal capital allocation for your journey.</p>
            </div>
            <div className="glass p-10 rounded-2xl border border-white/10 hover:border-white/30 transition-all group">
              <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center mb-8 border border-white/10 group-hover:bg-white/10 transition-all">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="font-outfit text-xl font-bold text-white mb-4 uppercase tracking-wide">Deep Reconnaissance</h3>
              <p className="text-sm leading-relaxed text-slate-400">Unlock restricted access locations and off-grid nodes that standard systems fail to log.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <p className="font-outfit font-black tracking-widest text-white/20 text-xs mb-4 uppercase">SYSTEMS BY AEROSTRIDE INDUSTRIES</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest">&copy; 2026. ALL RIGHTS RESERVED. OPERATING AT THE EDGE OF THE KNOWN.</p>
        </div>
      </footer>
    </>
  );
}

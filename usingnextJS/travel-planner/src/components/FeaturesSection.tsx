import React from "react";

export default function FeaturesSection() {
  return (
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
  );
}

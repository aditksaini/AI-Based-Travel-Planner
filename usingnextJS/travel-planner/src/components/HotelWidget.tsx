"use client";

import React from "react";

export default function HotelWidget({ budget = 50000 }: { budget?: number }) {
  const price = Math.max(2500, Math.round((budget * 0.3) / 3));

  return (
    <div className="w-full mt-4">
      <h4 className="text-cyber font-outfit uppercase tracking-widest text-xs font-bold mb-4 flex items-center">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
        Recommended Stays
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden group hover:border-cyber/50 transition-colors shadow-lg cursor-pointer">
            <div className="h-32 bg-slate-800 relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
              {/* Dummy image representation using a gradient */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/60 to-purple-900/40 mix-blend-overlay"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10"></div>
              <div className="absolute bottom-3 left-3 z-20">
                <p className="text-white font-bold text-sm">Premium Resort {i}</p>
                <div className="flex text-amber-400 text-xs mt-1">★★★★★</div>
              </div>
            </div>
            <div className="p-4 flex justify-between items-end bg-black relative z-20">
              <div>
                <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Est. Per Night</p>
                <p className="text-cyber font-bold mt-1">₹{price.toLocaleString()}</p>
              </div>
              <button className="px-4 py-2 bg-white/5 border border-white/10 text-white text-xs font-bold rounded-lg hover:bg-cyber hover:text-deep hover:border-cyber transition-all">
                Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

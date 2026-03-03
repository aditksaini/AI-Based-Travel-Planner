"use client";

import React from "react";

export default function ItineraryWidget({ days = 3 }: { days?: number }) {
  // A vertical timeline of days
  return (
    <div className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 mt-4">
      <h4 className="text-cyber font-outfit uppercase tracking-widest text-xs font-bold mb-6">Generated Itinerary</h4>
      <div className="space-y-6">
        {Array.from({ length: days }).map((_, i) => (
          <div key={i} className="relative pl-6 border-l border-white/10 pb-2">
            <div className="absolute w-3 h-3 bg-cyber rounded-full -left-[6px] top-1 shadow-[0_0_10px_#00f5ff]"></div>
            <h5 className="text-white font-bold text-sm">Day {i + 1}</h5>
            <div className="mt-3 space-y-3">
              <div className="bg-white/5 p-3 rounded-lg border border-white/5 hover:border-cyber/30 transition-colors cursor-pointer group">
                <p className="text-xs text-cyber font-bold group-hover:text-white transition-colors">09:00 AM</p>
                <p className="text-sm text-slate-300 mt-1">Arrival and Check-in. Morning exploration.</p>
              </div>
              <div className="bg-white/5 p-3 rounded-lg border border-white/5 hover:border-cyber/30 transition-colors cursor-pointer group">
                <p className="text-xs text-cyber font-bold group-hover:text-white transition-colors">02:00 PM</p>
                <p className="text-sm text-slate-300 mt-1">Visit local landmarks and cultural sites.</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

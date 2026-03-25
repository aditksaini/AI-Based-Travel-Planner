"use client";

import React from "react";

export interface ItineraryDay {
  day: number;
  title: string;
  activities: string[];
  estimated_cost: string;
}

export default function ItineraryWidget({ days = 3, itinerary }: { days?: number, itinerary?: ItineraryDay[] }) {
  // A vertical timeline of days
  const displayDays = itinerary ? itinerary.length : days;
  return (
    <div className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 mt-4">
      <h4 className="text-cyber font-outfit uppercase tracking-widest text-xs font-bold mb-6">Generated Itinerary</h4>
      <div className="space-y-6">
        {itinerary ? (
          itinerary.map((item, i) => (
            <div key={i} className="relative pl-6 border-l border-white/10 pb-2">
              <div className="absolute w-3 h-3 bg-cyber rounded-full -left-[6px] top-1 shadow-[0_0_10px_#00f5ff]"></div>
              <h5 className="text-white font-bold text-sm">Day {item.day} <span className="text-cyber/80 font-normal ml-2">- {item.title}</span></h5>
              <div className="mt-3 space-y-3">
                {item.activities.map((activity, actIdx) => (
                  <div key={actIdx} className="bg-white/5 p-3 rounded-lg border border-white/5 hover:border-cyber/30 transition-colors cursor-pointer group flex items-start space-x-3">
                    <span className="text-cyber text-xs mt-1">▹</span>
                    <p className="text-sm text-slate-300 font-light flex-1">{activity}</p>
                  </div>
                ))}
                {item.estimated_cost && (
                  <div className="bg-cyber/10 p-3 rounded-lg border border-cyber/20">
                    <p className="text-xs font-bold text-cyber tracking-wider uppercase">EST. COST: <span className="text-white ml-2">{item.estimated_cost}</span></p>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          Array.from({ length: displayDays }).map((_, i) => (
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
          ))
        )}
      </div>
    </div>
  );
}

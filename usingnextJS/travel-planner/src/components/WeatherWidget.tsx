"use client";

import React from "react";

export default function WeatherWidget({ location = "Destination" }: { location?: string }) {
  return (
    <div className="w-full bg-gradient-to-br from-indigo-900/40 to-black/40 border border-violet/30 rounded-2xl p-6 mt-4 flex items-center justify-between shadow-[0_0_30px_rgba(138,43,226,0.1)] hover:border-violet/60 transition-colors cursor-default">
      <div>
        <h4 className="text-white/60 font-outfit uppercase tracking-widest text-[10px] font-bold mb-1">Forecast Overview</h4>
        <h2 className="text-3xl font-black text-white">{location}</h2>
        <p className="text-violet-300 text-sm mt-1">Mostly Sunny & Clear</p>
      </div>
      <div className="text-right">
        <h1 className="text-5xl font-black text-white">24°<span className="text-2xl text-white/50">C</span></h1>
        <p className="text-white/50 text-xs mt-2">Humidity: 60%</p>
      </div>
    </div>
  );
}

import React from "react";

export default function MapPlaceholder() {
  return (
    <section id="map-preview" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12 text-center">
          <h2 className="font-outfit text-3xl md:text-5xl font-bold text-white mb-6">
            Interactive Itinerary Mapping
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Visualize your entire journey. Our map interface will automatically render optimal routes, key waypoints, and accommodation nodes.
          </p>
        </div>

        {/* Map Container Placeholder */}
        <div className="relative w-full aspect-video md:aspect-[21/9] rounded-3xl overflow-hidden glass border border-white/10 group">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

          {/* Center Content Map Icon/Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-10 transition-all duration-500 group-hover:bg-black/20">
            <div className="w-20 h-20 rounded-full bg-cyber/10 border border-cyber/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,240,255,0.2)]">
              <svg
                className="w-10 h-10 text-cyber"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h3 className="font-outfit text-2xl font-bold text-white mb-2">Map API Integration Pending</h3>
            <p className="text-slate-400 font-mono text-sm uppercase tracking-widest">Awaiting spatial data stream</p>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-4 left-4 z-20 flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
          </div>

          <div className="absolute bottom-4 right-4 z-20 bg-black/60 border border-white/10 px-4 py-2 rounded-lg backdrop-blur-md">
            <span className="text-cyber text-xs font-mono">LAT: 00.0000 | LNG: 00.0000</span>
          </div>
        </div>
      </div>
    </section>
  );
}

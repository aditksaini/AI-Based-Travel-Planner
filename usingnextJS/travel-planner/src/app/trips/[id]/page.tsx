"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTripStore } from "@/store/useTripStore";
import Navbar from "@/components/Navbar";

// We'll import MapPlaceholder here or whatever map component you currently use
import MapPlaceholder from "@/components/MapPlaceholder";

export default function TripView() {
  const params = useParams();
  const router = useRouter();
  const { getTripById } = useTripStore();
  const [mounted, setMounted] = useState(false);

  const tripId = Array.isArray(params.id) ? params.id[0] : params.id;
  const trip = getTripById(tripId || "");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-cyber border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!trip) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-outfit text-center px-4">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl text-slate-400 mb-8 max-w-md">The trip you are looking for could not be found or has been deleted.</p>
        <button
          onClick={() => router.push("/trips")}
          className="px-8 py-3 bg-cyber text-black font-bold uppercase tracking-widest hover:bg-white transition-colors"
        >
          Return to Dashboard
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-slate-300 font-sans selection:bg-cyber selection:text-black flex flex-col pt-20">
      <Navbar />

      <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-5rem)]">
        {/* Sidebar / Itinerary View */}
        <aside className="w-full lg:w-[450px] bg-black/80 backdrop-blur-xl border-r border-white/10 flex flex-col h-[50vh] lg:h-full z-10 overflow-hidden shadow-[20px_0_50px_rgba(0,0,0,0.5)]">
          {/* Header */}
          <div className="p-6 border-b border-white/10 shrink-0 bg-gradient-to-b from-white/5 to-transparent">
            <button
              onClick={() => router.push("/trips")}
              className="text-xs font-mono tracking-widest text-slate-400 hover:text-cyber transition-colors uppercase flex items-center gap-2 mb-4"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              All Trips
            </button>
            <h1 className="text-3xl font-outfit font-extrabold text-white tracking-tight uppercase">
              {trip.destination}
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-cyber font-medium">{trip.days} Days Itinerary</span>
              <span className="w-1 h-1 rounded-full bg-white/20"></span>
              <span className="text-slate-500 text-sm">Saved {new Date(trip.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Scrollable Itinerary Content */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            <div className="space-y-8">
              {/* 
                This is a placeholder for where the actual AI generated JSON payload will map out the days.
                For now we'll render a generic representation of the saved trip data.
              */}

              {trip.content ? (
                <div className="text-slate-300 space-y-4">
                  {/* Depending on how AI data is structured, map through it here. Assuming it's a string for now or raw object dump */}
                  <pre className="text-xs font-mono bg-white/5 p-4 rounded text-slate-400 whitespace-pre-wrap">
                    {JSON.stringify(trip.content, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="p-8 border border-dashed border-white/10 rounded-xl text-center text-slate-500">
                  <p>Detailed itinerary content will be loaded here from the saved state.</p>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Map View */}
        <section className="flex-1 relative h-[50vh] lg:h-full bg-slate-900 border-t lg:border-t-0 border-white/10">
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/20 to-transparent z-10 pointer-events-none"></div>

          {/* Reuse the map placeholder we already have */}
          <MapPlaceholder />

          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10 pointer-events-none flex items-end px-6 pb-6 lg:hidden">
            <button className="w-full bg-cyber text-black font-bold py-3 rounded-sm shadow-[0_0_20px_rgba(0,255,255,0.3)] pointer-events-auto">
              VIEW ITINERARY
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

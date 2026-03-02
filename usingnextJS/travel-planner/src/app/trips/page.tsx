"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTripStore, TripPlan } from "@/store/useTripStore";
import Navbar from "@/components/Navbar";

export default function TripsDashboard() {
  const { savedTrips, deleteTrip } = useTripStore();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering trips content after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="min-h-screen bg-black text-slate-300 font-sans selection:bg-cyber selection:text-black pt-28">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pb-20">
        <header className="mb-12 border-b border-white/10 pb-8">
          <h1 className="text-4xl md:text-5xl font-outfit font-extrabold text-white tracking-tighter mb-4">
            SAVED <span className="text-cyber">TRIPS</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
            Your personalized AI-generated travel itineraries. Resume planning or revisit your past adventures anytime.
          </p>
        </header>

        {!mounted ? (
          // Loading skeleton to prevent flash
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-xl bg-white/5 animate-pulse border border-white/10" />
            ))}
          </div>
        ) : savedTrips.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center p-16 text-center border border-white/10 rounded-2xl bg-black/40 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
            <svg className="w-20 h-20 text-slate-600 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-outfit font-bold text-white mb-3">No trips saved yet</h2>
            <p className="text-slate-400 mb-8 max-w-md">
              Start exploring the world! Create your first AI-powered itinerary and save it here for later.
            </p>
            <Link href="/" className="px-8 py-3 bg-white text-black font-bold rounded-sm border border-transparent hover:bg-transparent hover:text-white hover:border-white transition-all tracking-wide">
              PLAN A NEW TRIP
            </Link>
          </div>
        ) : (
          // Grid of saved trips
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedTrips.map((trip: TripPlan) => (
              <div
                key={trip.id}
                className="group relative flex flex-col rounded-xl overflow-hidden bg-black/40 border border-white/10 hover:border-cyber/50 transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(0,255,255,0.1)]"
              >
                {/* Visual Thumbnail */}
                <div className="h-48 bg-gradient-to-br from-slate-900 to-black relative border-b border-white/10 overflow-hidden">
                  {trip.coverImage ? (
                    <img src={trip.coverImage} alt={trip.destination} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-50 transition-opacity">
                      <svg className="w-24 h-24 text-cyber" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  )}
                  {/* Overlay gradent for text legibility */}
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent"></div>

                  {/* Top quick-actions */}
                  <button
                    onClick={(e) => { e.preventDefault(); deleteTrip(trip.id); }}
                    className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-red-500/80 text-white/70 hover:text-white rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300"
                    title="Delete Trip"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-outfit font-bold text-white capitalize group-hover:text-cyber transition-colors">
                      {trip.destination}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-slate-300">
                      {trip.days} Days
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 mb-6 font-mono">
                    Created {new Date(trip.createdAt).toLocaleDateString()}
                  </div>

                  {/* Actions */}
                  <div className="mt-auto">
                    <Link
                      href={`/trips/${trip.id}`}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-cyber/10 text-white hover:text-cyber font-semibold rounded-lg border border-white/10 hover:border-cyber/30 transition-all duration-300"
                    >
                      <span>Resume Trip</span>
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

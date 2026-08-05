"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTripStore } from "@/store/useTripStore";
import Navbar from "@/components/Navbar";
import MapPlaceholder from "@/components/MapPlaceholder";
import WeatherWidget from "@/components/WeatherWidget";
import ItineraryWidget from "@/components/ItineraryWidget";
import HotelWidget from "@/components/HotelWidget";
import ExportPdfButton from "@/components/ExportPdfButton";

export default function TripView() {
  const params = useParams();
  const router = useRouter();
  const { getTripById } = useTripStore();
  const [mounted, setMounted] = useState(false);

  const tripId = Array.isArray(params.id) ? params.id[0] : params.id;
  const trip = getTripById(tripId || "");

  const [weatherInfo, setWeatherInfo] = useState<any>(null);
  const [sourceGeo, setSourceGeo] = useState<any>(null);
  const [destGeo, setDestGeo] = useState<any>(null);
  const [routeInfo, setRouteInfo] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch weather data for PDF export
  useEffect(() => {
    if (!trip?.destination) return;
    const fetchWeather = async () => {
      try {
        const res = await fetch(`/api/weather?location=${encodeURIComponent(trip.destination)}`);
        if (res.ok) {
          const data = await res.json();
          setWeatherInfo(data);
        }
      } catch (err) {
        console.error("Failed to fetch weather for PDF", err);
      }
    };
    fetchWeather();
  }, [trip?.destination]);

  // Fetch geocoding + route data for PDF export
  useEffect(() => {
    if (!trip) return;
    const fetchGeoAndRoute = async () => {
      try {
        let src: any = null;
        let dest: any = null;
        if (trip.destination) {
          const res = await fetch(`/api/graphhopper?q=${encodeURIComponent(trip.destination)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.hits?.[0]) { dest = data.hits[0]; setDestGeo(dest); }
          }
        }
        if (trip.from) {
          const res = await fetch(`/api/graphhopper?q=${encodeURIComponent(trip.from)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.hits?.[0]) { src = data.hits[0]; setSourceGeo(src); }
          }
        }
        if (src && dest) {
          const res = await fetch(
            `/api/graphhopper?point=${src.point.lat},${src.point.lng}&point=${dest.point.lat},${dest.point.lng}&profile=car&points_encoded=false`
          );
          if (res.ok) {
            const data = await res.json();
            if (data.paths?.[0]) setRouteInfo(data.paths[0]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch geo/route for PDF", err);
      }
    };
    fetchGeoAndRoute();
  }, [trip]);

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
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent space-y-6">
            <WeatherWidget location={trip.destination} />
            
            <ItineraryWidget days={trip.days} itinerary={trip.content || undefined} />

            <HotelWidget 
              budget={trip.budget || 50000} 
              destination={trip.destination} 
              days={trip.days} 
              passengers={trip.passengers ? parseInt(trip.passengers) : 1} 
            />

            {/* Export PDF Action inside Dashboard View */}
            <div className="pt-4 border-t border-white/10">
              <ExportPdfButton
                variant="sidebar"
                destination={trip.destination}
                from={trip.from || ""}
                days={trip.days}
                budget={trip.budget || 50000}
                passengers={trip.passengers}
                imageUrl={trip.coverImage}
                itinerary={trip.content || undefined}
                weatherData={weatherInfo}
                sourceData={sourceGeo}
                mapData={destGeo}
                routeDistance={routeInfo?.distance}
                routeTime={routeInfo?.time}
              />
            </div>
          </div>
        </aside>

        {/* Map View */}
        <section className="flex-1 relative h-[50vh] lg:h-full bg-slate-900 border-t lg:border-t-0 border-white/10">
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/20 to-transparent z-10 pointer-events-none"></div>

          {/* Reuse the map placeholder we already have */}
          <MapPlaceholder sourceString={trip.from} destinationString={trip.destination} />

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

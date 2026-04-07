"use client";

import React, { useState, useEffect } from "react";

interface Hotel {
  id: string;
  name: string;
  image: string | null;
  price: number;
  rating: number;
  link: string;
}

interface HotelWidgetProps {
  budget?: number;
  destination?: string;
  passengers?: number;
  days?: number;
}

export default function HotelWidget({ budget = 50000, destination, passengers = 1, days = 5 }: HotelWidgetProps) {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [warningMsg, setWarningMsg] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHotels() {
      setIsLoading(true);
      setWarningMsg(null);
      try {
        const destParam = destination ? `&destination=${encodeURIComponent(destination)}` : '&destination=Delhi';
        const res = await fetch(`/api/hotels?budget=${budget}&passengers=${passengers}&days=${days}${destParam}`);
        const data = await res.json();
        
        if (data.warning) {
          setWarningMsg(data.warning);
        }

        if (data.hotels) {
          setHotels(data.hotels);
        } else {
          setHotels([]);
        }
      } catch (error) {
        console.error("Failed to fetch hotels:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    // Adding a slight delay so it doesn't block main UI animation immediately
    const timeout = setTimeout(() => {
        fetchHotels();
    }, 1000);

    return () => clearTimeout(timeout);
  }, [budget, destination, passengers, days]);

  if (isLoading) {
    return (
      <div className="w-full mt-4">
        <h4 className="text-cyber font-outfit uppercase tracking-widest text-xs font-bold mb-4 flex items-center">
          <svg className="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          Finding Best Stays...
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-black/40 border border-white/10 rounded-2xl h-44 animate-pulse">
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mt-4">
      <h4 className="text-cyber font-outfit uppercase tracking-widest text-xs font-bold mb-4 flex items-center">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
        Recommended Stays {destination ? `in ${destination}` : ''}
      </h4>
      
      {warningMsg && (
        <div className="mb-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-sm text-yellow-200">
          <p>⚠️ {warningMsg}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hotels.map((hotel) => (
          <div key={hotel.id} className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden group hover:border-cyber/50 transition-colors shadow-lg cursor-pointer">
            <div className="h-32 bg-slate-800 relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
               {hotel.image ? (
                <div 
                   className="absolute inset-0 bg-cover bg-center" 
                   style={{ backgroundImage: `url(${hotel.image})` }}
                ></div>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/60 to-purple-900/40 mix-blend-overlay"></div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10"></div>
              <div className="absolute bottom-3 left-3 z-20">
                <p className="text-white font-bold text-sm truncate max-w-[200px]" title={hotel.name}>{hotel.name}</p>
                <div className="flex text-amber-400 text-xs mt-1">
                  {Array.from({ length: Math.round(hotel.rating / 2) || 5 }).map((_, idx) => (
                    <span key={idx}>★</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 flex justify-between items-end bg-black relative z-20">
              <div>
                <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Est. Per Night</p>
                <p className="text-cyber font-bold mt-1">₹{hotel.price.toLocaleString()}</p>
              </div>
              <a href={hotel.link} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-white/5 border border-white/10 text-white text-xs font-bold rounded-lg hover:bg-cyber hover:text-deep hover:border-cyber transition-all">
                Details
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

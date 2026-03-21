"use client";

import React, { useState, useEffect, useRef } from "react";
import ItineraryWidget from "./ItineraryWidget";
import WeatherWidget from "./WeatherWidget";
import HotelWidget from "./HotelWidget";

interface ChatOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  initialParams: {
    destination: string;
    startDate: string;
    endDate: string;
    budget: string;
  } | null;
}

export default function ChatOverlay({ isOpen, onClose, initialParams }: ChatOverlayProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [days, setDays] = useState(5);
  const [budgetLimit, setBudgetLimit] = useState(50000);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (initialParams && messages.length === 0) {
        // Initialize with dummy data
        const initialDays = calculateDays(initialParams.startDate, initialParams.endDate);
        setDays(initialDays > 0 ? initialDays : 5);
        setBudgetLimit(initialParams.budget ? parseInt(initialParams.budget.replace(/[^0-9]/g, '')) || 50000 : 50000);

        setMessages([
          { role: 'user', content: `Plan a trip to ${initialParams.destination || 'my destination'} from ${initialParams.startDate || 'start date'} to ${initialParams.endDate || 'end date'} with a budget of ${initialParams.budget || 'my budget'}.` },
          { role: 'ai', content: `I'd be happy to help you plan your trip to ${initialParams.destination || 'your destination'}. Here's an initial itinerary, weather forecast, and some hotel options based on your budget.` }
        ]);
      }
    } else {
      document.body.style.overflow = "unset";
      // We do not reset messages so the user can close and reopen and continue where they left off.
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, initialParams]);

  useEffect(() => {
    if (isOpen && initialParams?.destination) {
      const fetchImage = async () => {
        try {
          const res = await fetch(`/api/image?query=${encodeURIComponent(initialParams.destination)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.imageUrl) {
              setImageUrl(data.imageUrl);
            }
          }
        } catch (error) {
          console.error("Failed to fetch image", error);
        }
      };
      // adding a small delay to avoid blocking any initial load animation
      setTimeout(fetchImage, 500);
    }
  }, [isOpen, initialParams]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isRegenerating]);

  // Dummy function for days calculation
  const calculateDays = (start: string, end: string) => {
    if (!start || !end) return 5;
    const s = new Date(start);
    const e = new Date(end);
    const diff = e.getTime() - s.getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 3600 * 24)));
  };

  const handleSliderChange = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setIsRegenerating(false);
      // Here we would update dummy widgets or fetch from AI again
      setMessages(prev => [...prev, { role: 'ai', content: `I have updated your tools and itinerary for ${days} days with a budget of ₹${budgetLimit.toLocaleString()}.` }]);
    }, 1500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    setMessages([...messages, { role: 'user', content: inputMessage }]);
    setInputMessage("");
    setIsRegenerating(true);

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', content: "I've received your request and updated the plan accordingly." }]);
      setIsRegenerating(false);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>

      <div className="relative glass border border-white/20 w-full h-full md:w-[90vw] md:h-[90vh] md:rounded-2xl shadow-[0_0_50px_rgba(0,245,255,0.1)] flex flex-col md:flex-row overflow-hidden scale-in-center">

        {/* Left Column: Dynamic Controls & Info */}
        <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-white/10 bg-black/40 flex flex-col z-10 shrink-0 overflow-hidden">
          {imageUrl && (
            <div 
              className="w-full h-48 md:h-56 bg-cover bg-center bg-no-repeat relative border-b border-white/10 shrink-0 animate-in fade-in duration-1000"
              style={{ backgroundImage: `url(${imageUrl})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-6 right-6">
                <span className="text-[10px] uppercase tracking-widest text-white/70 font-bold drop-shadow-md">Destination</span>
                <h2 className="font-outfit font-black tracking-wide text-white text-2xl drop-shadow-lg capitalize truncate">{initialParams?.destination || "Destination"}</h2>
              </div>
            </div>
          )}

          <div className="p-6 flex-1 flex flex-col z-10">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
              <h3 className="font-outfit font-bold tracking-widest text-cyber uppercase text-sm drop-shadow-md">Trip Parameters</h3>
              {isRegenerating && (
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cyber"></span>
                </span>
              )}
            </div>

            <div className="space-y-8 flex-1">
              <div className="space-y-4">
                <div className="flex justify-between items-end bg-black/20 p-2 rounded-md">
                  <label className="text-[10px] uppercase tracking-widest text-white/70 font-bold">Duration</label>
                  <span className="text-white font-outfit font-bold text-shadow">{days} Days</span>
                </div>
                <input
                  type="range"
                  min="1" max="14"
                  value={days}
                  onChange={(e) => setDays(parseInt(e.target.value))}
                  onMouseUp={handleSliderChange}
                  onTouchEnd={handleSliderChange}
                  className="w-full accent-cyber cursor-pointer"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end bg-black/20 p-2 rounded-md">
                  <label className="text-[10px] uppercase tracking-widest text-white/70 font-bold">Budget</label>
                  <span className="text-white font-outfit font-bold text-shadow">₹{budgetLimit.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="5000" max="500000" step="5000"
                  value={budgetLimit}
                  onChange={(e) => setBudgetLimit(parseInt(e.target.value))}
                  onMouseUp={handleSliderChange}
                  onTouchEnd={handleSliderChange}
                  className="w-full accent-violet cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Chat History & Input */}
        <div className="flex-1 flex flex-col h-full bg-deep/50 relative z-10 min-w-0">

          <button onClick={onClose} className="absolute top-4 right-4 z-20 text-white/50 hover:text-white bg-black/50 p-2 rounded-full backdrop-blur-sm border border-white/10">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 pt-16 md:pt-6">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-cyber/20 border border-cyber/50 text-white rounded-tr-sm' : 'bg-white/5 border border-white/10 text-slate-300 rounded-tl-sm'}`}>
                  <p className="font-light text-sm leading-relaxed">{msg.content}</p>
                  {/* Render UI Widgets for the first AI response */}
                  {msg.role === 'ai' && idx === 1 && (
                    <div className="mt-6 flex flex-col space-y-4">
                      <WeatherWidget location={initialParams?.destination || "Your Destination"} />
                      <ItineraryWidget days={days} />
                      <HotelWidget budget={budgetLimit} />
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isRegenerating && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/10 text-slate-300 rounded-2xl rounded-tl-sm p-4 flex space-x-2 items-center">
                  <div className="w-2 h-2 bg-cyber rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-cyber rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-cyber rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            <div ref={endOfMessagesRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-white/10 bg-black/40 shrink-0">
            <form onSubmit={handleSendMessage} className="relative">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask for adjustments, specific places, or suggestions..."
                className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-full focus:outline-none focus:border-cyber transition-colors text-white placeholder:text-white/30 pr-16"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isRegenerating}
                className="absolute right-2 top-2 bottom-2 aspect-square bg-cyber text-deep rounded-full flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

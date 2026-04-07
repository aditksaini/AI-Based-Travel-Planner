"use client";

import React, { useState, useEffect, useRef } from "react";
import ItineraryWidget from "./ItineraryWidget";
import WeatherWidget from "./WeatherWidget";
import HotelWidget from "./HotelWidget";
import MapPlaceholder from "./MapPlaceholder";
import ExportPdfButton from "./ExportPdfButton";

interface ChatOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  initialParams: {
    from: string;
    to: string;
    startDate: string;
    endDate: string;
    budget: string;
    passengers: string;
  } | null;
}

export default function ChatOverlay({ isOpen, onClose, initialParams }: ChatOverlayProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [days, setDays] = useState(5);
  const [budgetLimit, setBudgetLimit] = useState(50000);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [itineraryData, setItineraryData] = useState<any[] | null>(null);
  const [isItineraryLoading, setIsItineraryLoading] = useState(false);
  const [itineraryError, setItineraryError] = useState<string | null>(null);
  const [itineraryWarning, setItineraryWarning] = useState<string | null>(null);

  // Weather & map state lifted for PDF export
  const [weatherInfo, setWeatherInfo] = useState<any>(null);
  const [sourceGeo, setSourceGeo] = useState<any>(null);
  const [destGeo, setDestGeo] = useState<any>(null);
  const [routeInfo, setRouteInfo] = useState<any>(null);

  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const fetchItinerary = async (currentDays: number, currentBudget: number, isInitial: boolean = false) => {
    setIsItineraryLoading(true);
    setItineraryError(null);
    setItineraryWarning(null);
    try {
      const res = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: initialParams?.to || 'a random destination',
          days: currentDays,
          budget: currentBudget.toString()
        })
      });
      if (!res.ok) {
        let errorMsg = 'Failed to generate itinerary. Please try again.';
        try {
          const errData = await res.json();
          if (errData.error) errorMsg = errData.error;
        } catch (e) { }
        throw new Error(errorMsg);
      }
      const data = await res.json();

      if (data.is_sufficient === false) {
        setItineraryError(data.message || `Insufficient days. Recommended minimum: ${data.recommended_days} days.`);
        setItineraryData(null);
        setMessages(prev => {
          const newMsgs = [...prev];
          if (isInitial && newMsgs.length >= 2) {
            newMsgs[1] = { role: 'ai', content: data.message || `I cannot plan a trip to ${initialParams?.to} for just ${currentDays} days.` };
          } else {
            newMsgs.push({ role: 'ai', content: data.message || `Please increase the duration to at least ${data.recommended_days} days.` });
          }
          return newMsgs;
        });
        return;
      }

      if (data.is_too_long) {
        setItineraryWarning(data.message || `You can complete the full trip in ${data.recommended_maximum_days} days. There is nothing left to explore!`);
      }

      if (data.itinerary) {
        setItineraryData(data.itinerary);
        setMessages(prev => {
          const newMsgs = [...prev];

          let successMessage = `Here is your highly optimized travel itinerary to ${initialParams?.to || 'your destination'} for ${currentDays} days within your budget.`;
          if (data.is_too_long) {
            successMessage = data.message || `You can complete the full trip to ${initialParams?.to || 'your destination'} in ${data.recommended_maximum_days} days. There is nothing left to explore beyond that, so I've planned for ${data.recommended_maximum_days} days. You can safely reduce your trip days!`;
          } else if (!isInitial) {
            successMessage = `I have dynamically generated a new neural itinerary for ${currentDays} days and ₹${currentBudget.toLocaleString()} as requested.`;
          }

          if (isInitial && newMsgs.length >= 2) {
            newMsgs[1] = { role: 'ai', content: successMessage };
          } else {
            newMsgs.push({ role: 'ai', content: successMessage });
          }
          return newMsgs;
        });
      } else {
        throw new Error('Invalid neural response format.');
      }
    } catch (err: any) {
      setItineraryError(err.message || 'Error communicating with AI service.');
      setMessages(prev => {
        const newMsgs = [...prev];
        if (isInitial && newMsgs.length >= 2) {
          newMsgs[1] = { role: 'ai', content: `I encountered an issue generating your itinerary: ${err.message || 'Please try again.'}. Showing dummy data for now.` };
        } else {
          newMsgs.push({ role: 'ai', content: `I failed to update your itinerary: ${err.message}` });
        }
        return newMsgs;
      });
    } finally {
      setIsItineraryLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (initialParams && messages.length === 0) {
        // Initialize with dummy data
        const initialDays = calculateDays(initialParams.startDate, initialParams.endDate);
        setDays(initialDays > 0 ? initialDays : 5);

        const baseBudget = initialParams.budget ? parseInt(initialParams.budget.replace(/[^0-9]/g, '')) || 50000 : 50000;
        const passengerCount = parseInt(initialParams.passengers || '1') || 1;
        setBudgetLimit(baseBudget * passengerCount);

        setMessages([
          { role: 'user', content: `Plan a trip for ${passengerCount} passengers from ${initialParams.from || 'my location'} to ${initialParams.to || 'my destination'} from ${initialParams.startDate || 'start date'} to ${initialParams.endDate || 'end date'} with a budget constraint of ₹${(baseBudget * passengerCount).toLocaleString()}.` },
          { role: 'ai', content: `I'd be happy to help plan your trip from ${initialParams.from || 'your location'} to ${initialParams.to || 'your destination'}. Generating dynamic neural itinerary now...` }
        ]);

        fetchItinerary(initialDays > 0 ? initialDays : 5, baseBudget * passengerCount, true);
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
    if (isOpen && initialParams?.to) {
      const fetchImage = async () => {
        try {
          const res = await fetch(`/api/get-destination-image?destination=${encodeURIComponent(initialParams.to)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.image && data.image.url) {
              setImageUrl(data.image.url);
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

  // Fetch weather data for PDF export
  useEffect(() => {
    if (isOpen && initialParams?.to && initialParams.to !== "Destination") {
      const fetchWeather = async () => {
        try {
          const res = await fetch(`/api/weather?location=${encodeURIComponent(initialParams.to)}`);
          if (res.ok) {
            const data = await res.json();
            setWeatherInfo(data);
          }
        } catch (err) {
          console.error("Failed to fetch weather for PDF", err);
        }
      };
      fetchWeather();
    }
  }, [isOpen, initialParams]);

  // Fetch geocoding + route data for PDF export
  useEffect(() => {
    if (!isOpen || !initialParams) return;
    const fetchGeoAndRoute = async () => {
      try {
        let src: any = null;
        let dest: any = null;
        if (initialParams.to) {
          const res = await fetch(`/api/graphhopper?q=${encodeURIComponent(initialParams.to)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.hits?.[0]) { dest = data.hits[0]; setDestGeo(dest); }
          }
        }
        if (initialParams.from) {
          const res = await fetch(`/api/graphhopper?q=${encodeURIComponent(initialParams.from)}`);
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
  }, [isOpen, initialParams]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isRegenerating, isTyping]);

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
    fetchItinerary(days, budgetLimit, false).then(() => {
      setIsRegenerating(false);
    });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isRegenerating || isTyping) return;

    const currentMessage = inputMessage;
    const newMessages = [...messages, { role: 'user', content: currentMessage }];
    setMessages(newMessages);
    setInputMessage("");
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentMessage,
          history: messages
        })
      });

      if (!res.ok) {
        throw new Error('Failed to fetch response');
      }

      const data = await res.json();
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I'm having trouble connecting to my neural network right now." }]);
    } finally {
      setIsTyping(false);
    }
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
                <h2 className="font-outfit font-black tracking-wide text-white text-2xl drop-shadow-lg capitalize truncate">{initialParams?.to || "Destination"}</h2>
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

            {/* Sidebar Export PDF Button */}
            {!isItineraryLoading && messages.length >= 2 && (
              <ExportPdfButton
                variant="sidebar"
                destination={initialParams?.to || "Destination"}
                from={initialParams?.from || ""}
                days={days}
                budget={budgetLimit}
                passengers={initialParams?.passengers}
                startDate={initialParams?.startDate}
                endDate={initialParams?.endDate}
                imageUrl={imageUrl}
                itinerary={itineraryData || undefined}
                weatherData={weatherInfo}
                sourceData={sourceGeo}
                mapData={destGeo}
                routeDistance={routeInfo?.distance}
                routeTime={routeInfo?.time}
              />
            )}
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
                      <WeatherWidget location={initialParams?.to || "Your Destination"} />
                      <MapPlaceholder sourceString={initialParams?.from || "Source"} destinationString={initialParams?.to || "Destination"} />
                      {isItineraryLoading ? (
                        <div className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 mt-4 flex items-center justify-center min-h-[150px]">
                          <div className="flex flex-col items-center space-y-3">
                            <span className="flex h-4 w-4 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-4 w-4 bg-cyber"></span>
                            </span>
                            <p className="text-xs text-cyber tracking-widest uppercase font-bold text-center animate-pulse">Generating neural itinerary...</p>
                          </div>
                        </div>
                      ) : itineraryError ? (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 mt-4">
                          <p className="text-red-400 text-sm mb-4">{itineraryError}</p>
                          <ItineraryWidget days={days} />
                        </div>
                      ) : (
                        <>
                          {itineraryWarning && (
                            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 mt-4 mb-2">
                              <p className="text-yellow-400 text-sm font-light">{itineraryWarning}</p>
                            </div>
                          )}
                          <ItineraryWidget days={days} itinerary={itineraryData || undefined} />
                        </>
                      )}
                      {/* Floating Export PDF Button - shows after loading regardless of success/error */}
                      {!isItineraryLoading && (
                        <div className="mt-4 flex justify-end">
                          <ExportPdfButton
                            variant="floating"
                            destination={initialParams?.to || "Destination"}
                            from={initialParams?.from || ""}
                            days={days}
                            budget={budgetLimit}
                            passengers={initialParams?.passengers}
                            startDate={initialParams?.startDate}
                            endDate={initialParams?.endDate}
                            imageUrl={imageUrl}
                            itinerary={itineraryData || undefined}
                            weatherData={weatherInfo}
                            sourceData={sourceGeo}
                            mapData={destGeo}
                            routeDistance={routeInfo?.distance}
                            routeTime={routeInfo?.time}
                          />
                        </div>
                      )}
                      <HotelWidget 
                        budget={budgetLimit} 
                        destination={initialParams?.to || "Destination"} 
                        days={days} 
                        passengers={initialParams?.passengers ? parseInt(initialParams.passengers) : 1} 
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
            {(isRegenerating || isTyping) && (
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
                disabled={!inputMessage.trim() || isRegenerating || isTyping}
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

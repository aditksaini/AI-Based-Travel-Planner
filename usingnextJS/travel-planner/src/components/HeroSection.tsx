"use client";

import React, { useState, useEffect } from "react";
import PlannerWidget from "./PlannerWidget";
import ChatOverlay from "./ChatOverlay";

export default function HeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatParams, setChatParams] = useState<any>(null);

  const handlePlannerSubmit = (params: any) => {
    setChatParams(params);
    setIsChatOpen(true);
  };

  // Prevent background scrolling when the modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function strictly needed to restore scroll if the component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  return (
    <header className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-6 w-full grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 glass rounded-full border border-white/10">
            <span className="w-1.5 h-1.5 bg-cyber rounded-full animate-pulse"></span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-white/60">System Online / v2.0.4</span>
          </div>
          <h1 className="font-outfit text-6xl md:text-8xl font-black leading-[0.9] text-white tracking-tight">
            AI-BASED TRAVEL <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber to-violet">PLANNING</span>
          </h1>
          <p className="max-w-md text-lg text-slate-400 leading-relaxed font-light">
            Next-generation pathfinding for the world's most ambitious travelers. Precision itineraries crafted through deep spatial logic.
          </p>
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-4 bg-cyber text-deep font-black tracking-widest uppercase text-xs hover:shadow-[0_0_30px_rgba(0,245,255,0.4)] transition-all cursor-pointer"
            >
              How To Use?
            </button>
          </div>
        </div>

        {/* Planner Widget Component */}
        <div className="relative z-10">
          <PlannerWidget onSubmit={handlePlannerSubmit} />
        </div>
      </div>

      {/* --- HOW TO USE MODAL OVERLAY --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center animate-in fade-in duration-300">
          {/* Blurred Background Overlay (Click to close) */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* Modal Content Window */}
          {/* Added max-h-[90vh] and overflow-y-auto so the modal itself scrolls if the screen is too small */}
          <div className="relative glass border border-white/20 p-8 md:p-12 max-w-2xl w-[90%] max-h-[90vh] overflow-y-auto rounded-2xl shadow-[0_0_50px_rgba(0,245,255,0.1)] scale-in-center">

            {/* Close X Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-white/50 hover:text-cyber transition-colors z-10"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Header */}
            <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-cyber/20 rounded flex items-center justify-center border border-cyber/30 shrink-0">
                  <svg className="w-4 h-4 text-cyber" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="font-outfit text-2xl font-bold text-white uppercase tracking-widest pr-8">
                  System Interface Guide
                </h2>
              </div>
            </div>

            {/* Guide Steps */}
            <div className="space-y-6 text-slate-300">
              <div className="flex items-start space-x-4">
                <div className="mt-1 w-6 h-6 rounded-full bg-white/5 border border-white/20 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-white">1</span>
                </div>
                <div>
                  <h3 className="text-cyber font-bold tracking-widest text-sm uppercase mb-1">Fill in the input parameters</h3>
                  <p className="text-sm font-light leading-relaxed">Enter your starting city and destination in the input form on the right.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="mt-1 w-6 h-6 rounded-full bg-white/5 border border-white/20 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-white">2</span>
                </div>
                <div>
                  <h3 className="text-cyber font-bold tracking-widest text-sm uppercase mb-1">Timeline</h3>
                  <p className="text-sm font-light leading-relaxed">Input your start and end dates for the journey.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="mt-1 w-6 h-6 rounded-full bg-white/5 border border-white/20 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-white">3</span>
                </div>
                <div>
                  <h3 className="text-cyber font-bold tracking-widest text-sm uppercase mb-1">Passengers and Budget</h3>
                  <p className="text-sm font-light leading-relaxed">Define your budget limit and the total number of passengers.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="mt-1 w-6 h-6 rounded-full bg-cyber border border-white/20 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(0,245,255,0.5)]">
                  <svg className="w-3 h-3 text-deep" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-bold tracking-widest text-sm uppercase mb-1">Initialize Sequence</h3>
                  <p className="text-sm font-light leading-relaxed">Click 'Submit' to engage the neural engine. Your highly optimized itinerary will map directly onto the console.</p>
                </div>
              </div>
            </div>

            {/* Modal Footer / Action */}
            <div className="mt-10 pt-6 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 border border-white/20 text-white text-xs font-bold tracking-widest uppercase hover:bg-white/10 transition-colors"
              >
                Acknowledge
              </button>
            </div>

          </div>
        </div>
      )}
      {/* --- CHAT OVERLAY --- */}
      <ChatOverlay
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        initialParams={chatParams}
      />
    </header>
  );
}

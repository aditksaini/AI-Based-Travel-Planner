"use client";

import React, { useState } from "react";

interface PlannerWidgetProps {
  onSubmit?: (data: { from: string; to: string; startDate: string; endDate: string; budget: string; passengers: string }) => void;
}

export default function PlannerWidget({ onSubmit }: PlannerWidgetProps) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const [passengers, setPassengers] = useState("1");

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({ from, to, startDate, endDate, budget, passengers });
    }
  };

  return (
    <div id="planner" className="glass p-8 rounded-2xl border border-white/10 shadow-2xl relative animate-float">
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-cyber/20 blur-2xl"></div>
      <h2 className="font-outfit font-bold text-xl text-white mb-6 uppercase tracking-widest">Input Parameters</h2>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2 font-bold">From (Origin)</label>
            <input
              type="text"
              placeholder="STARTING CITY"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-md focus:outline-none focus:border-cyber transition-colors text-white placeholder:text-white/20"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2 font-bold">To (Destination)</label>
            <input
              type="text"
              placeholder="DESTINATION"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-md focus:outline-none focus:border-cyber transition-colors text-white placeholder:text-white/20"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2 font-bold">Departure</label>
            <input
              type="text"
              onFocus={(e) => (e.target.type = 'date')}
              onBlur={(e) => (e.target.type = 'text')}
              placeholder="START DATE"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-md focus:outline-none focus:border-cyber transition-colors text-white placeholder:text-white/20"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2 font-bold">Return</label>
            <input
              type="text"
              onFocus={(e) => (e.target.type = 'date')}
              onBlur={(e) => (e.target.type = 'text')}
              placeholder="END DATE"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-md focus:outline-none focus:border-cyber transition-colors text-white placeholder:text-white/20"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2 font-bold">Budget</label>
            <input
              type="text"
              placeholder="INR (₹)"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-md focus:outline-none focus:border-cyber transition-colors text-white placeholder:text-white/20"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2 font-bold">Passengers</label>
            <input
              type="number"
              min="1"
              placeholder="COUNT"
              value={passengers}
              onChange={(e) => setPassengers(e.target.value)}
              className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-md focus:outline-none focus:border-cyber transition-colors text-white placeholder:text-white/20"
            />
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className="w-full py-4 border border-cyber text-cyber font-bold tracking-widest uppercase hover:bg-cyber hover:text-deep transition-all duration-300 outline-none"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

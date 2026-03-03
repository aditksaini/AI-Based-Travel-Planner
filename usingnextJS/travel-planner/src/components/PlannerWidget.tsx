"use client";

import React, { useState } from "react";

interface PlannerWidgetProps {
  onSubmit?: (data: { destination: string; startDate: string; endDate: string; budget: string }) => void;
}

export default function PlannerWidget({ onSubmit }: PlannerWidgetProps) {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({ destination, startDate, endDate, budget });
    }
  };

  return (
    <div id="planner" className="glass p-8 rounded-2xl border border-white/10 shadow-2xl relative animate-float">
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-cyber/20 blur-2xl"></div>
      <h2 className="font-outfit font-bold text-xl text-white mb-6 uppercase tracking-widest">Input Parameters</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2 font-bold">Destination</label>
          <input
            type="text"
            placeholder="ENTER DESTINATION"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-md focus:outline-none focus:border-cyber transition-colors text-white placeholder:text-white/20"
          />
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
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2 font-bold">Budget</label>
          <input
            type="text"
            placeholder="INDIAN RUPEES (₹)"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-md focus:outline-none focus:border-cyber transition-colors text-white placeholder:text-white/20"
          />
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

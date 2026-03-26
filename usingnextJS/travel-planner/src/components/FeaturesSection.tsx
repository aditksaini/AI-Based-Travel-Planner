import React from "react";

export default function FeaturesSection() {
  const features = [
    {
      title: "Map-Based Itineraries",
      desc: "Visualize your trip with integrated maps outlining daily routes.",
      icon: (
        <svg className="w-6 h-6 text-cyber" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
      ),
      color: "cyber"
    },
    {
      title: "AI-Powered Suggestions",
      desc: "Smart, personalized recommendations based on your preferences.",
      icon: (
        <svg className="w-6 h-6 text-violet" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
      ),
      color: "violet"
    },
    {
      title: "Real-Time Cost Tracking",
      desc: "Continuous monitoring of expenses to ensure optimal budget allocation.",
      icon: (
        <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      ),
      color: "emerald-400"
    },
    {
      title: "Dynamic Scheduling",
      desc: "Auto-adjusting timelines that reroute based on weather and delays.",
      icon: (
        <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      ),
      color: "amber-400"
    }
  ];

  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">

        <div className="mb-16 text-center">
          <h2 className="font-outfit text-3xl md:text-5xl font-bold text-white mb-6 uppercase tracking-wider">
            System Capabilities
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyber via-violet to-transparent mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {features.map((feature, idx) => (
            <div key={idx} className={`glass p-10 rounded-2xl border border-white/10 hover:border-${feature.color}/30 transition-all group`}>
              <div className={`w-14 h-14 bg-${feature.color}/10 rounded-xl flex items-center justify-center mb-8 border border-${feature.color}/20 group-hover:bg-${feature.color}/20 group-hover:scale-110 transition-all duration-300`}>
                {feature.icon}
              </div>
              <h3 className="font-outfit text-xl font-bold text-white mb-4 tracking-wide">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

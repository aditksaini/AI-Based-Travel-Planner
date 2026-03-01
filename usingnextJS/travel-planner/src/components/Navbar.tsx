import React from "react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <a href="#" className="font-outfit text-2xl font-extrabold tracking-tighter text-white">
          AERO<span className="text-cyber">STRIDE</span>
        </a>
        <div className="hidden md:flex items-center space-x-10 text-sm font-medium tracking-wide">
          <a href="#features" className="hover:text-cyber transition-colors uppercase">Intelligence</a>
          <a href="#pricing" className="hover:text-cyber transition-colors uppercase">Access</a>
          <a href="#about" className="hover:text-cyber transition-colors uppercase">Manifesto</a>
          <a href="#" className="px-5 py-2.5 bg-white text-deep font-bold rounded-sm border border-white hover:bg-transparent hover:text-white transition-all duration-300">
            GET STARTED
          </a>
        </div>
      </div>
    </nav>
  );
}

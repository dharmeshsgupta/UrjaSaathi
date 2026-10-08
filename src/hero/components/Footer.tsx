import React from 'react';
import { Zap, ArrowUp, Sun, Wind, BatteryCharging, Building2 } from 'lucide-react';
import urjaLogo from '../../photos/logo/Urjasaathi logo.jpeg';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#F4EFE6] border-t border-stone-300 py-12 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand Identity */}
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-950 border border-amber-400/50 flex items-center justify-center shrink-0">
                <img
                  src={urjaLogo}
                  alt="UrjaSaathi AI Logo"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/urjasaathi-logo.jpeg';
                  }}
                />
              </div>
              <span className="font-display font-black text-slate-950 tracking-wider text-sm">
                URJASAATHI AI
              </span>
            </div>
            <span className="hidden sm:inline text-stone-400">/</span>
            <span className="font-mono text-xs text-slate-700 uppercase tracking-widest font-semibold">
              SMART PROSUMER MICROGRID &amp; THERMAL ENGINE
            </span>
          </div>

          {/* Minimal Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 font-mono text-xs text-slate-700 font-bold">
            <a href="#hero" className="hover:text-amber-800 transition-colors">
              3D Architecture
            </a>
            <a href="#problem" className="hover:text-amber-800 transition-colors">
              Problem
            </a>
            <a href="#solution" className="hover:text-amber-800 transition-colors">
              Platform Modules
            </a>
            <a href="#workflow" className="hover:text-amber-800 transition-colors">
              Workflow
            </a>
            <a href="#team" className="hover:text-amber-800 transition-colors">
              Team
            </a>
            <a href="#contact" className="hover:text-amber-800 transition-colors">
              Deploy
            </a>
          </nav>

          {/* Scroll to Top */}
          <div className="flex items-center gap-3">
            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-xl bg-white border border-stone-300 hover:bg-stone-100 text-slate-800 hover:text-slate-950 transition-all flex items-center gap-2 font-mono text-xs font-bold cursor-pointer shadow-xs"
            >
              <ArrowUp className="w-3.5 h-3.5 text-amber-600" />
              <span>Back to Top</span>
            </button>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-stone-300 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-600 gap-2">
          <span>Zero IoT Hardware Required · 100% Client-Side Physics &amp; Society Clearing</span>
          <span>© 2026 UrjaSaathi AI · All Rights Reserved</span>
        </div>
      </div>
    </footer>
  );
};

import React from 'react';
import { motion, MotionValue } from 'motion/react';
import { ArrowRight, ChevronRight, Zap, Sun, BatteryCharging, Shield, Building2 } from 'lucide-react';

interface HeroContentProps {
  frame1Opacity: MotionValue<number>;
  frame1Y: MotionValue<number>;
  frame4Opacity: MotionValue<number>;
  frame4Y: MotionValue<number>;
  frame5Opacity: MotionValue<number>;
  frame5Y: MotionValue<number>;
  onNavigateApp?: () => void;
  onExploreSolution?: () => void;
}

export const HeroContent: React.FC<HeroContentProps> = ({
  frame1Opacity,
  frame1Y,
  frame4Opacity,
  frame4Y,
  frame5Opacity,
  frame5Y,
  onNavigateApp,
  onExploreSolution,
}) => {
  const handlePrimaryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateApp) onNavigateApp();
    else window.location.hash = 'app';
  };

  const handleScrollToSolution = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onExploreSolution) onExploreSolution();
    else {
      const el = document.getElementById('solution');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col">

      {/* ── FRAME 1: CINEMATIC TITLE & DISPATCH CONSOLE ── */}
      <motion.div
        style={{ opacity: frame1Opacity, y: frame1Y }}
        className="absolute inset-0 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full pointer-events-none pt-20 sm:pt-24 pb-8"
      >
        <div className="w-full text-center">
          {/* Eyebrow badge
          <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4 select-none">
            <span className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-mono font-bold tracking-[0.28em] text-cyan-400 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
              MINISTRY OF POWER · NATIONAL SMART GRID MISSION
            </span>
          </div> */}

          {/* Massive UrjaSaathi AI Title — Exact scale & weight as reference */}
          <h1
            className="text-center font-black tracking-tight uppercase leading-none select-none text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]"
            style={{
              fontSize: 'clamp(2.9rem, 7.5vw, 6.6rem)',
              letterSpacing: '-0.02em',
              textShadow: '0 4px 24px rgba(0,0,0,0.95), 0 0 50px rgba(6,182,212,0.25)',
            }}
          >
            URJASAATHI AI
          </h1>

          {/* SIH Team Pill Badge
          <div className="flex justify-center mt-3.5 sm:mt-4 select-none">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.25)] text-cyan-300 font-mono text-xs font-bold tracking-wider uppercase backdrop-blur-md">
              <span>TEAM URJASAATHI</span>
              <span className="text-cyan-500/50">·</span>
              <span>SIH 2026</span>
              <span className="text-cyan-500/50">·</span>
              <span className="text-cyan-400 font-black">PS SIH26227</span>
            </div>
          </div> */}

          {/* Subtitle description
          <p className="mt-4 sm:mt-6 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed text-center drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] select-none">
            Autonomous peer-to-peer microgrid intelligence with rooftop solar forecasting,
            dynamic internal energy trading, and localized thermal envelope diagnostics running entirely on consumer hardware.
          </p> */}

          {/* Two CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 mt-6 sm:mt-8 pointer-events-auto">
            <a
              href="#app"
              onClick={handlePrimaryClick}
              className="group px-7 py-3.5 rounded-xl font-black text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 shadow-[0_0_30px_rgba(6,182,212,0.45)] hover:shadow-[0_0_40px_rgba(6,182,212,0.7)] hover:scale-[1.03] active:scale-[0.98] flex items-center gap-2.5 cursor-pointer"
              style={{
                background: '#06b6d4',
                color: '#020617',
              }}
            >
              <svg className="w-4 h-4 text-slate-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
              </svg>
              <span>OPEN ENERGY CONSOLE</span>
              <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="#solution"
              onClick={handleScrollToSolution}
              className="px-6 py-3.5 rounded-xl font-black text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] flex items-center gap-2 cursor-pointer text-white"
              style={{
                background: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(51, 65, 85, 0.8)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
              }}
            >
              <span>INSPECT PROBLEM &amp; ARCHITECTURE</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>
          </div>

          {/* Feature Badges Row */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mt-6 sm:mt-7 pointer-events-auto">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900/85 border border-slate-800/80 backdrop-blur-md text-[11px] sm:text-xs font-mono font-medium text-slate-300 shadow-md">
              <span className="w-2 h-2 rounded-full border border-cyan-400 flex items-center justify-center">
                <span className="w-1 h-1 rounded-full bg-cyan-400" />
              </span>
              <span>100% Offline Runtime</span>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900/85 border border-slate-800/80 backdrop-blur-md text-[11px] sm:text-xs font-mono font-medium text-slate-300 shadow-md">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Precision-Over-Recall Gating</span>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900/85 border border-slate-800/80 backdrop-blur-md text-[11px] sm:text-xs font-mono font-medium text-slate-300 shadow-md">
              <span className="text-cyan-400 font-bold">⚙</span>
              <span>40-Flat P2P Microgrid</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── FRAME 4: THERMAL DIAGNOSTICS OVERLAY ── */}
      <motion.div
        style={{ opacity: frame4Opacity, y: frame4Y }}
        className="absolute inset-0 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex items-center pointer-events-none"
      >
        <div
          className="w-full lg:w-1/2 max-w-xl text-left space-y-4 p-6 lg:p-8 rounded-3xl pointer-events-auto"
          style={{
            background: 'rgba(2,6,23,0.82)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs tracking-wider uppercase font-bold">
            <Sun className="w-3.5 h-3.5" />
            <span>Thermal Envelope Diagnostics</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
            STOP GUESSING WHY YOUR ELECTRICITY BILL SURGED
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-semibold leading-relaxed">
            UrjaSaathi AI isolates mandatory baseline appliances from discretionary surge items,
            calculates structural envelope thermal loss (Concrete U: 2.85 vs Glass U: 5.70 W/m²K),
            and detects vampire standby drain — without installing any hardware.
          </p>
          <div className="flex flex-wrap gap-2.5 text-xs font-mono">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white font-bold">
              Daily kWh = [P × t / 1000] × TLC
            </div>
            <div className="px-3 py-1.5 bg-amber-500/20 rounded-lg border border-amber-500/40 text-amber-300 font-bold">
              Concrete U: 2.85 · Glass U: 5.70
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── FRAME 5: P2P MICROGRID OVERLAY ── */}
      <motion.div
        style={{ opacity: frame5Opacity, y: frame5Y }}
        className="absolute inset-0 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex items-center justify-end pointer-events-none"
      >
        <div
          className="w-full lg:w-1/2 max-w-xl text-left space-y-4 p-6 lg:p-8 rounded-3xl pointer-events-auto"
          style={{
            background: 'rgba(2,6,23,0.82)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs tracking-wider uppercase font-bold">
            <Building2 className="w-3.5 h-3.5" />
            <span>Central HQ · 40-Flat P2P</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
            PROSUMER SHARING AT FAIR INTERNAL TARIFFS
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-semibold leading-relaxed">
            Terrace Solar and VAWT charge LiFePO4 banks. Instead of selling surplus at ₹3.10/kWh,
            the Central HQ ledger matches prosumers with deficit flats at ₹6.20/kWh — saving buyers 30%
            while doubling prosumer earnings.
          </p>
          <div className="text-xs font-mono text-emerald-300 font-black bg-emerald-500/15 border border-emerald-500/35 px-3.5 py-1.5 rounded-lg inline-block">
            GRID ₹8.85 &nbsp;·&nbsp; P2P ₹6.20 &nbsp;·&nbsp; EXPORT ₹3.10 /kWh
          </div>
        </div>
      </motion.div>

      {/* Bottom footer */}
      <div className="absolute bottom-5 left-0 right-0 text-center pointer-events-none">
        <span
          className="text-[10px] font-mono text-white/60 uppercase tracking-widest font-bold px-4 py-1.5 rounded-full"
          style={{ background: 'rgba(2,6,23,0.4)', backdropFilter: 'blur(6px)' }}
        >
          UrjaSaathi AI · Smart Prosumer Microgrid &amp; Building Thermal Diagnostics
        </span>
      </div>
    </div>
  );
};

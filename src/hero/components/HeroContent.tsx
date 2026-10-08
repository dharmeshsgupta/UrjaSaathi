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
    if (onNavigateApp) {
      onNavigateApp();
    } else {
      window.location.hash = 'app';
    }
  };

  const handleScrollToSolution = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onExploreSolution) {
      onExploreSolution();
    } else {
      const el = document.getElementById('problem');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      {/* FRAME 1: INITIAL HERO VIEWPORT (STAGE 1: HOUSE ON RIGHT, CONTENT ON LEFT) */}
      <motion.div
        style={{ opacity: frame1Opacity, y: frame1Y }}
        className="absolute inset-0 pt-20 sm:pt-24 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex items-center justify-between pointer-events-none"
      >
        {/* Left Column Hero Card: 100% Transparent Background */}
        <div className="w-full lg:w-[54%] xl:w-[50%] bg-transparent p-2 sm:p-4 lg:p-6 text-left flex flex-col items-start pointer-events-auto">
          {/* Obsidian Top Badge with Emerald Pulse */}
          {/* <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950 text-white text-[11px] font-mono tracking-wider uppercase mb-3.5 shadow-sm border border-slate-800">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <span className="font-extrabold text-white">ZERO HARDWARE SENSORS · 100% SOFTWARE-ONLY</span>
          </div> */}

          {/* Solid Obsidian Black Title for Maximum Contrast */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-slate-950 tracking-tight leading-[0.98] select-none">
            URJASAATHI{' '}
            <span className="inline-block px-3 py-0.5 rounded-xl bg-amber-400 text-slate-950 font-black text-3xl sm:text-4xl lg:text-5xl shadow-sm">
              AI
            </span>
          </h1>

          {/* High-Contrast Technical Sub-Tag Pill
          <div className="mt-3.5 inline-flex flex-wrap items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white font-mono text-[11px] tracking-wider uppercase shadow-sm">
            <span className="font-bold text-amber-300">PERSONAL ENERGY PLANNER</span>
            <span className="text-slate-600">·</span>
            <span className="text-white font-bold">THERMAL DIAGNOSTICS</span>
            <span className="text-slate-600">·</span>
            <span className="text-emerald-300 font-bold">40-FLAT P2P MICROGRID</span>
          </div> */}

          {/* Solid Dark Slate Body Paragraph
          <p className="mt-4 text-sm sm:text-base text-slate-900 font-bold leading-relaxed max-w-lg">
            Convert simple manual appliance inventories, structural building materials, and local weather into clear energy breakdowns, rooftop solar + VAWT wind generation models, and autonomous peer-to-peer microgrid trading for 40-tenant complexes.
          </p> */}

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <a
              href="#app"
              onClick={handlePrimaryClick}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-display font-black text-xs tracking-wider uppercase transition-all duration-200 shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer border border-slate-800"
            >
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>LAUNCH URJASAATHI SUITE</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </a>

            <a
              href="#problem"
              onClick={handleScrollToSolution}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-display font-black text-xs tracking-wider uppercase transition-all duration-200 shadow-md hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore Features</span>
              <ChevronRight className="w-4 h-4 text-slate-950" />
            </a>
          </div>

          {/* Feature Highlights Badges - Transparent Background
          <div className="mt-6 grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-2.5 text-[11px] font-mono text-slate-950 font-bold">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900/10 border border-stone-400/40 text-slate-950 backdrop-blur-xs">
              <Shield className="w-3.5 h-3.5 text-slate-900" />
              Zero Smart Meters
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900/10 border border-stone-400/40 text-slate-950 backdrop-blur-xs">
              <Sun className="w-3.5 h-3.5 text-slate-900" />
              Rooftop Solar &amp; VAWT
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900/10 border border-stone-400/40 text-slate-950 backdrop-blur-xs">
              <BatteryCharging className="w-3.5 h-3.5 text-slate-900" />
              LiFePO4 Storage
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900/10 border border-stone-400/40 text-slate-950 backdrop-blur-xs">
              <Building2 className="w-3.5 h-3.5 text-slate-900" />
              Central HQ P2P
            </span>
          </div> */}
        </div>

        {/* Right Column: 3D Twin HUD Status Overlay (Anchored to dedicated 3D space)
        <div className="hidden lg:flex flex-col items-end gap-2 ml-auto self-end mb-8 pointer-events-auto">
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-950 text-white font-mono text-xs border border-slate-800 shadow-xl">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <span className="font-bold text-white tracking-wide">3D ECO-HOUSE TWIN</span>
            <span className="text-slate-600">|</span>
            <span className="text-amber-400 font-bold">SOLAR 18.5 kWp</span>
            <span className="text-slate-600">|</span>
            <span className="text-sky-400 font-bold">VAWT 5.2 kW</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-md text-[10px] font-mono font-bold text-white">
            <span>ALL-FACADE WINDOWS</span>
            <span className="text-amber-400">·</span>
            <span>ENLARGED TERRACE PV</span>
            <span className="text-amber-400">·</span>
            <span>LiFePO4 HUB</span>
          </div>
        </div> */}
      </motion.div>

      {/* FRAME 4: STORYTELLING OVERLAY (STAGE 2: HOUSE ZOOMS IN & ROTATES TO SHOW THERMAL ENVELOPE) */}
      <motion.div
        style={{ opacity: frame4Opacity, y: frame4Y }}
        className="absolute inset-0 pt-20 sm:pt-24 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex items-center pointer-events-none"
      >
        <div className="w-full lg:w-[52%] max-w-xl text-left space-y-4 bg-transparent p-2 sm:p-4 lg:p-6 rounded-3xl pointer-events-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950 text-white font-mono text-xs tracking-wider uppercase font-bold">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>THERMAL ENVELOPE DIAGNOSTICS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-slate-950 tracking-tight leading-tight">
            STOP GUESSING WHY YOUR BILL SURGED
          </h2>

          <p className="text-sm sm:text-base text-slate-900 font-bold leading-relaxed">
            Most homes receive only an aggregated monthly lump sum. UrjaSaathi AI isolates mandatory baseline appliances from discretionary surge items, calculates structural envelope thermal loss coefficients (Concrete U: 2.85 vs Glass U: 5.70), and detects dormant standby vampire drain—giving residents clear, itemized savings roadmaps without installing hardware.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs font-mono text-slate-950">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900/10 border border-stone-400/40 font-bold backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-slate-950" />
              <span>Daily kWh = [P × t / 1000] × TLC</span>
            </div>
            <div className="font-bold text-slate-950 px-3 py-1.5 bg-amber-100/80 rounded-lg border border-amber-300">
              Concrete U: 2.85 · Glass U: 5.70 W/m²K
            </div>
          </div>
        </div>
      </motion.div>

      {/* FRAME 5: STORYTELLING OVERLAY (STAGE 3: HOUSE MOVES TO LEFT, SOLAR & VAWT SHOWN, CONTENT ON RIGHT) */}
      <motion.div
        style={{ opacity: frame5Opacity, y: frame5Y }}
        className="absolute inset-0 pt-20 sm:pt-24 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex items-center justify-end pointer-events-none"
      >
        <div className="w-full lg:w-[50%] max-w-xl text-left lg:text-right space-y-4 bg-transparent p-2 sm:p-4 lg:p-6 rounded-3xl pointer-events-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950 text-white font-mono text-xs tracking-wider uppercase font-bold lg:ml-auto">
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>CENTRAL HEADQUARTERS · 40-FLAT P2P MARKETPLACE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-slate-950 tracking-tight leading-tight">
            PROSUMER SHARING AT FAIR INTERNAL TARIFFS
          </h2>

          <p className="text-sm sm:text-base text-slate-900 font-bold leading-relaxed">
            Terrace Solar and Vertical-Axis Wind Turbines (VAWT) charge LiFePO4 battery banks. Instead of selling surplus to the utility grid at a meager ₹3.10/kWh feed-in rate, the Central HQ ledger matches surplus prosumers with deficit flats at ₹6.20/kWh—saving buyers 30% while doubling prosumer earnings and cutting common lift/pump grid draw.
          </p>

          <div className="pt-2 text-xs font-mono text-slate-950 font-black bg-emerald-100/80 border border-emerald-300 px-3.5 py-1.5 rounded-lg inline-block">
            TARIFF ARBITRAGE: GRID ₹8.85 vs P2P ₹6.20 vs EXPORT ₹3.10/kWh
          </div>
        </div>
      </motion.div>

      {/* Bottom Scroll Indicator pinned at bottom of viewport */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-[10px] font-mono text-slate-700 uppercase tracking-widest font-black pointer-events-auto">
        <a
          href="#problem"
          onClick={handleScrollToSolution}
          className="inline-flex items-center gap-1.5 hover:text-slate-950 transition-colors cursor-pointer"
        >
          <span>SCROLL DOWN TO EXPLORE ARCHITECTURE &amp; SIMULATORS</span>
          <ChevronRight className="w-3.5 h-3.5 rotate-90" />
        </a>
      </div>
    </div>
  );
};

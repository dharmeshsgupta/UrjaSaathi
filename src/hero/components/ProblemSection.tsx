import React from 'react';
import { motion } from 'motion/react';
import { 
  Receipt, 
  Flame, 
  ZapOff, 
  SunMedium, 
  Building2, 
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  HelpCircle,
  ShieldAlert,
  SlidersHorizontal,
  Split
} from 'lucide-react';

export const ProblemSection: React.FC = () => {
  const problemCards = [
    {
      number: '01',
      title: 'THE LUMP-SUM BILL PARADOX',
      tagline: 'Zero Appliance-Level Visibility',
      summary: 'Utility discoms deliver a single total kWh and rupee figure each month, leaving residents completely blind to what caused their bill spikes.',
      detail: 'Was it the older water geyser running unchecked, the dual home-office monitors, or an inefficient AC compressor? Without itemized attribution, households cannot diagnose their consumption spikes or hold tenants accountable.',
      icon: Receipt,
      telemetryHint: 'TOTAL kWh BLINDSPOT'
    },
    {
      number: '02',
      title: 'THE INVISIBLE THERMAL PENALTY',
      tagline: 'Building Envelopes Dictate Cooling Cost',
      summary: 'High-rise concrete walls (U ~ 2.85 W/m²K) and single-glazed glass facades (U ~ 5.70 W/m²K) heavily amplify cooling heat ingress.',
      detail: 'Residents blame their air conditioner for high bills, unaware that an unshaded western glass facade or top-floor uninsulated concrete roof increases cooling loads by 45%. UrjaSaathi models the exact Thermal Loss Coefficient (TLC) to isolate envelope factors from appliance faults.',
      icon: Flame,
      telemetryHint: 'U-VALUE ENVELOPE DRAIN'
    },
    {
      number: '03',
      title: 'STANDBY VAMPIRE POWER DRAIN',
      tagline: 'Dormant Devices Bleed 8-15% Monthly',
      summary: 'Smart TVs, set-top boxes, microwave clocks, and inverter chargers continuously draw phantom electricity 24 hours a day.',
      detail: 'A typical 3BHK flat bleeds between 45W and 90W of continuous standby power. Over a month, this dormant leakage accounts for 35 to 65 kWh (₹300 to ₹600) thrown away on appliances that are not actively in use.',
      icon: ZapOff,
      telemetryHint: 'PHANTOM WATT LEAKAGE'
    },
    {
      number: '04',
      title: 'ROOFTOP RENEWABLE MISALIGNMENT',
      tagline: 'Soiling & Ignored Wind Potentials',
      summary: 'Solar arrays lose 15-25% yield from improper seasonal tilt and dust soiling, while turbulent rooftop winds remain completely untapped.',
      detail: 'Traditional horizontal wind turbines fail in urban rooftop turbulence due to rapid wind vector shifts. Vertical-Axis Wind Turbines (VAWT) operate omnidirectionally with low cut-in speeds (2.0 m/s), complementing solar arrays during cloudy monsoon spells and nighttime breezes.',
      icon: SunMedium,
      telemetryHint: '22% DERATING LOSSES'
    },
    {
      number: '05',
      title: '40-FLAT SPLIT-INCENTIVE GRID MONOPOLY',
      tagline: 'Discom Net-Metering vs Consumer Tariffs',
      summary: 'Prosumer flats sell daytime solar surplus back to the grid for a low ₹3.10/kWh, while their neighboring flat pays ₹8.85/kWh for utility power.',
      detail: 'Residential societies lack an internal clearing mechanism to trade power within the premises. UrjaSaathi creates a Central Headquarters P2P Ledger where prosumers sell battery power at ₹6.20/kWh—doubling prosumer return and slashing neighbor bills by 30%.',
      icon: Split,
      telemetryHint: '₹5.75/kWh VALUE SPREAD'
    }
  ];

  return (
    <section id="problem" className="relative py-24 sm:py-32 bg-[#F8F5EE] border-t border-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-950 font-mono text-xs uppercase tracking-wider mb-4 font-bold">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
            <span>OPERATIONAL BOTTLENECKS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-slate-950 tracking-tight leading-tight">
            WHY MODERN RESIDENTIAL ENERGY MANAGEMENT REMAINS BROKEN
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-700 font-medium leading-relaxed">
            Hardware-dependent IoT solutions demand expensive sensors, smart meters, and complex electrician wiring. UrjaSaathi AI replaces costly hardware with software-only thermal physics, mathematical generation modeling, and an autonomous 40-flat trading ledger.
          </p>
        </div>

        {/* 5 Problem Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {problemCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className={`relative flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-white border-2 border-stone-300 hover:border-slate-900 transition-all duration-200 shadow-sm hover:shadow-md ${
                  idx === 4 ? 'md:col-span-2 lg:col-span-2 bg-gradient-to-br from-white via-amber-50/30 to-emerald-50/30' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-sm font-black text-slate-400">
                      {card.number}
                    </span>
                    <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-stone-100 text-slate-800 border border-stone-200">
                      {card.telemetryHint}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center mb-5 shadow-xs">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-xl font-display font-black text-slate-950 tracking-tight mb-1">
                    {card.title}
                  </h3>
                  <div className="text-xs font-mono font-bold text-amber-700 uppercase tracking-wider mb-3">
                    {card.tagline}
                  </div>

                  <p className="text-sm font-semibold text-slate-900 leading-snug mb-3">
                    {card.summary}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {card.detail}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-200 flex items-center justify-between text-xs font-mono text-slate-700">
                  <span className="font-semibold">UrjaSaathi Resolution</span>
                  <span className="text-amber-800 font-bold">Software Physics · Zero-IoT</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-slate-800">
          <div className="space-y-1 text-center md:text-left">
            <div className="text-xs font-mono text-amber-400 uppercase tracking-widest font-bold">
              ZERO CAPITAL EXPENDITURE (CAPEX)
            </div>
            <div className="text-xl sm:text-2xl font-display font-black text-white">
              No smart meter installations. No intrusive IoT rewiring.
            </div>
            <p className="text-sm text-slate-300 font-medium">
              Start diagnosing building thermal efficiency and modeling multi-flat P2P microgrid trades immediately from browser inputs.
            </p>
          </div>
          <a
            href="#solution"
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-black text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer shadow-md"
          >
            Explore Solution Architecture
          </a>
        </div>

      </div>
    </section>
  );
};

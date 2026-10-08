import React from 'react';
import { motion } from 'motion/react';
import { 
  ClipboardList, 
  Cpu, 
  Sun, 
  Building2, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export const WorkflowSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'ZERO-HARDWARE AUDIT ONBOARDING',
      subtitle: '3-Minute Manual Inventory Entry',
      description: 'Tenants or facility managers enter their basic appliance inventory, operating hours, building construction type (Concrete / Glass / Brick), and local city weather. No smart meters or electricians required.',
      icon: ClipboardList,
      metric: '0 Hardware Sensors',
      badge: 'Step 1: Input Layer',
    },
    {
      step: '02',
      title: 'THERMAL ENVELOPE & BASELINE DECOMPOSITION',
      subtitle: 'TLC Calculation & Vampire Audit',
      description: 'The algorithmic engine evaluates heat transfer coefficients (U-values), solar roof radiation, and ambient delta T. It isolates mandatory vs discretionary loads and flags dormant standby vampire power.',
      icon: Cpu,
      metric: 'TLC = [P×t/1000] × TLC',
      badge: 'Step 2: Physics Modeling',
    },
    {
      step: '03',
      title: 'RENEWABLE MICROGRID & BATTERY DISPATCH',
      subtitle: 'Rooftop Solar + VAWT Aerodynamics',
      description: 'Models solar PV yields based on tilt angle and soiling derating, while computing vertical-axis wind turbine power curves. Directs LiFePO4 battery banks to store noon sun and discharge during evening peak grid tariffs.',
      icon: Sun,
      metric: 'Solar + VAWT + LiFePO4',
      badge: 'Step 3: Microgrid Optimization',
    },
    {
      step: '04',
      title: 'CENTRAL HQ AUTONOMOUS P2P CLEARING',
      subtitle: 'Multi-Tenant Fair Tariff Exchange',
      description: 'The Central Headquarters ledger matches prosumers with surplus microgrid power to deficit neighbors at ₹6.20/kWh—saving buyers 30% against utility grid tariffs while boosting prosumer revenue by 100%.',
      icon: Building2,
      metric: '₹6.20/kWh P2P Rate',
      badge: 'Step 4: Ledger Settlement',
    },
  ];

  return (
    <section id="workflow" className="relative py-24 sm:py-32 bg-[#F8F5EE] border-t border-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-amber-300 font-mono text-xs uppercase tracking-wider mb-4 font-bold border border-slate-800 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>HOW URJASAATHI AI OPERATES</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-slate-950 tracking-tight leading-tight">
            FOUR SIMPLE STEPS. TOTAL RESIDENTIAL ENERGY AUTONOMY.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-700 font-medium leading-relaxed">
            From initial manual appliance inventory to real-time 40-flat microgrid trading, our software pipeline operates without IoT installation bottlenecks.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="relative bg-white p-6 sm:p-7 rounded-2xl border-2 border-stone-300 hover:border-slate-900 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-black text-amber-700">
                      {item.badge}
                    </span>
                    <span className="font-mono text-2xl font-black text-slate-300">
                      {item.step}
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center mb-5 shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-display font-black text-slate-950 tracking-tight mb-1">
                    {item.title}
                  </h3>
                  <div className="text-xs font-mono font-bold text-amber-700 uppercase tracking-wider mb-3">
                    {item.subtitle}
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-200 flex items-center justify-between font-mono text-[11px]">
                  <span className="text-slate-500 font-semibold">Engine Metric:</span>
                  <span className="text-slate-950 font-bold bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                    {item.metric}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Technical Callout */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-white border-2 border-stone-300 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display font-black text-slate-950 text-lg">
                Privacy-Preserving &amp; Offline Autonomous
              </h4>
              <p className="text-xs text-slate-600 font-mono mt-0.5">
                All physics models, baseline regressions, and P2P matching operate client-side or in local society edge servers without selling personal tenant habits.
              </p>
            </div>
          </div>
          <a
            href="#app"
            className="px-6 py-3 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-display font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer shadow-md"
          >
            Launch UrjaSaathi App
          </a>
        </div>

      </div>
    </section>
  );
};

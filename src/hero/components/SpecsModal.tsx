import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check, FileText, Cpu, Zap, Sun, Wind, BatteryCharging, Building2, Download } from 'lucide-react';
import { TARIFFS } from '../../data/energyEngine';

interface SpecsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpecsModal: React.FC<SpecsModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const proposalText = `UrjaSaathi AI: Software-Only Personal Energy Planner & Smart Microgrid Management System

Core Objective:
Provide complete visibility into household energy consumption, thermal efficiency, renewable generation, and multi-tenant energy trading without hardware sensors or smart meters.

Key Capabilities:
1. Complete Appliance & Thermal Diagnostics:
   - Categorizes loads into mandatory vs. discretionary baseline items (AC, Geyser, Fridge, Washing Machine, Mixer Grinder, Laptops, TV, Lighting).
   - Adjusts AC/heating costs based on building materials (Concrete U ~ 2.85 W/m²K vs. Glass envelope U ~ 5.70 W/m²K) and local ambient temperatures.
   - Mathematical formulation: Daily Energy (kWh) = [Power (W) * Hours Daily / 1000] * TLC.
   - Standby Vampire Power Audit flags 45W-90W continuous bleed per flat.

2. Prosumer Microgrid Management:
   - Calculates rooftop Solar PV yield with tilt angle and automated soiling cleaning schedules.
   - Calculates Vertical-Axis Wind Turbine (VAWT) yields: P = 0.5 * rho * A_swept * v^3 * Cp (cut-in 2.0 m/s, omnidirectional rooftop advantage).
   - Optimizes LiFePO4 battery storage (93% round-trip efficiency) with peak shaving schedule (noon solar charge, 18:00-22:00 evening discharge).

3. Multi-Tenant Building Management (N = 40 Flats):
   - Computes individual flat consumption alongside common building loads (2x lifts, hydro-pneumatic water pumps, STP, LED common lighting).
   - Calculates aggregate society net utility balance.

4. Central Headquarters P2P Trading Ledger:
   - Manages an internal peer-to-peer energy marketplace where flats with surplus microgrid energy sell battery power to deficit flats.
   - Tariff Arbitrage: Discom Grid Tariff (₹8.85/kWh) vs UrjaSaathi P2P Clearing Rate (₹6.20/kWh) vs Net-Metering Export (₹3.10/kWh).
   - Prosumers earn +100% higher revenue; Buyers save 30% on electricity bills.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(proposalText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadReport = () => {
    const blob = new Blob([proposalText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'UrjaSaathi_AI_Technical_Proposal.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-4xl bg-white rounded-3xl border-2 border-stone-300 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 sm:p-8 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-display font-black text-white">
                  URJASAATHI AI · TECHNICAL SPECIFICATION &amp; PROPOSAL
                </h3>
                <p className="text-xs font-mono text-amber-400">
                  Software-Only Personal Energy Planner &amp; 40-Flat Microgrid Architecture
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-800 font-sans">
            
            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-950">
                <Zap className="w-4 h-4 text-amber-600" />
                <span>Ready for Copy-Paste into Submissions &amp; Pitch Decks</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Proposal Summary'}</span>
                </button>
                <button
                  onClick={handleDownloadReport}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-stone-50 text-slate-900 border border-stone-300 font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .TXT</span>
                </button>
              </div>
            </div>

            {/* Architecture Diagram */}
            <div>
              <h4 className="font-display font-black text-slate-950 text-base uppercase tracking-tight mb-2 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-600" />
                Platform Architecture &amp; Core Modules
              </h4>
              <div className="p-4 rounded-xl bg-slate-900 text-amber-300 font-mono text-[11px] sm:text-xs overflow-x-auto leading-relaxed border border-slate-800">
                <pre>{`                      ┌─────────────────────────────────────────┐
                      │    CENTRAL HEADQUARTERS / ADMIN HUB    │
                      │  • Building Net-Grid Balance & Tariff   │
                      │  • Shared Solar/Wind Allocation Engine  │
                      │  • Virtual Battery Bank & P2P Ledger    │
                      └────────────────────┬────────────────────┘
                                           │
         ┌─────────────────────────────────┼─────────────────────────────────┐
         ▼                                 ▼                                 ▼
┌─────────────────┐               ┌─────────────────┐               ┌─────────────────┐
│     FLAT 101    │               │     FLAT 102    │               │     FLAT 401    │
│ • Appliance Load│               │ • Appliance Load│               │ • Appliance Load│
│ • Terrace Solar │               │ • Standard Load │               │ • Terrace Solar │
│ • Terrace Wind  │               │ • Shared Energy │               │ • Terrace Wind  │
│ • Local Battery │               │   Allocation    │               │ • Local Battery │
└─────────────────┘               └─────────────────┘               └─────────────────┘`}</pre>
              </div>
            </div>

            {/* Mathematical Foundations */}
            <div>
              <h4 className="font-display font-black text-slate-950 text-base uppercase tracking-tight mb-2 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-600" />
                Algorithmic Equations &amp; Physical Formulas
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                  <span className="font-mono text-xs font-bold text-amber-800 uppercase block">1. Thermal Appliance Law</span>
                  <div className="font-mono text-xs font-bold text-slate-950">Daily kWh = [Power (W) × Hours / 1000] × TLC</div>
                  <p className="text-xs text-slate-600">
                    TLC scales with envelope material (Concrete U: 2.85, Glass U: 5.70), outdoor temperature differential (ΔT), and vertical solar roof radiation.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                  <span className="font-mono text-xs font-bold text-cyan-800 uppercase block">2. VAWT Wind Aerodynamics</span>
                  <div className="font-mono text-xs font-bold text-slate-950">P_wind = 0.5 × ρ × A_swept × v³ × Cp</div>
                  <p className="text-xs text-slate-600">
                    Savonius-Darrieus hybrid captures omnidirectional urban rooftop turbulence with low 2.0 m/s cut-in velocity.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                  <span className="font-mono text-xs font-bold text-amber-800 uppercase block">3. Solar PV &amp; Soiling Derating</span>
                  <div className="font-mono text-xs font-bold text-slate-950">E_solar = P_kwp × G_h × PR × (1 - Soiling)</div>
                  <p className="text-xs text-slate-600">
                    Accounts for latitude tilt angle (18°-22° optimal for India) and provides automated cleaning notifications when dust drops yield by &gt;8%.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                  <span className="font-mono text-xs font-bold text-emerald-800 uppercase block">4. Central HQ P2P Clearing</span>
                  <div className="font-mono text-xs font-bold text-slate-950">Tariff: ₹6.20/kWh (Grid: ₹8.85, Feed-in: ₹3.10)</div>
                  <p className="text-xs text-slate-600">
                    Clears internal battery power between surplus prosumers and deficit neighbors, creating net-zero residential ecosystems.
                  </p>
                </div>
              </div>
            </div>

            {/* Three Operational Tiers */}
            <div>
              <h4 className="font-display font-black text-slate-950 text-base uppercase tracking-tight mb-2">
                Operational Tiers
              </h4>
              <ul className="space-y-2 text-xs font-mono text-slate-700">
                <li className="p-3 rounded-lg bg-stone-50 border border-stone-200">
                  <strong className="text-slate-950">Tier 1: Single Household Planner:</strong> Estimates individual appliance draw, isolates standby vampire loss (35-65 kWh/month), and recommends operational savings checklists.
                </li>
                <li className="p-3 rounded-lg bg-stone-50 border border-stone-200">
                  <strong className="text-slate-950">Tier 2: Independent Prosumer Hub:</strong> Tracks rooftop solar + VAWT yields, optimizes LiFePO4 battery round-trip dispatch, and boosts clean self-consumption ratio above 75%.
                </li>
                <li className="p-3 rounded-lg bg-stone-50 border border-stone-200">
                  <strong className="text-slate-950">Tier 3: Multi-Tenant Complex (40 Flats):</strong> Reconciles 40 residential flats with common loads (elevators, water booster pumps, corridor lighting, EV chargers) and automates peer-to-peer trade clearing.
                </li>
              </ul>
            </div>

          </div>

          {/* Footer */}
          <div className="p-6 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
            <span className="font-mono text-xs text-slate-500">
              URJASAATHI AI · ZERO IOT · 100% SOFTWARE-ONLY
            </span>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-950 text-white font-mono text-xs font-bold uppercase transition-all hover:bg-slate-800 cursor-pointer"
            >
              Close Specifications
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Copy, 
  Check, 
  Award, 
  Sparkles, 
  Zap, 
  Sun, 
  Wind, 
  BatteryCharging, 
  Building2, 
  ShieldCheck, 
  ArrowLeft,
  Share2
} from 'lucide-react';
import { getStoredUser } from '../auth/authStore';
import { loadUserEnergyState, calculateEnergyMetrics } from '../data/userEnergyStore';

interface ReportsPitchPageProps {
  onNavigate: (view: string) => void;
}

type ReportMode = 'household_audit' | 'apartment_report' | 'renewable_proposal' | 'bis_pitch';

export const ReportsPitchPage: React.FC<ReportsPitchPageProps> = ({ onNavigate }) => {
  const currentUser = getStoredUser();
  const energyState = loadUserEnergyState(currentUser);
  const metrics = calculateEnergyMetrics(energyState);

  const [activeMode, setActiveMode] = useState<ReportMode>('household_audit');
  const [reportingPeriod, setReportingPeriod] = useState<string>('Q1 2026 / Annual Projection');
  const [copied, setCopied] = useState<boolean>(false);

  // Generate Report Text Content based on active mode
  const getReportContent = () => {
    switch (activeMode) {
      case 'household_audit':
        return `URJASAATHI AI — RESIDENTIAL ENERGY AUDIT & THERMAL REPORT
Document ID: UJ-AUDIT-${energyState.userId.slice(-6).toUpperCase()}-${Date.now().toString().slice(-4)}
Reporting Period: ${reportingPeriod}
Date: ${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}
Premise: ${energyState.householdName} (${energyState.city}, ${energyState.discomName})

1. HOUSEHOLD & CONSUMPTION PROFILE
- Premise Category: ${currentUser?.profile.accountType?.replace('_', ' ').toUpperCase() || 'INDEPENDENT RESIDENCE'}
- Building Envelope Construction: ${metrics.material.name} (U-Factor: ${metrics.material.uValue} W/m²K)
- Thermodynamic Loss Coefficient (TLC): ${metrics.tlc}x Multiplier
- Grid Electricity Tariff: ₹${energyState.tariffPerKWh} / kWh
- Estimated Monthly Consumption: ${metrics.monthlyConsumptionKWh} kWh/month
- Estimated Monthly Utility Bill: ₹${metrics.monthlyCostRupees} / month
- Active Household Appliances: ${energyState.appliances.length} items logged

2. APPLIANCE INVENTORY BREAKDOWN
${energyState.appliances.slice(0, 8).map(a => {
  const dKWh = (a.ratedWatts * a.defaultHoursDaily / 1000) * (a.thermalCoupled ? metrics.tlc : 1);
  return `- ${a.name}: ${a.ratedWatts}W | ${a.defaultHoursDaily} hrs/d | ~${dKWh.toFixed(1)} kWh/d (₹${Math.round(dKWh * 30 * energyState.tariffPerKWh)}/mo)`;
}).join('\n')}

3. PRIMARY INEFFICIENCIES DETECTED
- Thermal Envelope Coupling: High-conductance walls cause an estimated ~₹${Math.round(metrics.monthlyCostRupees * 0.28)}/month in avoidable cooling losses.
- Parasitic Vampire Standby Power: Continuous ${metrics.standbyAudit.standbyTotalWatts}W bleed adds ~${metrics.standbyAudit.standbyMonthlyKWh} kWh/mo (~₹${metrics.standbyAudit.standbyMonthlyCostRupees}/mo).

4. RECOMMENDED 3-TIER SAVINGS PLAN
- Tier A (Zero-Cost): Thermostat calibration (21°C -> 24°C) saves ~48 kWh/mo (~₹425/mo).
- Tier B (Low-Cost): Zero-idle smart power strips eliminate ${metrics.standbyAudit.standbyTotalWatts}W vampire bleed (Payback: 4 months).
- Tier C (Long-Term): Rooftop Solar PV & VAWT wind integration can reduce grid dependence by 75-85%.
- Total Potential Savings: Up to ₹${metrics.potentialSavingsRupees}/month (~${metrics.potentialSavingsKWh} kWh/month reduction).

5. ENVIRONMENTAL & CARBON IMPACT
- Grid Emissions Footprint: ~${metrics.monthlyEmissionsKg} kg CO2e / month (CEA factor 0.82 kg/kWh).
- Avoided Renewable Emissions: -${metrics.avoidedEmissionsMonthlyKg} kg CO2e / month via on-site clean power.
- Ecological Equivalent: ~${Math.round(metrics.avoidedEmissionsMonthlyKg / 21)} mature trees planted per year.

ENGINEERING ASSUMPTIONS & LIMITATIONS:
All figures represent engineering estimates derived from mathematical thermodynamic heat-loss models and BEE baseline equipment ratings. No IoT hardware smart meters are required. Local weather variations and DISCOM regulatory rules apply.`;

      case 'apartment_report':
        return `URJASAATHI AI — MULTI-TENANT 40-FLAT COMPLEX ENERGY REPORT
Document ID: UJ-SOC-40F-${Date.now().toString().slice(-4)}
Facility: 40-Flat High-Rise Society (4 Floors, 10 Flats/Floor)
Location: ${energyState.city} | Grid DISCOM: ${energyState.discomName}

1. EXECUTIVE COMPLEX TOTALS
- Aggregate 40 Flats Daily Demand: 593.4 kWh / day
- Common Building Infrastructure Loads: 78.4 kWh / day (Lifts, STP, Pumps, Lighting)
- Gross Society Electricity Demand: 671.8 kWh / day (~20,154 kWh / month)
- Shared Terrace Generation: 275.2 kWh / day (35 kWp Solar + 12 kW VAWT Wind)
- Society Net Grid Self-Sufficiency: ~41.0% Autonomous

2. P2P CLEARING LEDGER & TARIFF ARBITRAGE
- Local DISCOM Grid Tariff: ₹8.85 / kWh
- UrjaSaathi P2P Clearing Rate: ₹6.20 / kWh
- DISCOM Feed-In Net Metering Rate: ₹3.10 / kWh
- Prosumer Net Gain: +100% higher revenue vs grid export
- Deficit Buyer Savings: -30% lower bills vs grid import

REGULATORY NOTICE:
Internal P2P energy allocations represent calculated clearing settlements. Actual utility billing offsets depend on applicable state SERC regulatory sandbox approvals.`;

      case 'renewable_proposal':
        return `URJASAATHI AI — SOLAR PV & VAWT RENEWABLE FEASIBILITY PROPOSAL
Prepared for: ${energyState.householdName}
Proposed Architecture: Hybrid Solar PV + Omnidirectional VAWT + LiFePO4 BESS

1. SYSTEM SPECIFICATIONS
- Monocrystalline Solar PV Array: 5.5 kWp (Tilt: 20° South, Shadow-free: 440 sq. ft.)
- Expected Solar Yield: ~24.2 kWh / day (~726 kWh / month)
- Savonius-Darrieus VAWT Wind Turbine: 2.4 kW Omnidirectional Cut-in 2.0 m/s
- Expected Wind Yield: ~6.8 kWh / day (~204 kWh / month)
- LiFePO4 Energy Storage (BESS): 5.12 kWh (48V 100Ah, 93% Round-Trip Efficiency)
- Peak Shaving Window: 18:00 - 22:00 evening discharge

2. FINANCIAL RETURN ON INVESTMENT
- Total Monthly Renewable Generation: ~930 kWh / month
- Net Monthly Electric Bill Offset: ~₹${Math.round(930 * energyState.tariffPerKWh)} / month
- Estimated Turnkey Capital Outlay: ₹2,45,000 (after Central PM-Surya Ghar subsidy)
- Estimated Simple Payback Period: ~3.8 Years
- 25-Year Levelized Cost of Energy (LCOE): ~₹2.65 / kWh vs Grid ₹8.85 / kWh`;

      case 'bis_pitch':
        return `URJASAATHI AI — BUREAU OF INDIAN STANDARDS (BIS) COMPETITION PITCH
Project Title: UrjaSaathi AI: Software-Only Personal Energy Planner & Smart Microgrid Management System
Team: UrjaSaathi AI Engineering Team
Track: Smart Energy, Building Decarbonization & Clean Microgrids

1. THE PROBLEM
Urban India is experiencing unprecedented cooling electricity demand surges. Over 65% of summer residential power is consumed by air conditioners fighting poorly insulated building envelopes. Existing solutions require expensive ₹20,000+ IoT smart meters that 98% of households refuse to install.

2. THE SOFTWARE-ONLY INNOVATION
UrjaSaathi AI introduces the Thermal-Load Coupling (TLC) Engine — a patent-pending mathematical formulation that models building material U-values (IS 3792), ambient heat indices, and vampire standby bleed using software-only inputs. Zero IoT hardware. Zero sensor maintenance.

3. KEY CAPABILITIES
- Personal Energy Audit: Disaggregates appliance loads into mandatory vs discretionary baseline items.
- Prosumer Microgrid Suite: Optimizes hybrid rooftop solar PV, urban omnidirectional VAWT wind turbines, and LiFePO4 battery dispatch.
- 40-Flat P2P Trading Ledger: Simulates a local double-auction electricity market where prosumers sell battery power to deficit flats at ₹6.20/kWh (saving buyers 30% and doubling prosumer profit vs ₹3.10 grid export).

4. SCALABILITY & SOCIAL IMPACT
Scalable across 80+ million Indian urban dwellings via a simple web interface. Reduces average residential bills by 22% - 35% and cuts national peak grid stress without government hardware subsidies.`;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getReportContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = getReportContent();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `UrjaSaathi_${activeMode}_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F8F5EE] pt-24 pb-20 selection:bg-amber-500/30 selection:text-amber-950 font-sans text-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm print:hidden">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300">
                AUDIT &amp; PITCH SUITE
              </span>
              <span className="text-xs font-mono text-slate-400">·</span>
              <span className="text-xs font-mono text-slate-500">
                Export Ready Formats
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-slate-950">
              Reports &amp; Pitch Generator
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-sans mt-0.5">
              Generate presentation-ready executive energy reports, multi-tenant audits, and BIS competition pitch decks.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-800 font-mono text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-stone-200"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-800 font-mono text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-stone-200"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .txt</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

        {/* 4 Mode Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 print:hidden">
          {[
            { id: 'household_audit', label: '1. Household Audit', desc: 'Personal Energy Report', icon: Zap },
            { id: 'apartment_report', label: '2. Apartment Society', desc: '40-Flat P2P Ledger', icon: Building2 },
            { id: 'renewable_proposal', label: '3. Solar & VAWT', desc: 'Renewable Proposal', icon: Sun },
            { id: 'bis_pitch', label: '4. BIS Competition', desc: 'Executive Pitch Deck', icon: Award },
          ].map(tab => {
            const Icon = tab.icon;
            const isSelected = activeMode === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveMode(tab.id as ReportMode)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-slate-950 text-white border-slate-950 shadow-sm' 
                    : 'bg-white text-slate-800 border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                  <span className="text-xs font-mono font-bold leading-tight">{tab.label}</span>
                </div>
                <div className={`text-[11px] font-sans ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                  {tab.desc}
                </div>
              </button>
            );
          })}
        </div>

        {/* Document Display Canvas */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border-2 border-stone-300 shadow-xl space-y-6 font-mono text-xs text-slate-800 leading-relaxed whitespace-pre-wrap select-text">
          {getReportContent()}
        </div>

        {/* Disclaimer */}
        <div className="p-4 rounded-2xl bg-stone-100 text-slate-600 text-xs font-sans flex items-start gap-2.5 print:hidden">
          <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <span>
            <strong>Presentation Disclaimer:</strong> UrjaSaathi AI estimates are based on thermodynamic engineering calculations, IS 3792 standards, and historical meteorological data. They are designed for competition submissions, RWA audits, and prosumer planning.
          </span>
        </div>

      </div>
    </div>
  );
};

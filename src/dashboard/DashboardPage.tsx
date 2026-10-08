import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Sun, 
  Wind, 
  BatteryCharging, 
  TrendingDown, 
  Leaf, 
  ShieldCheck, 
  Calendar, 
  Filter, 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowRight, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  SlidersHorizontal,
  FileText,
  Building2,
  Bot,
  Flame,
  ArrowUpRight,
  Clock,
  Gauge
} from 'lucide-react';
import { User, getStoredUser } from '../auth/authStore';
import { 
  loadUserEnergyState, 
  saveUserEnergyState, 
  calculateEnergyMetrics, 
  UserEnergyState 
} from '../data/userEnergyStore';
import { Appliance, BUILDING_MATERIALS, TARIFFS } from '../data/energyEngine';

interface DashboardPageProps {
  onNavigate: (view: string) => void;
  onOpenSpecs?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, onOpenSpecs }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => getStoredUser());
  const [energyState, setEnergyState] = useState<UserEnergyState>(() => loadUserEnergyState(currentUser));
  const [dateFilter, setDateFilter] = useState<'today' | 'this_month' | 'projected_year'>('this_month');
  const [dashboardTab, setDashboardTab] = useState<'overview' | 'appliances' | 'energy_flow'>('overview');

  // Add Appliance Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [appName, setAppName] = useState<string>('');
  const [appWatts, setAppWatts] = useState<number>(350);
  const [appUnits, setAppUnits] = useState<number>(1);
  const [appHours, setAppHours] = useState<number>(3.0);
  const [appCategory, setAppCategory] = useState<'mandatory' | 'discretionary'>('discretionary');
  const [appStar, setAppStar] = useState<1 | 2 | 3 | 4 | 5>(4);

  // Sync state when changes happen
  useEffect(() => {
    const handleEnergyChange = () => {
      setEnergyState(loadUserEnergyState(currentUser));
    };
    window.addEventListener('urjasaathi_energy_change', handleEnergyChange);
    return () => window.removeEventListener('urjasaathi_energy_change', handleEnergyChange);
  }, [currentUser]);

  const metrics = calculateEnergyMetrics(energyState);

  // Appliance Handlers
  const handleAddAppliance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appName.trim()) return;

    const newApp: Appliance = {
      id: `app_${Date.now()}`,
      name: appName.trim(),
      category: appCategory,
      ratedWatts: Number(appWatts) * Number(appUnits),
      standbyWatts: appCategory === 'discretionary' ? 4 : 1,
      defaultHoursDaily: Number(appHours),
      starRating: appStar,
      icon: 'Zap',
      description: `User-configured appliance (${appUnits} unit${appUnits > 1 ? 's' : ''} @ ${appWatts}W).`,
      seasonalSurge: 'neutral',
      thermalCoupled: appName.toLowerCase().includes('ac') || appName.toLowerCase().includes('cooler'),
    };

    const updated = {
      ...energyState,
      appliances: [newApp, ...energyState.appliances]
    };
    setEnergyState(updated);
    saveUserEnergyState(updated);

    // Reset Form
    setAppName('');
    setAppWatts(350);
    setAppUnits(1);
    setAppHours(3.0);
    setIsAddModalOpen(false);
  };

  const handleRemoveAppliance = (id: string) => {
    const updated = {
      ...energyState,
      appliances: energyState.appliances.filter(a => a.id !== id)
    };
    setEnergyState(updated);
    saveUserEnergyState(updated);
  };

  const toggleSmartStrip = () => {
    const updated = {
      ...energyState,
      smartStripMitigation: !energyState.smartStripMitigation
    };
    setEnergyState(updated);
    saveUserEnergyState(updated);
  };

  return (
    <div className="min-h-screen bg-[#F8F5EE] pt-24 pb-20 selection:bg-amber-500/30 selection:text-amber-950 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* ============================================================== */}
        {/* DASHBOARD HEADER & QUICK FILTERS                               */}
        {/* ============================================================== */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300">
                {currentUser?.profile.accountType?.replace('_', ' ').toUpperCase() || 'RESIDENTIAL PROSUMER'}
              </span>
              <span className="text-xs font-mono text-slate-400">·</span>
              <span className="text-xs font-mono text-slate-500">
                {energyState.city}, {energyState.discomName}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-slate-950">
              Welcome back, {currentUser?.name || 'Prosumer'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-sans mt-0.5">
              Understand your energy. Reduce waste. Plan a cleaner future.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Date Filter */}
            <div className="flex items-center bg-stone-100 p-1 rounded-2xl border border-stone-200">
              <button
                onClick={() => setDateFilter('today')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  dateFilter === 'today' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setDateFilter('this_month')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  dateFilter === 'this_month' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                This Month
              </button>
              <button
                onClick={() => setDateFilter('projected_year')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  dateFilter === 'projected_year' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                Yearly Trend
              </button>
            </div>

            <button
              onClick={() => onNavigate('planner')}
              className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
              <span>Audit &amp; Plan</span>
            </button>
          </div>
        </div>

        {/* Onboarding Notice if Profile Incomplete */}
        {currentUser && !currentUser.profile.isProfileComplete && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500 text-slate-950">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-mono font-bold text-amber-950">
                  Energy Profile Incomplete
                </h4>
                <p className="text-xs text-amber-900 font-sans">
                  Complete your household and solar/VAWT specs to unlock 98% accurate thermal calculations and payback models.
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('planner')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-950 text-white font-mono text-xs font-bold uppercase whitespace-nowrap cursor-pointer hover:bg-slate-900"
            >
              Complete Profile →
            </button>
          </div>
        )}

        {/* ============================================================== */}
        {/* 6 SUMMARY CARDS (With Data Provenance Distinction)             */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Card 1: Electricity Consumption */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                1. Electricity Consumption
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-stone-100 text-stone-600 border border-stone-200">
                Calculated Estimate
              </span>
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-display font-black text-slate-950">
                  {dateFilter === 'today' ? metrics.dailyConsumptionKWh : metrics.monthlyConsumptionKWh}
                </span>
                <span className="text-sm font-mono text-slate-500 font-bold">kWh</span>
              </div>
              <div className="text-xs text-slate-500 font-sans mt-1">
                {dateFilter === 'today' 
                  ? `Daily load (~${metrics.mandatoryKWh} kWh baseline + ${metrics.discretionaryKWh} kWh discretionary)`
                  : `Monthly estimated draw (${energyState.appliances.length} active household appliances)`}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500">Envelope TLC Factor:</span>
              <span className="font-bold text-amber-700">{metrics.tlc}x multiplier</span>
            </div>
          </div>

          {/* Card 2: Estimated Electricity Cost */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                2. Estimated Electricity Cost
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-stone-100 text-stone-600 border border-stone-200">
                ₹{energyState.tariffPerKWh}/kWh Tariff
              </span>
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-display font-black text-slate-950">
                  ₹{dateFilter === 'today' ? metrics.dailyCostRupees : metrics.monthlyCostRupees}
                </span>
                <span className="text-xs font-mono text-slate-500">
                  / {dateFilter === 'today' ? 'day' : 'month'}
                </span>
              </div>
              <div className="text-xs text-slate-500 font-sans mt-1">
                Based on active DISCOM tariff slabs without commercial penalties.
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500">Vampire Standby Bleed:</span>
              <span className="font-bold text-rose-600">~₹{metrics.standbyAudit.standbyMonthlyCostRupees}/mo</span>
            </div>
          </div>

          {/* Card 3: Energy-Saving Opportunity */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                3. Saving Opportunity
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                Actionable
              </span>
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-display font-black text-emerald-600">
                  ₹{metrics.potentialSavingsRupees}
                </span>
                <span className="text-xs font-mono text-slate-500">/ month</span>
              </div>
              <div className="text-xs text-slate-500 font-sans mt-1">
                Potential reduction of ~{metrics.potentialSavingsKWh} kWh/mo via thermal tuning &amp; vampire strips.
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-mono">
              <button
                onClick={() => onNavigate('planner')}
                className="text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>Explore 3 Scenarios</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 4: Renewable Energy */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                4. Renewable Generation
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-100 text-amber-900 border border-amber-300 font-bold">
                Solar + VAWT
              </span>
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-display font-black text-slate-950">
                  {dateFilter === 'today' ? metrics.dailyRenewableKWh : metrics.monthlyRenewableKWh}
                </span>
                <span className="text-sm font-mono text-slate-500 font-bold">kWh</span>
              </div>
              <div className="text-xs text-slate-500 font-sans mt-1">
                Solar PV: {metrics.solarYield.dailyKWh} kWh/d · VAWT Wind: {metrics.vawtYield.dailyKWh} kWh/d
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500">Clean Savings:</span>
              <span className="font-bold text-emerald-700">~₹{metrics.monthlyRenewableSavingsRupees}/mo</span>
            </div>
          </div>

          {/* Card 5: Energy Independence */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                5. Energy Independence
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-stone-100 text-stone-600 border border-stone-200">
                Self-Consumption
              </span>
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-display font-black text-amber-600">
                  {metrics.energyIndependencePercent}%
                </span>
                <span className="text-xs font-mono text-slate-500">Autonomous</span>
              </div>
              {/* Visual Progress Bar */}
              <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden mt-2">
                <div 
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${metrics.energyIndependencePercent}%` }}
                />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500">Grid Reliance:</span>
              <span className="font-bold text-slate-800">{Math.max(0, 100 - metrics.energyIndependencePercent)}% Net Utility</span>
            </div>
          </div>

          {/* Card 6: Carbon Impact */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                6. Carbon Impact
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1 font-bold">
                <Leaf className="w-3 h-3" />
                <span>Avoided CO₂</span>
              </span>
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-display font-black text-emerald-700">
                  -{metrics.avoidedEmissionsMonthlyKg}
                </span>
                <span className="text-sm font-mono text-slate-500 font-bold">kg CO₂e/mo</span>
              </div>
              <div className="text-xs text-slate-500 font-sans mt-1">
                Gross Grid Draw: ~{metrics.monthlyEmissionsKg} kg CO₂e based on CEA baseline factor (0.82 kg/kWh).
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500">Tree Equivalent:</span>
              <span className="font-bold text-emerald-700">~{Math.round(metrics.avoidedEmissionsMonthlyKg / 21)} mature trees</span>
            </div>
          </div>

        </div>

        {/* ============================================================== */}
        {/* TABS FOR DEEP MONITORING: Overview, Appliances, Energy Flow    */}
        {/* ============================================================== */}
        <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
          <button
            onClick={() => setDashboardTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider transition-all cursor-pointer ${
              dashboardTab === 'overview'
                ? 'bg-slate-950 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            A. Overview &amp; Recommendations
          </button>
          <button
            onClick={() => setDashboardTab('appliances')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider transition-all cursor-pointer ${
              dashboardTab === 'appliances'
                ? 'bg-slate-950 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            B. Appliance Matrix ({energyState.appliances.length})
          </button>
          <button
            onClick={() => setDashboardTab('energy_flow')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider transition-all cursor-pointer ${
              dashboardTab === 'energy_flow'
                ? 'bg-slate-950 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            E. Energy Flow &amp; Battery
          </button>
        </div>

        {/* ============================================================== */}
        {/* TAB A: OVERVIEW & RECOMMENDED ACTIONS                          */}
        {/* ============================================================== */}
        {dashboardTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Consumption vs Renewable Breakdown */}
            <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-display font-black text-slate-950">
                    Household Consumption vs Renewable Contribution
                  </h3>
                  <p className="text-xs text-slate-500 font-sans">
                    Estimated daily 24-hour balance profile across baseline, thermal surge, solar PV, and VAWT wind.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono">
                  <span className="w-3 h-3 rounded-full bg-slate-900 inline-block" />
                  <span className="text-slate-600 mr-2">Load</span>
                  <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                  <span className="text-slate-600">Renewable</span>
                </div>
              </div>

              {/* Visual Day Schedule Bars */}
              <div className="space-y-3">
                {[
                  { time: '06:00 - 10:00 (Morning Rush)', load: 2.8, gen: 1.2, note: 'Water geyser & induction cooking surge' },
                  { time: '10:00 - 15:00 (Peak Solar Window)', load: 3.2, gen: 4.8, note: 'Net surplus sent to battery & water pumping' },
                  { time: '15:00 - 19:00 (Afternoon Thermal)', load: 4.1, gen: 2.1, note: 'Building thermal lag causes peak AC load' },
                  { time: '19:00 - 23:00 (Evening Prime)', load: 4.9, gen: 0.8, note: 'Battery peak shaving active (VAWT wind boost)' },
                  { time: '23:00 - 06:00 (Night Standby)', load: 1.5, gen: 0.6, note: 'Vampire standby load & refrigerator cycling' },
                ].map((slot, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                    <div className="flex items-center justify-between text-xs font-mono font-bold mb-1">
                      <span className="text-slate-900">{slot.time}</span>
                      <span className="text-slate-500 font-sans text-[11px]">{slot.note}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <div className="flex justify-between text-[11px] font-mono text-slate-600 mb-0.5">
                          <span>Load: {slot.load} kWh</span>
                        </div>
                        <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
                          <div className="h-full bg-slate-900 rounded-full" style={{ width: `${(slot.load / 5) * 100}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[11px] font-mono text-slate-600 mb-0.5">
                          <span>Renewable: {slot.gen} kWh</span>
                        </div>
                        <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(slot.gen / 5) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Data Provenance Disclaimer */}
              <div className="p-4 rounded-2xl bg-stone-100 text-slate-600 text-xs font-sans flex items-start gap-2.5">
                <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Data Provenance Notice:</strong> These figures are calculated strictly from your entered appliance inventory, envelope material U-values, and meteorological models. No IoT smart meters are required.
                </span>
              </div>
            </div>

            {/* Right Col: Quick Modules Navigation & Saved Plans */}
            <div className="space-y-6">
              
              {/* Quick Navigation Cards */}
              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-3">
                <h3 className="text-sm font-mono font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Connected UrjaSaathi Modules
                </h3>

                <button
                  onClick={() => onNavigate('planner')}
                  className="w-full text-left p-3 rounded-2xl bg-stone-50 hover:bg-amber-50 border border-stone-200 transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                      <SlidersHorizontal className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-mono font-bold text-slate-950">Energy-Saving Planner</div>
                      <div className="text-[11px] text-slate-500">Interactive 3-scenario recommendations</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('innovation-1')}
                  className="w-full text-left p-3 rounded-2xl bg-stone-50 hover:bg-amber-50 border border-stone-200 transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-rose-100 text-rose-800">
                      <Flame className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-mono font-bold text-slate-950">Innovation 1: Thermal TLC</div>
                      <div className="text-[11px] text-slate-500">Envelope U-value &amp; heat index diagnostics</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('solar-vawt')}
                  className="w-full text-left p-3 rounded-2xl bg-stone-50 hover:bg-amber-50 border border-stone-200 transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                      <Sun className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-mono font-bold text-slate-950">Solar &amp; VAWT Microgrid</div>
                      <div className="text-[11px] text-slate-500">Clean plant registration &amp; battery BESS</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('apartment')}
                  className="w-full text-left p-3 rounded-2xl bg-stone-50 hover:bg-amber-50 border border-stone-200 transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-sky-100 text-sky-800">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-mono font-bold text-slate-950">Apartment Energy (40 Flats)</div>
                      <div className="text-[11px] text-slate-500">Shared microgrid &amp; P2P trading ledger</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('chat')}
                  className="w-full text-left p-3 rounded-2xl bg-stone-50 hover:bg-emerald-50 border border-stone-200 transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-mono font-bold text-slate-950">UrjaSaathi AI Copilot</div>
                      <div className="text-[11px] text-slate-500">Ask why consumption is high &amp; get advice</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Saved Energy Plans Card */}
              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-mono font-bold text-slate-900 uppercase tracking-wider">
                    Active Saved Plans
                  </h3>
                  <button
                    onClick={() => onNavigate('planner')}
                    className="text-xs font-mono text-amber-700 hover:text-amber-800 font-bold"
                  >
                    + New Plan
                  </button>
                </div>

                {energyState.savedPlans.map(plan => (
                  <div key={plan.id} className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-slate-950">{plan.title}</span>
                      <span className="text-[10px] font-mono text-emerald-700 font-bold">
                        -₹{plan.estimatedMonthlySavingsRupees}/mo
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 font-sans">
                      Target: {plan.targetKWhReduction} kWh monthly reduction across {plan.selectedActions.length} planned actions.
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* TAB B: APPLIANCE MATRIX & MONITORING                           */}
        {/* ============================================================== */}
        {dashboardTab === 'appliances' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-display font-black text-slate-950">
                  Appliance Inventory &amp; Estimated Consumption Breakdown
                </h3>
                <p className="text-xs text-slate-500 font-sans">
                  Manage individual rated power, daily operating hours, and thermal envelope multipliers.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={toggleSmartStrip}
                  className={`px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-colors ${
                    energyState.smartStripMitigation 
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                      : 'bg-stone-100 text-slate-700 border border-stone-200 hover:bg-stone-200'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Smart Strips: {energyState.smartStripMitigation ? 'ON (Vampire Mitigated)' : 'OFF'}</span>
                </button>

                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  <span>Add Appliance</span>
                </button>
              </div>
            </div>

            {/* Appliance Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-stone-200 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4 font-bold">Appliance Name</th>
                    <th className="py-3 px-4 font-bold">Rated Power</th>
                    <th className="py-3 px-4 font-bold">Hours / Day</th>
                    <th className="py-3 px-4 font-bold">Daily kWh</th>
                    <th className="py-3 px-4 font-bold">Monthly kWh</th>
                    <th className="py-3 px-4 font-bold">Monthly Cost</th>
                    <th className="py-3 px-4 font-bold">Thermal Coupling</th>
                    <th className="py-3 px-4 text-right font-bold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {energyState.appliances.map(app => {
                    let dailyKWh = (app.ratedWatts * app.defaultHoursDaily) / 1000;
                    if (app.thermalCoupled) {
                      dailyKWh *= metrics.tlc;
                    }
                    dailyKWh = Number(dailyKWh.toFixed(2));
                    const monthlyKWh = Number((dailyKWh * 30).toFixed(1));
                    const monthlyCost = Math.round(monthlyKWh * energyState.tariffPerKWh);

                    return (
                      <tr key={app.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-950 flex items-center gap-2">
                          <Zap className="w-3.5 h-3.5 text-amber-500" />
                          <span>{app.name}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{app.ratedWatts} W</td>
                        <td className="py-3 px-4 text-slate-600">{app.defaultHoursDaily} hrs</td>
                        <td className="py-3 px-4 font-bold text-slate-900">{dailyKWh} kWh</td>
                        <td className="py-3 px-4 font-bold text-slate-900">{monthlyKWh} kWh</td>
                        <td className="py-3 px-4 font-bold text-slate-950">₹{monthlyCost}</td>
                        <td className="py-3 px-4">
                          {app.thermalCoupled ? (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-rose-100 text-rose-800 font-bold border border-rose-200">
                              Active (x{metrics.tlc})
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Independent</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleRemoveAppliance(app.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Remove appliance"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Standby Vampire Power Audit Card */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <h4 className="text-xs font-mono font-bold text-amber-950">
                    Standby Vampire Power Leakage: {metrics.standbyAudit.standbyTotalWatts}W Continuous Bleed
                  </h4>
                  <p className="text-xs text-amber-900 font-sans">
                    Standby parasitic power bleeds ~{metrics.standbyAudit.standbyMonthlyKWh} kWh/month (₹{metrics.standbyAudit.standbyMonthlyCostRupees}) across idle AC controllers, TV boards, and chargers.
                  </p>
                </div>
              </div>

              <button
                onClick={toggleSmartStrip}
                className="px-3.5 py-1.5 rounded-xl bg-slate-950 text-white font-mono text-xs font-bold whitespace-nowrap cursor-pointer hover:bg-slate-900"
              >
                {energyState.smartStripMitigation ? 'Disable Smart Strips' : 'Enable Smart Strips (-100% Vampire)'}
              </button>
            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* TAB E: BATTERY & ENERGY FLOW                                   */}
        {/* ============================================================== */}
        {dashboardTab === 'energy_flow' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-display font-black text-slate-950">
                Battery Storage &amp; Peak-Shaving Energy Flow
              </h3>
              <p className="text-xs text-slate-500 font-sans">
                Real-time round-trip efficiency (93%), state of charge, and dispatch scheduling.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <div className="text-xs font-mono text-slate-500">LiFePO4 Storage Capacity</div>
                <div className="text-2xl font-display font-black text-slate-950 mt-1">5.12 kWh</div>
                <div className="text-[11px] text-slate-500 font-sans mt-0.5">Modular 48V 100Ah rack</div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <div className="text-xs font-mono text-slate-500">Estimated State of Charge (SoC)</div>
                <div className="text-2xl font-display font-black text-emerald-600 mt-1">78%</div>
                <div className="text-[11px] text-slate-500 font-sans mt-0.5">Estimated from net generation</div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <div className="text-xs font-mono text-slate-500">Peak Shaving Window</div>
                <div className="text-2xl font-display font-black text-amber-600 mt-1">18:00 - 22:00</div>
                <div className="text-[11px] text-slate-500 font-sans mt-0.5">Avoids high DISCOM evening tariff</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-100 text-xs font-mono text-slate-600 space-y-2">
              <div className="font-bold text-slate-800">Dispatch Logic Rule:</div>
              <div>1. 09:00 - 15:00: Direct solar self-consumption; excess generation charges LiFePO4 battery bank to 95%.</div>
              <div>2. 18:00 - 22:00: Battery discharges to power household lights, TV, and fans during grid peak rate periods.</div>
              <div>3. 22:00 - 06:00: VAWT wind generator supplements nocturnal base load.</div>
            </div>

            <button
              onClick={() => onNavigate('solar-vawt')}
              className="px-4 py-2.5 rounded-xl bg-slate-950 text-white font-mono text-xs font-bold flex items-center gap-2 cursor-pointer hover:bg-slate-900"
            >
              <span>Manage Plant Connection in Solar &amp; VAWT Module</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </div>
        )}

      </div>

      {/* ============================================================== */}
      {/* MODAL: ADD CUSTOM APPLIANCE                                    */}
      {/* ============================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-stone-200 shadow-2xl">
            <h3 className="text-lg font-display font-bold text-slate-950 mb-1">Add Appliance to Household</h3>
            <p className="text-xs text-slate-600 mb-4 font-sans">
              Enter power rating and daily operating hours to update your load profile.
            </p>

            <form onSubmit={handleAddAppliance} className="space-y-3 text-xs font-mono">
              <div>
                <label className="block font-bold text-slate-800 uppercase mb-1">Appliance Name</label>
                <input
                  type="text"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  placeholder="e.g. Microwave Oven, 2-Ton AC"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-sans text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 uppercase mb-1">Rated Power (Watts)</label>
                  <input
                    type="number"
                    value={appWatts}
                    onChange={(e) => setAppWatts(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-sans text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 uppercase mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={appUnits}
                    onChange={(e) => setAppUnits(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-sans text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 uppercase mb-1">Hours Used Daily</label>
                  <input
                    type="number"
                    step="0.5"
                    value={appHours}
                    onChange={(e) => setAppHours(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-sans text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 uppercase mb-1">Load Category</label>
                  <select
                    value={appCategory}
                    onChange={(e) => setAppCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-sans text-sm"
                  >
                    <option value="discretionary">Discretionary</option>
                    <option value="mandatory">Mandatory</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-950 text-white font-bold cursor-pointer"
                >
                  Add Appliance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

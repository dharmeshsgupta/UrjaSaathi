import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  TrendingDown, 
  Sparkles, 
  AlertCircle, 
  DollarSign, 
  Sun, 
  BatteryCharging, 
  ShieldCheck, 
  FileText,
  UploadCloud,
  Check,
  RotateCcw,
  Info
} from 'lucide-react';
import { getStoredUser } from '../auth/authStore';
import { 
  loadUserEnergyState, 
  saveUserEnergyState, 
  calculateEnergyMetrics, 
  SavedEnergyPlan 
} from '../data/userEnergyStore';

interface EnergyPlannerPageProps {
  onNavigate: (view: string) => void;
}

export const EnergyPlannerPage: React.FC<EnergyPlannerPageProps> = ({ onNavigate }) => {
  const currentUser = getStoredUser();
  const [energyState, setEnergyState] = useState(() => loadUserEnergyState(currentUser));
  const metrics = calculateEnergyMetrics(energyState);

  // Form State: Section A: Electricity Info
  const [monthlyKWh, setMonthlyKWh] = useState<number>(metrics.monthlyConsumptionKWh);
  const [monthlyBill, setMonthlyBill] = useState<number>(metrics.monthlyCostRupees);
  const [tariff, setTariff] = useState<number>(energyState.tariffPerKWh);
  const [billingPeriod, setBillingPeriod] = useState<string>('Monthly (30 days)');
  const [billUploaded, setBillUploaded] = useState<boolean>(false);

  // Section C: Household Info
  const [homeType, setHomeType] = useState<'house' | 'apartment'>('house');
  const [occupants, setOccupants] = useState<number>(currentUser?.profile.occupants || 4);
  const [daytimeOccupancy, setDaytimeOccupancy] = useState<'low' | 'moderate' | 'high'>('moderate');
  const [primaryLoads, setPrimaryLoads] = useState<string[]>(['ac', 'geyser', 'refrigeration']);

  // Section D: User Goals
  const [goals, setGoals] = useState<string[]>([
    'reduce_cost', 
    'increase_solar', 
    'cut_vampire'
  ]);

  // View state: 'form' or 'results'
  const [step, setStep] = useState<'form' | 'results'>('results');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const toggleGoal = (id: string) => {
    if (goals.includes(id)) {
      setGoals(goals.filter(g => g !== id));
    } else {
      setGoals([...goals, id]);
    }
  };

  const handleSimulateBillUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBillUploaded(true);
      setMonthlyKWh(512);
      setMonthlyBill(4530);
      setTariff(8.85);
    }
  };

  // Recommendations Datasets with Rigorous Explanations
  const scenarioA = [
    {
      id: 'scA_1',
      title: 'Thermostat Setpoint Adjustment (21°C → 24°C)',
      description: 'Raise air-conditioner setpoint from chilling 21°C to the Bureau of Energy Efficiency (BEE) recommended 24°C baseline.',
      whyMatters: 'Every 1°C increase in AC thermostat setting reduces compressor electrical work by 6% due to reduced thermal envelope heat flux.',
      monthlyKWhSaved: 48.0,
      monthlyRupeesSaved: Math.round(48.0 * tariff),
      cost: 0,
      confidence: 'High (Thermodynamic Carnot cycle baseline)',
      assumptions: 'Assumes 7.5 hrs daily operation of 1.5-ton split inverter AC during summer months.',
    },
    {
      id: 'scA_2',
      title: 'Off-Peak Wet Appliance Scheduling',
      description: 'Run washing machines, dishwashers, and iron presses during peak solar generation hours (11:00 - 14:00) rather than evening peak grid hours.',
      whyMatters: 'Maximizes direct solar self-consumption and prevents costly utility peak-tariff surcharges.',
      monthlyKWhSaved: 18.5,
      monthlyRupeesSaved: Math.round(18.5 * tariff),
      cost: 0,
      confidence: 'Medium (User habit dependent)',
      assumptions: 'Assumes 1 cycle/day of 800W washing machine.',
    },
  ];

  const scenarioB = [
    {
      id: 'scB_1',
      title: 'Zero-Idle Smart Power Strips for AV & Workstations',
      description: 'Deploy auto-cutoff smart strips on TV, soundbar, desktop computers, and chargers to terminate parasitic vampire power.',
      whyMatters: 'Vampire standby power constantly bleeds 45W-90W continuous baseline load even when appliances are turned off via remote.',
      monthlyKWhSaved: 38.0,
      monthlyRupeesSaved: Math.round(38.0 * tariff),
      cost: 1400,
      confidence: 'High (Standby power audit calibrated)',
      assumptions: 'Eliminates 55W continuous standby across 2 rooms (55W * 24h * 30d / 1000 = 39.6 kWh).',
    },
    {
      id: 'scB_2',
      title: 'BLDC Ceiling Fan Retrofit',
      description: 'Replace standard 75W induction ceiling fans with 28W 5-Star Brushless DC (BLDC) motor fans with RF remote speed governors.',
      whyMatters: 'BLDC motor electronics run cooler and consume 62% less electricity at identical air delivery (CMM).',
      monthlyKWhSaved: 42.0,
      monthlyRupeesSaved: Math.round(42.0 * tariff),
      cost: 3200,
      confidence: 'High (BEE standard specifications)',
      assumptions: 'Assumes 3 fans running 10 hrs daily (47W savings * 3 * 10h * 30d / 1000 = 42.3 kWh).',
    },
  ];

  const scenarioC = [
    {
      id: 'scC_1',
      title: 'Rooftop Solar PV Expansion (+3.5 kWp) & VAWT Integration',
      description: 'Add tier-1 monocrystalline bifacial solar panels and an omnidirectional rooftop VAWT turbine with hybrid dual-MPPT controller.',
      whyMatters: 'Generates on-site clean power, lowering net grid import by 65-85% with net metering export compensation.',
      monthlyKWhSaved: 420.0,
      monthlyRupeesSaved: Math.round(420.0 * tariff),
      cost: 185000,
      confidence: 'Medium (Weather and irradiance dependent)',
      assumptions: 'Assumes 4.8 peak sun hours/day in western/southern India and 5.5 m/s rooftop wind velocity.',
    },
    {
      id: 'scC_2',
      title: 'Heat Pump Water Heating & Inverter Heat Envelope Upgrades',
      description: 'Replace 25L resistive water geysers (2000W) with an air-source heat pump (COP 3.4) and install radiant barrier roof insulation.',
      whyMatters: 'Heat pumps transfer thermal energy from ambient air rather than generating heat resistively, cutting water heating energy by 70%.',
      monthlyKWhSaved: 68.0,
      monthlyRupeesSaved: Math.round(68.0 * tariff),
      cost: 38000,
      confidence: 'Medium (Climate & winter water temp dependent)',
      assumptions: 'COP of 3.4 during winter mornings with 25°C ambient air.',
    },
  ];

  const totalPossibleKWhSaved = scenarioA.reduce((s, a) => s + a.monthlyKWhSaved, 0)
    + scenarioB.reduce((s, a) => s + a.monthlyKWhSaved, 0)
    + scenarioC.reduce((s, a) => s + a.monthlyKWhSaved, 0);

  const totalPossibleRupeesSaved = Math.round(totalPossibleKWhSaved * tariff);

  const handleSavePlan = () => {
    const newPlan: SavedEnergyPlan = {
      id: `plan_${Date.now()}`,
      savedAt: new Date().toISOString(),
      title: `Personalized 3-Tier Optimization (${new Date().toLocaleDateString()})`,
      targetKWhReduction: totalPossibleKWhSaved,
      estimatedMonthlySavingsRupees: totalPossibleRupeesSaved,
      selectedActions: [
        ...scenarioA.map(a => ({ scenario: 'A' as const, action: a.title, impactKWh: a.monthlyKWhSaved, impactRupees: a.monthlyRupeesSaved, cost: a.cost })),
        ...scenarioB.map(b => ({ scenario: 'B' as const, action: b.title, impactKWh: b.monthlyKWhSaved, impactRupees: b.monthlyRupeesSaved, cost: b.cost })),
      ]
    };

    const updated = {
      ...energyState,
      savedPlans: [newPlan, ...energyState.savedPlans]
    };
    setEnergyState(updated);
    saveUserEnergyState(updated);

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#F8F5EE] pt-24 pb-20 selection:bg-amber-500/30 selection:text-amber-950 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300">
                CORE INNOVATION MODULE
              </span>
              <span className="text-xs font-mono text-slate-400">·</span>
              <span className="text-xs font-mono text-slate-500">
                Zero-Hardware Energy Audit
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-slate-950">
              Interactive Energy-Saving Planner
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-sans mt-0.5">
              Enter your actual consumption parameters to receive personalized, thermodynamic energy-saving recommendations across 3 actionable tiers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setStep(step === 'form' ? 'results' : 'form')}
              className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-800 font-mono text-xs font-bold transition-colors cursor-pointer border border-stone-200"
            >
              {step === 'form' ? 'View Results & Scenarios →' : '← Edit Audit Inputs'}
            </button>
            <button
              onClick={handleSavePlan}
              className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Plan Saved!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Save My Energy Plan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* VIEW 1: AUDIT & CONSUMPTION INPUT FORM                         */}
        {/* ============================================================== */}
        {step === 'form' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <div className="border-b border-stone-200 pb-3">
              <h2 className="text-lg font-display font-black text-slate-950">
                Describe Your Electricity Consumption &amp; Inefficiencies
              </h2>
              <p className="text-xs text-slate-500 font-sans">
                UrjaSaathi AI uses these parameters to simulate your building envelope losses and appliance duty-cycles.
              </p>
            </div>

            {/* A. Electricity Information */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
                A. Electricity &amp; Billing Data
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-700 mb-1">Monthly Consumption (kWh)</label>
                  <input
                    type="number"
                    value={monthlyKWh}
                    onChange={(e) => setMonthlyKWh(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-sans"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-700 mb-1">Monthly Electricity Bill (₹)</label>
                  <input
                    type="number"
                    value={monthlyBill}
                    onChange={(e) => setMonthlyBill(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-sans"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-700 mb-1">Tariff per kWh (₹)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={tariff}
                    onChange={(e) => setTariff(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-sans"
                  />
                </div>
              </div>

              {/* Optional Bill Upload Simulation */}
              <div className="p-4 rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50/60 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-xs text-slate-600 font-sans">
                  <UploadCloud className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900">Optional Electricity Bill OCR Upload</span>
                    <p className="text-[11px] text-slate-500">Upload PDF or photo of DISCOM bill to extract slabs automatically.</p>
                  </div>
                </div>

                <label className="px-4 py-1.5 rounded-xl bg-white border border-stone-300 text-slate-700 font-mono text-xs font-bold hover:bg-stone-100 cursor-pointer">
                  <span>{billUploaded ? 'Bill Parsed ✓' : 'Upload Bill (PDF/Img)'}</span>
                  <input type="file" onChange={handleSimulateBillUpload} className="hidden" accept=".pdf,image/*" />
                </label>
              </div>
            </div>

            {/* C. Household Information */}
            <div className="space-y-3 pt-3 border-t border-stone-100">
              <h3 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
                C. Household Premise &amp; Occupancy
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-700 mb-1">Dwelling Type</label>
                  <select
                    value={homeType}
                    onChange={(e) => setHomeType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-sans"
                  >
                    <option value="house">Independent House / Villa</option>
                    <option value="apartment">Multi-Storey Apartment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-700 mb-1">Number of Occupants</label>
                  <input
                    type="number"
                    min="1"
                    value={occupants}
                    onChange={(e) => setOccupants(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-sans"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-700 mb-1">Daytime Occupancy</label>
                  <select
                    value={daytimeOccupancy}
                    onChange={(e) => setDaytimeOccupancy(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-sans"
                  >
                    <option value="low">Low (Working individuals away)</option>
                    <option value="moderate">Moderate (Remote work / Children)</option>
                    <option value="high">High (Full-day home occupancy)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* D. User Goals */}
            <div className="space-y-3 pt-3 border-t border-stone-100">
              <h3 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
                D. Strategic Energy Goals
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'reduce_cost', label: 'Reduce Monthly Electricity Cost' },
                  { id: 'increase_solar', label: 'Increase Solar Self-Consumption' },
                  { id: 'cut_vampire', label: 'Eliminate Vampire Standby Bleed' },
                  { id: 'plan_battery', label: 'Plan LiFePO4 Battery Peak Shaving' },
                  { id: 'cut_carbon', label: 'Maximize Avoided CO₂ Emissions' },
                  { id: 'community_p2p', label: 'Participate in Community Energy Sharing' },
                ].map(g => (
                  <label 
                    key={g.id}
                    onClick={() => toggleGoal(g.id)}
                    className={`p-3 rounded-2xl border text-xs font-mono font-bold flex items-center gap-2.5 cursor-pointer transition-colors ${
                      goals.includes(g.id) 
                        ? 'bg-amber-50 border-amber-500 text-slate-950' 
                        : 'bg-stone-50 border-stone-200 text-slate-600 hover:bg-stone-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={goals.includes(g.id)}
                      onChange={() => {}}
                      className="w-4 h-4 rounded text-amber-500"
                    />
                    <span>{g.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setStep('results')}
                className="px-6 py-3 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer flex items-center gap-2"
              >
                <span className="text-amber-400">Generate Recommendations</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 2: COMPREHENSIVE 3-TIER SCENARIOS & RESULTS               */}
        {/* ============================================================== */}
        {step === 'results' && (
          <div className="space-y-6">
            
            {/* Executive Analysis Banner */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Current Estimated Draw</span>
                <div className="text-3xl font-display font-black text-slate-950 mt-1">
                  {metrics.monthlyConsumptionKWh} <span className="text-sm font-mono text-slate-500 font-normal">kWh/mo</span>
                </div>
                <div className="text-xs text-slate-500 font-sans mt-0.5">
                  Est. monthly bill: ₹{metrics.monthlyCostRupees} based on active tariff slabs.
                </div>
              </div>

              <div>
                <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Primary Energy Inefficiencies</span>
                <div className="text-base font-display font-bold text-rose-600 mt-1">
                  AC Thermal Coupling + Vampire Standby
                </div>
                <div className="text-xs text-slate-500 font-sans mt-0.5">
                  Envelope TLC penalty adds ₹{Math.round(metrics.monthlyCostRupees * 0.28)}/mo; standby adds ₹{metrics.standbyAudit.standbyMonthlyCostRupees}/mo.
                </div>
              </div>

              <div>
                <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Potential Total Savings</span>
                <div className="text-3xl font-display font-black text-emerald-600 mt-1">
                  ₹{totalPossibleRupeesSaved} <span className="text-sm font-mono text-slate-500 font-normal">/ month</span>
                </div>
                <div className="text-xs text-slate-500 font-sans mt-0.5">
                  Potential reduction of up to ~{totalPossibleKWhSaved.toFixed(0)} kWh/month across all 3 tiers.
                </div>
              </div>
            </div>

            {/* SCENARIO A: NO-COST IMPROVEMENTS */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-800 font-bold font-mono text-sm">
                    Tier A
                  </div>
                  <div>
                    <h3 className="text-base font-display font-black text-slate-950">
                      Scenario A: Immediate No-Cost Improvements
                    </h3>
                    <p className="text-xs text-slate-500 font-sans">
                      Zero capital outlay. Pure behavioral and operating schedule optimizations.
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono text-slate-500">Savings: </span>
                  <span className="font-mono font-bold text-emerald-700 text-sm">
                    ~₹{scenarioA.reduce((s, a) => s + a.monthlyRupeesSaved, 0)}/mo
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scenarioA.map((rec) => (
                  <div key={rec.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-mono font-bold text-slate-950">{rec.title}</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 text-emerald-800 font-bold shrink-0">
                        -₹{rec.monthlyRupeesSaved}/mo
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-sans">{rec.description}</p>
                    <div className="pt-2 border-t border-stone-200 text-[11px] font-mono text-slate-500 space-y-1">
                      <div><strong>Why:</strong> {rec.whyMatters}</div>
                      <div><strong>Impact:</strong> -{rec.monthlyKWhSaved} kWh/month | Implementation Cost: ₹0</div>
                      <div className="text-[10px] text-slate-400">Assumptions: {rec.assumptions}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SCENARIO B: LOW-COST IMPROVEMENTS */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-900 font-bold font-mono text-sm">
                    Tier B
                  </div>
                  <div>
                    <h3 className="text-base font-display font-black text-slate-950">
                      Scenario B: Low-Cost Upgrades (Payback &lt; 8 Months)
                    </h3>
                    <p className="text-xs text-slate-500 font-sans">
                      Targeted smart hardware: zero-idle strips, BLDC fan motors, and thermal sealants.
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono text-slate-500">Savings: </span>
                  <span className="font-mono font-bold text-amber-700 text-sm">
                    ~₹{scenarioB.reduce((s, a) => s + a.monthlyRupeesSaved, 0)}/mo
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scenarioB.map((rec) => (
                  <div key={rec.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-mono font-bold text-slate-950">{rec.title}</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-100 text-amber-900 font-bold shrink-0">
                        -₹{rec.monthlyRupeesSaved}/mo
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-sans">{rec.description}</p>
                    <div className="pt-2 border-t border-stone-200 text-[11px] font-mono text-slate-500 space-y-1">
                      <div><strong>Why:</strong> {rec.whyMatters}</div>
                      <div><strong>Cost &amp; Payback:</strong> ₹{rec.cost} (~{Math.round(rec.cost / rec.monthlyRupeesSaved)} months payback)</div>
                      <div className="text-[10px] text-slate-400">Assumptions: {rec.assumptions}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SCENARIO C: LONG-TERM IMPROVEMENTS */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-sky-100 text-sky-900 font-bold font-mono text-sm">
                    Tier C
                  </div>
                  <div>
                    <h3 className="text-base font-display font-black text-slate-950">
                      Scenario C: Long-Term Infrastructure &amp; Microgrid Investments
                    </h3>
                    <p className="text-xs text-slate-500 font-sans">
                      Clean energy autonomy: Rooftop Solar PV, VAWT wind integration, and heat pump water heating.
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono text-slate-500">Savings: </span>
                  <span className="font-mono font-bold text-sky-800 text-sm">
                    ~₹{scenarioC.reduce((s, a) => s + a.monthlyRupeesSaved, 0)}/mo
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scenarioC.map((rec) => (
                  <div key={rec.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-mono font-bold text-slate-950">{rec.title}</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-100 text-sky-900 font-bold shrink-0">
                        -₹{rec.monthlyRupeesSaved}/mo
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-sans">{rec.description}</p>
                    <div className="pt-2 border-t border-stone-200 text-[11px] font-mono text-slate-500 space-y-1">
                      <div><strong>Why:</strong> {rec.whyMatters}</div>
                      <div><strong>Estimated Cost:</strong> ₹{rec.cost.toLocaleString()} (~{(rec.cost / (rec.monthlyRupeesSaved * 12)).toFixed(1)} years payback)</div>
                      <div className="text-[10px] text-slate-400">Assumptions: {rec.assumptions}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer & Bottom Actions */}
            <div className="p-4 rounded-2xl bg-stone-100 text-xs font-sans text-slate-600 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <span>
                <strong>Engineering Disclaimer:</strong> Recommendations are calculated estimates derived from thermodynamic building heat loss models, BEE efficiency curves, and historical solar/wind data. Savings are not guaranteed and local DISCOM net-metering regulations apply.
              </span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setStep('form')}
                className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-700 font-mono text-xs font-bold cursor-pointer"
              >
                ← Adjust Parameters
              </button>

              <button
                onClick={handleSavePlan}
                className="px-6 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-2 cursor-pointer"
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Plan Saved to Dashboard!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-amber-400">Save My Energy Plan</span>
                  </>
                )}
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

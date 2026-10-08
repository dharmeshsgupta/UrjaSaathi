import React, { useState } from 'react';
import { 
  Zap, 
  Sun, 
  Wind, 
  BatteryCharging, 
  Building2, 
  Thermometer, 
  ArrowLeft, 
  Download, 
  FileText, 
  Plus, 
  Trash2, 
  RefreshCw, 
  TrendingDown, 
  Copy,
  Check
} from 'lucide-react';
import { 
  Appliance, 
  BUILDING_MATERIALS, 
  STANDARD_APPLIANCES, 
  TARIFFS, 
  calculateTLC, 
  calculateSolarYield, 
  calculateVAWTYield, 
  calculateStandbyAudit,
  generate40FlatsDataset,
  generateSeedP2PTrades,
  COMMON_BUILDING_LOADS,
  FlatRecord,
  P2PTrade
} from '../data/energyEngine';

interface UrjaSaathiConsoleProps {
  onBackToHero: () => void;
  onOpenSpecs: () => void;
}

type ConsoleTab = 'household-planner' | 'prosumer-microgrid' | 'complex-40-flats' | 'p2p-ledger' | 'audit-report';

export default function UrjaSaathiConsole({ onBackToHero, onOpenSpecs }: UrjaSaathiConsoleProps) {
  const [activeTab, setActiveTab] = useState<ConsoleTab>('household-planner');

  // --- TAB 1: Household State ---
  const [appliances, setAppliances] = useState<Appliance[]>(STANDARD_APPLIANCES);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('reinforced_concrete');
  const [ambientTemp, setAmbientTemp] = useState<number>(38.5);
  const [acSetpoint, setAcSetpoint] = useState<number>(24.0);
  const [floorPosition, setFloorPosition] = useState<'top' | 'middle' | 'ground'>('middle');
  const [smartStripMitigation, setSmartStripMitigation] = useState<boolean>(false);

  // New Appliance Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newAppName, setNewAppName] = useState<string>('');
  const [newAppWatts, setNewAppWatts] = useState<number>(500);
  const [newAppHours, setNewAppHours] = useState<number>(2.0);
  const [newAppCategory, setNewAppCategory] = useState<'mandatory' | 'discretionary'>('discretionary');

  // --- TAB 2: Prosumer Microgrid State ---
  const [solarKWp, setSolarKWp] = useState<number>(5.5);
  const [tiltAngle, setTiltAngle] = useState<number>(20);
  const [soilingLevel, setSoilingLevel] = useState<number>(6);
  const [windSpeedMS, setWindSpeedMS] = useState<number>(6.2);
  const [batteryCapacityKWh, setBatteryCapacityKWh] = useState<number>(5.12);
  const [batterySoC, setBatterySoC] = useState<number>(78);

  // --- TAB 3: 40 Flats State ---
  const [flats, setFlats] = useState<FlatRecord[]>(() => generate40FlatsDataset());
  const [selectedFlatId, setSelectedFlatId] = useState<string>('Flat 101');
  const [filterCategory, setFilterCategory] = useState<'all' | 'prosumer' | 'deficit' | 'eco_saver'>('all');
  const [floorFilter, setFloorFilter] = useState<number | 'all'>('all');

  // --- TAB 4: P2P Trading State ---
  const [trades, setTrades] = useState<P2PTrade[]>(() => generateSeedP2PTrades());
  const [isClearing, setIsClearing] = useState<boolean>(false);

  // --- TAB 5: Report Copy State ---
  const [reportCopied, setReportCopied] = useState<boolean>(false);

  // -------------------------------------------------------------------------
  // CALCULATIONS
  // -------------------------------------------------------------------------
  const selectedMaterial = BUILDING_MATERIALS.find(m => m.id === selectedMaterialId) || BUILDING_MATERIALS[0];
  const tlc = calculateTLC(selectedMaterial, ambientTemp, acSetpoint, floorPosition);

  // Household Energy Calculations
  let totalDailyKWh = 0;
  let mandatoryKWh = 0;
  let discretionaryKWh = 0;

  appliances.forEach(app => {
    let appDailyKWh = (app.ratedWatts * app.defaultHoursDaily) / 1000;
    if (app.thermalCoupled) {
      appDailyKWh *= tlc;
    }
    totalDailyKWh += appDailyKWh;
    if (app.category === 'mandatory') mandatoryKWh += appDailyKWh;
    else discretionaryKWh += appDailyKWh;
  });

  totalDailyKWh = Number(totalDailyKWh.toFixed(2));
  mandatoryKWh = Number(mandatoryKWh.toFixed(2));
  discretionaryKWh = Number(discretionaryKWh.toFixed(2));

  const monthlyHouseholdKWh = Number((totalDailyKWh * 30).toFixed(1));
  const monthlyHouseholdCost = Math.round(monthlyHouseholdKWh * TARIFFS.utilityGridImport);

  const standbyAudit = calculateStandbyAudit(appliances);
  const effectiveStandbyMonthlyCost = smartStripMitigation ? 0 : standbyAudit.standbyMonthlyCostRupees;

  // Microgrid Calculations
  const solarGen = calculateSolarYield(solarKWp, 5.5, tiltAngle, soilingLevel);
  const vawtGen = calculateVAWTYield(windSpeedMS, 2.4);
  const totalMicrogridDaily = Number((solarGen.dailyKWh + vawtGen.dailyKWh).toFixed(2));
  const microgridMonthlyRupeesSaved = Math.round(totalMicrogridDaily * 30 * TARIFFS.utilityGridImport);

  // 40 Flats Aggregates
  const totalComplexConsumption = flats.reduce((acc, f) => acc + f.dailyConsumptionKWh, 0);
  const totalComplexGeneration = flats.reduce((acc, f) => acc + f.terraceSolarKWh + f.terraceWindKWh, 0);
  const commonLoadsSum = COMMON_BUILDING_LOADS.reduce((acc, c) => acc + c.dailyKWh, 0);
  const grossSocietyLoad = totalComplexConsumption + commonLoadsSum;
  const netSocietyGridBalance = Number((totalComplexGeneration - grossSocietyLoad).toFixed(1));

  const selectedFlat = flats.find(f => f.flatId === selectedFlatId) || flats[0];

  // Add custom appliance handler
  const handleAddAppliance = () => {
    if (!newAppName.trim()) return;
    const newApp: Appliance = {
      id: `custom_${Date.now()}`,
      name: newAppName,
      category: newAppCategory,
      ratedWatts: newAppWatts,
      standbyWatts: newAppCategory === 'discretionary' ? 4 : 1,
      defaultHoursDaily: newAppHours,
      starRating: 4,
      icon: 'Zap',
      description: 'Custom tenant-added electrical appliance.',
      seasonalSurge: 'neutral',
      thermalCoupled: newAppCategory === 'discretionary' && newAppName.toLowerCase().includes('ac'),
    };
    setAppliances([newApp, ...appliances]);
    setNewAppName('');
    setIsAddModalOpen(false);
  };

  // Remove appliance handler
  const handleRemoveAppliance = (id: string) => {
    setAppliances(appliances.filter(a => a.id !== id));
  };

  // Execute P2P clearing round
  const handleExecuteP2PClearing = () => {
    setIsClearing(true);
    setTimeout(() => {
      const prosumers = flats.filter(f => f.category === 'prosumer');
      const deficits = flats.filter(f => f.category === 'deficit');
      const seller = prosumers[Math.floor(Math.random() * prosumers.length)];
      const buyer = deficits[Math.floor(Math.random() * deficits.length)];
      const kwh = Number((3.0 + Math.random() * 4.5).toFixed(1));
      const amount = Number((kwh * TARIFFS.p2pInternalMarketRate).toFixed(2));
      const buyerSave = Number((kwh * TARIFFS.consumerSavingsMargin).toFixed(2));
      const sellerGain = Number((kwh * TARIFFS.prosumerNetProfitBonus).toFixed(2));

      const newTrade: P2PTrade = {
        tradeId: `TX-2026-${Math.floor(2000 + Math.random() * 8000)}`,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false }) + ' IST',
        sellerFlatId: seller.flatId,
        buyerFlatId: buyer.flatId,
        energyKWh: kwh,
        ratePerKWh: TARIFFS.p2pInternalMarketRate,
        totalAmountRupees: amount,
        buyerSavingsRupees: buyerSave,
        sellerGainRupees: sellerGain,
        status: 'settled',
      };

      setTrades(prev => [newTrade, ...prev.slice(0, 11)]);
      setIsClearing(false);
    }, 400);
  };

  // Export report
  const generateReportText = () => {
    return `URJASAATHI AI - RESIDENTIAL ENERGY AUDIT & MICROGRID REPORT
Generated: ${new Date().toLocaleString()}
Building Complex: 40-Flat High-Rise Society (N = 40 Flats)
Architecture: Software-Only, Zero-IoT Sensors

1. HOUSEHOLD & THERMAL DIAGNOSTICS SUMMARY
- Building Envelope: ${selectedMaterial.name} (U = ${selectedMaterial.uValue} W/m²K)
- Thermal Loss Coefficient (TLC): ${tlc}x Multiplier
- Outdoor Temp: ${ambientTemp}°C | Thermostat Setpoint: ${acSetpoint}°C
- Total Daily Household Load: ${totalDailyKWh} kWh/day
- Mandatory Baseline Load: ${mandatoryKWh} kWh/day (${Math.round((mandatoryKWh/totalDailyKWh)*100)}%)
- Discretionary / Surge Load: ${discretionaryKWh} kWh/day (${Math.round((discretionaryKWh/totalDailyKWh)*100)}%)
- Monthly Energy Consumption: ${monthlyHouseholdKWh} kWh (~₹${monthlyHouseholdCost})
- Standby Vampire Leakage: ${standbyAudit.standbyTotalWatts}W (${standbyAudit.standbyMonthlyKWh} kWh/mo, ~₹${standbyAudit.standbyMonthlyCostRupees})

2. PROSUMER RENEWABLE GENERATION
- Rooftop Solar Capacity: ${solarKWp} kWp (Tilt: ${tiltAngle}°, Soiling: ${soilingLevel}%)
- Daily Solar Yield: ${solarGen.dailyKWh} kWh/day (~${solarGen.monthlyKWh} kWh/mo)
- Savonius-Darrieus VAWT Wind: ${vawtGen.dailyKWh} kWh/day (Wind Speed: ${windSpeedMS} m/s)
- LiFePO4 Battery Pack: ${batteryCapacityKWh} kWh (Current SoC: ${batterySoC}%)
- Monthly Clean Energy Savings: ~₹${microgridMonthlyRupeesSaved}

3. 40-FLAT COMPLEX AGGREGATE
- 40 Flats Daily Load: ${totalComplexConsumption.toFixed(1)} kWh/day
- Common Infrastructure (Lifts, Pumps, Lighting): ${commonLoadsSum.toFixed(1)} kWh/day
- Total Clean Terrace Generation: ${totalComplexGeneration.toFixed(1)} kWh/day
- Society Net Grid Balance: ${netSocietyGridBalance} kWh/day (Self-Sufficiency ~41%)

4. CENTRAL HQ P2P TRADING LEDGER
- Utility Grid Rate: ₹${TARIFFS.utilityGridImport.toFixed(2)} / kWh
- UrjaSaathi P2P Clearing Rate: ₹${TARIFFS.p2pInternalMarketRate.toFixed(2)} / kWh
- Utility Feed-in Rate: ₹${TARIFFS.utilityGridExport.toFixed(2)} / kWh
- Buyer Savings Margin: -30% vs Utility Grid
- Seller Gain: +100% vs Grid Feed-in Net Metering`;
  };

  const handleCopyReport = () => {
    navigator.clipboard.writeText(generateReportText());
    setReportCopied(true);
    setTimeout(() => setReportCopied(false), 2000);
  };

  const handleDownloadReport = () => {
    const text = generateReportText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `UrjaSaathi_Audit_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#F8F5EE] text-slate-900 font-sans selection:bg-amber-500/30 selection:text-amber-950 pb-20">
      
      {/* TOP CONSOLE HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-stone-300 shadow-sm py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          {/* Logo & Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHero}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-800 transition-colors flex items-center gap-1.5 text-xs font-mono font-bold cursor-pointer border border-stone-300"
              title="Return to 3D Architectural Scene"
            >
              <ArrowLeft className="w-4 h-4 text-slate-700" />
              <span className="hidden sm:inline">3D View</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-950 text-amber-400 flex items-center justify-center font-bold">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-black text-lg text-slate-950 tracking-tight leading-none">
                    UrjaSaathi
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-amber-500 text-slate-950">
                    AI
                  </span>
                </div>
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-semibold">
                  Operating Console
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="hidden lg:flex items-center gap-5 text-xs font-mono">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200">
              <span className="text-slate-500 font-semibold uppercase text-[10px]">Society Load:</span>
              <span className="font-black text-slate-950">{grossSocietyLoad.toFixed(1)} kWh/d</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200">
              <span className="text-emerald-800 font-semibold uppercase text-[10px]">Solar+Wind:</span>
              <span className="font-black text-emerald-700">+{totalComplexGeneration.toFixed(1)} kWh/d</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200">
              <span className="text-amber-800 font-semibold uppercase text-[10px]">P2P Rate:</span>
              <span className="font-black text-amber-900">₹6.20/kWh</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleDownloadReport}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-slate-900 font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-700" />
              <span className="hidden sm:inline">Export Audit</span>
            </button>
            <button
              onClick={onOpenSpecs}
              className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Proposal Specs</span>
            </button>
          </div>

        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8 p-1.5 bg-white rounded-2xl border-2 border-stone-300 shadow-xs">
          {[
            { id: 'household-planner', label: 'Household Thermal & Appliances', icon: Thermometer },
            { id: 'prosumer-microgrid', label: 'Prosumer Solar + VAWT + Battery', icon: Sun },
            { id: 'complex-40-flats', label: '40-Tenant Residential Matrix', icon: Building2 },
            { id: 'p2p-ledger', label: 'Central HQ P2P Ledger', icon: Zap },
            { id: 'audit-report', label: 'Audit Report & Pitch Summary', icon: FileText },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ConsoleTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-bold tracking-tight transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-950 text-white shadow-sm'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-stone-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: HOUSEHOLD PLANNER & THERMAL DIAGNOSTICS */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'household-planner' && (
          <div className="space-y-8">
            
            {/* Top Diagnostic Summary Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border-2 border-stone-300 shadow-xs">
                <span className="text-[11px] font-mono text-slate-500 uppercase font-bold block">
                  Daily Household Energy
                </span>
                <span className="text-3xl font-display font-black text-slate-950 mt-1 block">
                  {totalDailyKWh} <span className="text-sm font-mono text-slate-500 font-normal">kWh/day</span>
                </span>
                <span className="text-[10px] font-mono text-slate-600 mt-1 block">
                  ~{monthlyHouseholdKWh} kWh/month (₹{monthlyHouseholdCost})
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border-2 border-stone-300 shadow-xs">
                <span className="text-[11px] font-mono text-amber-800 uppercase font-bold block">
                  Thermal Loss Multiplier (TLC)
                </span>
                <span className="text-3xl font-display font-black text-amber-600 mt-1 block">
                  {tlc}x
                </span>
                <span className="text-[10px] font-mono text-amber-900 font-semibold mt-1 block">
                  {selectedMaterial.name.split(' ')[0]} Envelope · ΔT: {(ambientTemp - acSetpoint).toFixed(1)}°C
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border-2 border-stone-300 shadow-xs">
                <span className="text-[11px] font-mono text-rose-800 uppercase font-bold block">
                  Standby Vampire Bleed
                </span>
                <span className="text-3xl font-display font-black text-rose-600 mt-1 block">
                  {smartStripMitigation ? '0' : standbyAudit.standbyTotalWatts} <span className="text-sm font-mono text-slate-500 font-normal">W</span>
                </span>
                <span className="text-[10px] font-mono text-rose-900 font-semibold mt-1 block">
                  {smartStripMitigation ? 'Mitigated with Smart Strip!' : `Bleeding ₹${standbyAudit.standbyMonthlyCostRupees}/month 24/7`}
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border-2 border-stone-300 shadow-xs">
                <span className="text-[11px] font-mono text-emerald-800 uppercase font-bold block">
                  Load Decomposition
                </span>
                <div className="flex items-center gap-2 mt-2">
                  <div className="text-xs font-mono font-bold text-slate-800">
                    <span className="text-slate-500">Mandatory:</span> {mandatoryKWh} kWh
                  </div>
                  <span className="text-slate-300">|</span>
                  <div className="text-xs font-mono font-bold text-amber-700">
                    <span className="text-slate-500">Surge:</span> {discretionaryKWh} kWh
                  </div>
                </div>
                <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden mt-2.5">
                  <div
                    className="bg-slate-900 h-full"
                    style={{ width: `${(mandatoryKWh / totalDailyKWh) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Main Interactive Controls & Appliance Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Envelope & Weather Modeling Controls */}
              <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-2xl border-2 border-stone-300 shadow-sm space-y-6">
                <div className="pb-3 border-b border-stone-200 flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-950 uppercase tracking-wider">
                    THERMAL ENVELOPE INPUTS
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">
                    Zero-Hardware Modeling
                  </span>
                </div>

                {/* Building Structure Selection */}
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-800 uppercase mb-2">
                    Structural Wall / Glazing Type
                  </label>
                  <div className="space-y-2">
                    {BUILDING_MATERIALS.map(mat => (
                      <button
                        key={mat.id}
                        onClick={() => setSelectedMaterialId(mat.id)}
                        className={`w-full text-left p-3 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                          selectedMaterialId === mat.id
                            ? 'border-amber-500 bg-amber-50/70 font-bold text-slate-950 ring-1 ring-amber-500'
                            : 'border-stone-200 bg-stone-50/70 hover:bg-stone-100 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{mat.name}</span>
                          <span className="font-bold text-amber-700">U: {mat.uValue}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ambient Weather Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-800 mb-1.5">
                    <span>Outdoor Temperature:</span>
                    <span className="text-amber-700 font-black text-sm">{ambientTemp}°C</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="45"
                    step="0.5"
                    value={ambientTemp}
                    onChange={e => setAmbientTemp(parseFloat(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-0.5">
                    <span>Pleasant (20°C)</span>
                    <span>Summer (38°C)</span>
                    <span>Heatwave (45°C)</span>
                  </div>
                </div>

                {/* AC Setpoint Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-800 mb-1.5">
                    <span>AC Thermostat Setpoint:</span>
                    <span className="text-blue-700 font-black text-sm">{acSetpoint}°C</span>
                  </div>
                  <input
                    type="range"
                    min="18"
                    max="28"
                    step="1"
                    value={acSetpoint}
                    onChange={e => setAcSetpoint(parseFloat(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="text-[11px] font-mono text-slate-600 mt-1">
                    Rule of Thumb: Each 1°C increase in setpoint saves ~6% AC electricity!
                  </div>
                </div>

                {/* Vertical Roof Level */}
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-800 uppercase mb-2">
                    Flat Elevation / Roof Exposure
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs font-mono font-bold">
                    {(['top', 'middle', 'ground'] as const).map(lvl => (
                      <button
                        key={lvl}
                        onClick={() => setFloorPosition(lvl)}
                        className={`py-2 px-2.5 rounded-xl border uppercase transition-all cursor-pointer text-center ${
                          floorPosition === lvl
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-stone-50 text-slate-700 border-stone-300 hover:bg-stone-100'
                        }`}
                      >
                        {lvl === 'top' ? 'Top Terrace' : lvl === 'middle' ? 'Middle Floor' : 'Ground Floor'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Standby Vampire Toggle */}
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="font-display font-bold text-slate-950 text-xs block">
                      Smart Strip Vampire Kill-Switch
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      Eliminates {standbyAudit.standbyTotalWatts}W phantom bleed
                    </span>
                  </div>
                  <button
                    onClick={() => setSmartStripMitigation(!smartStripMitigation)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      smartStripMitigation
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white border border-stone-300 text-slate-700'
                    }`}
                  >
                    {smartStripMitigation ? 'Active (-₹' + standbyAudit.standbyMonthlyCostRupees + ')' : 'Enable'}
                  </button>
                </div>
              </div>

              {/* Right Column: Full Appliance Inventory Matrix */}
              <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-2xl border-2 border-stone-300 shadow-sm space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-200">
                  <div>
                    <h3 className="font-display font-black text-slate-950 text-lg">
                      Appliance Inventory &amp; Baseline Matrix
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">
                      Categorized into mandatory baseline vs discretionary thermal surge items.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-400" />
                    <span>Add Appliance</span>
                  </button>
                </div>

                {/* Appliances List Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-stone-300 text-slate-500 uppercase text-[10px]">
                        <th className="py-2.5 px-2">Appliance</th>
                        <th className="py-2.5 px-2">Category</th>
                        <th className="py-2.5 px-2">Rated W</th>
                        <th className="py-2.5 px-2">Hrs/Day</th>
                        <th className="py-2.5 px-2">Daily kWh</th>
                        <th className="py-2.5 px-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {appliances.map(app => {
                        let dailyKWh = (app.ratedWatts * app.defaultHoursDaily) / 1000;
                        if (app.thermalCoupled) dailyKWh *= tlc;
                        return (
                          <tr key={app.id} className="hover:bg-stone-50 transition-colors">
                            <td className="py-3 px-2 font-bold text-slate-900 flex items-center gap-2">
                              <span>{app.name}</span>
                              {app.thermalCoupled && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-100 text-amber-900 font-bold">
                                  TLC
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                app.category === 'mandatory'
                                  ? 'bg-stone-100 text-slate-800'
                                  : 'bg-amber-100 text-amber-900'
                              }`}>
                                {app.category}
                              </span>
                            </td>
                            <td className="py-3 px-2 font-bold text-slate-800">{app.ratedWatts}W</td>
                            <td className="py-3 px-2 text-slate-700">{app.defaultHoursDaily}h</td>
                            <td className="py-3 px-2 font-black text-slate-950">
                              {dailyKWh.toFixed(2)} kWh
                            </td>
                            <td className="py-3 px-2 text-right">
                              <button
                                onClick={() => handleRemoveAppliance(app.id)}
                                className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer p-1"
                                title="Remove Appliance"
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

                {/* High Cost Drivers & Recommendation Card */}
                <div className="p-5 rounded-2xl bg-amber-50 border border-amber-300 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-950 uppercase">
                    <TrendingDown className="w-4 h-4 text-amber-700" />
                    <span>Top Priority Savings Actions</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-amber-950 font-mono">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-700 font-bold">1.</span>
                      <span>Raise AC setpoint from 22°C to 25°C: Cuts cooling power draw by 18% (~₹740/mo savings).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-700 font-bold">2.</span>
                      <span>Apply thermal reflective window film on western glass: Lowers envelope TLC from {tlc}x to {(tlc * 0.88).toFixed(2)}x.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-700 font-bold">3.</span>
                      <span>Shift washing machine &amp; EV scooter charging to 12:00-14:00 solar generation peak.</span>
                    </li>
                  </ul>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: PROSUMER MICROGRID (SOLAR + VAWT + BATTERY) */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'prosumer-microgrid' && (
          <div className="space-y-8">
            
            {/* Top Microgrid Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border-2 border-stone-300 shadow-xs">
                <span className="text-[11px] font-mono text-amber-800 uppercase font-bold block">
                  Rooftop Solar PV Yield
                </span>
                <span className="text-3xl font-display font-black text-amber-700 mt-1 block">
                  {solarGen.dailyKWh} <span className="text-sm font-mono text-slate-500 font-normal">kWh/day</span>
                </span>
                <span className="text-[10px] font-mono text-amber-900 font-semibold mt-1 block">
                  ~{solarGen.monthlyKWh} kWh/month · PR 0.81
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border-2 border-stone-300 shadow-xs">
                <span className="text-[11px] font-mono text-cyan-800 uppercase font-bold block">
                  Savonius-Darrieus VAWT Wind
                </span>
                <span className="text-3xl font-display font-black text-cyan-800 mt-1 block">
                  {vawtGen.dailyKWh} <span className="text-sm font-mono text-slate-500 font-normal">kWh/day</span>
                </span>
                <span className="text-[10px] font-mono text-cyan-900 font-semibold mt-1 block">
                  Instant: {vawtGen.instantWatts}W @ {windSpeedMS} m/s
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border-2 border-stone-300 shadow-xs">
                <span className="text-[11px] font-mono text-emerald-800 uppercase font-bold block">
                  LiFePO4 Storage Bank
                </span>
                <span className="text-3xl font-display font-black text-emerald-700 mt-1 block">
                  {batteryCapacityKWh} <span className="text-sm font-mono text-slate-500 font-normal">kWh</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-900 font-semibold mt-1 block">
                  State of Charge: {batterySoC}% (DoD safe range 15-95%)
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border-2 border-stone-300 shadow-xs">
                <span className="text-[11px] font-mono text-slate-600 uppercase font-bold block">
                  Monthly Clean Savings
                </span>
                <span className="text-3xl font-display font-black text-slate-950 mt-1 block">
                  ₹{microgridMonthlyRupeesSaved}
                </span>
                <span className="text-[10px] font-mono text-emerald-700 font-bold mt-1 block">
                  Displacing grid at ₹{TARIFFS.utilityGridImport}/kWh
                </span>
              </div>
            </div>

            {/* Microgrid Sliders & Maintenance Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Generation Parameters */}
              <div className="lg:col-span-6 bg-white p-6 sm:p-7 rounded-2xl border-2 border-stone-300 shadow-sm space-y-6">
                <div className="pb-3 border-b border-stone-200 flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-950 uppercase tracking-wider">
                    MICROGRID HARDWARE TUNING
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold">
                    Clean Energy Yield
                  </span>
                </div>

                {/* Solar Size */}
                <div>
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-800 mb-1.5">
                    <span>Solar Capacity (kWp):</span>
                    <span className="text-amber-700 font-black text-sm">{solarKWp} kWp</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="15.0"
                    step="0.5"
                    value={solarKWp}
                    onChange={e => setSolarKWp(parseFloat(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-0.5">
                    <span>1 kWp (Small Flat)</span>
                    <span>5.5 kWp (Standard)</span>
                    <span>15 kWp (Society Shared Array)</span>
                  </div>
                </div>

                {/* Tilt Angle */}
                <div>
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-800 mb-1.5">
                    <span>Panel Tilt Angle:</span>
                    <span className="text-slate-900 font-black text-sm">{tiltAngle}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="45"
                    step="1"
                    value={tiltAngle}
                    onChange={e => setTiltAngle(parseInt(e.target.value))}
                    className="w-full accent-slate-800 cursor-pointer"
                  />
                  <div className="text-[11px] font-mono text-slate-600 mt-0.5">
                    Optimal for Mumbai/Delhi: 18°–22° (Currently: {Math.abs(tiltAngle - 20) <= 2 ? 'Optimal Alignment' : 'Sub-Optimal Angle'})
                  </div>
                </div>

                {/* Soiling Loss Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-800 mb-1.5">
                    <span>Dust Soiling Derating:</span>
                    <span className={`font-black text-sm ${soilingLevel > 8 ? 'text-rose-600' : 'text-slate-900'}`}>{soilingLevel}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="25"
                    step="1"
                    value={soilingLevel}
                    onChange={e => setSoilingLevel(parseInt(e.target.value))}
                    className="w-full accent-rose-600 cursor-pointer"
                  />
                  {soilingLevel > 8 ? (
                    <div className="mt-2 p-2.5 rounded-xl bg-rose-50 border border-rose-300 text-xs font-mono text-rose-950 font-bold flex items-center justify-between">
                      <span>Schedule Panel Cleaning! Recover +{solarGen.soilingLossKWh} kWh/day</span>
                      <button
                        onClick={() => setSoilingLevel(2)}
                        className="px-2 py-1 rounded bg-rose-600 text-white text-[10px] uppercase font-bold cursor-pointer"
                      >
                        Clean Panels
                      </button>
                    </div>
                  ) : (
                    <div className="text-[10px] font-mono text-emerald-800 mt-0.5">
                      Panels clean. Low optical reflection losses.
                    </div>
                  )}
                </div>

                {/* VAWT Wind Speed Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-800 mb-1.5">
                    <span>Rooftop Wind Velocity (m/s):</span>
                    <span className="text-cyan-800 font-black text-sm">{windSpeedMS} m/s</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="14.0"
                    step="0.2"
                    value={windSpeedMS}
                    onChange={e => setWindSpeedMS(parseFloat(e.target.value))}
                    className="w-full accent-cyan-600 cursor-pointer"
                  />
                  <div className="text-[11px] font-mono text-slate-600 mt-0.5">
                    VAWT Cut-in: 2.0 m/s · Omnidirectional Savonius/Darrieus rotor operates silently in turbulent city gusts.
                  </div>
                </div>
              </div>

              {/* Right Column: LiFePO4 Storage & Peak Shaving Schedule */}
              <div className="lg:col-span-6 bg-white p-6 sm:p-7 rounded-2xl border-2 border-stone-300 shadow-sm space-y-6">
                <div className="pb-3 border-b border-stone-200 flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-950 uppercase tracking-wider">
                    LiFePO4 BATTERY MANAGEMENT SYSTEM (BMS)
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold">
                    6000+ Cycles (15-Yr Life)
                  </span>
                </div>

                {/* Battery Size Toggle */}
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-800 uppercase mb-2">
                    Storage Capacity
                  </label>
                  <div className="grid grid-cols-2 gap-3 text-xs font-mono font-bold">
                    {[5.12, 10.24].map(kwh => (
                      <button
                        key={kwh}
                        onClick={() => setBatteryCapacityKWh(kwh)}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          batteryCapacityKWh === kwh
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-stone-50 text-slate-700 border-stone-300 hover:bg-stone-100'
                        }`}
                      >
                        <div className="text-sm font-black">{kwh} kWh Pack</div>
                        <div className="text-[10px] opacity-80 mt-0.5">51.2V 100Ah/200Ah</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* SoC Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-800 mb-1.5">
                    <span>Current State of Charge (SoC):</span>
                    <span className="text-emerald-700 font-black text-sm">{batterySoC}%</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="98"
                    step="1"
                    value={batterySoC}
                    onChange={e => setBatterySoC(parseInt(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-0.5">
                    <span>15% (DoD Cutoff)</span>
                    <span>50% Nominal</span>
                    <span>98% Float Charged</span>
                  </div>
                </div>

                {/* Automated Dispatch Strategy */}
                <div className="p-4 rounded-xl bg-slate-900 text-white font-mono text-xs space-y-2 border border-slate-800">
                  <div className="text-amber-400 font-bold flex items-center gap-1.5">
                    <BatteryCharging className="w-4 h-4 text-emerald-400" />
                    Automated Peak Shaving Schedule
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    1. 11:00 - 15:00: Battery charges from rooftop solar peak instead of feeding back into the grid at the low ₹3.10/kWh net-metering rate.
                  </p>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    2. 18:00 - 22:00: Battery discharges power to cover home dinner &amp; AC loads, avoiding peak discom tariffs (₹8.85/kWh) or selling excess to neighbors via P2P (₹6.20/kWh).
                  </p>
                </div>

                {/* Self Consumption Gauge */}
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono text-slate-500 font-bold uppercase block">Self-Consumption Ratio</span>
                    <span className="text-xl font-display font-black text-slate-950">76.4% Solar/Wind Stored &amp; Used</span>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-mono text-xs font-bold">
                    Zero Grid Injection Loss
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: 40-TENANT RESIDENTIAL MATRIX */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'complex-40-flats' && (
          <div className="space-y-8">
            
            {/* Top Building Net Grid Balance */}
            <div className="bg-slate-900 text-white p-6 sm:p-7 rounded-2xl border border-slate-800 shadow-md">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="text-xs font-mono text-amber-400 uppercase font-bold tracking-widest">
                    RESIDENTIAL COMPLEX NET BALANCE (N = 40 FLATS)
                  </div>
                  <h3 className="text-2xl font-display font-black text-white mt-0.5">
                    Building Grid Independence: ~41.2%
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-500 font-mono text-xs font-bold">
                    10 Prosumer Arrays Active
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 font-mono text-xs font-bold">
                    40 Tenant Flats
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Tenants Consumption</span>
                  <span className="text-lg font-black text-white mt-1 block">{totalComplexConsumption.toFixed(1)} kWh/d</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Common Loads (Lifts/Pumps)</span>
                  <span className="text-lg font-black text-white mt-1 block">{commonLoadsSum.toFixed(1)} kWh/d</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
                  <span className="text-emerald-400 block text-[10px] uppercase font-bold">Clean Generation</span>
                  <span className="text-lg font-black text-emerald-400 mt-1 block">+{totalComplexGeneration.toFixed(1)} kWh/d</span>
                </div>
                <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-600/80">
                  <span className="text-amber-300 block text-[10px] uppercase font-bold">Net Grid Balance</span>
                  <span className="text-lg font-black text-amber-400 mt-1 block">
                    {netSocietyGridBalance < 0 ? `${Math.abs(netSocietyGridBalance)} kWh Import` : `+${netSocietyGridBalance} kWh Export`}
                  </span>
                </div>
              </div>
            </div>

            {/* 40 Flats Interactive Grid Card */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border-2 border-stone-300 shadow-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200">
                <div>
                  <h4 className="font-display font-black text-slate-950 text-xl">
                    40 Flats Status Matrix (4 Floors × 10 Flats)
                  </h4>
                  <p className="text-xs text-slate-500 font-mono">
                    Select any flat to view appliance breakdown, local generation, and P2P trade balance.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-700">Filter:</span>
                  {(['all', 'prosumer', 'deficit', 'eco_saver'] as const).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFilterCategory(cat)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                        filterCategory === cat
                          ? 'bg-slate-950 text-white'
                          : 'bg-stone-100 text-slate-700 hover:bg-stone-200'
                      }`}
                    >
                      {cat === 'all' ? 'All (40)' : cat === 'prosumer' ? 'Prosumers' : cat === 'deficit' ? 'Deficit' : 'Eco-Savers'}
                    </button>
                  ))}
                </div>
              </div>

              {/* 40 Flats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2.5">
                {flats
                  .filter(f => filterCategory === 'all' || f.category === filterCategory)
                  .map(flat => {
                    const isSelected = flat.flatId === selectedFlatId;
                    const isProsumer = flat.category === 'prosumer';
                    const isEcoSaver = flat.category === 'eco_saver';

                    return (
                      <button
                        key={flat.flatId}
                        onClick={() => setSelectedFlatId(flat.flatId)}
                        className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between h-20 ${
                          isSelected
                            ? 'ring-2 ring-slate-950 border-slate-950 bg-slate-950 text-white shadow-md'
                            : isProsumer
                            ? 'border-emerald-400 bg-emerald-50/80 hover:bg-emerald-100 text-slate-950'
                            : isEcoSaver
                            ? 'border-cyan-300 bg-cyan-50/70 hover:bg-cyan-100 text-slate-950'
                            : 'border-stone-300 bg-stone-50 hover:bg-stone-100 text-slate-950'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`font-mono text-xs font-black ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                            {flat.flatId.replace('Flat ', '')}
                          </span>
                          <span className="text-[9px] font-mono font-bold uppercase">
                            {flat.flatType}
                          </span>
                        </div>
                        <div>
                          <div className={`text-[10px] font-mono font-bold ${
                            isSelected
                              ? 'text-amber-400'
                              : isProsumer
                              ? 'text-emerald-800'
                              : 'text-slate-700'
                          }`}>
                            {isProsumer ? `+${(flat.terraceSolarKWh + flat.terraceWindKWh).toFixed(0)} kWh` : `${flat.dailyConsumptionKWh} kWh`}
                          </div>
                          <div className={`text-[9px] uppercase tracking-wider font-semibold ${
                            isSelected ? 'text-slate-300' : 'text-slate-500'
                          }`}>
                            {isProsumer ? 'Prosumer' : isEcoSaver ? 'Eco-Saver' : 'Deficit'}
                          </div>
                        </div>
                      </button>
                    );
                  })}
              </div>

              {/* Selected Flat Telemetry Inspection Drawer */}
              <div className="p-6 rounded-2xl bg-stone-50 border-2 border-stone-300 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xl font-display font-black text-slate-950">
                      {selectedFlat.flatId} ({selectedFlat.flatType} · Floor {selectedFlat.floor})
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold uppercase ${
                      selectedFlat.category === 'prosumer'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : selectedFlat.category === 'eco_saver'
                        ? 'bg-cyan-100 text-cyan-900 border border-cyan-300'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}>
                      {selectedFlat.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-mono">
                    Appliance Count: {selectedFlat.applianceCount} units · Daily Load: {selectedFlat.dailyConsumptionKWh} kWh/day
                    {selectedFlat.category === 'prosumer' && (
                      <> · Solar: {selectedFlat.terraceSolarKWh} kWh · VAWT: {selectedFlat.terraceWindKWh} kWh · Battery: {selectedFlat.batteryCapacityKWh} kWh (SoC {selectedFlat.currentSoCPercent}%)</>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-white border border-stone-200">
                    <span className="text-slate-500 text-[10px] block font-bold uppercase">Net Daily Balance</span>
                    <span className={`text-base font-black ${selectedFlat.netDailyBalanceKWh >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {selectedFlat.netDailyBalanceKWh >= 0 ? `+${selectedFlat.netDailyBalanceKWh} kWh Surplus` : `${selectedFlat.netDailyBalanceKWh} kWh Deficit`}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-stone-200">
                    <span className="text-slate-500 text-[10px] block font-bold uppercase">P2P Trading Role</span>
                    <span className="text-base font-black text-slate-900 uppercase">
                      {selectedFlat.p2pTradingRole === 'seller' ? 'Surplus Seller' : selectedFlat.p2pTradingRole === 'buyer' ? 'P2P Buyer' : 'Balanced'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Common Building Loads Breakdown */}
              <div>
                <h5 className="font-display font-black text-slate-950 text-base mb-3">
                  Shared Society Infrastructure Loads ({commonLoadsSum.toFixed(1)} kWh/day)
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
                  {COMMON_BUILDING_LOADS.map(item => (
                    <div key={item.id} className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                      <span className="font-bold text-slate-900 block mb-1">{item.name}</span>
                      <div className="flex items-center justify-between text-slate-600">
                        <span>{item.powerKW} kW</span>
                        <span className="font-black text-slate-950">{item.dailyKWh} kWh/d</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 4: CENTRAL HQ P2P TRADING LEDGER */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'p2p-ledger' && (
          <div className="space-y-8">
            
            {/* Tariff Arbitrage Breakdown Banner */}
            <div className="bg-slate-900 text-white p-6 sm:p-7 rounded-2xl border border-slate-800 shadow-md">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
                <div>
                  <div className="text-xs font-mono text-amber-400 uppercase font-bold tracking-widest">
                    CENTRAL HEADQUARTERS MARKETPLACE ENGINE
                  </div>
                  <h3 className="text-2xl font-display font-black text-white mt-0.5">
                    Internal Peer-to-Peer Tariff Arbitrage
                  </h3>
                </div>

                <button
                  onClick={handleExecuteP2PClearing}
                  disabled={isClearing}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isClearing ? 'animate-spin' : ''}`} />
                  <span>Execute Next P2P Clearing Round</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                  <div className="text-xs font-mono text-slate-400 font-bold uppercase">Utility Discom Tariff</div>
                  <div className="text-3xl font-display font-black text-white mt-1">
                    ₹{TARIFFS.utilityGridImport.toFixed(2)} <span className="text-xs font-mono text-slate-400">/ kWh</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-300">
                    Billed to deficit flats when purchasing power directly from the external utility grid.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-amber-950/40 border-2 border-amber-500">
                  <div className="text-xs font-mono text-amber-300 font-bold uppercase flex items-center justify-between">
                    <span>UrjaSaathi P2P Clearing Rate</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-bold">WIN-WIN CLEARING</span>
                  </div>
                  <div className="text-3xl font-display font-black text-amber-400 mt-1">
                    ₹{TARIFFS.p2pInternalMarketRate.toFixed(2)} <span className="text-xs font-mono text-amber-200">/ kWh</span>
                  </div>
                  <p className="mt-2 text-xs text-amber-100">
                    Buyers save -30% (₹2.65/kWh) compared to utility rates. Sellers gain +100% (₹3.10/kWh) over grid export!
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                  <div className="text-xs font-mono text-slate-400 font-bold uppercase">Discom Feed-in Net Metering</div>
                  <div className="text-3xl font-display font-black text-slate-400 mt-1">
                    ₹{TARIFFS.utilityGridExport.toFixed(2)} <span className="text-xs font-mono text-slate-400">/ kWh</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">
                    Low compensation prosumers receive if they dump solar into the grid without peer trading.
                  </p>
                </div>
              </div>
            </div>

            {/* Real-Time Ledger Table */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border-2 border-stone-300 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-200">
                <div>
                  <h4 className="font-display font-black text-slate-950 text-xl">
                    HQ Autonomous P2P Energy Settlement Ledger
                  </h4>
                  <p className="text-xs text-slate-500 font-mono">
                    Real-time transaction matching and automated internal society credits.
                  </p>
                </div>
                <div className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-300">
                  Total Society Traded Today: {trades.reduce((acc, t) => acc + t.energyKWh, 0).toFixed(1)} kWh
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-stone-300 text-slate-500 uppercase text-[10px]">
                      <th className="py-2.5 px-3">Transaction ID</th>
                      <th className="py-2.5 px-3">Timestamp</th>
                      <th className="py-2.5 px-3">Seller (Prosumer)</th>
                      <th className="py-2.5 px-3">Buyer (Deficit)</th>
                      <th className="py-2.5 px-3">Energy (kWh)</th>
                      <th className="py-2.5 px-3">Rate (₹/kWh)</th>
                      <th className="py-2.5 px-3">Total Amount</th>
                      <th className="py-2.5 px-3">Buyer Savings</th>
                      <th className="py-2.5 px-3">Seller Gain</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {trades.map(tx => (
                      <tr key={tx.tradeId} className="hover:bg-stone-50 transition-colors">
                        <td className="py-3 px-3 font-bold text-slate-950">{tx.tradeId}</td>
                        <td className="py-3 px-3 text-slate-600">{tx.timestamp}</td>
                        <td className="py-3 px-3 font-bold text-emerald-700">{tx.sellerFlatId}</td>
                        <td className="py-3 px-3 font-bold text-slate-800">{tx.buyerFlatId}</td>
                        <td className="py-3 px-3 font-black text-slate-950">{tx.energyKWh} kWh</td>
                        <td className="py-3 px-3 text-slate-700">₹{tx.ratePerKWh.toFixed(2)}</td>
                        <td className="py-3 px-3 font-bold text-slate-950">₹{tx.totalAmountRupees.toFixed(2)}</td>
                        <td className="py-3 px-3 font-bold text-emerald-700">+₹{tx.buyerSavingsRupees.toFixed(2)}</td>
                        <td className="py-3 px-3 font-bold text-amber-700">+₹{tx.sellerGainRupees.toFixed(2)}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 uppercase">
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 5: AUDIT REPORT & PITCH PROPOSAL */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'audit-report' && (
          <div className="space-y-6">
            
            <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-stone-300 shadow-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200">
                <div>
                  <h4 className="font-display font-black text-slate-950 text-2xl">
                    Comprehensive Energy Audit &amp; Proposal Summary
                  </h4>
                  <p className="text-xs text-slate-600 font-mono">
                    Formatted text audit ready for society committee presentation, municipal submission, or pitch brief.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCopyReport}
                    className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    {reportCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{reportCopied ? 'Copied Audit!' : 'Copy to Clipboard'}</span>
                  </button>

                  <button
                    onClick={handleDownloadReport}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download TXT</span>
                  </button>
                </div>
              </div>

              {/* Formatted Text Box */}
              <div className="p-6 rounded-2xl bg-stone-900 text-amber-300 font-mono text-xs leading-relaxed overflow-x-auto border border-stone-800">
                <pre>{generateReportText()}</pre>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ADD APPLIANCE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl border-2 border-stone-300 shadow-2xl p-6 space-y-4">
            <h4 className="font-display font-black text-slate-950 text-lg">
              Add Electrical Appliance
            </h4>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="block font-bold text-slate-800 uppercase mb-1">
                  Appliance Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Inverter Air Conditioner"
                  value={newAppName}
                  onChange={e => setNewAppName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-slate-900 bg-stone-50 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 uppercase mb-1">
                    Rated Power (Watts)
                  </label>
                  <input
                    type="number"
                    value={newAppWatts}
                    onChange={e => setNewAppWatts(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-slate-900 bg-stone-50 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 uppercase mb-1">
                    Operating Hours/Day
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={newAppHours}
                    onChange={e => setNewAppHours(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-slate-900 bg-stone-50 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 uppercase mb-1">
                  Category Type
                </label>
                <select
                  value={newAppCategory}
                  onChange={e => setNewAppCategory(e.target.value as 'mandatory' | 'discretionary')}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-slate-900 bg-stone-50 text-slate-900 font-bold"
                >
                  <option value="discretionary">Discretionary / Surge Item</option>
                  <option value="mandatory">Mandatory 24/7 Baseline Item</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-stone-300 text-slate-700 font-mono text-xs font-bold hover:bg-stone-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAppliance}
                className="px-4 py-2 rounded-xl bg-slate-950 text-white font-mono text-xs font-bold hover:bg-slate-800 cursor-pointer"
              >
                Add to Inventory
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

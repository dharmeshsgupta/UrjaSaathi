import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Cpu, 
  Sun, 
  Wind, 
  BatteryCharging, 
  Building2, 
  Thermometer, 
  Zap, 
  RefreshCw
} from 'lucide-react';
import { 
  BUILDING_MATERIALS, 
  STANDARD_APPLIANCES, 
  TARIFFS, 
  calculateTLC, 
  calculateSolarYield, 
  calculateVAWTYield, 
  calculateStandbyAudit,
  generate40FlatsDataset,
  generateSeedP2PTrades,
  COMMON_BUILDING_LOADS
} from '../../data/energyEngine';

type SolutionTab = 'thermal-diagnostic' | 'prosumer-microgrid' | 'multi-tenant-40' | 'p2p-ledger';

export const SolutionSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SolutionTab>('thermal-diagnostic');

  // Interactive state for Tab 1: Thermal Diagnostics
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('reinforced_concrete');
  const [ambientTemp, setAmbientTemp] = useState<number>(38.0);
  const [acSetpoint, setAcSetpoint] = useState<number>(24.0);
  const [floorLevel, setFloorLevel] = useState<'top' | 'middle' | 'ground'>('middle');

  // Interactive state for Tab 2: Prosumer Microgrid
  const [solarKWp, setSolarKWp] = useState<number>(5.5);
  const [windSpeedMS, setWindSpeedMS] = useState<number>(5.8);
  const [tiltAngle, setTiltAngle] = useState<number>(20);
  const [soilingLevel, setSoilingLevel] = useState<number>(6); // %
  const [batteryKWh, setBatteryKWh] = useState<number>(5.12);

  // Interactive state for Tab 3: 40-Tenant Flats
  const [flats] = useState(() => generate40FlatsDataset());
  const [selectedFlatId, setSelectedFlatId] = useState<string>('Flat 101');
  const [floorFilter, setFloorFilter] = useState<number | 'all'>('all');

  // Interactive state for Tab 4: P2P Trading Ledger
  const [p2pTrades, setP2pTrades] = useState(() => generateSeedP2PTrades());
  const [isSimulatingTrade, setIsSimulatingTrade] = useState<boolean>(false);

  // Computed values for Tab 1
  const selectedMaterial = BUILDING_MATERIALS.find(m => m.id === selectedMaterialId) || BUILDING_MATERIALS[0];
  const tlcValue = calculateTLC(selectedMaterial, ambientTemp, acSetpoint, floorLevel);
  const baseAcWatts = 1450;
  const acHours = 7.5;
  const standardAcKWh = (baseAcWatts * acHours) / 1000;
  const adjustedAcKWh = Number((standardAcKWh * tlcValue).toFixed(2));
  const excessThermalRupeesMonth = Math.round((adjustedAcKWh - standardAcKWh) * 30 * TARIFFS.utilityGridImport);
  const standbyAudit = calculateStandbyAudit(STANDARD_APPLIANCES);

  // Computed values for Tab 2
  const solarGen = calculateSolarYield(solarKWp, 5.4, tiltAngle, soilingLevel);
  const vawtGen = calculateVAWTYield(windSpeedMS, 2.4);
  const totalMicrogridDaily = Number((solarGen.dailyKWh + vawtGen.dailyKWh).toFixed(2));
  const householdLoadEstimate = 16.5; // kWh/day
  const selfConsumptionRatio = Math.min(100, Math.round((Math.min(totalMicrogridDaily, householdLoadEstimate) / totalMicrogridDaily) * 100)) || 100;

  // Selected flat details
  const currentFlat = flats.find(f => f.flatId === selectedFlatId) || flats[0];

  // Common building totals
  const totalBuildingLoad = flats.reduce((sum, f) => sum + f.dailyConsumptionKWh, 0);
  const totalBuildingGen = flats.reduce((sum, f) => sum + f.terraceSolarKWh + f.terraceWindKWh, 0);
  const commonLoadsTotal = COMMON_BUILDING_LOADS.reduce((sum, c) => sum + c.dailyKWh, 0);
  const grossBuildingLoad = totalBuildingLoad + commonLoadsTotal;
  const netBuildingBalance = Number((totalBuildingGen - grossBuildingLoad).toFixed(1));

  // Handler to simulate new P2P trade
  const handleTriggerSimulatedTrade = () => {
    setIsSimulatingTrade(true);
    setTimeout(() => {
      const prosumers = flats.filter(f => f.category === 'prosumer');
      const deficits = flats.filter(f => f.category === 'deficit');
      const randomSeller = prosumers[Math.floor(Math.random() * prosumers.length)];
      const randomBuyer = deficits[Math.floor(Math.random() * deficits.length)];
      const tradedEnergy = Number((2.5 + Math.random() * 4.0).toFixed(1));
      const amount = Number((tradedEnergy * TARIFFS.p2pInternalMarketRate).toFixed(2));
      const buyerSave = Number((tradedEnergy * TARIFFS.consumerSavingsMargin).toFixed(2));
      const sellerEarn = Number((tradedEnergy * TARIFFS.prosumerNetProfitBonus).toFixed(2));

      const newTx = {
        tradeId: `TX-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false }) + ' IST',
        sellerFlatId: randomSeller.flatId,
        buyerFlatId: randomBuyer.flatId,
        energyKWh: tradedEnergy,
        ratePerKWh: TARIFFS.p2pInternalMarketRate,
        totalAmountRupees: amount,
        buyerSavingsRupees: buyerSave,
        sellerGainRupees: sellerEarn,
        status: 'settled' as const,
      };

      setP2pTrades(prev => [newTx, ...prev.slice(0, 7)]);
      setIsSimulatingTrade(false);
    }, 450);
  };

  return (
    <section id="solution" className="relative py-24 sm:py-32 bg-[#F8F5EE] border-t border-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-amber-300 font-mono text-xs uppercase tracking-wider mb-4 font-bold border border-slate-800 shadow-xs">
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span>ALGORITHMIC FOUNDATION &amp; PLATFORM ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-slate-950 tracking-tight leading-tight">
            FOUR CORE CAPABILITIES. ZERO PHYSICAL SENSORS.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-700 font-medium leading-relaxed">
            UrjaSaathi AI runs mathematical models in-browser, giving individual households, independent prosumers, and 40-tenant apartment societies complete operational intelligence.
          </p>
        </div>

        {/* 4 Interactive Capability Tabs */}
        <div className="flex flex-wrap items-center gap-2.5 mb-10 pb-2 border-b border-stone-300">
          {[
            { id: 'thermal-diagnostic', label: '1. Appliance & Thermal Diagnostics', icon: Thermometer },
            { id: 'prosumer-microgrid', label: '2. Prosumer Solar + VAWT + Battery', icon: Sun },
            { id: 'multi-tenant-40', label: '3. 40-Tenant Building Complex', icon: Building2 },
            { id: 'p2p-ledger', label: '4. Central HQ P2P Trading Ledger', icon: Zap },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as SolutionTab)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-mono text-xs sm:text-sm font-bold tracking-tight transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-950 text-white shadow-md'
                    : 'bg-white hover:bg-stone-100 text-slate-700 border border-stone-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: APPLIANCE & THERMAL DIAGNOSTICS */}
        {activeTab === 'thermal-diagnostic' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Left Controls */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border-2 border-stone-300 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <span className="font-mono text-xs font-bold text-slate-950 uppercase tracking-wider">
                  ENVELOPE &amp; CLIMATE PARAMETERS
                </span>
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                  Thermal Loss Coefficient (TLC)
                </span>
              </div>

              {/* Material Select */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-800 uppercase mb-2">
                  Building Envelope Structure
                </label>
                <div className="space-y-2">
                  {BUILDING_MATERIALS.map((mat) => (
                    <button
                      key={mat.id}
                      onClick={() => setSelectedMaterialId(mat.id)}
                      className={`w-full text-left p-3 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                        selectedMaterialId === mat.id
                          ? 'border-amber-500 bg-amber-50/60 font-bold text-slate-950 ring-1 ring-amber-500'
                          : 'border-stone-200 bg-stone-50/70 hover:bg-stone-100 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{mat.name}</span>
                        <span className="text-amber-700 font-black">U: {mat.uValue} W/m²K</span>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-600 font-normal leading-tight">
                        {mat.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Ambient Temp Slider */}
              <div>
                <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-800 mb-1.5">
                  <span>Outdoor Ambient Temperature:</span>
                  <span className="text-amber-700 font-black text-sm">{ambientTemp}°C</span>
                </div>
                <input
                  type="range"
                  min="22"
                  max="46"
                  step="0.5"
                  value={ambientTemp}
                  onChange={(e) => setAmbientTemp(parseFloat(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-0.5">
                  <span>Mild (22°C)</span>
                  <span>Hot Summer (38°C)</span>
                  <span>Extreme Heatwave (46°C)</span>
                </div>
              </div>

              {/* AC Setpoint Slider */}
              <div>
                <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-800 mb-1.5">
                  <span>Thermostat AC Setpoint:</span>
                  <span className="text-blue-700 font-black text-sm">{acSetpoint}°C</span>
                </div>
                <input
                  type="range"
                  min="18"
                  max="28"
                  step="1"
                  value={acSetpoint}
                  onChange={(e) => setAcSetpoint(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-0.5">
                  <span>Chill 18°C (High Load)</span>
                  <span>Recommended 24°C</span>
                  <span>Eco 26°C-28°C</span>
                </div>
              </div>

              {/* Floor Level */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-800 uppercase mb-2">
                  Vertical Floor Exposure
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                  {(['top', 'middle', 'ground'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setFloorLevel(lvl)}
                      className={`py-2 px-3 rounded-lg border uppercase font-bold transition-all cursor-pointer ${
                        floorLevel === lvl
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-stone-50 hover:bg-stone-100 text-slate-700 border-stone-300'
                      }`}
                    >
                      {lvl === 'top' ? 'Top Terrace' : lvl === 'middle' ? 'Middle Floor' : 'Ground Floor'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Output Diagnostics */}
            <div className="lg:col-span-7 space-y-6">
              {/* TLC Result Card */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-stone-300 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                  <div>
                    <span className="text-xs font-mono text-amber-700 font-bold uppercase tracking-wider">
                      THERMAL DIAGNOSTIC ENGINE OUTPUT
                    </span>
                    <h3 className="text-2xl font-display font-black text-slate-950">
                      Calculated TLC Multiplier: <span className="text-amber-600">{tlcValue}x</span>
                    </h3>
                  </div>
                  <div className="px-3.5 py-1.5 rounded-xl bg-stone-100 border border-stone-300 text-xs font-mono font-bold text-slate-800">
                    ΔT = {(ambientTemp - acSetpoint).toFixed(1)}°C Thermal Gradient
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                    <div className="text-[11px] font-mono text-slate-600 font-semibold uppercase">
                      Baseline AC Daily Draw
                    </div>
                    <div className="text-xl font-display font-black text-slate-900 mt-1">
                      {standardAcKWh} kWh
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Under neutral standard conditions</div>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-300">
                    <div className="text-[11px] font-mono text-amber-800 font-bold uppercase">
                      Envelope-Adjusted Draw
                    </div>
                    <div className="text-xl font-display font-black text-amber-700 mt-1">
                      {adjustedAcKWh} kWh/day
                    </div>
                    <div className="text-[10px] text-amber-900 font-semibold mt-0.5">
                      +{(adjustedAcKWh - standardAcKWh).toFixed(2)} kWh extra heat ingress
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-300">
                    <div className="text-[11px] font-mono text-rose-800 font-bold uppercase">
                      Monthly Thermal Bill Surge
                    </div>
                    <div className="text-xl font-display font-black text-rose-700 mt-1">
                      +₹{excessThermalRupeesMonth}
                    </div>
                    <div className="text-[10px] text-rose-900 font-semibold mt-0.5">
                      Purely from building envelope losses
                    </div>
                  </div>
                </div>

                {/* Physics Formula Explanation */}
                <div className="p-4 rounded-xl bg-slate-900 text-white font-mono text-xs space-y-1.5 border border-slate-800">
                  <div className="text-amber-400 font-bold">
                    Mathematical Formulation: Daily Energy = [Power (W) × Hours Daily / 1000] × TLC
                  </div>
                  <div className="text-slate-300 text-[11px]">
                    TLC is dynamically modulated by Envelope U-Value ({selectedMaterial.uValue} W/m²K), ambient thermal differential (ΔT), and vertical solar roof radiation.
                  </div>
                </div>
              </div>

              {/* Standby Vampire Power Audit Card */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-stone-300 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-display font-black text-slate-950 text-lg">
                        Standby Vampire Power Detection
                      </h4>
                      <p className="text-xs text-slate-600">Hidden dormant drain across unmonitored baseline electronics</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-900 border border-rose-300 font-mono text-xs font-bold">
                    {standbyAudit.standbyTotalWatts}W Continuous Bleed
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
                    <span className="text-slate-600 text-[10px] uppercase font-bold block">Monthly Leakage</span>
                    <span className="text-base font-black text-slate-900">{standbyAudit.standbyMonthlyKWh} kWh</span>
                  </div>
                  <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
                    <span className="text-slate-600 text-[10px] uppercase font-bold block">Rupee Waste / Month</span>
                    <span className="text-base font-black text-rose-600">₹{standbyAudit.standbyMonthlyCostRupees}</span>
                  </div>
                  <div className="col-span-2 sm:col-span-1 p-3 rounded-lg bg-emerald-50 border border-emerald-300">
                    <span className="text-emerald-800 text-[10px] uppercase font-bold block">1-Click Mitigation</span>
                    <span className="text-xs font-black text-emerald-950">Master Smart Strip Savings</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: PROSUMER MICROGRID */}
        {activeTab === 'prosumer-microgrid' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Left Controls */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border-2 border-stone-300 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <span className="font-mono text-xs font-bold text-slate-950 uppercase tracking-wider">
                  MICROGRID HARDWARE PROFILE
                </span>
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                  Solar PV + VAWT + LiFePO4
                </span>
              </div>

              {/* Solar Array Slider */}
              <div>
                <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-800 mb-1.5">
                  <span className="flex items-center gap-1.5"><Sun className="w-3.5 h-3.5 text-amber-500" /> Rooftop Solar Capacity:</span>
                  <span className="text-amber-700 font-black text-sm">{solarKWp} kWp</span>
                </div>
                <input
                  type="range"
                  min="1.5"
                  max="12.0"
                  step="0.5"
                  value={solarKWp}
                  onChange={(e) => setSolarKWp(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-0.5">
                  <span>1.5 kWp (Small Flat)</span>
                  <span>5.5 kWp (Standard)</span>
                  <span>12.0 kWp (Penthouse)</span>
                </div>
              </div>

              {/* VAWT Wind Speed Slider */}
              <div>
                <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-800 mb-1.5">
                  <span className="flex items-center gap-1.5"><Wind className="w-3.5 h-3.5 text-cyan-600" /> Rooftop Wind Velocity:</span>
                  <span className="text-cyan-800 font-black text-sm">{windSpeedMS} m/s</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="14.0"
                  step="0.2"
                  value={windSpeedMS}
                  onChange={(e) => setWindSpeedMS(parseFloat(e.target.value))}
                  className="w-full accent-cyan-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-0.5">
                  <span>Sub-Cutin (1 m/s)</span>
                  <span>Moderate Breeze (5.8 m/s)</span>
                  <span>Strong Gust (14 m/s)</span>
                </div>
              </div>

              {/* Tilt Angle */}
              <div>
                <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-800 mb-1.5">
                  <span>Solar Panel Tilt Angle:</span>
                  <span className="text-slate-900 font-black text-sm">{tiltAngle}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="45"
                  step="1"
                  value={tiltAngle}
                  onChange={(e) => setTiltAngle(parseInt(e.target.value))}
                  className="w-full accent-slate-800 cursor-pointer"
                />
                <div className="text-[11px] font-mono text-slate-600 mt-0.5">
                  Optimal Indian Latitude Angle: 18°–22° ({Math.abs(tiltAngle - 20) <= 2 ? 'Optimal Alignment' : 'Sub-Optimal Tilt'})
                </div>
              </div>

              {/* Soiling Loss Slider */}
              <div>
                <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-800 mb-1.5">
                  <span>Dust Soiling Factor:</span>
                  <span className={`font-black text-sm ${soilingLevel > 8 ? 'text-rose-600' : 'text-slate-900'}`}>{soilingLevel}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  step="1"
                  value={soilingLevel}
                  onChange={(e) => setSoilingLevel(parseInt(e.target.value))}
                  className="w-full accent-rose-600 cursor-pointer"
                />
                {soilingLevel > 8 && (
                  <div className="mt-1.5 p-2 rounded bg-rose-50 border border-rose-200 text-[11px] font-mono text-rose-900 font-bold">
                    Schedule Cleaning Alert: Panel washing recovers +{solarGen.soilingLossKWh} kWh daily!
                  </div>
                )}
              </div>

              {/* LiFePO4 Battery Pack */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-800 uppercase mb-2">
                  LiFePO4 Storage Capacity
                </label>
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  {[5.12, 10.24].map((kwh) => (
                    <button
                      key={kwh}
                      onClick={() => setBatteryKWh(kwh)}
                      className={`p-3 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                        batteryKWh === kwh
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-stone-50 hover:bg-stone-100 text-slate-700 border-stone-300'
                      }`}
                    >
                      <div className="text-sm">{kwh} kWh Pack</div>
                      <div className="text-[10px] opacity-80 mt-0.5">51.2V 100Ah/200Ah</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Output Generation Telemetry */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-stone-300 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="text-xs font-mono text-emerald-800 font-bold uppercase tracking-wider">
                      PROSUMER GENERATION TELEMETRY
                    </span>
                    <h3 className="text-2xl font-display font-black text-slate-950">
                      Total Clean Yield: <span className="text-emerald-700">{totalMicrogridDaily} kWh/day</span>
                    </h3>
                  </div>
                  <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-xs font-mono font-bold text-emerald-950">
                    Self-Consumption: {selfConsumptionRatio}%
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {/* Solar Output */}
                  <div className="p-5 rounded-xl bg-amber-50/70 border-2 border-amber-300 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-amber-950 uppercase flex items-center gap-1.5">
                        <Sun className="w-4 h-4 text-amber-600" /> Rooftop Solar PV
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-bold">
                        PR ~ 0.81
                      </span>
                    </div>
                    <div className="text-3xl font-display font-black text-amber-800">
                      {solarGen.dailyKWh} <span className="text-sm font-mono font-normal">kWh/day</span>
                    </div>
                    <p className="text-xs text-amber-900 font-medium">
                      Monthly yield: ~{solarGen.monthlyKWh} kWh. Avoids ₹{(solarGen.monthlyKWh * TARIFFS.utilityGridImport).toFixed(0)} in utility grid bills.
                    </p>
                  </div>

                  {/* VAWT Wind Output */}
                  <div className="p-5 rounded-xl bg-cyan-50/70 border-2 border-cyan-300 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-cyan-950 uppercase flex items-center gap-1.5">
                        <Wind className="w-4 h-4 text-cyan-700" /> Savonius-Darrieus VAWT
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-200 text-cyan-900 font-bold">
                        Cp ~ 0.32
                      </span>
                    </div>
                    <div className="text-3xl font-display font-black text-cyan-800">
                      {vawtGen.dailyKWh} <span className="text-sm font-mono font-normal">kWh/day</span>
                    </div>
                    <p className="text-xs text-cyan-900 font-medium">
                      Instant generation: {vawtGen.instantWatts}W. Captures nocturnal breezes and monsoon gusts.
                    </p>
                  </div>
                </div>

                {/* LiFePO4 Peak Shaving Protocol */}
                <div className="p-5 rounded-xl bg-slate-900 text-white border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-amber-400 font-bold uppercase flex items-center gap-2">
                      <BatteryCharging className="w-4 h-4 text-emerald-400" />
                      LiFePO4 Round-Trip Dispatch Cycle
                    </span>
                    <span className="font-mono text-[11px] text-emerald-400 font-bold">
                      93% Round-Trip Efficiency
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono text-slate-300">
                    <div className="p-2.5 rounded bg-slate-800/80 border border-slate-700">
                      <span className="text-amber-300 font-bold block mb-1">Solar Noon Charge (11:00 - 15:00)</span>
                      Absorbs peak midday solar generation to eliminate discom net-metering low export penalty.
                    </div>
                    <div className="p-2.5 rounded bg-slate-800/80 border border-slate-700">
                      <span className="text-emerald-300 font-bold block mb-1">Peak Evening Discharge (18:00 - 22:00)</span>
                      Discharges stored kWh when discom grid tariffs and flat loads peak. Sells surplus to neighbors via P2P.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: 40-TENANT COMPLEX */}
        {activeTab === 'multi-tenant-40' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Top Aggregate Summary Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border-2 border-stone-300 shadow-xs">
                <span className="text-[11px] font-mono text-slate-500 uppercase font-bold block">
                  Total 40-Flat Consumption
                </span>
                <span className="text-2xl font-display font-black text-slate-950 mt-1 block">
                  {totalBuildingLoad.toFixed(1)} kWh/day
                </span>
                <span className="text-[10px] font-mono text-slate-600">40 Tenant Households</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border-2 border-stone-300 shadow-xs">
                <span className="text-[11px] font-mono text-slate-500 uppercase font-bold block">
                  Common Infrastructure Load
                </span>
                <span className="text-2xl font-display font-black text-slate-950 mt-1 block">
                  {commonLoadsTotal.toFixed(1)} kWh/day
                </span>
                <span className="text-[10px] font-mono text-slate-600">Lifts, Pumps &amp; Lighting</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border-2 border-stone-300 shadow-xs">
                <span className="text-[11px] font-mono text-emerald-800 uppercase font-bold block">
                  Terrace Solar &amp; VAWT Generation
                </span>
                <span className="text-2xl font-display font-black text-emerald-700 mt-1 block">
                  {totalBuildingGen.toFixed(1)} kWh/day
                </span>
                <span className="text-[10px] font-mono text-emerald-900 font-semibold">10 Prosumer Arrays</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border-2 border-stone-300 shadow-xs">
                <span className="text-[11px] font-mono text-blue-800 uppercase font-bold block">
                  Net Grid Import Balance
                </span>
                <span className="text-2xl font-display font-black text-blue-800 mt-1 block">
                  {netBuildingBalance < 0 ? `${Math.abs(netBuildingBalance)} kWh` : `+${netBuildingBalance} kWh Net Export`}
                </span>
                <span className="text-[10px] font-mono text-blue-900 font-semibold">Self-Sufficiency ~41%</span>
              </div>
            </div>

            {/* Floor Selector & 40 Flats Interactive Grid */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-stone-300 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-200">
                <div>
                  <h3 className="font-display font-black text-slate-950 text-xl">
                    Residential Matrix (40 Flats: 4 Floors × 10 Flats)
                  </h3>
                  <p className="text-xs text-slate-600">
                    Click any flat to inspect appliance draw, rooftop renewable allocation, and P2P trading balance.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-700">Filter Floor:</span>
                  {(['all', 1, 2, 3, 4] as const).map((fl) => (
                    <button
                      key={fl}
                      onClick={() => setFloorFilter(fl)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                        floorFilter === fl
                          ? 'bg-slate-900 text-white'
                          : 'bg-stone-100 text-slate-700 hover:bg-stone-200'
                      }`}
                    >
                      {fl === 'all' ? 'All (40)' : `Floor ${fl}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* 40 Flats Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2.5 mb-8">
                {flats
                  .filter(f => floorFilter === 'all' || f.floor === floorFilter)
                  .map((flat) => {
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

              {/* Selected Flat Detailed Inspection Bar */}
              <div className="p-6 rounded-2xl bg-stone-50 border-2 border-stone-300 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xl font-display font-black text-slate-950">
                      {currentFlat.flatId} ({currentFlat.flatType} · Floor {currentFlat.floor})
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold uppercase ${
                      currentFlat.category === 'prosumer'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : currentFlat.category === 'eco_saver'
                        ? 'bg-cyan-100 text-cyan-900 border border-cyan-300'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}>
                      {currentFlat.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-mono">
                    Appliances: {currentFlat.applianceCount} items · Daily Load: {currentFlat.dailyConsumptionKWh} kWh
                    {currentFlat.category === 'prosumer' && ` · Solar: ${currentFlat.terraceSolarKWh} kWh · VAWT: ${currentFlat.terraceWindKWh} kWh · LiFePO4: ${currentFlat.batteryCapacityKWh} kWh (SoC ${currentFlat.currentSoCPercent}%)`}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-white border border-stone-200">
                    <span className="text-slate-500 text-[10px] block font-bold uppercase">Net Daily Balance</span>
                    <span className={`text-base font-black ${currentFlat.netDailyBalanceKWh >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {currentFlat.netDailyBalanceKWh >= 0 ? `+${currentFlat.netDailyBalanceKWh} kWh Surplus` : `${currentFlat.netDailyBalanceKWh} kWh Deficit`}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-stone-200">
                    <span className="text-slate-500 text-[10px] block font-bold uppercase">P2P Marketplace Role</span>
                    <span className="text-base font-black text-slate-900 uppercase">
                      {currentFlat.p2pTradingRole === 'seller' ? 'Surplus Seller' : currentFlat.p2pTradingRole === 'buyer' ? 'P2P Buyer' : 'Self-Balanced'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 4: P2P TRADING LEDGER */}
        {activeTab === 'p2p-ledger' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Tariff Arbitrage Breakdown Card */}
            <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
                <div>
                  <div className="text-xs font-mono text-amber-400 uppercase font-bold tracking-widest">
                    ECONOMIC INCENTIVE ENGINE
                  </div>
                  <h3 className="text-2xl font-display font-black text-white mt-1">
                    Why P2P Internal Energy Trading is a Win-Win for All 40 Flats
                  </h3>
                </div>
                <button
                  onClick={handleTriggerSimulatedTrade}
                  disabled={isSimulatingTrade}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSimulatingTrade ? 'animate-spin' : ''}`} />
                  <span>Execute Simulated P2P Trade</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 rounded-xl bg-slate-800/80 border border-slate-700">
                  <div className="text-xs font-mono text-slate-400 font-bold uppercase">Discom Utility Tariff</div>
                  <div className="text-3xl font-display font-black text-white mt-1">
                    ₹{TARIFFS.utilityGridImport.toFixed(2)} <span className="text-xs font-mono text-slate-400">/ kWh</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-300 font-medium">
                    Standard high grid billing rate charged to deficit flats when purchasing from the public substation.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-amber-950/40 border-2 border-amber-500/80">
                  <div className="text-xs font-mono text-amber-300 font-bold uppercase flex items-center justify-between">
                    <span>UrjaSaathi P2P Clearing Rate</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-black">MARKET CLEARING</span>
                  </div>
                  <div className="text-3xl font-display font-black text-amber-400 mt-1">
                    ₹{TARIFFS.p2pInternalMarketRate.toFixed(2)} <span className="text-xs font-mono text-amber-200">/ kWh</span>
                  </div>
                  <p className="mt-2 text-xs text-amber-100 font-medium">
                    Internal trade price negotiated within building headquarters ledger. Slashes buyer cost by 30% while beating grid feed-in rates.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-slate-800/80 border border-slate-700">
                  <div className="text-xs font-mono text-slate-400 font-bold uppercase">Discom Net-Metering Export</div>
                  <div className="text-3xl font-display font-black text-slate-300 mt-1">
                    ₹{TARIFFS.utilityGridExport.toFixed(2)} <span className="text-xs font-mono text-slate-400">/ kWh</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-400 font-medium">
                    Meager feed-in tariff prosumers receive when dumping clean surplus into the public grid without UrjaSaathi P2P.
                  </p>
                </div>
              </div>
            </div>

            {/* Central HQ Real-Time Ledger Table */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-stone-300 shadow-sm">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-200">
                <div>
                  <h4 className="font-display font-black text-slate-950 text-xl">
                    Central Headquarters Autonomous P2P Ledger
                  </h4>
                  <p className="text-xs text-slate-600 font-mono">
                    Real-time internal settlement matching rooftop battery prosumers with high-demand neighbors.
                  </p>
                </div>
                <div className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-300">
                  Society Daily Savings: +₹{p2pTrades.reduce((sum, t) => sum + t.buyerSavingsRupees + t.sellerGainRupees, 0).toFixed(0)}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-stone-300 text-slate-500 uppercase text-[11px]">
                      <th className="py-3 px-3">Tx ID</th>
                      <th className="py-3 px-3">Time</th>
                      <th className="py-3 px-3">Seller (Prosumer)</th>
                      <th className="py-3 px-3">Buyer (Deficit)</th>
                      <th className="py-3 px-3">Energy (kWh)</th>
                      <th className="py-3 px-3">Settlement (₹)</th>
                      <th className="py-3 px-3">Buyer Savings</th>
                      <th className="py-3 px-3">Seller Gain</th>
                      <th className="py-3 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {p2pTrades.map((tx) => (
                      <tr key={tx.tradeId} className="hover:bg-stone-50 transition-colors">
                        <td className="py-3.5 px-3 font-bold text-slate-900">{tx.tradeId}</td>
                        <td className="py-3.5 px-3 text-slate-600">{tx.timestamp}</td>
                        <td className="py-3.5 px-3 font-bold text-emerald-700 flex items-center gap-1.5">
                          <Sun className="w-3.5 h-3.5 text-amber-500 inline" /> {tx.sellerFlatId}
                        </td>
                        <td className="py-3.5 px-3 font-bold text-slate-900">{tx.buyerFlatId}</td>
                        <td className="py-3.5 px-3 font-black text-slate-950">{tx.energyKWh} kWh</td>
                        <td className="py-3.5 px-3 font-bold text-slate-900">₹{tx.totalAmountRupees.toFixed(2)}</td>
                        <td className="py-3.5 px-3 font-bold text-emerald-700">+₹{tx.buyerSavingsRupees.toFixed(2)}</td>
                        <td className="py-3.5 px-3 font-bold text-amber-700">+₹{tx.sellerGainRupees.toFixed(2)}</td>
                        <td className="py-3.5 px-3">
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
          </motion.div>
        )}

      </div>
    </section>
  );
};

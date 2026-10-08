import React, { useState } from 'react';
import { 
  Flame, 
  Thermometer, 
  Cpu, 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  TrendingUp, 
  Info,
  ShieldCheck,
  Building
} from 'lucide-react';
import { 
  BUILDING_MATERIALS, 
  STANDARD_APPLIANCES, 
  TARIFFS, 
  calculateTLC, 
  calculateStandbyAudit 
} from '../data/energyEngine';
import { loadUserEnergyState, saveUserEnergyState } from '../data/userEnergyStore';
import { getStoredUser } from '../auth/authStore';

interface Innovation1PageProps {
  onNavigate: (view: string) => void;
}

export const Innovation1Page: React.FC<Innovation1PageProps> = ({ onNavigate }) => {
  const currentUser = getStoredUser();
  const [energyState, setEnergyState] = useState(() => loadUserEnergyState(currentUser));

  // Interactive TLC Simulator State
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>(energyState.selectedMaterialId || 'reinforced_concrete');
  const [ambientTemp, setAmbientTemp] = useState<number>(energyState.ambientTemp || 38.5);
  const [acSetpoint, setAcSetpoint] = useState<number>(energyState.acSetpoint || 24.0);
  const [floorLevel, setFloorLevel] = useState<'top' | 'middle' | 'ground'>(energyState.floorPosition || 'middle');
  const [smartStripMitigation, setSmartStripMitigation] = useState<boolean>(energyState.smartStripMitigation);

  const selectedMaterial = BUILDING_MATERIALS.find(m => m.id === selectedMaterialId) || BUILDING_MATERIALS[0];
  const tlcValue = calculateTLC(selectedMaterial, ambientTemp, acSetpoint, floorLevel);

  // AC baseline calculation
  const baseAcWatts = 1450;
  const acHours = 7.5;
  const standardAcKWh = (baseAcWatts * acHours) / 1000; // 10.875 kWh
  const adjustedAcKWh = Number((standardAcKWh * tlcValue).toFixed(2));
  const excessKWhMonthly = Number(((adjustedAcKWh - standardAcKWh) * 30).toFixed(1));
  const excessRupeesMonthly = Math.round(excessKWhMonthly * energyState.tariffPerKWh);

  const standbyAudit = calculateStandbyAudit(STANDARD_APPLIANCES);

  // Sync to global energy state
  const handleApplyToDashboard = () => {
    const updated = {
      ...energyState,
      selectedMaterialId,
      ambientTemp,
      acSetpoint,
      floorPosition: floorLevel,
      smartStripMitigation
    };
    setEnergyState(updated);
    saveUserEnergyState(updated);
    onNavigate('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F8F5EE] pt-24 pb-20 selection:bg-amber-500/30 selection:text-amber-950 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300">
                PATENT-PENDING ARCHITECTURE
              </span>
              <span className="text-xs font-mono text-slate-400">·</span>
              <span className="text-xs font-mono text-slate-500">
                Zero-Sensor Thermal Intelligence
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-slate-950">
              Innovation 1: Thermal-Load Coupling (TLC) Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-sans mt-0.5">
              Software-only thermodynamic diagnostics calculating envelope heat ingress, AC compressor surges, and vampire standby bleed.
            </p>
          </div>

          <button
            onClick={handleApplyToDashboard}
            className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-mono text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Apply TLC Settings to Dashboard →</span>
          </button>
        </div>

        {/* 1. Overview & Problem Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-800 uppercase tracking-wider">
              <Flame className="w-4 h-4 text-amber-600" />
              <span>The Core Problem It Solves</span>
            </div>
            <h2 className="text-lg font-display font-black text-slate-950">
              Why Standard Energy Bills Hide 30% - 70% of Real Inefficiencies
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Traditional utility meters record bulk monthly kilowatt-hours without revealing <em>why</em> consumption surges. In tropical and subtropical buildings, over 60% of summer electricity is consumed by cooling systems fighting building envelope heat ingress.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              A home with standard reinforced concrete walls (U = 2.85 W/m²K) conducts <strong>3.3x more ambient heat</strong> into living spaces than an AAC-insulated wall (U = 0.85 W/m²K), forcing AC inverter compressors to operate continuously at maximum wattage.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-800 uppercase tracking-wider">
              <Cpu className="w-4 h-4 text-amber-600" />
              <span>How the Mathematical Formulation Works</span>
            </div>
            <h2 className="text-lg font-display font-black text-slate-950">
              Zero-Hardware Thermal Loss Coefficient (TLC)
            </h2>
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 font-mono text-xs text-slate-900 space-y-1.5">
              <div className="font-bold text-amber-800">
                Daily Energy (kWh) = [Power (W) × Hours Daily / 1000] × TLC
              </div>
              <div className="text-[11px] text-slate-500">
                TLC = 1.0 + [Material Multiplier × (Ambient Temp - AC Setpoint) / 10] + Floor Penalty
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              By combining building structural material constants, ambient outdoor heat index, thermostat setpoints, and roof radiant gain penalties, UrjaSaathi AI calculates exact heat-flux penalties without requiring ₹25,000 smart meter hardware.
            </p>
          </div>
        </div>

        {/* 2. Interactive Diagnostic Demonstration Simulator */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
            <div>
              <h3 className="text-base font-display font-black text-slate-950">
                Live Interactive TLC Diagnostic Simulator
              </h3>
              <p className="text-xs text-slate-500 font-sans">
                Adjust building materials, thermostat setpoints, and outdoor ambient temperature to observe real-time compressor surge and financial bleed.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-500">Calculated TLC Multiplier:</span>
              <span className="px-3 py-1 rounded-xl bg-amber-500 text-slate-950 font-mono font-black text-sm shadow-xs">
                {tlcValue}x
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Input Controls */}
            <div className="lg:col-span-2 space-y-4 text-xs font-mono">
              {/* Material Selection */}
              <div>
                <label className="block font-bold text-slate-800 uppercase mb-2">
                  Building Envelope Construction Material
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {BUILDING_MATERIALS.map(mat => (
                    <button
                      key={mat.id}
                      type="button"
                      onClick={() => setSelectedMaterialId(mat.id)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        selectedMaterialId === mat.id 
                          ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20' 
                          : 'bg-stone-50 hover:bg-stone-100 border-stone-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{mat.name}</span>
                        <span className="text-[10px] text-slate-500">U: {mat.uValue}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-sans mt-0.5">{mat.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sliders: Temp & Setpoint */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <div className="flex justify-between font-bold text-slate-900 mb-1">
                    <span>Outdoor Ambient Temperature:</span>
                    <span className="text-rose-600">{ambientTemp}°C</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="48"
                    step="0.5"
                    value={ambientTemp}
                    onChange={(e) => setAmbientTemp(Number(e.target.value))}
                    className="w-full accent-rose-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>30°C Mild</span>
                    <span>38°C Hot</span>
                    <span>48°C Extreme</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <div className="flex justify-between font-bold text-slate-900 mb-1">
                    <span>AC Thermostat Setpoint:</span>
                    <span className="text-sky-600">{acSetpoint}°C</span>
                  </div>
                  <input
                    type="range"
                    min="18"
                    max="26"
                    step="0.5"
                    value={acSetpoint}
                    onChange={(e) => setAcSetpoint(Number(e.target.value))}
                    className="w-full accent-sky-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>18°C Overcooling</span>
                    <span>24°C BEE Optimal</span>
                    <span>26°C Eco</span>
                  </div>
                </div>
              </div>

              {/* Floor Level Penalty */}
              <div>
                <label className="block font-bold text-slate-800 uppercase mb-1">Floor Level Exposure</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'top', label: 'Top Floor (Direct Roof Slab Heat)', penalty: '+18% TLC' },
                    { id: 'middle', label: 'Middle Floor (Insulated Slabs)', penalty: 'Baseline' },
                    { id: 'ground', label: 'Ground Floor (Earth Heat Sink)', penalty: '-5% TLC' },
                  ].map(fl => (
                    <button
                      key={fl.id}
                      type="button"
                      onClick={() => setFloorLevel(fl.id as any)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        floorLevel === fl.id 
                          ? 'bg-amber-500 text-slate-950 font-bold border-amber-600' 
                          : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-slate-700'
                      }`}
                    >
                      <div className="text-xs leading-tight">{fl.label}</div>
                      <div className="text-[10px] opacity-80 mt-0.5">{fl.penalty}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Output Box */}
            <div className="p-6 rounded-3xl bg-slate-950 text-white flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                  Thermodynamic Impact Summary
                </span>
                <div className="mt-3">
                  <div className="text-xs font-mono text-slate-400">Total AC Consumption:</div>
                  <div className="text-3xl font-display font-black text-white mt-1">
                    {adjustedAcKWh} <span className="text-xs font-mono text-amber-400">kWh/day</span>
                  </div>
                  <div className="text-xs text-slate-400 font-sans mt-0.5">
                    vs standard unadjusted baseline {standardAcKWh} kWh/day
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800">
                  <div className="text-xs font-mono text-slate-400">Thermal Heat Ingress Cost Bleed:</div>
                  <div className="text-2xl font-display font-black text-rose-400 mt-1">
                    +₹{excessRupeesMonthly} <span className="text-xs font-mono text-slate-400">/ month</span>
                  </div>
                  <div className="text-xs text-slate-400 font-sans mt-0.5">
                    (~{excessKWhMonthly} excess kWh wasted cooling conducting walls)
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleApplyToDashboard}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono text-xs font-bold uppercase cursor-pointer"
                >
                  Save TLC Values to My Profile
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* 3. Standby Vampire Audit Section */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-100 text-rose-800">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-display font-black text-slate-950">
                Standby Vampire Power Audit ({standbyAudit.standbyTotalWatts}W Continuous Bleed)
              </h3>
              <p className="text-xs text-slate-500 font-sans">
                Parasitic electrical bleed that persists 24 hours a day even when appliances are turned off via remote control.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-slate-500">Continuous Vampire Load:</span>
              <div className="text-2xl font-display font-black text-slate-950 mt-1">{standbyAudit.standbyTotalWatts} Watts</div>
              <div className="text-[11px] text-slate-500 font-sans">Idle AC sensors, TV boards, routers</div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-slate-500">Monthly Energy Waste:</span>
              <div className="text-2xl font-display font-black text-rose-600 mt-1">{standbyAudit.standbyMonthlyKWh} kWh/mo</div>
              <div className="text-[11px] text-slate-500 font-sans">Equivalent to running a fan for 500 hours</div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-slate-500">Financial Bleed per Year:</span>
              <div className="text-2xl font-display font-black text-amber-700 mt-1">₹{standbyAudit.standbyAnnualCostRupees}</div>
              <div className="text-[11px] text-slate-500 font-sans">Recoverable via zero-idle smart power strips</div>
            </div>
          </div>
        </div>

        {/* 4. Limitations & Future Development */}
        <div className="p-6 rounded-3xl bg-stone-100 border border-stone-200 text-xs font-sans text-slate-700 space-y-2">
          <div className="flex items-center gap-2 font-mono font-bold text-slate-900">
            <Info className="w-4 h-4 text-slate-600" />
            <span>Engineering Limitations &amp; Upcoming Research Milestones</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            <strong>Current Limitations:</strong> U-values are based on standard IS 3792 / NBC guidelines. Internal thermal mass, window-to-wall ratios (WWR), and humidity-dependent latent heat loads are approximated through sensible heat multipliers.
          </p>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            <strong>Future Development:</strong> Integration with Open-Meteo satellite solar irradiance API, smartphone infrared camera calibration for surface emissivity, and phase-change material (PCM) retrofit calculators.
          </p>
        </div>

      </div>
    </div>
  );
};

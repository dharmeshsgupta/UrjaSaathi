import React, { useState } from 'react';
import { 
  Sun, 
  Wind, 
  BatteryCharging, 
  Sliders, 
  ShieldCheck, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles, 
  Radio, 
  Calendar, 
  Info, 
  RotateCcw,
  Zap,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { getStoredUser } from '../auth/authStore';
import { 
  loadUserEnergyState, 
  saveUserEnergyState, 
  calculateEnergyMetrics, 
  ConnectedPlant 
} from '../data/userEnergyStore';
import { calculateSolarYield, calculateVAWTYield } from '../data/energyEngine';

interface SolarVawtPageProps {
  onNavigate: (view: string) => void;
}

export const SolarVawtPage: React.FC<SolarVawtPageProps> = ({ onNavigate }) => {
  const currentUser = getStoredUser();
  const [energyState, setEnergyState] = useState(() => loadUserEnergyState(currentUser));
  const metrics = calculateEnergyMetrics(energyState);

  // Solar Form State
  const [solarAreaSqFt, setSolarAreaSqFt] = useState<number>(450);
  const [roofType, setRoofType] = useState<string>('flat_rcc');
  const [shadingPercent, setShadingPercent] = useState<number>(5);
  const [tiltAngle, setTiltAngle] = useState<number>(20);
  const [solarKWp, setSolarKWp] = useState<number>(5.5);

  // VAWT Form State
  const [vawtHeightMeters, setVawtHeightMeters] = useState<number>(14);
  const [windSpeedMS, setWindSpeedMS] = useState<number>(6.0);
  const [vawtCapacityKW, setVawtCapacityKW] = useState<number>(2.4);

  // Battery Storage
  const [batteryCapacityKWh, setBatteryCapacityKWh] = useState<number>(5.12);

  // "Connect Energy Plant" Modal State
  const [isConnectModalOpen, setIsConnectModalOpen] = useState<boolean>(false);
  const [newPlantType, setNewPlantType] = useState<'solar' | 'vawt'>('solar');
  const [newPlantName, setNewPlantName] = useState<string>('Rooftop Solar Array Phase 1');
  const [newPlantCap, setNewPlantCap] = useState<number>(5.0);
  const [newInverterSpecs, setNewInverterSpecs] = useState<string>('Growatt Dual MPPT 5kW Inverter');
  const [newCommissionDate, setNewCommissionDate] = useState<string>('2025-10-15');
  const [newConnectionMode, setNewConnectionMode] = useState<'manual' | 'api'>('manual');
  const [newManualReading, setNewManualReading] = useState<number>(24.5);

  // Calculated Solar Output
  const solarOutput = calculateSolarYield(solarKWp, 5.5, tiltAngle, shadingPercent);
  // Calculated VAWT Output
  const vawtOutput = calculateVAWTYield(windSpeedMS, vawtCapacityKW);

  const totalRenewableDaily = Number((solarOutput.dailyKWh + vawtOutput.dailyKWh).toFixed(2));
  const totalRenewableMonthly = Number((totalRenewableDaily * 30).toFixed(1));
  const monthlySavings = Math.round(totalRenewableMonthly * energyState.tariffPerKWh);

  // Add Plant Handler
  const handleRegisterPlant = (e: React.FormEvent) => {
    e.preventDefault();
    const newPlant: ConnectedPlant = {
      id: `plant_${Date.now()}`,
      plantType: newPlantType,
      name: newPlantName,
      capacityKW: Number(newPlantCap),
      inverterSpecs: newInverterSpecs,
      commissionDate: newCommissionDate,
      connectionStatus: 'Connected',
      lastUpdated: new Date().toISOString().slice(0, 10),
      isSimulatedOnly: false,
      manualReadings: [
        { date: new Date().toISOString().slice(0, 10), generationKWh: Number(newManualReading) }
      ]
    };

    const updated = {
      ...energyState,
      connectedPlants: [newPlant, ...energyState.connectedPlants]
    };
    setEnergyState(updated);
    saveUserEnergyState(updated);
    setIsConnectModalOpen(false);
  };

  const removePlant = (id: string) => {
    const updated = {
      ...energyState,
      connectedPlants: energyState.connectedPlants.filter(p => p.id !== id)
    };
    setEnergyState(updated);
    saveUserEnergyState(updated);
  };

  return (
    <div className="min-h-screen bg-[#F8F5EE] pt-24 pb-20 selection:bg-amber-500/30 selection:text-amber-950 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300">
                PROSUMER RENEWABLE ARCHITECTURE
              </span>
              <span className="text-xs font-mono text-slate-400">·</span>
              <span className="text-xs font-mono text-slate-500">
                Solar PV + Savonius-Darrieus VAWT
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-slate-950">
              Solar &amp; VAWT Renewable Energy Suite
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-sans mt-0.5">
              Plan rooftop monocrystalline PV arrays, omnidirectional urban wind turbines, and LiFePO4 battery peak shaving.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsConnectModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-mono text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Connect Energy Plant</span>
            </button>
          </div>
        </div>

        {/* Generation & Autonomous Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500">
              <span>Solar PV Generation</span>
              <Sun className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-3xl font-display font-black text-slate-950 mt-2">
              {solarOutput.dailyKWh} <span className="text-xs font-mono text-slate-500 font-bold">kWh/day</span>
            </div>
            <div className="text-xs text-slate-500 font-sans mt-1">
              Monthly estimate: ~{solarOutput.monthlyKWh} kWh ({solarKWp} kWp @ 5.5 PSH)
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500">
              <span>VAWT Wind Generation</span>
              <Wind className="w-4 h-4 text-sky-500" />
            </div>
            <div className="text-3xl font-display font-black text-slate-950 mt-2">
              {vawtOutput.dailyKWh} <span className="text-xs font-mono text-slate-500 font-bold">kWh/day</span>
            </div>
            <div className="text-xs text-slate-500 font-sans mt-1">
              Monthly estimate: ~{vawtOutput.monthlyKWh} kWh ({vawtCapacityKW} kW @ {windSpeedMS} m/s)
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500">
              <span>Clean Tariff Offset</span>
              <BatteryCharging className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-3xl font-display font-black text-emerald-600 mt-2">
              ₹{monthlySavings} <span className="text-xs font-mono text-slate-500 font-bold">/ month</span>
            </div>
            <div className="text-xs text-slate-500 font-sans mt-1">
              Estimated annual offset: ~₹{(monthlySavings * 12).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Registered Plants Management Section */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-display font-black text-slate-950">
                Registered Plant Installations &amp; Connection Status
              </h3>
              <p className="text-xs text-slate-500 font-sans">
                Real-time connection badges distinguishing manual entry, inverter APIs, and simulation models.
              </p>
            </div>
            <button
              onClick={() => setIsConnectModalOpen(true)}
              className="text-xs font-mono font-bold text-amber-700 hover:text-amber-800 cursor-pointer"
            >
              + Register Another Plant
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {energyState.connectedPlants.map(plant => (
              <div key={plant.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {plant.plantType === 'solar' ? (
                      <Sun className="w-5 h-5 text-amber-600" />
                    ) : (
                      <Wind className="w-5 h-5 text-sky-600" />
                    )}
                    <div>
                      <h4 className="text-xs font-mono font-bold text-slate-950">{plant.name}</h4>
                      <div className="text-[11px] text-slate-500 font-sans">{plant.inverterSpecs}</div>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                    plant.connectionStatus === 'Connected' 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : plant.connectionStatus === 'Setup Required'
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : 'bg-stone-100 text-stone-600 border-stone-200'
                  }`}>
                    {plant.connectionStatus}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-200 text-[11px] font-mono text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[9px]">CAPACITY</span>
                    <span className="font-bold text-slate-900">{plant.capacityKW} kW</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px]">COMMISSIONED</span>
                    <span className="font-bold text-slate-900">{plant.commissionDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px]">LAST READING</span>
                    <span className="font-bold text-emerald-700">
                      {plant.manualReadings[0]?.generationKWh || 0} kWh
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-mono text-slate-400">
                    Source: {plant.isSimulatedOnly ? 'Simulated Model' : 'Manual / Inverter Telemetry'}
                  </span>
                  <button
                    onClick={() => removePlant(plant.id)}
                    className="text-[11px] font-mono text-rose-600 hover:text-rose-800 cursor-pointer"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Forms Side-by-Side: Solar Form & VAWT Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Solar PV Planner */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-stone-100 pb-3">
              <Sun className="w-5 h-5 text-amber-500" />
              <div>
                <h3 className="text-base font-display font-black text-slate-950">
                  Rooftop Solar PV Sizing &amp; Yield Simulation
                </h3>
                <p className="text-xs text-slate-500 font-sans">
                  Calculate panel capacity based on available roof area and tilt.
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Available Roof Area (sq. ft.)</label>
                  <input
                    type="number"
                    value={solarAreaSqFt}
                    onChange={(e) => {
                      const area = Number(e.target.value);
                      setSolarAreaSqFt(area);
                      // ~80 sq. ft per kWp rule of thumb
                      setSolarKWp(Number((area / 80).toFixed(1)));
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-sans"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">Calculated Capacity (kWp)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={solarKWp}
                    onChange={(e) => setSolarKWp(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-sans font-bold text-amber-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Roof Type</label>
                  <select
                    value={roofType}
                    onChange={(e) => setRoofType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-sans"
                  >
                    <option value="flat_rcc">Flat Reinforced Concrete (RCC)</option>
                    <option value="metal_sheet">Industrial Metal Profile Sheet</option>
                    <option value="tiled">Sloped Mangalore Tile</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">Tilt Angle (°)</label>
                  <input
                    type="number"
                    value={tiltAngle}
                    onChange={(e) => setTiltAngle(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Approx. Shading / Soiling Loss: {shadingPercent}%</label>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={shadingPercent}
                  onChange={(e) => setShadingPercent(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-sans text-amber-950">
              <strong>Weather Notice:</strong> Solar yield depends strictly on local irradiance, dust cleaning frequency, inverter clipping ratio, and temperature coefficients (-0.38%/°C above 25°C).
            </div>
          </div>

          {/* VAWT Wind Turbine Planner */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-stone-100 pb-3">
              <Wind className="w-5 h-5 text-sky-500" />
              <div>
                <h3 className="text-base font-display font-black text-slate-950">
                  VAWT Wind Turbine Aerodynamic Assessment
                </h3>
                <p className="text-xs text-slate-500 font-sans">
                  Omnidirectional cut-in at 2.0 m/s with nocturnal supplement.
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Installation Height (meters)</label>
                  <input
                    type="number"
                    value={vawtHeightMeters}
                    onChange={(e) => setVawtHeightMeters(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-sans"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">Avg Rooftop Wind Speed (m/s)</label>
                  <input
                    type="number"
                    step="0.2"
                    value={windSpeedMS}
                    onChange={(e) => setWindSpeedMS(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Turbine Rated Power (kW)</label>
                <input
                  type="number"
                  step="0.2"
                  value={vawtCapacityKW}
                  onChange={(e) => setVawtCapacityKW(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-sans font-bold text-sky-700"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-100 text-xs font-sans text-slate-700 space-y-1">
                <strong>Structural &amp; Safety Considerations:</strong>
                <p className="text-[11px] text-slate-600">
                  Urban VAWTs experience localized boundary layer turbulence and parapet vortex shedding. Ensure vibration-dampening neoprene mounts and verify roof structural slab moment loading before mechanical anchor drilling.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ============================================================== */}
      {/* MODAL: CONNECT ENERGY PLANT                                    */}
      {/* ============================================================== */}
      {isConnectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border-2 border-stone-200 shadow-2xl">
            <h3 className="text-lg font-display font-bold text-slate-950 mb-1">Register &amp; Connect Energy Plant</h3>
            <p className="text-xs text-slate-600 mb-4 font-sans">
              Connect existing rooftop solar, VAWT, or battery inverter telemetry to UrjaSaathi AI.
            </p>

            <form onSubmit={handleRegisterPlant} className="space-y-3 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 uppercase mb-1">Plant Type</label>
                  <select
                    value={newPlantType}
                    onChange={(e) => setNewPlantType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-sans text-sm"
                  >
                    <option value="solar">Rooftop Solar PV</option>
                    <option value="vawt">Vertical-Axis Wind Turbine (VAWT)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-800 uppercase mb-1">Rated Capacity (kW)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newPlantCap}
                    onChange={(e) => setNewPlantCap(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-sans text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 uppercase mb-1">Plant Name / Label</label>
                <input
                  type="text"
                  value={newPlantName}
                  onChange={(e) => setNewPlantName(e.target.value)}
                  placeholder="e.g. South Terrace Monocrystalline String"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-sans text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 uppercase mb-1">Inverter / Controller Specifications</label>
                <input
                  type="text"
                  value={newInverterSpecs}
                  onChange={(e) => setNewInverterSpecs(e.target.value)}
                  placeholder="e.g. Solis 5G Dual MPPT, Growatt SPF 5000"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-sans text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 uppercase mb-1">Commissioning Date</label>
                  <input
                    type="date"
                    value={newCommissionDate}
                    onChange={(e) => setNewCommissionDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-sans text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 uppercase mb-1">Latest Reading (kWh)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newManualReading}
                    onChange={(e) => setNewManualReading(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-sans text-sm"
                    required
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-[11px] font-sans text-amber-950">
                <strong>Connection Mode:</strong> Direct Modbus/RS485 and Cloud Inverter API gateways are supported. If no IoT gateway is present, manual reading logging operates offline without cloud lock-in.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsConnectModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-950 text-white font-bold cursor-pointer"
                >
                  Register &amp; Connect Plant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

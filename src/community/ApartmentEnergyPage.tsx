import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Zap, 
  Sun, 
  Wind, 
  BatteryCharging, 
  TrendingUp, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle2, 
  Layers, 
  FileText,
  DollarSign,
  Plus
} from 'lucide-react';
import { getStoredUser } from '../auth/authStore';
import { 
  generate40FlatsDataset, 
  generateSeedP2PTrades, 
  COMMON_BUILDING_LOADS, 
  TARIFFS, 
  FlatRecord, 
  P2PTrade 
} from '../data/energyEngine';

interface ApartmentEnergyPageProps {
  onNavigate: (view: string) => void;
}

export const ApartmentEnergyPage: React.FC<ApartmentEnergyPageProps> = ({ onNavigate }) => {
  const currentUser = getStoredUser();
  const [flats, setFlats] = useState<FlatRecord[]>(() => generate40FlatsDataset());
  const [trades, setTrades] = useState<P2PTrade[]>(() => generateSeedP2PTrades());
  const [selectedFlatId, setSelectedFlatId] = useState<string>('Flat 101');
  const [filterCategory, setFilterCategory] = useState<'all' | 'prosumer' | 'deficit' | 'eco_saver'>('all');
  const [floorFilter, setFloorFilter] = useState<number | 'all'>('all');
  const [isClearing, setIsClearing] = useState<boolean>(false);

  // Society Registration Modal
  const [isSocModalOpen, setIsSocModalOpen] = useState<boolean>(false);
  const [socName, setSocName] = useState<string>('Green Meadows Co-op Housing Society');
  const [totalFlatsCount, setTotalFlatsCount] = useState<number>(40);
  const [commonSolarKWp, setCommonSolarKWp] = useState<number>(35.0);
  const [commonVAWTKW, setCommonVAWTKW] = useState<number>(12.0);
  const [commonBatteryKWh, setCommonBatteryKWh] = useState<number>(40.0);

  // Aggregates
  const totalComplexConsumption = flats.reduce((acc, f) => acc + f.dailyConsumptionKWh, 0);
  const totalComplexGeneration = flats.reduce((acc, f) => acc + f.terraceSolarKWh + f.terraceWindKWh, 0);
  const commonLoadsSum = COMMON_BUILDING_LOADS.reduce((acc, c) => acc + c.dailyKWh, 0);
  const grossSocietyLoad = totalComplexConsumption + commonLoadsSum;
  const netSocietyGridBalance = Number((totalComplexGeneration - grossSocietyLoad).toFixed(1));
  const renewableRatio = Math.round((totalComplexGeneration / grossSocietyLoad) * 100);

  const selectedFlat = flats.find(f => f.flatId === selectedFlatId) || flats[0];

  // Filtered flats list
  const filteredFlats = flats.filter(f => {
    if (filterCategory !== 'all' && f.category !== filterCategory) return false;
    if (floorFilter !== 'all' && f.floor !== floorFilter) return false;
    return true;
  });

  // Execute Simulated P2P Clearing Round
  const handleExecuteP2PClearing = () => {
    setIsClearing(true);
    setTimeout(() => {
      const prosumers = flats.filter(f => f.category === 'prosumer');
      const deficits = flats.filter(f => f.category === 'deficit');
      const seller = prosumers[Math.floor(Math.random() * prosumers.length)];
      const buyer = deficits[Math.floor(Math.random() * deficits.length)];
      const kwh = Number((2.8 + Math.random() * 4.2).toFixed(1));
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

      setTrades(prev => [newTrade, ...prev.slice(0, 14)]);
      setIsClearing(false);
    }, 450);
  };

  return (
    <div className="min-h-screen bg-[#F8F5EE] pt-24 pb-20 selection:bg-amber-500/30 selection:text-amber-950 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300">
                MULTI-TENANT COMMUNITY ARCHITECTURE
              </span>
              <span className="text-xs font-mono text-slate-400">·</span>
              <span className="text-xs font-mono text-slate-500">
                N = 40 Flats Microgrid Cluster
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-slate-950">
              Apartment &amp; Community Energy Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-sans mt-0.5">
              Aggregate common building loads, shared rooftop solar/VAWT capacity, and peer-to-peer energy clearing ledger.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSocModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-mono text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>Society Profile &amp; Capacity</span>
            </button>
          </div>
        </div>

        {/* 4 Community Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
            <span className="text-xs font-mono text-slate-500 uppercase">Gross Society Demand</span>
            <div className="text-3xl font-display font-black text-slate-950 mt-1">
              {grossSocietyLoad.toFixed(1)} <span className="text-xs font-mono text-slate-500 font-bold">kWh/day</span>
            </div>
            <div className="text-[11px] text-slate-500 font-sans mt-0.5">
              40 flats ({totalComplexConsumption.toFixed(1)} kWh) + common loads ({commonLoadsSum} kWh)
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
            <span className="text-xs font-mono text-slate-500 uppercase">Shared Clean Generation</span>
            <div className="text-3xl font-display font-black text-amber-600 mt-1">
              {totalComplexGeneration.toFixed(1)} <span className="text-xs font-mono text-slate-500 font-bold">kWh/day</span>
            </div>
            <div className="text-[11px] text-slate-500 font-sans mt-0.5">
              Rooftop Solar ({commonSolarKWp} kWp) + VAWT Wind ({commonVAWTKW} kW)
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
            <span className="text-xs font-mono text-slate-500 uppercase">Renewable Sufficiency</span>
            <div className="text-3xl font-display font-black text-emerald-600 mt-1">
              {renewableRatio}%
            </div>
            <div className="text-[11px] text-slate-500 font-sans mt-0.5">
              Net balance: {netSocietyGridBalance} kWh/day imported from DISCOM
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
            <span className="text-xs font-mono text-slate-500 uppercase">P2P Tariff Arbitrage</span>
            <div className="text-3xl font-display font-black text-slate-950 mt-1">
              ₹6.20 <span className="text-xs font-mono text-slate-500 font-bold">/ kWh</span>
            </div>
            <div className="text-[11px] text-slate-500 font-sans mt-0.5">
              vs DISCOM grid import ₹8.85 &amp; net export ₹3.10
            </div>
          </div>
        </div>

        {/* Regulatory & Legal Disclaimer */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-xs font-sans text-amber-950 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong>Regulatory &amp; Legal Compliance Notice:</strong>
            <p className="text-[11px] text-amber-900 mt-0.5">
              Peer-to-peer (P2P) electricity clearing models calculated here represent virtual internal settlement allocations. Physical export, billing offset, and cross-subsidies require explicit State Electricity Regulatory Commission (SERC) guidelines, DISCOM sandbox permissions, and bi-directional smart metering infrastructure.
            </p>
          </div>
        </div>

        {/* 40-Flat Complex & Common Loads Side-by-Side */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: 40-Flat Interactive Directory */}
          <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-display font-black text-slate-950">
                  40-Flat Tenant Load Directory &amp; Roles
                </h3>
                <p className="text-xs text-slate-500 font-sans">
                  Select any flat to inspect individual load profiles and trading role.
                </p>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-1.5 text-xs font-mono">
                {(['all', 'prosumer', 'deficit', 'eco_saver'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg capitalize transition-colors cursor-pointer ${
                      filterCategory === cat 
                        ? 'bg-slate-950 text-white font-bold' 
                        : 'bg-stone-100 text-slate-700 hover:bg-stone-200'
                    }`}
                  >
                    {cat.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Flat Grid Matrix */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {filteredFlats.map(flat => {
                const isSelected = flat.flatId === selectedFlatId;
                return (
                  <button
                    key={flat.flatId}
                    onClick={() => setSelectedFlatId(flat.flatId)}
                    className={`p-2 rounded-xl text-center transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 border-amber-600 font-bold shadow-xs'
                        : flat.category === 'prosumer'
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:border-emerald-400'
                        : flat.category === 'deficit'
                        ? 'bg-rose-50 text-rose-900 border-rose-200 hover:border-rose-400'
                        : 'bg-stone-50 text-slate-700 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <div className="text-[11px] font-mono font-bold leading-tight">{flat.flatId.replace('Flat ', '')}</div>
                    <div className="text-[9px] font-mono opacity-80 mt-0.5">{flat.dailyConsumptionKWh}k</div>
                  </button>
                );
              })}
            </div>

            {/* Selected Flat Card */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-mono font-bold text-slate-950">
                    {selectedFlat.flatId} · {selectedFlat.residentName} ({selectedFlat.flatType})
                  </h4>
                  <p className="text-[11px] text-slate-500 font-sans">
                    Category: <b className="capitalize">{selectedFlat.category.replace('_', ' ')}</b> · Trading Role: <b className="uppercase">{selectedFlat.p2pTradingRole}</b>
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white border border-stone-300">
                  Floor {selectedFlat.floor}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-stone-200 text-[11px] font-mono text-slate-600">
                <div>
                  <span className="text-slate-400 block text-[9px]">DAILY DRAW</span>
                  <span className="font-bold text-slate-900">{selectedFlat.dailyConsumptionKWh} kWh</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px]">SOLAR ALLOC</span>
                  <span className="font-bold text-amber-700">{selectedFlat.terraceSolarKWh} kWh</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px]">NET BALANCE</span>
                  <span className={`font-bold ${selectedFlat.netDailyBalanceKWh >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {selectedFlat.netDailyBalanceKWh > 0 ? `+${selectedFlat.netDailyBalanceKWh}` : selectedFlat.netDailyBalanceKWh} kWh
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px]">TODAY SAVINGS</span>
                  <span className="font-bold text-emerald-700">₹{selectedFlat.savingsTodayRupees}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Col: Common Building Infrastructure Loads */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <h3 className="text-sm font-mono font-bold text-slate-900 uppercase tracking-wider">
              Common Building Loads ({commonLoadsSum} kWh/day)
            </h3>

            <div className="space-y-2.5">
              {COMMON_BUILDING_LOADS.map(load => (
                <div key={load.id} className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs font-mono">
                  <div>
                    <div className="font-bold text-slate-900">{load.name}</div>
                    <div className="text-[10px] text-slate-500 font-sans">{load.operatingHoursDaily} hrs/day operation</div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900">{load.dailyKWh} kWh</span>
                    <span className="text-[10px] text-slate-400 block">/ day</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-2xl bg-stone-100 text-[11px] font-sans text-slate-600">
              Common infrastructure draws ~{(commonLoadsSum * 30).toLocaleString()} kWh/month, offset by shared terrace solar &amp; VAWT generation before individual flat distribution.
            </div>
          </div>

        </div>

        {/* P2P Trading Ledger & Settlement Engine */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-display font-black text-slate-950">
                Central Headquarters P2P Energy Trading Ledger
              </h3>
              <p className="text-xs text-slate-500 font-sans">
                Internal double-auction clearing where prosumer flats with battery surplus sell directly to deficit flats.
              </p>
            </div>

            <button
              onClick={handleExecuteP2PClearing}
              disabled={isClearing}
              className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{isClearing ? 'Clearing Round...' : 'Simulate P2P Trade Round'}</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-stone-200 text-slate-400 uppercase text-[10px]">
                  <th className="py-2.5 px-3">Transaction ID</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Seller (Prosumer)</th>
                  <th className="py-2.5 px-3">Buyer (Deficit)</th>
                  <th className="py-2.5 px-3">Traded Energy</th>
                  <th className="py-2.5 px-3">Clearing Rate</th>
                  <th className="py-2.5 px-3">Settlement Amount</th>
                  <th className="py-2.5 px-3 text-right">Buyer Savings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {trades.slice(0, 8).map(trade => (
                  <tr key={trade.tradeId} className="hover:bg-stone-50/80">
                    <td className="py-2.5 px-3 font-bold text-slate-900">{trade.tradeId}</td>
                    <td className="py-2.5 px-3 text-slate-500">{trade.timestamp}</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-bold">{trade.sellerFlatId}</td>
                    <td className="py-2.5 px-3 text-sky-700 font-bold">{trade.buyerFlatId}</td>
                    <td className="py-2.5 px-3 font-bold">{trade.energyKWh} kWh</td>
                    <td className="py-2.5 px-3 text-slate-600">₹{trade.ratePerKWh}/kWh</td>
                    <td className="py-2.5 px-3 font-bold text-slate-950">₹{trade.totalAmountRupees}</td>
                    <td className="py-2.5 px-3 text-right text-emerald-700 font-bold">₹{trade.buyerSavingsRupees}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

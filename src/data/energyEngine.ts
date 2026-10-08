/**
 * UrjaSaathi AI - Core Mathematical Engine & Data Architecture
 * 
 * Mathematical Models:
 * 1. Appliance Load & Thermal Envelope Modeling:
 *    Daily Energy (kWh) = [Power (W) * Hours Daily / 1000] * TLC
 *    TLC = f(Envelope Material, Ambient Temp Delta, Floor Position)
 * 2. Solar PV Modeling:
 *    Daily Yield (kWh) = Area * Eta_pv * Irradiance * PR * (1 - Soiling)
 * 3. VAWT (Vertical-Axis Wind Turbine) Aerodynamic Power Curve:
 *    P_wind (W) = 0.5 * rho * A_swept * v^3 * Cp
 * 4. LiFePO4 Battery Bank Round-Trip Efficiency & SoC Management:
 *    SoC(t+1) = SoC(t) + [P_in * Eta_ch - P_out / Eta_dis] * dt / Capacity
 * 5. 40-Flat Multi-Tenant Complex & Central HQ P2P Trading Ledger
 */

export interface Appliance {
  id: string;
  name: string;
  category: 'mandatory' | 'discretionary';
  ratedWatts: number;
  standbyWatts: number;
  defaultHoursDaily: number;
  starRating: 1 | 2 | 3 | 4 | 5;
  icon: string;
  description: string;
  seasonalSurge: 'summer' | 'winter' | 'monsoon' | 'neutral';
  thermalCoupled?: boolean;
}

export interface BuildingMaterial {
  id: string;
  name: string;
  uValue: number; // W/m²K (Heat transfer coefficient)
  thermalLagHours: number;
  coolingLoadMultiplier: number;
  description: string;
}

export interface WeatherCondition {
  id: string;
  season: string;
  ambientTemp: number; // °C
  avgWindSpeed: number; // m/s
  solarIrradiance: number; // kWh/m²/day
  humidity: number; // %
}

export interface FlatRecord {
  flatId: string;
  floor: number;
  flatType: '1BHK' | '2BHK' | '3BHK' | '4BHK' | 'Penthouse';
  residentName: string;
  category: 'prosumer' | 'deficit' | 'balanced' | 'eco_saver';
  applianceCount: number;
  dailyConsumptionKWh: number;
  terraceSolarKWh: number;
  terraceWindKWh: number;
  batteryCapacityKWh: number;
  currentSoCPercent: number;
  netDailyBalanceKWh: number; // Generation - Consumption
  p2pTradingRole: 'seller' | 'buyer' | 'neutral';
  p2pTradedTodayKWh: number;
  savingsTodayRupees: number;
}

export interface P2PTrade {
  tradeId: string;
  timestamp: string;
  sellerFlatId: string;
  buyerFlatId: string;
  energyKWh: number;
  ratePerKWh: number;
  totalAmountRupees: number;
  buyerSavingsRupees: number;
  sellerGainRupees: number;
  status: 'settled' | 'clearing';
}

// -------------------------------------------------------------
// STANDARD APPLIANCE INVENTORY
// -------------------------------------------------------------
export const STANDARD_APPLIANCES: Appliance[] = [
  {
    id: 'ac_split',
    name: '1.5-Ton Inverter AC',
    category: 'discretionary',
    ratedWatts: 1450,
    standbyWatts: 6,
    defaultHoursDaily: 7.5,
    starRating: 5,
    icon: 'Wind',
    description: 'High-surge thermal load; heavily affected by envelope U-value and outdoor heat index.',
    seasonalSurge: 'summer',
    thermalCoupled: true,
  },
  {
    id: 'geyser_storage',
    name: '25L Storage Water Geyser',
    category: 'discretionary',
    ratedWatts: 2000,
    standbyWatts: 2,
    defaultHoursDaily: 1.2,
    starRating: 4,
    icon: 'Flame',
    description: 'Rapid high-wattage water heating; operates during morning peak grid hours.',
    seasonalSurge: 'winter',
    thermalCoupled: true,
  },
  {
    id: 'refrigerator_frost_free',
    name: '320L Frost-Free Refrigerator',
    category: 'mandatory',
    ratedWatts: 180,
    standbyWatts: 3,
    defaultHoursDaily: 24,
    starRating: 4,
    icon: 'Refrigerator',
    description: 'Continuous 24/7 baseline compressor cooling with periodic defrost cycles.',
    seasonalSurge: 'summer',
    thermalCoupled: false,
  },
  {
    id: 'washing_machine',
    name: '7kg Front-Load Washing Machine',
    category: 'discretionary',
    ratedWatts: 650,
    standbyWatts: 4,
    defaultHoursDaily: 1.0,
    starRating: 5,
    icon: 'RotateCw',
    description: 'Intermittent motor and heating cycle load; shiftable to solar peak hours.',
    seasonalSurge: 'neutral',
    thermalCoupled: false,
  },
  {
    id: 'mixer_grinder',
    name: '750W Heavy Mixer Grinder',
    category: 'discretionary',
    ratedWatts: 750,
    standbyWatts: 1,
    defaultHoursDaily: 0.4,
    starRating: 3,
    icon: 'Zap',
    description: 'Short-duration culinary motor pulse load.',
    seasonalSurge: 'neutral',
    thermalCoupled: false,
  },
  {
    id: 'laptops_workstations',
    name: 'Home Office Workstations (2x)',
    category: 'mandatory',
    ratedWatts: 130,
    standbyWatts: 8,
    defaultHoursDaily: 9.0,
    starRating: 5,
    icon: 'Laptop',
    description: 'Dual laptops, external monitors, and peripherals with notable phantom charger draw.',
    seasonalSurge: 'neutral',
    thermalCoupled: false,
  },
  {
    id: 'smart_tv_55',
    name: '55" 4K Smart OLED TV & Soundbar',
    category: 'discretionary',
    ratedWatts: 140,
    standbyWatts: 11,
    defaultHoursDaily: 4.5,
    starRating: 4,
    icon: 'Tv',
    description: 'Evening entertainment load with continuous standby vampire draw.',
    seasonalSurge: 'neutral',
    thermalCoupled: false,
  },
  {
    id: 'ceiling_fans',
    name: 'BLDC Energy-Saving Fans (4x)',
    category: 'mandatory',
    ratedWatts: 112, // 28W x 4
    standbyWatts: 2,
    defaultHoursDaily: 14.0,
    starRating: 5,
    icon: 'Fan',
    description: 'Continuous air circulation; BLDC motors save 62% over traditional induction fans.',
    seasonalSurge: 'summer',
    thermalCoupled: false,
  },
  {
    id: 'led_lighting',
    name: 'High-Efficiency LED Fixtures (12x)',
    category: 'mandatory',
    ratedWatts: 108, // 9W x 12
    standbyWatts: 0,
    defaultHoursDaily: 6.0,
    starRating: 5,
    icon: 'Lightbulb',
    description: 'Distributed ambient and task illumination across living rooms and bedrooms.',
    seasonalSurge: 'neutral',
    thermalCoupled: false,
  },
  {
    id: 'microwave_oven',
    name: 'Convection Microwave Oven',
    category: 'discretionary',
    ratedWatts: 1200,
    standbyWatts: 5,
    defaultHoursDaily: 0.5,
    starRating: 3,
    icon: 'Microwave',
    description: 'High power culinary reheating with continuous digital clock standby drain.',
    seasonalSurge: 'neutral',
    thermalCoupled: false,
  },
  {
    id: 'ro_water_purifier',
    name: 'RO + UV Water Purifier',
    category: 'mandatory',
    ratedWatts: 60,
    standbyWatts: 4,
    defaultHoursDaily: 2.5,
    starRating: 4,
    icon: 'Droplets',
    description: 'Membrane filtration pump and UV disinfection chamber.',
    seasonalSurge: 'neutral',
    thermalCoupled: false,
  },
  {
    id: 'ev_scooter_charger',
    name: 'EV Two-Wheeler Home Charger',
    category: 'discretionary',
    ratedWatts: 750,
    standbyWatts: 3,
    defaultHoursDaily: 3.5,
    starRating: 5,
    icon: 'BatteryCharging',
    description: 'Night or midday prosumer battery top-up (approx 2.6 kWh pack).',
    seasonalSurge: 'neutral',
    thermalCoupled: false,
  },
];

// -------------------------------------------------------------
// STRUCTURAL BUILDING MATERIALS & THERMAL ENVELOPES
// -------------------------------------------------------------
export const BUILDING_MATERIALS: BuildingMaterial[] = [
  {
    id: 'reinforced_concrete',
    name: 'Reinforced Concrete (Standard Indian High-Rise)',
    uValue: 2.85,
    thermalLagHours: 5.5,
    coolingLoadMultiplier: 1.18,
    description: 'High thermal mass; absorbs tropical solar heat during noon and re-radiates it inward throughout warm evenings.',
  },
  {
    id: 'glass_curtain_wall',
    name: 'Large Glass Facade / Window Envelope (Single Glazed)',
    uValue: 5.70,
    thermalLagHours: 0.8,
    coolingLoadMultiplier: 1.48,
    description: 'Severe solar heat gain coefficient (SHGC); forces AC compressors to work 48% harder due to continuous thermal transmission.',
  },
  {
    id: 'brick_masonry',
    name: 'Clay Brick Masonry Wall (230mm Plastered)',
    uValue: 1.95,
    thermalLagHours: 7.2,
    coolingLoadMultiplier: 1.05,
    description: 'Balanced traditional masonry thermal resistance with moderate daytime heat ingress.',
  },
  {
    id: 'insulated_cavity',
    name: 'AAC Lightweight Blocks with Cavity Insulation',
    uValue: 0.82,
    thermalLagHours: 11.0,
    coolingLoadMultiplier: 0.88,
    description: 'High-performance eco-envelope; reduces conditioned cooling losses by 12% below standard baselines.',
  },
];

// -------------------------------------------------------------
// WEATHER & CLIMATE SCENARIOS
// -------------------------------------------------------------
export const WEATHER_SCENARIOS: WeatherCondition[] = [
  {
    id: 'peak_summer',
    season: 'Peak Summer (May - June)',
    ambientTemp: 39.5,
    avgWindSpeed: 4.8,
    solarIrradiance: 5.85, // kWh/m²/day
    humidity: 58,
  },
  {
    id: 'monsoon_humid',
    season: 'Monsoon Gusts (July - August)',
    ambientTemp: 31.0,
    avgWindSpeed: 7.2, // High coastal gusts for VAWT
    solarIrradiance: 3.40,
    humidity: 88,
  },
  {
    id: 'mild_autumn',
    season: 'Post-Monsoon Autumn (October)',
    ambientTemp: 32.5,
    avgWindSpeed: 4.2,
    solarIrradiance: 5.10,
    humidity: 62,
  },
  {
    id: 'cool_winter',
    season: 'Mild Winter (December - January)',
    ambientTemp: 21.0,
    avgWindSpeed: 3.6,
    solarIrradiance: 4.75,
    humidity: 45,
  },
];

// -------------------------------------------------------------
// TARIFF CONSTANTS (INR)
// -------------------------------------------------------------
export const TARIFFS = {
  utilityGridImport: 8.85, // ₹/kWh charged by DISCOM utility
  utilityGridExport: 3.10, // ₹/kWh feed-in net metering tariff (low compensation)
  p2pInternalMarketRate: 6.20, // ₹/kWh fair trade clearing price
  prosumerNetProfitBonus: 3.10, // ₹/kWh extra profit prosumer earns vs selling to grid (6.20 - 3.10 = +₹3.10/kWh, +100%!)
  consumerSavingsMargin: 2.65, // ₹/kWh savings buyer achieves vs buying from grid (8.85 - 6.20 = -₹2.65/kWh, -30%!)
};

// -------------------------------------------------------------
// 40 FLATS SEED DATASET (4 FLOORS x 10 FLATS)
// -------------------------------------------------------------
export function generate40FlatsDataset(): FlatRecord[] {
  const flats: FlatRecord[] = [];
  const prosumerFlatNumbers = [101, 104, 201, 205, 208, 302, 307, 401, 405, 410];
  const ecoSaverFlatNumbers = [103, 107, 204, 209, 305, 309, 403, 408];

  for (let floor = 1; floor <= 4; floor++) {
    for (let unit = 1; unit <= 10; unit++) {
      const flatNum = floor * 100 + unit;
      const flatId = `Flat ${flatNum}`;
      const isProsumer = prosumerFlatNumbers.includes(flatNum);
      const isEcoSaver = ecoSaverFlatNumbers.includes(flatNum);

      let flatType: FlatRecord['flatType'] = '2BHK';
      if (unit === 1 || unit === 10) flatType = floor === 4 ? 'Penthouse' : '3BHK';
      else if (unit <= 3) flatType = '2BHK';
      else if (unit <= 7) flatType = '3BHK';
      else flatType = '1BHK';

      let category: FlatRecord['category'] = 'deficit';
      if (isProsumer) category = 'prosumer';
      else if (isEcoSaver) category = 'eco_saver';
      else category = 'deficit';

      // Base consumption calculation
      let dailyConsumption = 14.2;
      if (flatType === '1BHK') dailyConsumption = 8.5;
      if (flatType === '2BHK') dailyConsumption = 13.8;
      if (flatType === '3BHK') dailyConsumption = 21.4;
      if (flatType === 'Penthouse') dailyConsumption = 29.6;

      if (isEcoSaver) dailyConsumption *= 0.68;
      if (category === 'deficit' && !isEcoSaver) dailyConsumption *= 1.15;

      // Generation for prosumers (Terrace Solar + VAWT + Battery)
      let terraceSolar = 0;
      let terraceWind = 0;
      let batteryCap = 0;
      let currentSoC = 50;

      if (isProsumer) {
        // Flat 401 & 410 (Penthouse/Top Floor) have larger allocated arrays
        const isTopFloor = floor === 4;
        terraceSolar = isTopFloor ? 28.5 : 18.2;
        terraceWind = isTopFloor ? 8.6 : 5.4;
        batteryCap = isTopFloor ? 10.24 : 5.12;
        currentSoC = Math.round(68 + (unit % 4) * 6);
      }

      const totalGen = terraceSolar + terraceWind;
      const netBalance = Number((totalGen - dailyConsumption).toFixed(2));

      let p2pRole: FlatRecord['p2pTradingRole'] = 'neutral';
      let p2pTraded = 0;
      let savingsRupees = 0;

      if (netBalance > 2) {
        p2pRole = 'seller';
        p2pTraded = Number((netBalance * 0.72).toFixed(2));
        savingsRupees = Number((p2pTraded * TARIFFS.prosumerNetProfitBonus).toFixed(1));
      } else if (netBalance < -2) {
        p2pRole = 'buyer';
        p2pTraded = Number((Math.min(Math.abs(netBalance), 12.0) * 0.85).toFixed(2));
        savingsRupees = Number((p2pTraded * TARIFFS.consumerSavingsMargin).toFixed(1));
      }

      flats.push({
        flatId,
        floor,
        flatType,
        residentName: `Tenant ${flatNum}`,
        category,
        applianceCount: Math.round(9 + (unit % 5) * 2),
        dailyConsumptionKWh: Number(dailyConsumption.toFixed(2)),
        terraceSolarKWh: Number(terraceSolar.toFixed(2)),
        terraceWindKWh: Number(terraceWind.toFixed(2)),
        batteryCapacityKWh: batteryCap,
        currentSoCPercent: currentSoC,
        netDailyBalanceKWh: netBalance,
        p2pTradingRole: p2pRole,
        p2pTradedTodayKWh: p2pTraded,
        savingsTodayRupees: savingsRupees,
      });
    }
  }

  return flats;
}

// -------------------------------------------------------------
// COMMON BUILDING UTILITY LOADS
// -------------------------------------------------------------
export const COMMON_BUILDING_LOADS = [
  {
    id: 'lifts_passenger',
    name: '2x High-Speed Passenger Elevators (V3F Drives)',
    dailyKWh: 22.4,
    powerKW: 9.5,
    hoursOperating: 18,
    description: 'Variable frequency regenerative drive lifts serving 4 floors.',
  },
  {
    id: 'water_pumps_stp',
    name: 'Hydro-Pneumatic Booster Pumps & Sewage Treatment (STP)',
    dailyKWh: 16.8,
    powerKW: 5.5,
    hoursOperating: 5.5,
    description: 'Dual multi-stage domestic water booster and automated greywater aeration.',
  },
  {
    id: 'security_corridor_lighting',
    name: 'Corridor, Stairwell & Compound Perimeter LEDs',
    dailyKWh: 8.6,
    powerKW: 1.2,
    hoursOperating: 12,
    description: 'Dusk-to-dawn automated smart PIR motion sensing illumination.',
  },
  {
    id: 'ev_community_chargers',
    name: 'Shared Community EV Level-2 Fast Charger Hub',
    dailyKWh: 18.2,
    powerKW: 7.2,
    hoursOperating: 4.5,
    description: 'Shared residential charging bank for tenant two-wheelers and sedans.',
  },
];

// -------------------------------------------------------------
// SEED P2P TRADING TRANSACTIONS (CENTRAL HQ LEDGER)
// -------------------------------------------------------------
export function generateSeedP2PTrades(): P2PTrade[] {
  return [
    {
      tradeId: 'TX-2026-9041',
      timestamp: '14:22:10 IST',
      sellerFlatId: 'Flat 401',
      buyerFlatId: 'Flat 102',
      energyKWh: 4.8,
      ratePerKWh: 6.20,
      totalAmountRupees: 29.76,
      buyerSavingsRupees: 12.72,
      sellerGainRupees: 14.88,
      status: 'settled',
    },
    {
      tradeId: 'TX-2026-9042',
      timestamp: '14:26:45 IST',
      sellerFlatId: 'Flat 410',
      buyerFlatId: 'Flat 206',
      energyKWh: 6.2,
      ratePerKWh: 6.20,
      totalAmountRupees: 38.44,
      buyerSavingsRupees: 16.43,
      sellerGainRupees: 19.22,
      status: 'settled',
    },
    {
      tradeId: 'TX-2026-9043',
      timestamp: '14:31:18 IST',
      sellerFlatId: 'Flat 205',
      buyerFlatId: 'Flat 304',
      energyKWh: 3.5,
      ratePerKWh: 6.20,
      totalAmountRupees: 21.70,
      buyerSavingsRupees: 9.28,
      sellerGainRupees: 10.85,
      status: 'settled',
    },
    {
      tradeId: 'TX-2026-9044',
      timestamp: '14:38:02 IST',
      sellerFlatId: 'Flat 104',
      buyerFlatId: 'Flat 406',
      energyKWh: 5.1,
      ratePerKWh: 6.20,
      totalAmountRupees: 31.62,
      buyerSavingsRupees: 13.52,
      sellerGainRupees: 15.81,
      status: 'settled',
    },
    {
      tradeId: 'TX-2026-9045',
      timestamp: '14:44:50 IST',
      sellerFlatId: 'Flat 302',
      buyerFlatId: 'Flat 108',
      energyKWh: 4.0,
      ratePerKWh: 6.20,
      totalAmountRupees: 24.80,
      buyerSavingsRupees: 10.60,
      sellerGainRupees: 12.40,
      status: 'settled',
    },
    {
      tradeId: 'TX-2026-9046',
      timestamp: '14:51:33 IST',
      sellerFlatId: 'Flat 405',
      buyerFlatId: 'Flat 202',
      energyKWh: 5.5,
      ratePerKWh: 6.20,
      totalAmountRupees: 34.10,
      buyerSavingsRupees: 14.58,
      sellerGainRupees: 17.05,
      status: 'settled',
    },
  ];
}

// -------------------------------------------------------------
// COMPUTATION ALGORITHMS
// -------------------------------------------------------------

/**
 * Computes Thermal Loss Coefficient (TLC) based on envelope material and delta T
 */
export function calculateTLC(
  material: BuildingMaterial,
  ambientTemp: number,
  setpointTemp: number = 24.0,
  floorLevel: 'top' | 'middle' | 'ground' = 'middle'
): number {
  const deltaT = Math.max(0, ambientTemp - setpointTemp);
  // Base scaling: deltaT = 15°C (39°C vs 24°C) gives full design delta
  const tempFactor = 1.0 + (deltaT / 15.0) * 0.25;
  const floorFactor = floorLevel === 'top' ? 1.18 : floorLevel === 'ground' ? 0.94 : 1.0;
  
  return Number((material.coolingLoadMultiplier * tempFactor * floorFactor).toFixed(3));
}

/**
 * Calculates Solar PV Daily Yield (kWh)
 */
export function calculateSolarYield(
  installedKWp: number,
  irradianceKWhM2: number,
  tiltAngleDeg: number = 20,
  soilingPercent: number = 5,
  inverterEfficiency: number = 0.96
): {
  dailyKWh: number;
  monthlyKWh: number;
  soilingLossKWh: number;
  optimalTiltBonusPercent: number;
} {
  // Optimal tilt for central India is roughly 18° to 22°
  const tiltDeviation = Math.abs(tiltAngleDeg - 20);
  const tiltEfficiency = Math.max(0.85, 1.0 - (tiltDeviation * 0.007));
  const performanceRatio = 0.80 * inverterEfficiency * tiltEfficiency;

  const grossDaily = installedKWp * irradianceKWhM2 * performanceRatio;
  const netDaily = grossDaily * (1 - soilingPercent / 100);
  const soilingLoss = grossDaily - netDaily;

  return {
    dailyKWh: Number(netDaily.toFixed(2)),
    monthlyKWh: Number((netDaily * 30).toFixed(1)),
    soilingLossKWh: Number(soilingLoss.toFixed(2)),
    optimalTiltBonusPercent: Number(((tiltEfficiency - 0.85) * 100).toFixed(1)),
  };
}

/**
 * Calculates VAWT (Vertical-Axis Wind Turbine) Yield
 * Formula: P = 0.5 * rho * A_swept * v^3 * Cp
 */
export function calculateVAWTYield(
  windSpeedMS: number,
  sweptAreaM2: number = 2.4, // standard rooftop Savonius/Darrieus hybrid
  cutInSpeed: number = 2.0,
  cutOutSpeed: number = 18.0,
  cp: number = 0.32, // Power coefficient for rooftop VAWT
  hoursDaily: number = 18 // Typical breezy operational hours
): {
  instantWatts: number;
  dailyKWh: number;
  monthlyKWh: number;
  operatingState: 'idle_sub_cutin' | 'generating' | 'storm_cutout';
} {
  const airDensity = 1.225; // kg/m³

  if (windSpeedMS < cutInSpeed) {
    return { instantWatts: 0, dailyKWh: 0, monthlyKWh: 0, operatingState: 'idle_sub_cutin' };
  }
  if (windSpeedMS > cutOutSpeed) {
    return { instantWatts: 0, dailyKWh: 0, monthlyKWh: 0, operatingState: 'storm_cutout' };
  }

  // Aerodynamic power (W)
  const powerWatts = 0.5 * airDensity * sweptAreaM2 * Math.pow(windSpeedMS, 3) * cp;
  const mechanicalTransmissionEff = 0.92;
  const electricalGenEff = 0.88;
  const netWatts = powerWatts * mechanicalTransmissionEff * electricalGenEff;

  const dailyKWh = (netWatts * hoursDaily) / 1000;

  return {
    instantWatts: Math.round(netWatts),
    dailyKWh: Number(dailyKWh.toFixed(2)),
    monthlyKWh: Number((dailyKWh * 30).toFixed(1)),
    operatingState: 'generating',
  };
}

/**
 * Calculates Standby / Vampire Power Audit
 */
export function calculateStandbyAudit(appliances: Appliance[]): {
  standbyTotalWatts: number;
  standbyDailyKWh: number;
  standbyMonthlyKWh: number;
  standbyMonthlyCostRupees: number;
} {
  const totalStandbyWatts = appliances.reduce((sum, app) => sum + app.standbyWatts, 0);
  const standbyDailyKWh = (totalStandbyWatts * 24) / 1000;
  const standbyMonthlyKWh = standbyDailyKWh * 30;
  const standbyMonthlyCost = standbyMonthlyKWh * TARIFFS.utilityGridImport;

  return {
    standbyTotalWatts: totalStandbyWatts,
    standbyDailyKWh: Number(standbyDailyKWh.toFixed(3)),
    standbyMonthlyKWh: Number(standbyMonthlyKWh.toFixed(2)),
    standbyMonthlyCostRupees: Math.round(standbyMonthlyCost),
  };
}

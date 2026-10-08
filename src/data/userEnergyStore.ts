/**
 * UrjaSaathi AI - Unified User Energy Data Model & Persistence Store
 * Connects Household Profile, Appliances, Connected Plants, and Saved Energy Plans.
 */

import { 
  Appliance, 
  STANDARD_APPLIANCES, 
  TARIFFS, 
  BUILDING_MATERIALS,
  calculateTLC, 
  calculateSolarYield, 
  calculateVAWTYield, 
  calculateStandbyAudit 
} from './energyEngine';
import { User } from '../auth/authStore';

export interface ConnectedPlant {
  id: string;
  plantType: 'solar' | 'vawt' | 'hybrid' | 'battery';
  name: string;
  capacityKW: number;
  inverterSpecs: string;
  commissionDate: string;
  connectionStatus: 'Not Connected' | 'Setup Required' | 'Connected';
  lastUpdated: string;
  isSimulatedOnly: boolean;
  manualReadings: { date: string; generationKWh: number }[];
}

export interface SavedEnergyPlan {
  id: string;
  savedAt: string;
  title: string;
  targetKWhReduction: number;
  estimatedMonthlySavingsRupees: number;
  selectedActions: {
    scenario: 'A' | 'B' | 'C';
    action: string;
    impactKWh: number;
    impactRupees: number;
    cost: number;
  }[];
}

export interface UserEnergyState {
  userId: string;
  householdName: string;
  city: string;
  discomName: string;
  tariffPerKWh: number;
  selectedMaterialId: string;
  ambientTemp: number;
  acSetpoint: number;
  floorPosition: 'top' | 'middle' | 'ground';
  smartStripMitigation: boolean;
  appliances: Appliance[];
  connectedPlants: ConnectedPlant[];
  savedPlans: SavedEnergyPlan[];
  lastCalculatedAt: string;
}

const USER_ENERGY_KEY = 'urjasaathi_user_energy_data';

export const getInitialEnergyState = (user?: User | null): UserEnergyState => {
  return {
    userId: user?.id || 'guest',
    householdName: user?.profile.householdName || 'My Sustainable Home',
    city: user?.profile.city || 'Jaipur',
    discomName: user?.profile.discomName || 'State DISCOM',
    tariffPerKWh: user?.profile.tariffPerKWh || TARIFFS.utilityGridImport,
    selectedMaterialId: 'reinforced_concrete',
    ambientTemp: 38.5,
    acSetpoint: 24.0,
    floorPosition: 'middle',
    smartStripMitigation: false,
    appliances: [...STANDARD_APPLIANCES],
    connectedPlants: [
      {
        id: 'plant_solar_01',
        plantType: 'solar',
        name: 'Rooftop Monocrystalline PV Array',
        capacityKW: user?.profile.solarKWp || 5.5,
        inverterSpecs: 'Growatt 6kW Hybrid Inverter (Dual MPPT)',
        commissionDate: '2025-08-14',
        connectionStatus: user?.profile.hasSolar ? 'Connected' : 'Setup Required',
        lastUpdated: new Date().toISOString().slice(0, 10),
        isSimulatedOnly: false,
        manualReadings: [
          { date: '2026-04-01', generationKWh: 26.4 },
          { date: '2026-04-02', generationKWh: 27.8 },
          { date: '2026-04-03', generationKWh: 25.1 },
        ]
      },
      {
        id: 'plant_vawt_02',
        plantType: 'vawt',
        name: 'Terrace Savonius-Darrieus VAWT',
        capacityKW: user?.profile.vawtCapacityKW || 2.4,
        inverterSpecs: 'Direct-Drive Permanent Magnet Wind Controller',
        commissionDate: '2025-11-20',
        connectionStatus: user?.profile.hasVAWT ? 'Connected' : 'Not Connected',
        lastUpdated: new Date().toISOString().slice(0, 10),
        isSimulatedOnly: false,
        manualReadings: [
          { date: '2026-04-01', generationKWh: 7.2 },
          { date: '2026-04-02', generationKWh: 8.4 },
          { date: '2026-04-03', generationKWh: 6.9 },
        ]
      }
    ],
    savedPlans: [
      {
        id: 'plan_seed_01',
        savedAt: '2026-03-28T14:30:00Z',
        title: 'Spring Baseline Optimization Plan',
        targetKWhReduction: 94.5,
        estimatedMonthlySavingsRupees: 836,
        selectedActions: [
          {
            scenario: 'A',
            action: 'Raise AC thermostat from 21°C to 24°C & seal thermal leaks',
            impactKWh: 48.0,
            impactRupees: 425,
            cost: 0
          },
          {
            scenario: 'A',
            action: 'Install Smart Vampire power-strips on entertainment & workstation clusters',
            impactKWh: 26.5,
            impactRupees: 235,
            cost: 1200
          },
          {
            scenario: 'B',
            action: 'Shift washing machine & dishwasher cycles to peak solar window (11:00-14:00)',
            impactKWh: 20.0,
            impactRupees: 176,
            cost: 0
          }
        ]
      }
    ],
    lastCalculatedAt: new Date().toISOString()
  };
};

export const loadUserEnergyState = (user?: User | null): UserEnergyState => {
  if (typeof window === 'undefined') return getInitialEnergyState(user);
  try {
    const raw = localStorage.getItem(USER_ENERGY_KEY);
    if (!raw) {
      const initial = getInitialEnergyState(user);
      localStorage.setItem(USER_ENERGY_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed: UserEnergyState = JSON.parse(raw);
    if (user && parsed.userId !== user.id) {
      // Sync user profile updates
      parsed.userId = user.id;
      parsed.householdName = user.profile.householdName;
      parsed.city = user.profile.city;
      parsed.discomName = user.profile.discomName;
      parsed.tariffPerKWh = user.profile.tariffPerKWh || parsed.tariffPerKWh;
    }
    return parsed;
  } catch (e) {
    console.error('Error loading energy state:', e);
    return getInitialEnergyState(user);
  }
};

export const saveUserEnergyState = (state: UserEnergyState): void => {
  if (typeof window === 'undefined') return;
  try {
    state.lastCalculatedAt = new Date().toISOString();
    localStorage.setItem(USER_ENERGY_KEY, JSON.stringify(state));
    window.dispatchEvent(new Event('urjasaathi_energy_change'));
  } catch (e) {
    console.error('Error saving energy state:', e);
  }
};

/**
 * Real-time derived energy metrics computed strictly from current active state
 */
export const calculateEnergyMetrics = (state: UserEnergyState) => {
  const material = BUILDING_MATERIALS.find(m => m.id === state.selectedMaterialId) || BUILDING_MATERIALS[0];
  const tlc = calculateTLC(material, state.ambientTemp, state.acSetpoint, state.floorPosition);

  let dailyConsumptionKWh = 0;
  let mandatoryKWh = 0;
  let discretionaryKWh = 0;

  state.appliances.forEach(app => {
    let kwh = (app.ratedWatts * app.defaultHoursDaily) / 1000;
    if (app.thermalCoupled) {
      kwh *= tlc;
    }
    dailyConsumptionKWh += kwh;
    if (app.category === 'mandatory') mandatoryKWh += kwh;
    else discretionaryKWh += kwh;
  });

  dailyConsumptionKWh = Number(dailyConsumptionKWh.toFixed(2));
  const monthlyConsumptionKWh = Number((dailyConsumptionKWh * 30).toFixed(1));
  const dailyCostRupees = Math.round(dailyConsumptionKWh * state.tariffPerKWh);
  const monthlyCostRupees = Math.round(monthlyConsumptionKWh * state.tariffPerKWh);

  // Renewable Generation
  const solarPlant = state.connectedPlants.find(p => p.plantType === 'solar');
  const vawtPlant = state.connectedPlants.find(p => p.plantType === 'vawt');

  const solarCapacity = solarPlant ? solarPlant.capacityKW : 0;
  const vawtCapacity = vawtPlant ? vawtPlant.capacityKW : 0;

  const solarYield = calculateSolarYield(solarCapacity, 5.5, 20, 6);
  const vawtYield = calculateVAWTYield(6.0, vawtCapacity);

  const dailyRenewableKWh = Number((solarYield.dailyKWh + vawtYield.dailyKWh).toFixed(2));
  const monthlyRenewableKWh = Number((dailyRenewableKWh * 30).toFixed(1));
  const monthlyRenewableSavingsRupees = Math.round(monthlyRenewableKWh * state.tariffPerKWh);

  // Energy Independence %
  const energyIndependencePercent = dailyConsumptionKWh > 0 
    ? Math.min(100, Math.round((dailyRenewableKWh / dailyConsumptionKWh) * 100))
    : 0;

  // Carbon Impact: National average emission factor ~ 0.82 kg CO2 / kWh
  const emissionFactor = 0.82;
  const monthlyEmissionsKg = Math.round(monthlyConsumptionKWh * emissionFactor);
  const avoidedEmissionsMonthlyKg = Math.round(monthlyRenewableKWh * emissionFactor);

  // Standby Power Audit
  const standbyAudit = calculateStandbyAudit(state.appliances);
  const potentialSavingsKWh = Number((monthlyConsumptionKWh * 0.22 + (state.smartStripMitigation ? 0 : standbyAudit.standbyMonthlyKWh)).toFixed(1));
  const potentialSavingsRupees = Math.round(potentialSavingsKWh * state.tariffPerKWh);

  return {
    tlc,
    material,
    dailyConsumptionKWh,
    monthlyConsumptionKWh,
    mandatoryKWh: Number(mandatoryKWh.toFixed(2)),
    discretionaryKWh: Number(discretionaryKWh.toFixed(2)),
    dailyCostRupees,
    monthlyCostRupees,
    solarYield,
    vawtYield,
    dailyRenewableKWh,
    monthlyRenewableKWh,
    monthlyRenewableSavingsRupees,
    energyIndependencePercent,
    monthlyEmissionsKg,
    avoidedEmissionsMonthlyKg,
    standbyAudit,
    potentialSavingsKWh,
    potentialSavingsRupees
  };
};

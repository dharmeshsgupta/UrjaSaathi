/**
 * UrjaSaathi AI - Authentication & User Profile Store
 * Supports offline-first persistence, multiple user types, and demo access.
 */

export type UserRole = 
  | 'independent_house' 
  | 'apartment_resident' 
  | 'community_manager' 
  | 'plant_manager';

export interface UserEnergyProfile {
  householdName: string;
  accountType: UserRole;
  occupants: number;
  city: string;
  state: string;
  discomName: string;
  tariffPerKWh: number;
  monthlyBillRupees?: number;
  monthlyConsumptionKWh: number;
  hasSolar: boolean;
  solarKWp?: number;
  hasVAWT: boolean;
  vawtCapacityKW?: number;
  hasBattery: boolean;
  batteryCapacityKWh?: number;
  isProfileComplete: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  token: string;
  createdAt: string;
  profile: UserEnergyProfile;
}

const AUTH_STORAGE_KEY = 'urjasaathi_auth_user';

// Sample demo users for rapid testing
export const DEMO_USERS: Record<string, User> = {
  house: {
    id: 'usr_house_01',
    name: 'Dharmesh Gupta',
    email: 'dharmesh@urjasaathi.ai',
    role: 'independent_house',
    token: 'tok_demo_house_9921',
    createdAt: '2026-01-15T10:00:00Z',
    profile: {
      householdName: 'Gupta Eco-Villa',
      accountType: 'independent_house',
      occupants: 4,
      city: 'Jaipur',
      state: 'Rajasthan',
      discomName: 'JVVNL (Jaipur Vidyut Vitran Nigam)',
      tariffPerKWh: 8.85,
      monthlyBillRupees: 4850,
      monthlyConsumptionKWh: 548,
      hasSolar: true,
      solarKWp: 5.5,
      hasVAWT: true,
      vawtCapacityKW: 2.4,
      hasBattery: true,
      batteryCapacityKWh: 5.12,
      isProfileComplete: true,
    }
  },
  society: {
    id: 'usr_soc_02',
    name: 'Priya Sharma',
    email: 'priya.sharma@greenmeadows.org',
    role: 'community_manager',
    token: 'tok_demo_soc_4412',
    createdAt: '2026-02-01T08:30:00Z',
    profile: {
      householdName: 'Green Meadows Co-op (40 Flats)',
      accountType: 'community_manager',
      occupants: 140,
      city: 'Bengaluru',
      state: 'Karnataka',
      discomName: 'BESCOM (Bangalore Electricity Supply Co.)',
      tariffPerKWh: 8.50,
      monthlyBillRupees: 68400,
      monthlyConsumptionKWh: 8040,
      hasSolar: true,
      solarKWp: 35.0,
      hasVAWT: true,
      vawtCapacityKW: 12.0,
      hasBattery: true,
      batteryCapacityKWh: 40.0,
      isProfileComplete: true,
    }
  },
  resident: {
    id: 'usr_res_03',
    name: 'Rahul Verma',
    email: 'rahul.v@flat101.in',
    role: 'apartment_resident',
    token: 'tok_demo_res_8812',
    createdAt: '2026-03-10T12:00:00Z',
    profile: {
      householdName: 'Flat 101, Green Meadows',
      accountType: 'apartment_resident',
      occupants: 3,
      city: 'Bengaluru',
      state: 'Karnataka',
      discomName: 'BESCOM',
      tariffPerKWh: 8.50,
      monthlyBillRupees: 2800,
      monthlyConsumptionKWh: 330,
      hasSolar: false,
      hasVAWT: false,
      hasBattery: false,
      isProfileComplete: true,
    }
  }
};

export const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading auth store:', e);
    return null;
  }
};

export const setStoredUser = (user: User | null): void => {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    window.dispatchEvent(new Event('urjasaathi_auth_change'));
  } catch (e) {
    console.error('Error updating auth store:', e);
  }
};

export const getRoleLabel = (role: UserRole): string => {
  switch (role) {
    case 'independent_house': return 'Independent House';
    case 'apartment_resident': return 'Apartment Resident';
    case 'community_manager': return 'Society / Community Manager';
    case 'plant_manager': return 'Energy Project Manager';
    default: return 'Energy User';
  }
};

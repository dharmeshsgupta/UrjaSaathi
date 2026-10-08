import React, { useCallback, useEffect, useState } from 'react';
import HeroLandingPage from './hero/HeroLandingPage.tsx';
import UrjaSaathiConsole from './components/UrjaSaathiConsole.tsx';
import { SpecsModal } from './hero/components/SpecsModal.tsx';
import { Navbar } from './hero/components/Navbar.tsx';
import { LoginPage } from './auth/LoginPage.tsx';
import { SignupPage } from './auth/SignupPage.tsx';
import { DashboardPage } from './dashboard/DashboardPage.tsx';
import { EnergyPlannerPage } from './planner/EnergyPlannerPage.tsx';
import { Innovation1Page } from './innovation/Innovation1Page.tsx';
import { SolarVawtPage } from './renewables/SolarVawtPage.tsx';
import { ApartmentEnergyPage } from './community/ApartmentEnergyPage.tsx';
import { ReportsPitchPage } from './reports/ReportsPitchPage.tsx';
import { AiChatPage } from './chat/AiChatPage.tsx';
import { getStoredUser } from './auth/authStore.ts';

export default function App() {
  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      const path = window.location.pathname.replace('/', '');
      const target = hash || path;
      if (['dashboard', 'planner', 'innovation-1', 'solar-vawt', 'apartment', 'reports', 'chat', 'login', 'signup', 'app'].includes(target)) {
        return target;
      }
    }
    return 'hero';
  });

  const [isSpecsOpen, setIsSpecsOpen] = useState(false);

  // Sync with browser back/forward history
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '');
      const path = window.location.pathname.replace('/', '');
      const target = hash || path;
      if (['hero', 'dashboard', 'planner', 'innovation-1', 'solar-vawt', 'apartment', 'reports', 'chat', 'login', 'signup', 'app'].includes(target)) {
        setCurrentView(target);
      } else {
        setCurrentView('hero');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = useCallback((view) => {
    // Protected route check for Dashboard
    if (view === 'dashboard' && !getStoredUser()) {
      window.history.pushState({}, '', '#login');
      setCurrentView('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    window.history.pushState({}, '', `#${view}`);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: view === 'hero' ? 'smooth' : 'instant' });
  }, []);

  useEffect(() => {
    if (['app', 'dashboard', 'planner', 'solar-vawt', 'apartment'].includes(currentView)) {
      document.body.classList.add('in-app');
    } else {
      document.body.classList.remove('in-app');
    }
  }, [currentView]);

  return (
    <>
      {/* Views that include the standard global Sticky Navbar */}
      {['dashboard', 'planner', 'innovation-1', 'solar-vawt', 'apartment', 'reports', 'chat'].includes(currentView) && (
        <Navbar
          currentView={currentView}
          onNavigate={handleNavigate}
          onOpenSpecs={() => setIsSpecsOpen(true)}
        />
      )}

      {/* Main View Router */}
      {currentView === 'hero' && (
        <HeroLandingPage
          onNavigate={handleNavigate}
          onOpenSpecs={() => setIsSpecsOpen(true)}
        />
      )}

      {currentView === 'login' && (
        <LoginPage
          onNavigate={handleNavigate}
          onLoginSuccess={(user) => handleNavigate('dashboard')}
        />
      )}

      {currentView === 'signup' && (
        <SignupPage
          onNavigate={handleNavigate}
          onSignupSuccess={(user) => handleNavigate('dashboard')}
        />
      )}

      {currentView === 'dashboard' && (
        <DashboardPage
          onNavigate={handleNavigate}
          onOpenSpecs={() => setIsSpecsOpen(true)}
        />
      )}

      {currentView === 'planner' && (
        <EnergyPlannerPage
          onNavigate={handleNavigate}
        />
      )}

      {currentView === 'innovation-1' && (
        <Innovation1Page
          onNavigate={handleNavigate}
        />
      )}

      {currentView === 'solar-vawt' && (
        <SolarVawtPage
          onNavigate={handleNavigate}
        />
      )}

      {currentView === 'apartment' && (
        <ApartmentEnergyPage
          onNavigate={handleNavigate}
        />
      )}

      {currentView === 'reports' && (
        <ReportsPitchPage
          onNavigate={handleNavigate}
        />
      )}

      {currentView === 'chat' && (
        <AiChatPage
          onNavigate={handleNavigate}
        />
      )}

      {currentView === 'app' && (
        <UrjaSaathiConsole
          onBackToHero={() => handleNavigate('hero')}
          onOpenSpecs={() => setIsSpecsOpen(true)}
        />
      )}

      {/* Global Specifications & Technical Proposal Modal */}
      <SpecsModal
        isOpen={isSpecsOpen}
        onClose={() => setIsSpecsOpen(false)}
      />
    </>
  );
}

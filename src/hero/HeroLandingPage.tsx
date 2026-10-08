/**
 * UrjaSaathi AI - Landing Page View
 * Features:
 * - 3D Realistic House & Building with Terrace Solar Plant & VAWT
 * - Warm Sunlit Cream Architectural Background
 * - High-Contrast Precision Typography & Color Hierarchy
 * - Seamless Navigation to Full UrjaSaathi Operating Suite
 */

import React, { useState } from 'react';
import './index.css';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProblemSection } from './components/ProblemSection';
import { SolutionSection } from './components/SolutionSection';
import { WorkflowSection } from './components/WorkflowSection';
import { TeamSection } from './components/TeamSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { SpecsModal } from './components/SpecsModal';
import { getStoredUser } from '../auth/authStore';

interface HeroLandingPageProps {
  onNavigate: (view: string) => void;
  onOpenSpecs?: () => void;
}

export default function HeroLandingPage({ onNavigate, onOpenSpecs }: HeroLandingPageProps) {
  const [isSpecsOpen, setIsSpecsOpen] = useState<boolean>(false);

  const handleScrollToSolution = () => {
    const el = document.getElementById('solution');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLaunchSuite = () => {
    const user = getStoredUser();
    if (user) {
      onNavigate('dashboard');
    } else {
      onNavigate('login');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5EE] text-slate-900 font-sans selection:bg-amber-500/30 selection:text-amber-950">
      {/* Precision Top Navigation */}
      <Navbar
        currentView="hero"
        onNavigate={onNavigate}
        onOpenSpecs={onOpenSpecs || (() => setIsSpecsOpen(true))}
      />

      {/* Main Content Sections */}
      <main>
        {/* Section 1 & 2: Main 3D Architectural Scene with House, Terrace Solar & VAWT */}
        <Hero
          onNavigateApp={handleLaunchSuite}
          onExploreSolution={handleScrollToSolution}
        />

        {/* Section 3: Problem Statement */}
        <ProblemSection />

        {/* Section 4: 4 Core Capabilities & Interactive Simulators */}
        <SolutionSection />

        {/* Section 5: Workflow Pipeline */}
        <WorkflowSection />

        {/* Section 6: Engineering Team */}
        <TeamSection />

        {/* Section 7: Society Deployment & Audit Request */}
        <ContactSection onNavigateApp={handleLaunchSuite} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Technical Proposal & Specification Modal */}
      <SpecsModal
        isOpen={isSpecsOpen}
        onClose={() => setIsSpecsOpen(false)}
      />
    </div>
  );
}

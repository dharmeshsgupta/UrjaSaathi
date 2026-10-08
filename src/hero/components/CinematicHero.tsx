import React, { useRef } from 'react';
import { useEarthScroll } from '../hooks/useEarthScroll';
import { EarthScene } from './EarthScene';
import { HeroContent } from './HeroContent';

interface CinematicHeroProps {
  onNavigateApp?: () => void;
  onExploreSolution?: () => void;
}

/**
 * 3D Architectural Microgrid Hero Experience:
 * - 3D Realistic House with Terrace Solar Plant & Spinning VAWT
 * - Just like the Earth animation in Antariksh Drishti, the house moves across
 *   the screen, changes its size, and dynamically rotates its direction as you scroll down!
 */
export const CinematicHero: React.FC<CinematicHeroProps> = ({
  onNavigateApp,
  onExploreSolution
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Hook managing scroll-driven scale, positions, rotation direction, and crossfades
  const {
    earthScale,
    earthX,
    earthY,
    earthRotationY,
    earthOpacity,
    frame1Opacity,
    frame1Y,
    frame4Opacity,
    frame4Y,
    frame5Opacity,
    frame5Y
  } = useEarthScroll({
    targetRef: containerRef,
    offset: ['start start', 'end start']
  });

  return (
    <div
      ref={containerRef}
      id="hero"
      className="relative w-full h-[250vh] bg-[#F8F5EE] text-slate-900"
    >
      {/* Pinned 100vh Viewport Window */}
      <div className="sticky top-0 w-full h-screen min-h-[640px] max-h-[1100px] overflow-hidden select-none">
        
        {/* Warm Architectural Sunlit Cream Gradient & Drafting Grid Pattern */}
        <div 
          className="absolute inset-0 pointer-events-none z-0" 
          style={{
            background: 'radial-gradient(ellipse at 60% 40%, #FFFDF9 0%, #F8F5EE 60%, #EFE8DC 100%)'
          }}
        />
        <div 
          className="absolute inset-0 opacity-[0.05] pointer-events-none z-0"
          style={{
            backgroundImage: 'linear-gradient(to right, #44403c 1px, transparent 1px), linear-gradient(to bottom, #44403c 1px, transparent 1px)',
            backgroundSize: '48px 48px'
          }}
        />

        {/* 
          1. REAL 3D ECO-ARCHITECTURE SCENE (THREE.JS / REACT THREE FIBER)
          - House moves, zooms in, and rotates direction as user scrolls down!
        */}
        <EarthScene
          scaleValue={earthScale}
          xValue={earthX}
          yValue={earthY}
          rotYValue={earthRotationY}
          opacityValue={earthOpacity}
        />

        {/* 
          2. PRECISION HIGH-CONTRAST STORYTELLING OVERLAYS
          - Frame 1: Hero title & specs on the left
          - Frame 4: Thermal Envelope Diagnostics on the left
          - Frame 5: 40-Flat P2P Marketplace on the right
        */}
        <HeroContent
          frame1Opacity={frame1Opacity}
          frame1Y={frame1Y}
          frame4Opacity={frame4Opacity}
          frame4Y={frame4Y}
          frame5Opacity={frame5Opacity}
          frame5Y={frame5Y}
          onNavigateApp={onNavigateApp}
          onExploreSolution={onExploreSolution}
        />

      </div>

      {/* Clean seamless blend into Section 3 */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none z-20"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, #F8F5EE 100%)'
        }}
      />
    </div>
  );
};

import { RefObject } from 'react';
import { useScroll, useTransform, useSpring, MotionValue } from 'motion/react';

export interface EarthScrollValues {
  scrollProgress: MotionValue<number>;
  earthScale: MotionValue<number>;
  earthX: MotionValue<number>;
  earthY: MotionValue<number>;
  earthRotationY: MotionValue<number>;
  earthOpacity: MotionValue<number>;
  studioTransitionOpacity: MotionValue<number>;
  // Text opacities and offsets for story stages
  frame1Opacity: MotionValue<number>;
  frame1Y: MotionValue<number>;
  frame4Opacity: MotionValue<number>;
  frame4Y: MotionValue<number>;
  frame5Opacity: MotionValue<number>;
  frame5Y: MotionValue<number>;
}

export interface UseEarthScrollOptions {
  targetRef?: RefObject<HTMLElement | null>;
  offset?: [string, string];
}

/**
 * Hook governing scroll-driven 3D House transformation:
 * - STAGE 1: HERO INTRO (House on Right, Scale ~0.95, Front Perspective, Frame 1 on Left)
 * - STAGE 2: THERMAL ENVELOPE (House zooms in Scale ~1.25, Rotates +0.85 to facade/windows, Frame 4 on Left)
 * - STAGE 3: MICROGRID & P2P (House moves to Left, Scale ~1.12, Rotates -1.25 to show Solar + VAWT, Frame 5 on Right)
 * - STAGE 4: Seamless transition to Problem Section
 */
export function useEarthScroll(options: UseEarthScrollOptions = {}): EarthScrollValues {
  const { targetRef, offset = ['start start', 'end start'] } = options;

  const { scrollYProgress } = useScroll(
    targetRef ? { target: targetRef, offset: offset as any } : {}
  );

  // Smooth responsive spring physics
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.3,
    restDelta: 0.0004
  });

  // 1. Model Scale:
  // Stage 1 (0.00 - 0.26): 0.95 (clean initial hero framing on the right side)
  // Stage 2 (0.34 - 0.58): 1.25 (ZOOMS IN to inspect the facade, thermal envelope, and windows)
  // Stage 3 (0.66 - 0.92): 1.12 (spotlights terrace solar panels and spinning VAWT turbine on the left)
  const earthScale = useTransform(
    smoothProgress,
    [0.0, 0.22, 0.36, 0.58, 0.68, 0.92, 1.0],
    [0.95, 0.98, 1.25, 1.25, 1.12, 1.12, 0.95]
  );

  // 2. Model X position in 3D world space:
  // Stage 1: Right side (+1.25)
  // Stage 2: Right side closer to center (+1.05)
  // Stage 3: Left side (-1.20) as Frame 5 text appears on the right!
  const earthX = useTransform(
    smoothProgress,
    [0.0, 0.22, 0.36, 0.58, 0.68, 0.92, 1.0],
    [1.25, 1.25, 1.05, 1.05, -1.20, -1.20, 0.0]
  );

  // 3. Model Y position:
  // Stage 1: -0.42
  // Stage 2: -0.28 (lifts up slightly for envelope inspection)
  // Stage 3: -0.62 (lowers so the rooftop PV and wind turbine are dramatic and prominent)
  const earthY = useTransform(
    smoothProgress,
    [0.0, 0.22, 0.36, 0.58, 0.68, 0.92, 1.0],
    [-0.42, -0.42, -0.28, -0.28, -0.62, -0.62, -0.42]
  );

  // 4. Model Rotation Y (direction angle changes on scroll):
  // Stage 1: -0.35 rad (front perspective)
  // Stage 2: +0.85 rad (rotates to show side facade and windows)
  // Stage 3: -1.25 rad (rotates to face solar array and turbine directly toward camera)
  const earthRotationY = useTransform(
    smoothProgress,
    [0.0, 0.22, 0.38, 0.58, 0.68, 0.92, 1.0],
    [-0.35, -0.35, 0.85, 0.85, -1.25, -1.25, -0.35]
  );

  // 5. Opacity: stays 1.0 throughout the scroll
  const earthOpacity = useTransform(
    smoothProgress,
    [0.0, 0.88, 1.0],
    [1.0, 1.0, 0.85]
  );

  const studioTransitionOpacity = useTransform(
    smoothProgress,
    [0.0, 0.88, 1.0],
    [0, 0, 0.3]
  );

  // 6. Frame 1 Opacity & Y (Initial Hero Text on Left)
  // Visible from 0.0 to 0.22, smoothly fades out by 0.28
  const frame1Opacity = useTransform(smoothProgress, [0.0, 0.20, 0.28], [1, 1, 0]);
  const frame1Y = useTransform(smoothProgress, [0.0, 0.28], [0, -35]);

  // 7. Frame 4 Opacity & Y (Thermal Diagnostics on Left)
  // Fades in from 0.26 to 0.33, active until 0.58, fades out by 0.64
  const frame4Opacity = useTransform(smoothProgress, [0.26, 0.33, 0.57, 0.64], [0, 1, 1, 0]);
  const frame4Y = useTransform(smoothProgress, [0.26, 0.33, 0.57, 0.64], [30, 0, 0, -30]);

  // 8. Frame 5 Opacity & Y (40-Flat P2P Marketplace on Right)
  // Fades in from 0.62 to 0.69, active until 0.92, fades out as next section arrives
  const frame5Opacity = useTransform(smoothProgress, [0.62, 0.69, 0.92, 0.98], [0, 1, 1, 0]);
  const frame5Y = useTransform(smoothProgress, [0.62, 0.69, 0.92, 0.98], [30, 0, 0, -30]);

  return {
    scrollProgress: smoothProgress,
    earthScale,
    earthX,
    earthY,
    earthRotationY,
    earthOpacity,
    studioTransitionOpacity,
    frame1Opacity,
    frame1Y,
    frame4Opacity,
    frame4Y,
    frame5Opacity,
    frame5Y
  };
}

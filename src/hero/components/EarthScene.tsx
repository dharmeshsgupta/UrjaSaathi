import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion, MotionValue } from 'motion/react';
import * as THREE from 'three';
import { HouseBuildingModel } from './HouseBuildingModel';

interface EarthSceneProps {
  scaleValue?: MotionValue<number>;
  xValue?: MotionValue<number>;
  yValue?: MotionValue<number>;
  rotYValue?: MotionValue<number>;
  opacityValue?: MotionValue<number>;
}

/**
 * Scene controller managing the 3D House positioning, scroll-driven scale, direction/rotation, and floating breath
 */
const SceneController: React.FC<{
  scaleValue?: MotionValue<number>;
  xValue?: MotionValue<number>;
  yValue?: MotionValue<number>;
  rotYValue?: MotionValue<number>;
}> = ({ scaleValue, xValue, yValue, rotYValue }) => {
  const transformGroupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!transformGroupRef.current) return;

    const t = state.clock.elapsedTime;
    const s = scaleValue ? scaleValue.get() : 0.95;
    const x = xValue ? xValue.get() : 1.25;
    const baseRotY = rotYValue ? rotYValue.get() : -0.35;
    // Gentle architectural breathing floating motion
    const y = (yValue ? yValue.get() : -0.42) + Math.sin(t * 1.5) * 0.035;

    transformGroupRef.current.scale.set(s, s, s);
    transformGroupRef.current.position.set(x, y, 0);
    // Smooth scroll-driven orientation with subtle ambient idle drift
    transformGroupRef.current.rotation.set(0.18, baseRotY + Math.sin(t * 0.6) * 0.04, 0);
  });

  return (
    <group ref={transformGroupRef}>
      {/* Soft Ground Contact Shadow on the Cream Floor */}
      <mesh position={[0, -0.96, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[0, 4.4, 48]} />
        <meshBasicMaterial color="#c4b5a2" transparent opacity={0.35} depthWrite={false} />
      </mesh>

      {/* Main High-Fidelity 3D House & Building Model */}
      <HouseBuildingModel scale={1.0} rotationSpeed={0} />
    </group>
  );
};

/**
 * Full-Screen Three.js Eco-Architecture Scene Component.
 * The house dynamically moves across the screen, changes size, and rotates direction as the user scrolls!
 */
export const EarthScene: React.FC<EarthSceneProps> = ({
  scaleValue,
  xValue,
  yValue,
  rotYValue,
  opacityValue
}) => {
  return (
    <motion.div
      style={opacityValue ? { opacity: opacityValue } : undefined}
      className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-hidden"
    >
      <Canvas
        camera={{ position: [0, 1.8, 6.2], fov: 42 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.12
        }}
        dpr={[1, 2]}
        className="w-full h-full"
      >
        {/* Dynamic Architectural Solar Lighting */}
        <ambientLight intensity={0.95} color="#fdfbf7" />
        <directionalLight
          position={[8, 12, 7]}
          intensity={2.8}
          color="#fffbeb"
          castShadow
        />
        <directionalLight
          position={[-6, 4, -4]}
          intensity={0.85}
          color="#e0f2fe"
        />
        <directionalLight
          position={[-3, -3, 2]}
          intensity={0.4}
          color="#fef3c7"
        />
        <pointLight position={[0, 3.2, 1.2]} intensity={2.0} color="#06b6d4" distance={9} />

        {/* 3D House & Building with Terrace Solar Plant and VAWT */}
        <Suspense fallback={null}>
          <SceneController
            scaleValue={scaleValue}
            xValue={xValue}
            yValue={yValue}
            rotYValue={rotYValue}
          />
        </Suspense>
      </Canvas>
    </motion.div>
  );
};

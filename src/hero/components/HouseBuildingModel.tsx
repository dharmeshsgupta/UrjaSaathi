import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface HouseBuildingModelProps {
  scale?: number;
  rotationSpeed?: number;
}

/**
 * High-Fidelity Photovoltaic Solar Module (Enlarged Commercial-Scale Monocrystalline)
 * Scaled significantly larger per user request, featuring high-contrast deep navy silicon,
 * 4 silver busbars, grid fingers, and heavy extruded aluminum mounting frames.
 */
const RealisticSolarPanel: React.FC<{
  position: [number, number, number];
  tiltAngle?: number;
  width?: number;
  length?: number;
}> = ({ position, tiltAngle = 0.38, width = 0.92, length = 1.15 }) => {
  return (
    <group position={position} rotation={[tiltAngle, 0, 0]}>
      {/* Structural Extruded Aluminum Bezel Frame */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, 0.038, length]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.15} />
      </mesh>

      {/* Monocrystalline Silicon Solar Wafer Surface - High-Contrast Deep Navy */}
      <mesh position={[0, 0.021, 0]}>
        <boxGeometry args={[width - 0.030, 0.008, length - 0.030]} />
        <meshStandardMaterial
          color="#031633"
          emissive="#024282"
          emissiveIntensity={0.45}
          metalness={0.92}
          roughness={0.06}
        />
      </mesh>

      {/* Primary Silver Busbars (4 Conductive Ribbons) */}
      {[-length * 0.36, -length * 0.12, length * 0.12, length * 0.36].map((z, idx) => (
        <mesh key={`bb-${idx}`} position={[0, 0.027, z]}>
          <boxGeometry args={[width - 0.040, 0.003, 0.010]} />
          <meshStandardMaterial color="#ffffff" metalness={0.98} roughness={0.04} />
        </mesh>
      ))}

      {/* Fine Conductive Grid Finger Lines (8 Lines) */}
      {[-width * 0.40, -width * 0.28, -width * 0.15, -width * 0.03, width * 0.09, width * 0.21, width * 0.33, width * 0.44].map((x, idx) => (
        <mesh key={`grid-${idx}`} position={[x, 0.026, 0]}>
          <boxGeometry args={[0.004, 0.002, length - 0.040]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.08} />
        </mesh>
      ))}

      {/* Heavy-Duty Galvanized Mounting Legs (Front) */}
      <mesh position={[-width * 0.42, -0.16, length * 0.34]} rotation={[-tiltAngle, 0, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.32, 8]} />
        <meshStandardMaterial color="#475569" metalness={0.92} roughness={0.20} />
      </mesh>
      <mesh position={[width * 0.42, -0.16, length * 0.34]} rotation={[-tiltAngle, 0, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.32, 8]} />
        <meshStandardMaterial color="#475569" metalness={0.92} roughness={0.20} />
      </mesh>

      {/* Rear Elevating Stanchions */}
      <mesh position={[-width * 0.42, -0.06, -length * 0.40]} rotation={[-tiltAngle, 0, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.24, 8]} />
        <meshStandardMaterial color="#475569" metalness={0.92} roughness={0.20} />
      </mesh>
      <mesh position={[width * 0.42, -0.06, -length * 0.40]} rotation={[-tiltAngle, 0, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.24, 8]} />
        <meshStandardMaterial color="#475569" metalness={0.92} roughness={0.20} />
      </mesh>

      {/* Diagonal Galvanized Wind-Brace Struts */}
      <mesh position={[0, -0.12, -length * 0.06]} rotation={[-tiltAngle * 0.5, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.012, length * 0.90, 8]} />
        <meshStandardMaterial color="#334155" metalness={0.90} roughness={0.22} />
      </mesh>
    </group>
  );
};

/**
 * Realistic Vertical-Axis Wind Turbine (VAWT)
 * Features dark graphite mast, PMG nacelle, cyan status ring,
 * and pure white aerofoil blades with carbon leading edges.
 */
const RealisticVAWT: React.FC<{
  position: [number, number, number];
  scale?: number;
  rotationSpeed?: number;
}> = ({ position, scale = 1.0, rotationSpeed = 5.5 }) => {
  const rotorRef = useRef<THREE.Group>(null);
  const statusLedRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (rotorRef.current) {
      rotorRef.current.rotation.y += delta * rotationSpeed;
    }
    if (statusLedRef.current) {
      const pulse = 1.0 + Math.sin(state.clock.elapsedTime * 5.0) * 0.22;
      statusLedRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  const bladeAngles = [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3];
  const radius = 0.58;
  const height = 1.30;

  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Terrace Base Flange with Heavy Anchor Plate */}
      <mesh position={[0, 0.04, 0]} castShadow>
        <cylinderGeometry args={[0.24, 0.30, 0.08, 16]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.5} roughness={0.25} />
      </mesh>

      {/* Structural Mast Stand */}
      <mesh position={[0, 0.18, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.22, 0.20, 16]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.5} roughness={0.25} />
      </mesh>

      {/* Direct-Drive Permanent Magnet Generator (PMG) Nacelle (Gloss White) */}
      <mesh position={[0, 0.36, 0]} castShadow>
        <cylinderGeometry args={[0.20, 0.23, 0.24, 24]} />
        <meshStandardMaterial color="#f8fafc" metalness={0.2} roughness={0.15} />
      </mesh>

      {/* Generator Cooling Ribs */}
      {[-0.08, 0, 0.08].map((yOffset, i) => (
        <mesh key={`rib-${i}`} position={[0, 0.36 + yOffset, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.016, 24]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.2} />
        </mesh>
      ))}

      {/* Generator High-Intensity Cyan Status LED Ring */}
      <mesh ref={statusLedRef} position={[0, 0.36, 0]}>
        <torusGeometry args={[0.225, 0.015, 12, 32]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={2.6}
        />
      </mesh>

      {/* Central Fixed High-Strength Mast Shaft */}
      <mesh position={[0, height * 0.5 + 0.42, 0]}>
        <cylinderGeometry args={[0.045, 0.045, height + 0.3, 16]} />
        <meshStandardMaterial color="#64748b" metalness={0.92} roughness={0.15} />
      </mesh>

      {/* ROTATING VERTICAL ROTOR ASSEMBLY */}
      <group ref={rotorRef} position={[0, height * 0.5 + 0.42, 0]}>
        {/* Top & Bottom Precision Bearing Hubs */}
        <mesh position={[0, height * 0.48, 0]}>
          <cylinderGeometry args={[0.10, 0.10, 0.12, 16]} />
          <meshStandardMaterial color="#64748b" metalness={0.95} roughness={0.15} />
        </mesh>
        <mesh position={[0, -height * 0.48, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.12, 16]} />
          <meshStandardMaterial color="#64748b" metalness={0.95} roughness={0.15} />
        </mesh>

        {/* 3 Curved Troposkein Airfoil Blades + Aerodynamic Arms */}
        {bladeAngles.map((angle, index) => {
          const cos = Math.cos(angle);
          const sin = Math.sin(angle);
          const bladeX = cos * radius;
          const bladeZ = sin * radius;

          return (
            <group key={index}>
              {/* Upper Airfoil Radial Arm */}
              <group position={[bladeX * 0.5, height * 0.46, bladeZ * 0.5]} rotation={[0, -angle, 0]}>
                <mesh castShadow>
                  <boxGeometry args={[radius, 0.024, 0.070]} />
                  <meshStandardMaterial color="#64748b" metalness={0.85} roughness={0.2} />
                </mesh>
                <mesh position={[0, 0, 0.035]}>
                  <cylinderGeometry args={[0.010, 0.010, radius, 8]} />
                  <meshStandardMaterial color="#38bdf8" metalness={0.8} />
                </mesh>
              </group>

              {/* Lower Airfoil Radial Arm */}
              <group position={[bladeX * 0.5, -height * 0.46, bladeZ * 0.5]} rotation={[0, -angle, 0]}>
                <mesh castShadow>
                  <boxGeometry args={[radius, 0.024, 0.070]} />
                  <meshStandardMaterial color="#64748b" metalness={0.85} roughness={0.2} />
                </mesh>
                <mesh position={[0, 0, 0.035]}>
                  <cylinderGeometry args={[0.010, 0.010, radius, 8]} />
                  <meshStandardMaterial color="#38bdf8" metalness={0.8} />
                </mesh>
              </group>

              {/* Vertical Curved Blade */}
              <group position={[bladeX, 0, bladeZ]} rotation={[0, -angle + Math.PI / 2, 0]}>
                {/* Central Main Airfoil Wing Segment (Pure Gloss White) */}
                <mesh castShadow receiveShadow position={[0.04, 0, 0]}>
                  <boxGeometry args={[0.110, height * 0.65, 0.028]} />
                  <meshStandardMaterial
                    color="#ffffff"
                    metalness={0.3}
                    roughness={0.12}
                  />
                </mesh>

                {/* Upper Swept Segment */}
                <mesh castShadow position={[0.02, height * 0.38, 0]} rotation={[0, 0, -0.12]}>
                  <boxGeometry args={[0.100, height * 0.35, 0.028]} />
                  <meshStandardMaterial color="#ffffff" metalness={0.3} roughness={0.12} />
                </mesh>

                {/* Lower Swept Segment */}
                <mesh castShadow position={[0.02, -height * 0.38, 0]} rotation={[0, 0, 0.12]}>
                  <boxGeometry args={[0.100, height * 0.35, 0.028]} />
                  <meshStandardMaterial color="#ffffff" metalness={0.3} roughness={0.12} />
                </mesh>

                {/* Aerodynamic Titanium Leading-Edge Strip */}
                <mesh position={[0.080, 0, 0]}>
                  <cylinderGeometry args={[0.014, 0.014, height, 12]} />
                  <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.15} />
                </mesh>

                {/* Winglet Tips */}
                <mesh position={[0, height * 0.49, 0]}>
                  <boxGeometry args={[0.11, 0.05, 0.032]} />
                  <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={1.0} />
                </mesh>
                <mesh position={[0, -height * 0.49, 0]}>
                  <boxGeometry args={[0.11, 0.05, 0.032]} />
                  <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={0.8} />
                </mesh>
              </group>
            </group>
          );
        })}

        {/* Central Helical Savonius Scoops */}
        <mesh position={[0, 0, 0]} rotation={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.14, 0.14, height * 0.70, 16, 1, true, 0, Math.PI * 0.88]} />
          <meshStandardMaterial
            color="#0284c7"
            emissive="#0369a1"
            emissiveIntensity={0.4}
            side={THREE.DoubleSide}
            metalness={0.7}
            roughness={0.18}
          />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[0, 0.35 + Math.PI, 0]}>
          <cylinderGeometry args={[0.14, 0.14, height * 0.70, 16, 1, true, 0, Math.PI * 0.88]} />
          <meshStandardMaterial
            color="#0284c7"
            emissive="#0369a1"
            emissiveIntensity={0.4}
            side={THREE.DoubleSide}
            metalness={0.7}
            roughness={0.18}
          />
        </mesh>

        {/* Aerodynamic Top Nose Cone */}
        <mesh position={[0, height * 0.54, 0]}>
          <coneGeometry args={[0.075, 0.15, 16]} />
          <meshStandardMaterial color="#0284c7" metalness={0.85} roughness={0.15} />
        </mesh>
      </group>
    </group>
  );
};

/**
 * Realistic 3D Eco-Smart House & Mid-Rise Building Complex
 * - Large, prominent, architectural windows on EVERY SIDE of the house (Front, Back, Left, Right)
 * - Significantly enlarged, high-capacity rooftop solar plant mounted strictly INSIDE the terrace perimeter
 * - Vertical-axis wind turbine spinning on the terrace corner
 * - Warm Travertine stone facade with crisp obsidian mullions and warm interior golden illumination
 */
export const HouseBuildingModel: React.FC<HouseBuildingModelProps> = ({
  scale = 1.0,
  rotationSpeed = 0.05
}) => {
  const modelGroupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (modelGroupRef.current) {
      modelGroupRef.current.rotation.y += delta * rotationSpeed;
    }
  });

  return (
    <group ref={modelGroupRef} scale={[scale, scale, scale]} position={[0, -0.88, 0]}>
      {/* ============================================================== */}
      {/* 1. ARCHITECTURAL PLINTH & FOUNDATION PEDESTAL                  */}
      {/* ============================================================== */}
      <group position={[0, -0.18, 0]}>
        {/* Foundation Plinth Base - Slate Granite Ground Anchor */}
        <mesh receiveShadow position={[0, 0, 0]}>
          <cylinderGeometry args={[3.45, 3.65, 0.34, 40]} />
          <meshStandardMaterial color="#475569" roughness={0.65} metalness={0.25} />
        </mesh>

        {/* Recessed Cyan Architectural Lighting Ring */}
        <mesh position={[0, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[3.32, 3.38, 48]} />
          <meshStandardMaterial
            color="#06b6d4"
            emissive="#06b6d4"
            emissiveIntensity={2.0}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Eco-Lawn Ring */}
        <mesh receiveShadow position={[0, 0.18, 0]}>
          <cylinderGeometry args={[3.30, 3.30, 0.04, 36]} />
          <meshStandardMaterial color="#1c542a" roughness={0.8} metalness={0.05} />
        </mesh>

        {/* Entrance Stone Patio with Sandstone Pavers */}
        <mesh receiveShadow position={[0, 0.21, 1.65]}>
          <boxGeometry args={[1.35, 0.03, 1.85]} />
          <meshStandardMaterial color="#e5dfd4" roughness={0.5} metalness={0.2} />
        </mesh>

        {/* Stepping Stones to Entrance */}
        {[-0.35, 0, 0.35].map((x, i) => (
          <mesh key={`step-${i}`} receiveShadow position={[x, 0.23, 2.35]}>
            <boxGeometry args={[0.26, 0.025, 0.42]} />
            <meshStandardMaterial color="#d1c7b8" roughness={0.55} />
          </mesh>
        ))}

        {/* Architectural Low Planters & Ornamental Shrubs */}
        {[
          [-2.1, 0.32, 1.3],
          [-2.4, 0.32, -0.7],
          [2.15, 0.32, 1.2],
          [2.35, 0.32, -0.9],
        ].map((pt, i) => (
          <group key={i} position={pt as [number, number, number]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.48, 0.28, 0.48]} />
              <meshStandardMaterial color="#475569" roughness={0.5} metalness={0.6} />
            </mesh>
            <mesh position={[0, 0.14, 0]}>
              <boxGeometry args={[0.44, 0.02, 0.44]} />
              <meshStandardMaterial color="#2d1f14" roughness={0.9} />
            </mesh>
            <mesh position={[0, 0.32, 0]} castShadow>
              <coneGeometry args={[0.26, 0.45, 10]} />
              <meshStandardMaterial color="#1a4220" roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.48, 0]} castShadow>
              <coneGeometry args={[0.18, 0.35, 10]} />
              <meshStandardMaterial color="#235c2d" roughness={0.8} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ============================================================== */}
      {/* 2. GROUND FLOOR: PANORAMIC GLASS LIVING SUITE & FOUR-WAY WINDOWS */}
      {/* ============================================================== */}
      <group position={[0, 0.58, 0]}>
        {/* Main Lower Structural Volume (Warm Limestone Stucco) */}
        <mesh castShadow receiveShadow position={[-0.1, 0, -0.1]}>
          <boxGeometry args={[3.25, 1.18, 2.35]} />
          <meshStandardMaterial color="#ded5c5" roughness={0.65} metalness={0.12} />
        </mesh>

        {/* Interior Illuminated Living Core (Warm Golden Interior Glow) */}
        <mesh position={[-0.1, 0, 0]}>
          <boxGeometry args={[2.7, 0.90, 1.7]} />
          <meshStandardMaterial
            color="#fef08a"
            emissive="#f59e0b"
            emissiveIntensity={0.65}
            roughness={0.8}
          />
        </mesh>

        {/* ------------------------------------------------------------ */}
        {/* 2A. GROUND FLOOR FRONT WINDOWS (+Z): Floor-to-Ceiling Glazing */}
        {/* ------------------------------------------------------------ */}
        <group position={[-0.1, 0, 1.09]}>
          {/* Glass Pane */}
          <mesh>
            <planeGeometry args={[3.05, 1.05]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#0284c7"
              emissiveIntensity={0.35}
              transparent
              opacity={0.70}
              roughness={0.06}
              metalness={0.90}
            />
          </mesh>
          {/* Vertical Mullions */}
          {[-1.48, -0.50, 0.50, 1.48].map((x, idx) => (
            <mesh key={`gmull-${idx}`} position={[x, 0, 0.02]} castShadow>
              <boxGeometry args={[0.075, 1.15, 0.08]} />
              <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.25} />
            </mesh>
          ))}
          {/* Horizontal Transom */}
          <mesh position={[0, 0.38, 0.02]}>
            <boxGeometry args={[3.05, 0.05, 0.06]} />
            <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.25} />
          </mesh>
        </group>

        {/* Recessed Timber Front Door with Long Handle */}
        <group position={[0, -0.12, 1.11]}>
          <mesh castShadow>
            <boxGeometry args={[0.82, 0.94, 0.05]} />
            <meshStandardMaterial color="#6b2d0c" roughness={0.6} />
          </mesh>
          <mesh position={[0.32, 0, 0.04]} castShadow>
            <cylinderGeometry args={[0.012, 0.012, 0.42, 8]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.95} roughness={0.1} />
          </mesh>
        </group>

        {/* Entrance Floating Architectural Canopy with Warm Downlight */}
        <group position={[0, 0.48, 1.48]}>
          <mesh castShadow>
            <boxGeometry args={[1.35, 0.08, 0.85]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.35} metalness={0.15} />
          </mesh>
          <mesh position={[0, -0.04, 0]}>
            <boxGeometry args={[1.28, 0.015, 0.80]} />
            <meshStandardMaterial color="#92400e" roughness={0.65} metalness={0.1} />
          </mesh>
          <mesh position={[0, -0.05, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.015, 12]} />
            <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={2.5} />
          </mesh>
        </group>

        {/* ------------------------------------------------------------ */}
        {/* 2B. GROUND FLOOR BACK WINDOWS (-Z): Garden Patio Sliding Door */}
        {/* ------------------------------------------------------------ */}
        <group position={[-0.1, 0, -1.29]} rotation={[0, Math.PI, 0]}>
          {/* 3D Extruded Outer Casing */}
          <mesh position={[0, 0, 0.02]}>
            <boxGeometry args={[2.85, 1.08, 0.06]} />
            <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.25} />
          </mesh>
          {/* Glass Pane */}
          <mesh position={[0, 0, 0.035]}>
            <planeGeometry args={[2.75, 0.98]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#0284c7"
              emissiveIntensity={0.35}
              transparent
              opacity={0.70}
              roughness={0.06}
              metalness={0.90}
            />
          </mesh>
          {/* Patio Mullions */}
          {[-0.92, 0, 0.92].map((x, idx) => (
            <mesh key={`bpmull-${idx}`} position={[x, 0, 0.05]} castShadow>
              <boxGeometry args={[0.06, 0.98, 0.04]} />
              <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.25} />
            </mesh>
          ))}
          {/* Patio Garden Shade Canopy */}
          <mesh position={[0, 0.54, 0.22]} castShadow>
            <boxGeometry args={[2.90, 0.06, 0.44]} />
            <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.25} />
          </mesh>
        </group>

        {/* ------------------------------------------------------------ */}
        {/* 2C. GROUND FLOOR LEFT WINDOW (-X): Dining & Kitchen Glazing  */}
        {/* ------------------------------------------------------------ */}
        <group position={[-1.74, 0.04, -0.1]} rotation={[0, -Math.PI / 2, 0]}>
          {/* 3D Extruded Window Box Frame */}
          <mesh position={[0, 0, 0.02]} castShadow>
            <boxGeometry args={[2.05, 0.92, 0.07]} />
            <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.25} />
          </mesh>
          {/* Glass Pane */}
          <mesh position={[0, 0, 0.04]}>
            <planeGeometry args={[1.95, 0.82]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#0284c7"
              emissiveIntensity={0.40}
              transparent
              opacity={0.75}
              roughness={0.05}
              metalness={0.92}
            />
          </mesh>
          {/* Mullion Division */}
          {[-0.65, 0, 0.65].map((x, idx) => (
            <mesh key={`lwmull-${idx}`} position={[x, 0, 0.05]}>
              <boxGeometry args={[0.04, 0.82, 0.03]} />
              <meshStandardMaterial color="#334155" metalness={0.85} />
            </mesh>
          ))}
          {/* Architectural Concrete Header Lintels */}
          <mesh position={[0, 0.48, 0.04]} castShadow>
            <boxGeometry args={[2.15, 0.04, 0.10]} />
            <meshStandardMaterial color="#ded5c5" roughness={0.5} />
          </mesh>
        </group>

        {/* ------------------------------------------------------------ */}
        {/* 2D. GROUND FLOOR RIGHT WINDOW (+X): Grand Lounge Picture Window */}
        {/* ------------------------------------------------------------ */}
        <group position={[1.54, 0.04, -0.1]} rotation={[0, Math.PI / 2, 0]}>
          {/* 3D Extruded Window Box Frame */}
          <mesh position={[0, 0, 0.02]} castShadow>
            <boxGeometry args={[2.15, 0.95, 0.07]} />
            <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.25} />
          </mesh>
          {/* Glass Pane */}
          <mesh position={[0, 0, 0.04]}>
            <planeGeometry args={[2.05, 0.85]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#0284c7"
              emissiveIntensity={0.40}
              transparent
              opacity={0.75}
              roughness={0.05}
              metalness={0.92}
            />
          </mesh>
          {/* Mullions */}
          {[-0.70, 0, 0.70].map((x, idx) => (
            <mesh key={`rwmull-${idx}`} position={[x, 0, 0.05]}>
              <boxGeometry args={[0.04, 0.85, 0.03]} />
              <meshStandardMaterial color="#334155" metalness={0.85} />
            </mesh>
          ))}
          {/* Architectural Concrete Header Lintels */}
          <mesh position={[0, 0.50, 0.04]} castShadow>
            <boxGeometry args={[2.25, 0.04, 0.10]} />
            <meshStandardMaterial color="#ded5c5" roughness={0.5} />
          </mesh>
        </group>

        {/* Cantilever Slab Between Ground & Upper Floor */}
        <mesh position={[0, 0.63, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.65, 0.13, 2.75]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.35} metalness={0.12} />
        </mesh>
        {/* Architectural Slate Reveal Edge */}
        <mesh position={[0, 0.63, 1.38]}>
          <boxGeometry args={[3.67, 0.03, 0.02]} />
          <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.25} />
        </mesh>
      </group>

      {/* ============================================================== */}
      {/* 3. UPPER FLOOR: MODERN VILLA WITH WINDOWS ON EVERY SINGLE SIDE  */}
      {/* ============================================================== */}
      <group position={[0, 1.88, 0]}>
        {/* Main Upper Floor Mass (Warm Travertine Stone Facade) */}
        <mesh castShadow receiveShadow position={[0.22, 0, -0.15]}>
          <boxGeometry args={[2.95, 1.18, 2.15]} />
          <meshStandardMaterial color="#f1ece1" roughness={0.45} metalness={0.08} />
        </mesh>

        {/* Architectural Slate Feature Volume */}
        <mesh castShadow position={[-1.12, 0, -0.05]}>
          <boxGeometry args={[0.92, 1.18, 2.15]} />
          <meshStandardMaterial color="#475569" roughness={0.45} metalness={0.35} />
        </mesh>

        {/* Warm Teak Wood Rainscreen Slats (Vertical Louvers on Slate Feature) */}
        {[-0.75, -0.88, -1.01, -1.14, -1.27, -1.40].map((x, idx) => (
          <mesh key={`louver-${idx}`} position={[x, 0, 1.05]} castShadow>
            <boxGeometry args={[0.045, 1.08, 0.035]} />
            <meshStandardMaterial color="#92400e" roughness={0.65} metalness={0.1} />
          </mesh>
        ))}

        {/* Upper Floor Interior Golden Glow */}
        <mesh position={[0.22, 0, -0.15]}>
          <boxGeometry args={[2.50, 0.90, 1.70]} />
          <meshStandardMaterial color="#fef08a" emissive="#f59e0b" emissiveIntensity={0.55} roughness={0.8} />
        </mesh>

        {/* ------------------------------------------------------------ */}
        {/* 3A. UPPER FLOOR FRONT WINDOW (+Z): Master Suite Ribbon Window */}
        {/* ------------------------------------------------------------ */}
        <group position={[0.48, 0.12, 0.94]}>
          {/* Architectural Window Casing */}
          <mesh castShadow position={[0, 0, 0]}>
            <boxGeometry args={[2.28, 0.78, 0.04]} />
            <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.25} />
          </mesh>
          {/* Panoramic Glowing Glass Pane */}
          <mesh position={[0, 0, 0.032]}>
            <planeGeometry args={[2.18, 0.68]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#0284c7"
              emissiveIntensity={0.45}
              transparent
              opacity={0.80}
              roughness={0.06}
              metalness={0.92}
            />
          </mesh>
          {/* Mullions */}
          {[-0.55, 0.55].map((x, idx) => (
            <mesh key={`ufmull-${idx}`} position={[x, 0, 0.042]}>
              <boxGeometry args={[0.04, 0.68, 0.03]} />
              <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.2} />
            </mesh>
          ))}
        </group>

        {/* ------------------------------------------------------------ */}
        {/* 3B. UPPER FLOOR BACK WINDOWS (-Z): Dual Bedroom / Study Glazing */}
        {/* ------------------------------------------------------------ */}
        <group position={[0.22, 0, -1.24]} rotation={[0, Math.PI, 0]}>
          {/* Back Left Window */}
          <group position={[-0.72, 0.12, 0]}>
            <mesh castShadow position={[0, 0, 0]}>
              <boxGeometry args={[1.28, 0.78, 0.04]} />
              <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.25} />
            </mesh>
            <mesh position={[0, 0, 0.032]}>
              <planeGeometry args={[1.18, 0.68]} />
              <meshStandardMaterial
                color="#38bdf8"
                emissive="#0284c7"
                emissiveIntensity={0.42}
                transparent
                opacity={0.75}
                roughness={0.06}
                metalness={0.92}
              />
            </mesh>
            <mesh position={[0, 0, 0.042]}>
              <boxGeometry args={[0.04, 0.68, 0.03]} />
              <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.2} />
            </mesh>
          </group>

          {/* Back Right Window */}
          <group position={[0.72, 0.12, 0]}>
            <mesh castShadow position={[0, 0, 0]}>
              <boxGeometry args={[1.28, 0.78, 0.04]} />
              <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.25} />
            </mesh>
            <mesh position={[0, 0, 0.032]}>
              <planeGeometry args={[1.18, 0.68]} />
              <meshStandardMaterial
                color="#38bdf8"
                emissive="#0284c7"
                emissiveIntensity={0.42}
                transparent
                opacity={0.75}
                roughness={0.06}
                metalness={0.92}
              />
            </mesh>
            <mesh position={[0, 0, 0.042]}>
              <boxGeometry args={[0.04, 0.68, 0.03]} />
              <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.2} />
            </mesh>
          </group>
        </group>

        {/* ------------------------------------------------------------ */}
        {/* 3C. UPPER FLOOR LEFT WINDOWS (-X): Dual Studio Windows       */}
        {/* ------------------------------------------------------------ */}
        <group position={[-1.60, 0.12, -0.05]} rotation={[0, -Math.PI / 2, 0]}>
          {/* Left Window 1 */}
          <group position={[-0.52, 0, 0]}>
            <mesh castShadow position={[0, 0, 0]}>
              <boxGeometry args={[0.88, 0.90, 0.04]} />
              <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.25} />
            </mesh>
            <mesh position={[0, 0, 0.032]}>
              <planeGeometry args={[0.78, 0.80]} />
              <meshStandardMaterial
                color="#38bdf8"
                emissive="#0284c7"
                emissiveIntensity={0.42}
                transparent
                opacity={0.75}
                roughness={0.06}
                metalness={0.92}
              />
            </mesh>
            <mesh position={[0, 0, 0.042]}>
              <boxGeometry args={[0.035, 0.80, 0.03]} />
              <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.2} />
            </mesh>
          </group>

          {/* Left Window 2 */}
          <group position={[0.52, 0, 0]}>
            <mesh castShadow position={[0, 0, 0]}>
              <boxGeometry args={[0.88, 0.90, 0.04]} />
              <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.25} />
            </mesh>
            <mesh position={[0, 0, 0.032]}>
              <planeGeometry args={[0.78, 0.80]} />
              <meshStandardMaterial
                color="#38bdf8"
                emissive="#0284c7"
                emissiveIntensity={0.42}
                transparent
                opacity={0.75}
                roughness={0.06}
                metalness={0.92}
              />
            </mesh>
            <mesh position={[0, 0, 0.042]}>
              <boxGeometry args={[0.035, 0.80, 0.03]} />
              <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.2} />
            </mesh>
          </group>
        </group>

        {/* ------------------------------------------------------------ */}
        {/* 3D. UPPER FLOOR RIGHT WINDOW (+X): Sunrise Panoramic Ribbon  */}
        {/* ------------------------------------------------------------ */}
        <group position={[1.71, 0.12, -0.15]} rotation={[0, Math.PI / 2, 0]}>
          <mesh castShadow position={[0, 0, 0]}>
            <boxGeometry args={[1.98, 0.78, 0.04]} />
            <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0, 0.032]}>
            <planeGeometry args={[1.88, 0.68]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#0284c7"
              emissiveIntensity={0.42}
              transparent
              opacity={0.75}
              roughness={0.06}
              metalness={0.92}
            />
          </mesh>
          {[-0.45, 0.45].map((x, idx) => (
            <mesh key={`urwmull-${idx}`} position={[x, 0, 0.042]}>
              <boxGeometry args={[0.04, 0.68, 0.03]} />
              <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.2} />
            </mesh>
          ))}
          {/* Exterior Teak Shade Louvers */}
          {[-0.20, 0.20].map((y, idx) => (
            <mesh key={`rlouv-${idx}`} position={[0, y, 0.07]}>
              <boxGeometry args={[1.90, 0.03, 0.06]} />
              <meshStandardMaterial color="#92400e" roughness={0.65} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ============================================================== */}
      {/* 4. HOUSE TERRACE: OUTDOOR DECK, SAFETY RAILINGS & CABIN        */}
      {/* ============================================================== */}
      <group position={[0, 2.55, 0]}>
        {/* Terrace Deck Slab - Crisp Architectural Cantilever Slab */}
        <mesh receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[3.52, 0.15, 2.68]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.35} metalness={0.12} />
        </mesh>
        {/* Warm Teak Decking Inset */}
        <mesh receiveShadow position={[0, 0.08, 0]}>
          <boxGeometry args={[3.44, 0.02, 2.58]} />
          <meshStandardMaterial color="#b45309" roughness={0.65} metalness={0.1} />
        </mesh>

        {/* Perimeter Safety Balustrades (Full 4-sided enclosure) */}
        {/* Front Railing (Z = +1.31) */}
        <mesh position={[0, 0.30, 1.31]}>
          <boxGeometry args={[3.46, 0.46, 0.02]} />
          <meshStandardMaterial color="#38bdf8" transparent opacity={0.35} roughness={0.06} metalness={0.92} />
        </mesh>
        <mesh position={[0, 0.54, 1.31]}>
          <boxGeometry args={[3.48, 0.03, 0.045]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.4} roughness={0.3} />
        </mesh>

        {/* Back Railing (Z = -1.31) */}
        <mesh position={[0, 0.30, -1.31]}>
          <boxGeometry args={[3.46, 0.46, 0.02]} />
          <meshStandardMaterial color="#38bdf8" transparent opacity={0.35} roughness={0.06} metalness={0.92} />
        </mesh>
        <mesh position={[0, 0.54, -1.31]}>
          <boxGeometry args={[3.48, 0.03, 0.045]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.4} roughness={0.3} />
        </mesh>

        {/* Left Railing (X = -1.73) */}
        <mesh position={[-1.73, 0.30, 0]}>
          <boxGeometry args={[0.02, 0.46, 2.61]} />
          <meshStandardMaterial color="#38bdf8" transparent opacity={0.35} roughness={0.06} metalness={0.92} />
        </mesh>
        <mesh position={[-1.73, 0.54, 0]}>
          <boxGeometry args={[0.045, 0.03, 2.63]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.4} roughness={0.3} />
        </mesh>

        {/* Right Railing (X = +1.73) */}
        <mesh position={[1.73, 0.30, 0]}>
          <boxGeometry args={[0.02, 0.46, 2.61]} />
          <meshStandardMaterial color="#38bdf8" transparent opacity={0.35} roughness={0.06} metalness={0.92} />
        </mesh>
        <mesh position={[1.73, 0.54, 0]}>
          <boxGeometry args={[0.045, 0.03, 2.63]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.4} roughness={0.3} />
        </mesh>

        {/* Rooftop Penthouse Stairwell Access Pavilion */}
        {/* Centered at [-1.05, 0.48, -0.65], width 1.05, depth 1.10 */}
        <group position={[-1.05, 0.48, -0.65]}>
          <mesh castShadow>
            <boxGeometry args={[1.05, 0.88, 1.10]} />
            <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.35} />
          </mesh>
          {/* Front Illuminated Sliding Glass Door */}
          <mesh position={[0, -0.04, 0.56]}>
            <planeGeometry args={[0.68, 0.74]} />
            <meshStandardMaterial color="#fef08a" emissive="#eab308" emissiveIntensity={0.65} />
          </mesh>
          {/* Side East Picture Window */}
          <mesh position={[0.54, 0.04, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[0.72, 0.55]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.35} />
          </mesh>
          {/* Rear North Transom Window */}
          <mesh position={[0, 0.08, -0.56]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[0.70, 0.42]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.35} />
          </mesh>
          {/* Modern Pergola Slats (Warm Teak) */}
          {[-0.35, -0.12, 0.12, 0.35].map((z, idx) => (
            <mesh key={`perg-${idx}`} position={[0, 0.48, z]} castShadow>
              <boxGeometry args={[1.15, 0.035, 0.05]} />
              <meshStandardMaterial color="#92400e" roughness={0.65} metalness={0.1} />
            </mesh>
          ))}
          {/* Penthouse Rooftop Solar Panel (Mounted strictly on cabin roof!) */}
          <RealisticSolarPanel position={[0, 0.52, 0]} tiltAngle={0.25} width={0.85} length={0.95} />
        </group>

        {/* High-Tech Terrace Solar Inverter & LiFePO4 Battery Energy Hub */}
        <group position={[-0.42, 0.42, -0.55]}>
          <mesh castShadow>
            <boxGeometry args={[0.15, 0.56, 0.42]} />
            <meshStandardMaterial color="#f1f5f9" metalness={0.5} roughness={0.2} />
          </mesh>
          <mesh position={[-0.08, 0, 0]}>
            <boxGeometry args={[0.015, 0.50, 0.38]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.15} />
          </mesh>
          <mesh position={[0.08, 0.18, 0.10]}>
            <sphereGeometry args={[0.024, 12, 12]} />
            <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={3.0} />
          </mesh>
          <mesh position={[0.08, 0.05, 0]}>
            <planeGeometry args={[0.01, 0.16]} />
            <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={1.8} />
          </mesh>
        </group>

        {/* ============================================================== */}
        {/* 5. HOUSE TERRACE SOLAR PLANT (SIGNIFICANTLY ENLARGED MODULES)   */}
        {/* Strictly placed INSIDE the terrace perimeter bounds:           */}
        {/* Bounds: X [-0.30, +1.58] (well inside +/- 1.73), Z [-1.15, +1.10]*/}
        {/* Zero overhang, zero floating in thin air!                      */}
        {/* ============================================================== */}
        <group position={[0.62, 0.18, 0.0]}>
          {/* FRONT ROW: 2 Extra-Large Commercial Monocrystalline Panels */}
          {/* Left panel at X = -0.48, Right panel at X = +0.48 */}
          <RealisticSolarPanel position={[-0.48, 0, 0.52]} tiltAngle={0.38} width={0.92} length={1.15} />
          <RealisticSolarPanel position={[0.48, 0, 0.52]} tiltAngle={0.38} width={0.92} length={1.15} />

          {/* REAR ROW: Elevated on Galvanized Rack to Prevent Self-Shading */}
          <group position={[0, 0.26, -0.55]}>
            <RealisticSolarPanel position={[-0.48, 0, 0]} tiltAngle={0.38} width={0.92} length={1.15} />
            <RealisticSolarPanel position={[0.48, 0, 0]} tiltAngle={0.38} width={0.92} length={1.15} />
          </group>

          {/* Sturdy Galvanized Steel Mounting Rails Connecting the Array */}
          {/* Width 1.90m, strictly inside terrace bounds! */}
          <mesh position={[0, 0.04, 0.52]}>
            <boxGeometry args={[1.92, 0.035, 0.04]} />
            <meshStandardMaterial color="#475569" metalness={0.92} roughness={0.18} />
          </mesh>
          <mesh position={[0, 0.04, 0.10]}>
            <boxGeometry args={[1.92, 0.035, 0.04]} />
            <meshStandardMaterial color="#475569" metalness={0.92} roughness={0.18} />
          </mesh>
          <mesh position={[0, 0.28, -0.55]}>
            <boxGeometry args={[1.92, 0.035, 0.04]} />
            <meshStandardMaterial color="#475569" metalness={0.92} roughness={0.18} />
          </mesh>
          <mesh position={[0, 0.28, -0.95]}>
            <boxGeometry args={[1.92, 0.035, 0.04]} />
            <meshStandardMaterial color="#475569" metalness={0.92} roughness={0.18} />
          </mesh>

          {/* Heavy Concrete Ballast Mounting Feet (Securing array to deck) */}
          {[-0.88, 0, 0.88].map((x, idx) => (
            <group key={`ballast-${idx}`} position={[x, -0.05, 0]}>
              <mesh position={[0, 0, 0.52]}>
                <boxGeometry args={[0.16, 0.08, 0.22]} />
                <meshStandardMaterial color="#64748b" roughness={0.7} />
              </mesh>
              <mesh position={[0, 0, -0.55]}>
                <boxGeometry args={[0.16, 0.08, 0.22]} />
                <meshStandardMaterial color="#64748b" roughness={0.7} />
              </mesh>
            </group>
          ))}

          {/* DC Solar Conduit Cable Tray to Inverter */}
          <mesh position={[-0.96, 0, -0.15]}>
            <boxGeometry args={[0.04, 0.025, 1.05]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>

        {/* ============================================================== */}
        {/* 6. VERTICAL-AXIS WIND TURBINE (VAWT ON FRONT-LEFT CORNER)      */}
        {/* Position [-1.25, 0.08, 0.80] - firmly inside the corner deck   */}
        {/* ============================================================== */}
        <RealisticVAWT
          position={[-1.25, 0.08, 0.80]}
          scale={1.06}
          rotationSpeed={4.2}
        />
      </group>
    </group>
  );
};

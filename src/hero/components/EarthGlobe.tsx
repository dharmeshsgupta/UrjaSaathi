import React from 'react';
import { HouseBuildingModel } from './HouseBuildingModel';

interface EarthGlobeProps {
  radius?: number;
  rotationSpeed?: number;
}

/**
 * 3D Eco-Smart House & Building with Rooftop Terrace Solar Plant
 * and Vertical-Axis Wind Turbine (VAWT).
 */
export const EarthGlobe: React.FC<EarthGlobeProps> = ({ 
  rotationSpeed = 0.08 
}) => {
  return (
    <HouseBuildingModel
      scale={0.92}
      rotationSpeed={rotationSpeed}
    />
  );
};

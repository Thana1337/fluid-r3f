// src/components/SunLight.jsx
import React from "react";

const SunLight = ({ isNight }) => (
  <>
    <directionalLight
      castShadow
      position={[5, 10, 5]}
      intensity={isNight ? 0.2 : 1.5}
      color={isNight ? "blue" : "white"}
    />
    <ambientLight intensity={isNight ? 0.5 : 0.8} />
  </>
);

export default SunLight;

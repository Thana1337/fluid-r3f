// src/components/SunLight.jsx
import React from "react";

const SunLight = ({ isNight }) => (
  <>
    <directionalLight position={[5, 10, 5]} intensity={isNight ? 0.2 : 1.5} color={isNight ? "blue" : "yellow"} />
    <ambientLight intensity={isNight ? 0.02 : 0.3} />
  </>
);

export default SunLight;
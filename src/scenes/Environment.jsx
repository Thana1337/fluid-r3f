// src/scenes/Environment.jsx
import React from "react";
import SunLight from "../components/SunLight";
import CelestialBody from "../components/CelestialBody";

const Environment = ({ isNight }) => (
  <>
    <SunLight isNight={isNight} />
    <CelestialBody isNight={isNight} />
  </>
);

export default Environment;
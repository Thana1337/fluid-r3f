// src/components/CelestialBody.jsx
import React, { useState, useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";

function CelestialBody({ isNight }) {
  const moonRef = useRef();
  const sunRef = useRef();
  const [sunPosition, setSunPosition] = useState([0, 100, -100]);
  const [moonPosition, setMoonPosition] = useState([-10, -50, -100]);

  useEffect(() => {
    let targetSunY = isNight ? -50 : 100;
    let targetMoonY = isNight ? 100 : -50;
    let speed = 10;
    const interval = setInterval(() => {
      setSunPosition((prev) => {
        let newY = prev[1] + (isNight ? -speed : speed);
        if ((isNight && newY <= targetSunY) || (!isNight && newY >= targetSunY)) {
          clearInterval(interval);
          return [prev[0], targetSunY, prev[2]];
        }
        return [prev[0], newY, prev[2]];
      });
      setMoonPosition((prev) => {
        let newY = prev[1] + (isNight ? speed : -speed);
        if ((isNight && newY >= targetMoonY) || (!isNight && newY <= targetMoonY)) {
          clearInterval(interval);
          return [prev[0], targetMoonY, prev[2]];
        }
        return [prev[0], newY, prev[2]];
      });
    }, 50);
    return () => clearInterval(interval);
  }, [isNight]);

  return (
    <group>
      {/* Moon */}
      <primitive
        ref={moonRef}
        object={useGLTF("/models/moon.glb").scene}
        position={moonPosition}
        scale={[0.7, 0.7, 0.7]}
      />
      {/* Sun */}
      <primitive
        ref={sunRef}
        object={useGLTF("/models/sun.glb").scene}
        position={sunPosition}
        scale={[0.05, 0.05, 0.05]}
      />
    </group>
  );
}

export default CelestialBody;

// src/components/Lamp.jsx
import React, { useState, useEffect } from "react";
import GLBModel from "./GLBModel";

function Lamp({ isPowered }) {
  const [lightIntensity, setLightIntensity] = useState(0);
  const [blinking, setBlinking] = useState(false);

  useEffect(() => {
    if (blinking) return;
    if (isPowered) {
      setBlinking(true);
      let blinkCount = 0;
      const blinkInterval = setInterval(() => {
        setLightIntensity((prev) => (prev > 0 ? 0 : 1));
        blinkCount++;
        if (blinkCount >= 4) {
          clearInterval(blinkInterval);
          setBlinking(false);
          setLightIntensity(1);
        }
      }, 200);
    } else {
      let intensity = lightIntensity;
      const fadeInterval = setInterval(() => {
        intensity -= 0.1;
        if (intensity <= 0) {
          clearInterval(fadeInterval);
          setLightIntensity(0);
        } else {
          setLightIntensity(intensity);
        }
      }, 100);
    }
  }, [isPowered]);

  return (
    <group position={[2.7, 0, -2.2]}>
      <GLBModel
        path="/models/simple_low_poly_table_lamp.glb"
        position={[0, 0.98, 0]}
        scale={0.0005}
        rotation={[0,-Math.PI /4 ,0]}
      />
      {lightIntensity > 0 && (
        <pointLight
          intensity={lightIntensity}
          distance={5}
          position={[0, 1.4, 0.2]}
          color="yellow"
        />
      )}
    </group>
  );
}

export default Lamp;

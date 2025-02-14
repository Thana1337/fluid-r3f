// src/hooks/useSceneEffects.js
import { useEffect } from "react";
import * as THREE from "three";

const useSceneEffects = (isNight, setBackgroundColor) => {
  useEffect(() => {
    let targetColor = isNight ? "#0b1d3d" : "#ffcc88";
    let step = 0;
    const transitionInterval = setInterval(() => {
      setBackgroundColor((prev) => {
        let c1 = new THREE.Color(prev);
        let c2 = new THREE.Color(targetColor);
        let interpolated = c1.lerp(c2, step / 50);
        step++;
        if (step >= 50) {
          clearInterval(transitionInterval);
          return targetColor;
        }
        return `#${interpolated.getHexString()}`;
      });
    }, 30);
    return () => clearInterval(transitionInterval);
  }, [isNight]);
};

export default useSceneEffects;

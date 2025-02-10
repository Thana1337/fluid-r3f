// src/hooks/useBackgroundTransition.js
import { useEffect, useState } from "react";
import * as THREE from "three";

/**
 * Custom hook that smoothly transitions a background color.
 * @param {boolean} isNight - Whether night mode is active.
 * @param {number} duration - Total number of steps for the transition.
 * @param {number} intervalTime - Milliseconds between steps.
 */
export function useBackgroundTransition(isNight, duration = 50, intervalTime = 30) {
  const [backgroundColor, setBackgroundColor] = useState("#ffcc88");

  useEffect(() => {
    const targetColor = isNight ? "#0b1d3d" : "#ffcc88";
    let step = 0;
    const interval = setInterval(() => {
      setBackgroundColor((prev) => {
        const current = new THREE.Color(prev);
        const target = new THREE.Color(targetColor);
        const t = (step + 1) / duration;
        current.lerp(target, t);
        step++;
        if (step >= duration) {
          clearInterval(interval);
          return targetColor;
        }
        return `#${current.getHexString()}`;
      });
    }, intervalTime);
    return () => clearInterval(interval);
  }, [isNight, duration, intervalTime]);

  return backgroundColor;
}

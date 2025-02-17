// src/components/Wall_light.jsx
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

const Wall_light = ({ position, rotation, scale, intensity = 1 }) => {
  const { scene } = useGLTF("/models/wall_light.glb");
  const lightRef = useRef();
  const currentIntensity = useRef(intensity);

  useFrame((state, delta) => {
    const lerpFactor = 0.03;
    currentIntensity.current += (intensity - currentIntensity.current) * lerpFactor;
    if (lightRef.current) {
      lightRef.current.intensity = 20 * currentIntensity.current;
    }
  });

  return (
    <group>
      <primitive
        object={scene.clone()}
        position={position}
        rotation={rotation}
        scale={scale}
      />
      <pointLight
        ref={lightRef}
        position={position}
        intensity={20 * intensity} 
        distance={10}
        color="yellow"
        castShadow
      />
    </group>
  );
};

export default Wall_light;

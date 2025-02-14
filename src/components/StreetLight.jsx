// src/components/StreetLight.jsx
import React from "react";
import { useGLTF } from "@react-three/drei";

const StreetLight = () => {
  return (
    <group position={[1.5, 0, -2]}>
      <primitive object={useGLTF("/models/street_light.glb").scene} position={[-10, 0, -7]} scale={[1, 1, 1]} rotation={[0, Math.PI / 4, 0]} />
      <pointLight intensity={10} distance={10} position={[-8, 1, -5]} color="yellow" />
    </group>
  );
};

export default StreetLight;
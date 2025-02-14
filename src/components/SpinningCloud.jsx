// src/components/SpinningCloud.jsx
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

const SpinningCloud = ({ position, scale, rotationSpeed = 0.0001 }) => {
  const cloudRef = useRef();
  const { scene } = useGLTF("/models/cloud.glb");
  useFrame(() => {
    if (cloudRef.current) {
      cloudRef.current.rotation.y += rotationSpeed;
    }
  });
  return <primitive ref={cloudRef} object={scene} position={position} scale={scale} />;
};

export default SpinningCloud;

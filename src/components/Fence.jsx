// src/components/Fence.jsx
import React from "react";
import { useGLTF } from "@react-three/drei";

const Fence = ({ position, rotation, scale }) => {
  const { scene } = useGLTF("/models/fence.glb");
  return <primitive object={scene.clone()} position={position} rotation={rotation} scale={scale} />;
};

export default Fence;


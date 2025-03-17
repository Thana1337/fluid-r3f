// src/components/Character.jsx
import React, { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import NameTag from "./NameTag";

const Character = ({ color, username, ...props }) => {
  const { scene } = useGLTF("/models/character_model.glb");

  // Clone and modify the scene so that changes don't affect the original.
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (child.isMesh) {
        child.material = child.material.clone();
        child.material.color = new THREE.Color(color);
      }
    });
    return clone;
  }, [scene, color]);

  return (
    <group {...props}>
      <primitive object={clonedScene} />
      {/* Floating name tag above the character */}
      <NameTag username={username} offset={[0, 1, 0]} />
    </group>
  );
};

export default Character;

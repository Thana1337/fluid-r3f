// Water.jsx
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import "../shaders/RiverMaterial"; // Ensure the shader extension is imported

const Water = ({ position = [0, -2, 0], scale = [10, 1, 10] }) => {
  const materialRef = useRef();

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.update(delta);
    }
  });

  return (
    <mesh position={position} scale={scale} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[10, 10, 1, 1]} />
      <riverMaterial ref={materialRef} />
    </mesh>
  );
};

export default Water;

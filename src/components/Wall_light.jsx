import React from "react";
import { useGLTF  } from "@react-three/drei";

const Wall_light = ({ position, rotation, scale }) => {
  const { scene } = useGLTF("/models/wall_light.glb");
  return (
  <group>
    <primitive object={scene.clone()} position={position} rotation={rotation} scale={scale} />;
    <pointLight position={position} intensity={20} distance={10} color="yellow" castShadow/>
  </group>
  );
};

export default Wall_light;
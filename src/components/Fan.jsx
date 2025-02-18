// src/components/Fan.jsx
import React, { useEffect, useState } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

const Fan = ({ isPowered }) => {
  const { scene, animations } = useGLTF("/models/fan_lowpoly.glb");
  const { actions } = useAnimations(animations, scene);
  const [animationSpeed, setAnimationSpeed] = useState(0);

  // Gradually adjust animation speed when isPowered changes.
  useEffect(() => {
    if (!actions || !actions["Take 001"]) return;

    const targetSpeed = isPowered ? 1 : 0;
    const speedStep = isPowered ? 0.1 : -0.1;
    const interval = setInterval(() => {
      setAnimationSpeed((prev) => {
        const newSpeed = prev + speedStep;
        if ((isPowered && newSpeed >= targetSpeed) || (!isPowered && newSpeed <= targetSpeed)) {
          clearInterval(interval);
          return targetSpeed;
        }
        return newSpeed;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isPowered, actions]);

  // When the animationSpeed changes, play the "Take 001" clip and update its timeScale.
  useEffect(() => {
    console.log("Animations:", animations);
    console.log("Actions:", actions);
    if (actions["Take 001"]) {
      actions["Take 001"].play();
      actions["Take 001"].timeScale = animationSpeed;
    }
  }, [animationSpeed, actions, animations]);

  return (
    <primitive
      object={scene}
      position={[2.5, 1, -1.7]}
      scale={0.15}
      rotation={[0, -Math.PI / 2.5, 0]}
    />
  );
};

export default Fan;

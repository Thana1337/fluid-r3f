// src/components/Fan.jsx
import React, { useEffect, useState } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

const Fan = ({ isPowered }) => {
  const { scene, animations } = useGLTF("/models/fan.glb");
  const { actions } = useAnimations(animations, scene);
  const [animationSpeed, setAnimationSpeed] = useState(0);

  useEffect(() => {
    if (!actions || !actions.Animation) return;
    let targetSpeed = isPowered ? 1 : 0;
    let speedStep = isPowered ? 0.1 : -0.1;
    const interval = setInterval(() => {
      setAnimationSpeed((prev) => {
        let newSpeed = prev + speedStep;
        if ((isPowered && newSpeed >= targetSpeed) || (!isPowered && newSpeed <= targetSpeed)) {
          clearInterval(interval);
          return targetSpeed;
        }
        return newSpeed;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isPowered, actions]);

  useEffect(() => {
    if (actions.Animation) {
      actions.Animation.play();
      actions.Animation.timeScale = animationSpeed;
    }
  }, [animationSpeed, actions]);

  return <primitive object={scene} position={[1.5, 1, -2]} scale={[1, 1, 1]} />;
};

export default Fan;
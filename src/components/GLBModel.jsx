// src/components/GLBModel.jsx
import React, { useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

const GLBModel = ({ path, position, scale, rotation, animationSpeed = 1 }) => {
  const { scene, animations } = useGLTF(path);
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    if (actions) {
      Object.values(actions).forEach((action) => {
        action.play();
        action.timeScale = animationSpeed;
      });
    }
  }, [actions, animationSpeed]);

  return <primitive object={scene} position={position} scale={scale} rotation={rotation} />;
};

export default GLBModel;
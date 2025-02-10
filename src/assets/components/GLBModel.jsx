// src/components/GLBModel.jsx
import React, { useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

const GLBModel = ({ path, position, scale, rotation, animationSpeed }) => {
  const { scene, animations } = useGLTF(path);
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    const animationName = "M_rig_Action_S";
    if (actions && actions[animationName]) {
      actions[animationName].play();
      actions[animationName].timeScale = animationSpeed;
    }
    return () => {
      if (actions && actions[animationName]) actions[animationName].stop();
    };
  }, [actions, animationSpeed]);

  if (rotation) scene.rotation.set(...rotation);

  return <primitive object={scene} position={position} scale={scale} />;
};

export default GLBModel;

import React, { useEffect, useMemo } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { clone as SkeletonUtilsClone } from "three/examples/jsm/utils/SkeletonUtils";

const GLBModel = ({ path, position, scale, rotation, animationSpeed = 1 }) => {
  const { scene: originalScene, animations } = useGLTF(path);

  // Clone the scene so that each instance is separate
  const scene = useMemo(() => SkeletonUtilsClone(originalScene), [originalScene]);

  // Traverse the scene and enable shadows for each mesh
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);  

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

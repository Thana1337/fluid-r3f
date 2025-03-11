import React, { useEffect, useMemo } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { clone as SkeletonUtilsClone } from "three/examples/jsm/utils/SkeletonUtils";

const GLBModel = ({
  path,
  position,
  scale,
  rotation,
  animationSpeed = 1,
  manual = false,
  onActionsLoaded,
}) => {
  const { scene: originalScene, animations } = useGLTF(path);

  // Clone the scene so that each instance is separate
  const scene = useMemo(() => SkeletonUtilsClone(originalScene), [originalScene]);

  // Enable shadows on all meshes in the scene
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  const { actions } = useAnimations(animations, scene);

  // Notify parent component once actions are ready
  useEffect(() => {
    if (actions && onActionsLoaded) {
      onActionsLoaded(actions);
    }
  }, [actions, onActionsLoaded]);

  // Auto-play animations only if manual is false
  useEffect(() => {
    if (actions && !manual) {
      Object.values(actions).forEach((action) => {
        action.play();
        action.timeScale = animationSpeed;
      });
    }
  }, [actions, animationSpeed, manual]);

  return <primitive object={scene} position={position} scale={scale} rotation={rotation} />;
};

export default GLBModel;

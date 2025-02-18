// src/components/Lever.jsx
import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

const Lever = ({ isOn, toggle }) => {
  const group = useRef();
  // Load the lever model which includes the animation
  const { scene, animations } = useGLTF("/models/lever.glb");
  // Bind animations to the model's group
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (!actions || !actions["Animation"]) return;
    actions["Animation"].reset();
    actions["Animation"].timeScale = isOn ? 1 : -1;
    actions["Animation"].play();
  }, [isOn, actions]);

  return (
    <primitive
      ref={group}
      object={scene}
      onPointerDown={toggle}
      dispose={null}
    />
  );
};

export default Lever;

// StickyChatOverlay.jsx
import React, { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";

const StickyChatOverlay = ({ children, offset = [-0.7, -0.5, -3] }) => {
  const { camera } = useThree();
  const groupRef = useRef();

  useEffect(() => {
    if (groupRef.current) {
      camera.add(groupRef.current);
    }
    return () => {
      if (groupRef.current) {
        camera.remove(groupRef.current);
      }
    };
  }, [camera]);

  return (
    <group ref={groupRef} position={offset}>
      <group position={[0, 0, 0.01]}>
        {children}
      </group>
    </group>
  );
};

export default StickyChatOverlay;

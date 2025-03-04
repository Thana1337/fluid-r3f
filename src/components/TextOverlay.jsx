import React, { useRef, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";

const TextOverlay = () => {
  const { camera } = useThree();
  const hudRef = useRef();

  useEffect(() => {
    if (hudRef.current) {
      // Attach the HUD group to the camera
      camera.add(hudRef.current);
      // Set initial position relative to the camera
      hudRef.current.position.set(0, 0, -2);
    }
    return () => {
      if (hudRef.current) camera.remove(hudRef.current);
    };
  }, [camera]);

  return (
    <group ref={hudRef}>
      <Text
        fontSize={0.1}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        TEST
      </Text>
    </group>
  );
};

export default TextOverlay;

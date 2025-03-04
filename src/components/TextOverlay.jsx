// src/components/TextOverlay.jsx
import React, { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Text, Billboard } from "@react-three/drei";

const TextOverlay = ({ visible = false, text = "TEST", offset = [0, -0.5, -1] }) => {
  const { camera } = useThree();
  const hudRef = useRef();

  // Update the overlay's position relative to the camera using the provided offset.
  useFrame(() => {
    if (hudRef.current) {
      hudRef.current.position.set(...offset);
    }
  });

  useEffect(() => {
    if (hudRef.current) {
      camera.add(hudRef.current);
    }
    return () => {
      if (hudRef.current) camera.remove(hudRef.current);
    };
  }, [camera]);

  return (
    <group ref={hudRef} visible={visible}>
      <Billboard>
        <Text
          fontSize={0.07}
          color="white"
          anchorX="center"
          anchorY="middle"
          material-depthTest={false}
          outlineWidth={0.08}
          outlineColor="black"
        >
          {text}
        </Text>
      </Billboard>
    </group>
  );
};

export default TextOverlay;

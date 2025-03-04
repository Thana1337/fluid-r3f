// src/components/TextOverlay.jsx
import React, { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Text, Billboard } from "@react-three/drei";

const TextOverlay = ({ visible = false, text = "TEST" }) => {
  const { camera } = useThree();
  const hudRef = useRef();

  // Every frame, update the overlay's position relative to the camera.
  useFrame(() => {
    if (hudRef.current) {
      // Position relative to camera: adjust Y and Z as needed.
      hudRef.current.position.set(0, -0.5, -1);
    }
  });

  useEffect(() => {
    if (hudRef.current) {
      // Attach the overlay to the camera so it moves with it.
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
          fontSize={0.1}     
          color="white"
          anchorX="center"
          anchorY="middle"
          material-depthTest={false}
          outlineWidth={0.1}
          outlineColor="black"
        >
          {text}
        </Text>
      </Billboard>
    </group>
  );
};

export default TextOverlay;

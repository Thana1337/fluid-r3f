// src/components/InteractiveWithTip.jsx
import React, { useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import GameTip from "./GameTip";

const InteractiveWithTip = ({ tip, tipPosition, onClick, children }) => {
  const { camera } = useThree();
  const [visible, setVisible] = useState(false);

  // Convert the tip position (provided as an array) to a THREE.Vector3.
  const pos = new THREE.Vector3(...tipPosition);
  const thresholdDistance = 3; // Distance threshold in world units
  const lookThreshold = 0.95; // Dot product threshold

  useFrame(() => {
    // Calculate the distance from the camera to the tip position
    const distance = camera.position.distanceTo(pos);

    // Get the camera's forward direction and compute the direction to the object
    const cameraDir = new THREE.Vector3();
    camera.getWorldDirection(cameraDir);
    const directionToObj = pos.clone().sub(camera.position).normalize();
    const dot = cameraDir.dot(directionToObj);

    // Show tip if close enough or if looking directly at the object
    const shouldShow = distance < thresholdDistance || dot > lookThreshold;
    setVisible(shouldShow);
  });

  return (
    <group onPointerDown={onClick} pointerEventsType={{ deny: 'grab' }}>
      {children}
      <GameTip tip={tip} position={tipPosition} visible={visible} />
    </group>
  );
};

export default InteractiveWithTip;

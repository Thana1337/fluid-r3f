// src/components/InteractiveWithTip.jsx
import React, { useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import GameTip from "./GameTip";
import useAButtonToggle from "../hooks/useAButtonToggle";

const InteractiveWithTip = ({ tip, tipPosition, onClick, children }) => {
  const { camera } = useThree();
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Compute tip visibility based on camera distance/direction
  const pos = new THREE.Vector3(...tipPosition);
  const thresholdDistance = 0.1;
  const lookThreshold = 0.9;

  useFrame(() => {
    const distance = camera.position.distanceTo(pos);
    const cameraDir = new THREE.Vector3();
    camera.getWorldDirection(cameraDir);
    const directionToObj = pos.clone().sub(camera.position).normalize();
    const dot = cameraDir.dot(directionToObj);
    const shouldShow = distance < thresholdDistance || dot > lookThreshold;
    setVisible(shouldShow);
  });

  const aButtonPressed = useAButtonToggle();

  useEffect(() => {
    if (hovered && aButtonPressed) {
      onClick();
    }
  }, [hovered, aButtonPressed, onClick]);

  return (
    <group
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {children}
      <GameTip tip={tip} position={tipPosition} visible={visible} />
    </group>
  );
};

export default InteractiveWithTip;

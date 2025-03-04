// src/components/SleepingBagWithTip.jsx
import React, { useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import GLBModel from "../components/GLBModel";
import GameTip from "../components/GameTip";
import useAButtonToggle from "../hooks/useAButtonToggle";

const SleepingBagWithTip = ({ toggleNightMode }) => {
  const { camera } = useThree();
  const [tipVisible, setTipVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const aButtonPressed = useAButtonToggle();
  const [prevAButtonPressed, setPrevAButtonPressed] = useState(false);

  const sleepingBagPos = new THREE.Vector3(0, 0, 6);
  const thresholdDistance = 1;
  const lookThreshold = 0.7;

  useFrame(() => {
    const distance = camera.position.distanceTo(sleepingBagPos);
    const cameraDir = new THREE.Vector3();
    camera.getWorldDirection(cameraDir);
    const directionToBag = sleepingBagPos.clone().sub(camera.position).normalize();
    const dot = cameraDir.dot(directionToBag);

    const shouldShowTip = distance < thresholdDistance || Math.abs(dot) > lookThreshold;
    setTipVisible(shouldShowTip);
  });


  useEffect(() => {
    if (hovered && aButtonPressed && !prevAButtonPressed) {
      toggleNightMode();
    }
    setPrevAButtonPressed(aButtonPressed);
  }, [hovered, aButtonPressed, prevAButtonPressed, toggleNightMode]);

  return (
    <group
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Invisible interaction mesh */}
      <mesh position={[0, 0, 6]} scale={[4, 1, 2]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial opacity={0} transparent />
      </mesh>

      {/* Sleeping bag model */}
      <GLBModel
        path="/models/sleeping_bag.glb"
        position={[0, 0, 6]}
        scale={0.02}
        rotation={[0, Math.PI / 2, 0]}
      />

      {/* Tip displayed near the bag */}
      <GameTip
        tip="Press Ⓐ on the sleeping bag to toggle day/night"
        position={[0, 1, 6]}
        visible={tipVisible}
      />
    </group>
  );
};

export default SleepingBagWithTip;

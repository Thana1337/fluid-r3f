import React, { useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import GLBModel from "../components/GLBModel";
import GameTip from "../components/GameTip";

const SleepingBagWithTip = ({ toggleNightMode }) => {
  const { camera } = useThree();
  const [tipVisible, setTipVisible] = useState(false);

  // Define the sleeping bag's position (should match the model's position)
  const sleepingBagPos = new THREE.Vector3(0, 0, 6);
  // Distance (in world units) within which the tip shows
  const thresholdDistance = 3;
  // Dot product threshold to determine if the camera is "looking" at the bag
  const lookThreshold = 0.95;

  useFrame(() => {
    // Calculate the distance from the camera to the sleeping bag
    const distance = camera.position.distanceTo(sleepingBagPos);

    // Determine if the camera is looking at the sleeping bag
    const cameraDir = new THREE.Vector3();
    camera.getWorldDirection(cameraDir);
    const directionToBag = sleepingBagPos.clone().sub(camera.position).normalize();
    const dot = cameraDir.dot(directionToBag);

    // The tip will be visible if the camera is close or looking directly at the bag
    const shouldShowTip = distance < thresholdDistance || dot > lookThreshold;
    setTipVisible(shouldShowTip);
  });

  return (
    <group onPointerDown={toggleNightMode}>
      {/* Larger invisible hit area for interaction */}
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

      {/* Game tip that only appears when tipVisible is true */}
      <GameTip
        tip="Tap the sleeping bag to toggle day/night"
        position={[0, 1, 6]}
        visible={tipVisible}
      />
    </group>
  );
};

export default SleepingBagWithTip;

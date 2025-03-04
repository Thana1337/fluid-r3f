// src/components/SitChair.jsx
import React, { useState, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import GLBModel from "./GLBModel";
import GameTip from "./GameTip";
import useBButtonToggle from "../hooks/useBButtonToggle";

const SitChair = ({
  // Chair seat position relative to the XROrigin
  seatPosition = [2, 1.2, -1],
  // Exit position when standing up
  exitPosition = [2, 1.2, -2],
  // Callbacks passed from parent to update the sitting state.
  onSit = () => {},
  onStand = () => {},
}) => {
  const { camera } = useThree();
  const [sitting, setSitting] = useState(false);
  const [hovered, setHovered] = useState(false);
  const bButtonPressed = useBButtonToggle();
  const [prevBButtonPressed, setPrevBButtonPressed] = useState(false);

  // When clicking the chair, lock the player's origin into the chair’s seat
  const handleSit = () => {
    if (!sitting) {
      if (camera.parent) {
        camera.parent.position.set(...seatPosition);
      } else {
        camera.position.set(...seatPosition);
      }
      onSit(); // notify parent that we're sitting
      setSitting(true);
    }
  };

  // When sitting, listen for a rising edge on the B button to exit
  useEffect(() => {
    if (sitting && bButtonPressed && !prevBButtonPressed) {
      if (camera.parent) {
        camera.parent.position.set(...exitPosition);
      } else {
        camera.position.set(...exitPosition);
      }
      onStand(); // notify parent that we are now standing
      setSitting(false);
    }
    setPrevBButtonPressed(bButtonPressed);
  }, [sitting, bButtonPressed, prevBButtonPressed, camera, exitPosition, onStand]);

  // Change tip text based on sitting state.
  const tipText = sitting ? "Press B to stand up" : "Click Ⓐ to sit";

  return (
    <group
      onPointerDown={handleSit}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Your chair model */}
      <GLBModel
        path="/models/low_poly_computer_chair.glb"
        position={[2, 0, -1]}
        scale={0.35}
        rotation={[0, -Math.PI / 1.5, 0]}
      />
      <GameTip tip={tipText} position={[2, 1.2, -1]} visible={hovered} />
    </group>
  );
};

export default SitChair;

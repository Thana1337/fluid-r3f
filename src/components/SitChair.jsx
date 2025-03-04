// src/components/SitChair.jsx
import React, { useState, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import GLBModel from "./GLBModel";
import TextOverlay from "./TextOverlay";
import useAButtonToggle from "../hooks/useAButtonToggle";
import useBButtonToggle from "../hooks/useBButtonToggle";

const SitChair = ({
  // Position for the camera when sitting (chair POV)
  seatPosition = [2, 0.8, -1],
  // Position for the camera when standing up
  exitPosition = [2, 1.2, -2],
  // Optional callbacks to notify parent of sit/stand state changes
  onSit = () => {},
  onStand = () => {},
}) => {
  const { camera } = useThree();
  const [sitting, setSitting] = useState(false);
  const [hovered, setHovered] = useState(false);
  const aButtonPressed = useAButtonToggle();
  const bButtonPressed = useBButtonToggle();
  const [prevAButtonPressed, setPrevAButtonPressed] = useState(false);
  const [prevBButtonPressed, setPrevBButtonPressed] = useState(false);

  // Use the A button to sit when hovered (rising edge)
  useEffect(() => {
    if (hovered && aButtonPressed && !prevAButtonPressed && !sitting) {
      if (camera.parent) {
        camera.parent.position.set(...seatPosition);
      } else {
        camera.position.set(...seatPosition);
      }
      onSit();
      setSitting(true);
    }
    setPrevAButtonPressed(aButtonPressed);
  }, [hovered, aButtonPressed, prevAButtonPressed, sitting, camera, seatPosition, onSit]);

  // Use the B button to stand when sitting (rising edge)
  useEffect(() => {
    if (sitting && bButtonPressed && !prevBButtonPressed) {
      if (camera.parent) {
        camera.parent.position.set(...exitPosition);
      } else {
        camera.position.set(...exitPosition);
      }
      onStand();
      setSitting(false);
    }
    setPrevBButtonPressed(bButtonPressed);
  }, [sitting, bButtonPressed, prevBButtonPressed, camera, exitPosition, onStand]);

  return (
    <group
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Chair model */}
      <GLBModel
        path="/models/low_poly_computer_chair.glb"
        position={[2, 0, -1]}
        scale={0.35}
        rotation={[0, -Math.PI / 1.5, 0]}
      />
      {/* When not sitting and hovered, show the gametip "Press A to sit" */}
      {!sitting && hovered && (
        <TextOverlay visible={true} text="Press Ⓐ to sit" />
      )}
      {/* When sitting, always show the overlay "Press B to stand up" */}
      {sitting && <TextOverlay visible={true} text="Press Ⓑ to stand up" />}
    </group>
  );
};

export default SitChair;

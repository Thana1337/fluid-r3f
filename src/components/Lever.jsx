// src/components/Lever.jsx
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import GLBModel from "./GLBModel";
import useAButtonToggle from "../hooks/useAButtonToggle";
import GameTip from "./GameTip";

const Lever = ({ isOn, toggle }) => {
  const actionsRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const aButtonPressed = useAButtonToggle();
  const [prevAButtonPressed, setPrevAButtonPressed] = useState(false);

  const handleActionsLoaded = (actions) => {
    actionsRef.current = actions;
  };

  useEffect(() => {
    if (!actionsRef.current) return;
    const availableKeys = Object.keys(actionsRef.current);
    const action =
      actionsRef.current["CubeAction"] || actionsRef.current[availableKeys[0]];
    if (!action) return;

    action.setLoop(THREE.LoopOnce, 0);
    action.clampWhenFinished = true;
    
    const clipDuration = action.getClip().duration;
    const speed = 3; 

    if (isOn && action.time >= clipDuration) {
      action.time = 0;
    }
    if (!isOn && action.time <= 0) {
      action.time = clipDuration;
    }
    action.timeScale = isOn ? speed : -speed;
    action.paused = false;
    action.play();
  }, [isOn]);

  // Detect rising edge for A button press when hovered.
  useEffect(() => {
    if (hovered && aButtonPressed && !prevAButtonPressed) {
      toggle();
    }
    setPrevAButtonPressed(aButtonPressed);
  }, [hovered, aButtonPressed, prevAButtonPressed, toggle]);

  // Change the tip text based on the current state.
  const tipText = isOn ? "Press Ⓐ to turn off the pipe" : "Press Ⓐ to turn on the pipe";

  return (
    <group
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <GLBModel
        path="/models/lever.glb"
        position={[0, 0, 0]}
        scale={1}
        manual={true} 
        onActionsLoaded={handleActionsLoaded}
      />
      {/* Tip appears when hovered. GameTip uses Billboard so it always faces the camera */}
      <GameTip tip={tipText} position={[0, 1, 1]} visible={hovered} />
    </group>
  );
};

export default Lever;

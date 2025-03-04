// src/components/Lever.jsx
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import GLBModel from "./GLBModel";
import useAButtonToggle from "../hooks/useAButtonToggle";

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

  useEffect(() => {
    if (hovered && aButtonPressed && !prevAButtonPressed) {
      toggle();
    }
    setPrevAButtonPressed(aButtonPressed);
  }, [hovered, aButtonPressed, prevAButtonPressed, toggle]);

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
    </group>
  );
};

export default Lever;

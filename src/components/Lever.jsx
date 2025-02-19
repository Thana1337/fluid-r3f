// src/components/Lever.jsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import GLBModel from "./GLBModel";

const Lever = ({ isOn, toggle }) => {
  const actionsRef = useRef(null);

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

  return (
    <group onPointerDown={toggle}>
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

// src/components/Bike.jsx
import React, { useEffect } from "react";
import GLBModel from "./GLBModel";
import TextOverlay from "./TextOverlay";
import GameTip from "./GameTip";
import useAButtonToggle from "../hooks/useAButtonToggle";
import useDebouncedState from "../hooks/useDebouncedState";

const Bike = ({ onSelect, energySource }) => {
  const [tipVisible, setTipVisible] = useDebouncedState(false, 150);
  const aButtonPressed = useAButtonToggle();

  useEffect(() => {
    if (tipVisible && aButtonPressed) {
      onSelect("bike");
    }
  }, [tipVisible, aButtonPressed, onSelect]);

  return (
    <group
      onPointerEnter={() => setTipVisible(true)}
      onPointerLeave={() => setTipVisible(false)}
    >
      <GLBModel
        path="/models/bike.glb"
        position={[-2, 0.27, -4]}
        scale={[1, 1, 1]}
        animationSpeed={energySource === "bike" ? 1 : 0.2}
      />
      <GLBModel
        path="/models/free_lowpoly_crossfit_-_treadmill.glb"
        position={[-2, 0, -3.8]}
        scale={2.5}
        rotation={[0, 0, 0]}
      />
      <TextOverlay
        text="Press Ⓐ to select Bike"
        visible={tipVisible}
        offset={[0, -0.5, -1]}
      />
      <GameTip
        tip="You are getting power from the treadmill!"
        position={[-2, 2.2, -4]}
        visible={energySource === "bike"}
      />
    </group>
  );
};

export default Bike;

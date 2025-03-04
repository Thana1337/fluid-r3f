// src/components/Solar.jsx
import React, { useState, useEffect } from "react";
import GLBModel from "./GLBModel";
import TextOverlay from "./TextOverlay";
import useAButtonToggle from "../hooks/useAButtonToggle";
import GameTip from "./GameTip";

const Solar = ({ onSelect, energySource, isNight, isPowered }) => {
  const [tipVisible, setTipVisible] = useState(false);
  const aButtonPressed = useAButtonToggle();

  useEffect(() => {
    if (tipVisible && aButtonPressed) {
      onSelect("solar");
    }
  }, [tipVisible, aButtonPressed, onSelect]);

  return (
    <group
      onPointerEnter={() => setTipVisible(true)}
      onPointerLeave={() => setTipVisible(false)}
    >
      <GLBModel
        path="/models/solar.glb"
        position={[0, 6.1, -11.3]}
        scale={1.5}
        animationSpeed={isNight ? 0.2 : 1}
      />
      <TextOverlay
        text="Press Ⓐ to select Solar"
        visible={tipVisible}
        offset={[0, -0.6, -1]}
      />
      <GameTip
        tip={
            energySource === "solar" && isNight && !isPowered
            ? "Solar will only work when the sun is up!"
            : "You are getting power from the solarpanel!"
        }
        position={[0, 2.5, -9]}
        visible={energySource === "solar"}
        />
    </group>
  );
};

export default Solar;

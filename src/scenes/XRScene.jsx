// src/scenes/XRScene.jsx
import React from "react";
import GLBModel from "../components/GLBModel";
import Fence from "../components/Fence";
import StreetLight from "../components/StreetLight";
import Lamp from "../components/Lamp";
import Fan from "../components/Fan";

const XRScene = ({ isNight, isPowered, device }) => {
  const fencePositions = [
    { position: [-10, 0, -6.5], rotation: [0, Math.PI / 2, 0] },
    { position: [-10, 0, 0.2], rotation: [0, Math.PI / 2, 0] },
    { position: [-10, 0, 6.5], rotation: [0, Math.PI / 2, 0] },
    { position: [10, 0, -6.5], rotation: [0, Math.PI / 2, 0] },
    { position: [10, 0, 0.2], rotation: [0, Math.PI / 2, 0] },
    { position: [10, 0, 6.5], rotation: [0, Math.PI / 2, 0] },
    { position: [-6.6, 0, -10], rotation: [0, 0, 0] },
    { position: [0.2, 0, -10], rotation: [0, 0, 0] },
    { position: [6.6, 0, -10], rotation: [0, 0, 0] },
    { position: [-6.6, 0, 10], rotation: [0, 0, 0] },
    { position: [0.2, 0, 10], rotation: [0, 0, 0] },
    { position: [6.6, 0, 10], rotation: [0, 0, 0] },
  ];

  return (
    <>
      <GLBModel path="/models/generator.glb" position={[0, 1, -4]} scale={[0.6, 0.6, 0.6]} />
      <GLBModel path="/models/tree.glb" position={[3, 0, -10]} scale={[3, 3, 3]} />
      {fencePositions.map((props, index) => (
        <Fence key={index} {...props} scale={[0.007, 0.007, 0.007]} />
      ))}
      <StreetLight />
      {device === "lamp" && <Lamp isPowered={isPowered} />}
      {device === "fan" && <Fan isPowered={isPowered} />}
    </>
  );
};

export default XRScene;

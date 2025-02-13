// src/scenes/World.jsx
import React from "react";
import { Canvas } from "@react-three/fiber";
import { XR, XROrigin, TeleportTarget } from "@react-three/xr";
import { Vector3 } from "three";


import SunLight from "../components/SunLight";
import CelestialBody from "../components/CelestialBody";
import SpinningCloud from "../components/SpinningCloud";
import GLBModel from "../components/GLBModel";
import Fence from "../components/Fence";
import StreetLight from "../components/StreetLight";
import ControlPanel from "../components/ControlPanel";
import Lamp from "../components/Lamp";
import Fan from "../components/Fan";
import Pipe from "../components/Pipe";
import Wall_light from "../components/Wall_light";


const World = ({
  store,
  position,
  backgroundColor,
  onTeleport,
  handleEnergySourceChange,
  handleDeviceChange,
  toggleNightMode,
  isNight,
  energySource,
  isPowered,
  device,
}) => {
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

  const wallLightPositions = [
    { position: [-8, 4, -9], rotation: [0, Math.PI / 1, 0]},
    { position: [8, 4, -9], rotation: [0, Math.PI / 1, 0]},
    { position: [0, 4, -9], rotation: [0, Math.PI / 1, 0]},
    { position: [-8, 4, 9.6], rotation: [0, 0, 0]},
    { position: [8, 4, 9.6], rotation: [0, 0, 0]},
    { position: [0, 4, 9.6], rotation: [0, 0, 0]},
    { position: [9.6, 4, 8], rotation: [0, Math.PI / 2, 0]},
    { position: [9.6, 4, 0], rotation: [0, Math.PI / 2, 0]},
    { position: [9.6, 4, -8], rotation: [0, Math.PI / 2, 0]},
    { position: [-9.6, 4, 8], rotation: [0, Math.PI / -2, 0]},
    { position: [-9.6, 4, 0], rotation: [0, Math.PI / -2, 0]},
    { position: [-9.6, 4, -8], rotation: [0, Math.PI / -2, 0]},

  ]

  return (
    <Canvas
      camera={{ position: [5, 3, 5] }}
      onCreated={({ gl }) => {
        gl.xr.enabled = true; // Enable XR
      }}
    >
      <XR store={store}>
        {/* Background color */}
        <color attach="background" args={[backgroundColor]} />

        {/* Environment */}
        
        <SunLight isNight={isNight} />
        <CelestialBody isNight={isNight} />
        <SpinningCloud position={[0, 50, 0]} scale={[1, 1, 1]} />

        {/* XR Origin and Teleport Target */}
        <XROrigin position={position.toArray()} />
        <TeleportTarget onTeleport={onTeleport}>
          <mesh scale={[20, 1, 20]} position={[0, -0.5, 0]}>
            <boxGeometry />
            <meshStandardMaterial color="#664422" />
          </mesh>
        </TeleportTarget>
        <Pipe/>
        {/* Models */}
        <GLBModel path="/models/generator.glb" position={[0, 1.5, -9]} scale={[1, 1, 0.6]} />
        <GLBModel path="/models/tree.glb" position={[3, 0, -2]} scale={[3, 3, 3]} />
        <GLBModel path="/models/table.glb" position={[2, 0, -2]} scale={[0.3, 0.3, 0.3]} />

        {wallLightPositions.map((props, index) => (
          <Wall_light key={index} {...props} scale={[0.0025, 0.003, 0.003]} /> 
        ))}
        <pointLight position={[0,5,0]} intensity={20} distance={10} color="yellow" castShadow/>
        {fencePositions.map((props, index) => (
          <Fence key={index} {...props} scale={[3, 2.5, 3]} />
        ))}

        {/* <StreetLight /> */}

        {/* Conditional Models */}
        {energySource === "bike" && (
          <group>
            <GLBModel path="/models/bike.glb" position={[-2, 0.1, -4]} scale={[1, 1, 1]} animationSpeed={1} />
            <GLBModel path="/models/treadmill.glb" position={[-2, 0, -4]} scale={[1.2, 1.2, 1.2]} rotation={[0, Math.PI / 2, 0]} />
          </group>
        )}
        {energySource === "solar" && (
          <GLBModel path="/models/solar.glb" position={[6, 0, -6]} scale={[1, 1, 1]} />
        )}

        {/* Control Panel */}
        <ControlPanel
          onEnergySourceChange={handleEnergySourceChange}
          onDeviceChange={handleDeviceChange}
          toggleNightMode={toggleNightMode}
          isNight={isNight}
        />

        {/* Devices */}
        {device === "lamp" && <Lamp isPowered={isPowered} />}
        {device === "fan" && <Fan isPowered={isPowered} />}
      </XR>
    </Canvas>
  );
};

export default World;

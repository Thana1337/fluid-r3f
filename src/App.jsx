// src/App.jsx
import React, { useState, useEffect, useMemo  } from "react";
import { Vector3 } from "three";
import useXRControls from "./hooks/useXRControls";
import World from "./scenes/World";
import VRButton from "./components/VRButton"; 

function App() {
  const store = useMemo(() => useXRControls(), []);

  const [position, setPosition] = useState(new Vector3());
  const [energySource, setEnergySource] = useState(null);
  const [device, setDevice] = useState(null);
  const [isPowered, setIsPowered] = useState(false);
  const [isNight, setIsNight] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("#ffcc88");

  const handleEnergySourceChange = (source) => {
    setEnergySource(source);
    if (source === "bike") setIsPowered(true);
    else if (source === "solar") setIsPowered(!isNight);
    else setIsPowered(false);
  };

  const handleDeviceChange = (d) => setDevice(d);
  const toggleNightMode = () => setIsNight((prev) => !prev);

  useEffect(() => {
    if (energySource === "solar") {
      if (isNight) {
        console.log("Solar power is unavailable at night. Devices are turned off.");
        setIsPowered(false);
      } else {
        console.log("Daytime detected! Solar power is now active.");
        setIsPowered(true);
      }
    }
  }, [isNight]);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
      {/* <VRButton onEnterVR={() => store.enterVR()} /> */}
      <World
        store={store}
        position={position}
        backgroundColor={backgroundColor}
        onTeleport={(newPos) => setPosition(newPos)}
        handleEnergySourceChange={handleEnergySourceChange}
        handleDeviceChange={handleDeviceChange}
        toggleNightMode={toggleNightMode}
        isNight={isNight}
        energySource={energySource}
        isPowered={isPowered}
        device={device}
      />
    </div>
  );
}

export default App;

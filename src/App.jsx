// src/App.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  const [isInVR, setIsInVR] = useState(false); 

  const handleEnergySourceChange = useCallback((source) => {
    setEnergySource(source);
    if (source === "bike") setIsPowered(true);
    else if (source === "solar") setIsPowered(!isNight);
    else setIsPowered(false);
  }, [isNight]);

  const handleDeviceChange = useCallback((d) => setDevice(d), []);
  const toggleNightMode = useCallback(() => setIsNight((prev) => !prev), []);

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
  }, [isNight, energySource]);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
      <VRButton onEnterVR={() => { setIsInVR(true); store.enterVR(); }} />
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
        isInVR={isInVR}  
      />
    </div>
  );
}

export default App;

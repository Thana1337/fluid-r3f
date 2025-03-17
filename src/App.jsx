// src/App.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Vector3 } from "three";
import useXRControls from "./hooks/useXRControls";
import World from "./scenes/World";
import VRButton from "./components/VRButton"; 
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import PublishLocalAudio from "./components/PublishLocalAudio"; 
import SetUsername from "./components/SetUsername";
import { XRDevice, metaQuest3 } from 'iwer';

function App() {
  const store = useMemo(() => useXRControls(), []);
  const [position, setPosition] = useState(new Vector3());
  const [energySource, setEnergySource] = useState(null);
  const [device, setDevice] = useState(null);
  const [isPowered, setIsPowered] = useState(false);
  const [isNight, setIsNight] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("#ffcc88");
  const [isInVR, setIsInVR] = useState(false); 
  const [liveKitToken, setLiveKitToken] = useState(null);
  // Check if a username exists in localStorage
  const [usernameSet, setUsernameSet] = useState(!!localStorage.getItem("username"));

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

  const liveKitWsUrl = "wss://vr-voice-1w4014yg.livekit.cloud";

  // Fetch token only when username is set.
  useEffect(() => {
    if (!usernameSet) return;
    const username = localStorage.getItem("username");
    fetch(`https://vr-server.onrender.com/api/token?username=${encodeURIComponent(username)}`)
      .then((res) => res.json())
      .then((data) => setLiveKitToken(data.token))
      .catch((err) => console.error("Error fetching token:", err));
  }, [usernameSet]);

  // const xrDevice = new XRDevice(metaQuest3);
  // xrDevice.installRuntime();


  const handleUsernameSet = (username) => {
    setUsernameSet(true);
  };

  if (!usernameSet) {
    return <SetUsername onUsernameSet={handleUsernameSet} />;
  }

  return (
    <LiveKitRoom token={liveKitToken} serverUrl={liveKitWsUrl} audio={true} video={true}>
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
        <RoomAudioRenderer/>
        <PublishLocalAudio/>
      </div>
    </LiveKitRoom>
  );
}

export default App;

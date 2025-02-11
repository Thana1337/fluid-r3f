# App.css

```css
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}


```

# App.jsx

```jsx
// src/App.jsx
import React, { useState, useEffect } from "react";
import { Vector3 } from "three";
import useXRControls from "./hooks/useXRControls";
import World from "./scenes/World";
import VRButton from "./components/VRButton"; // your VR button overlay

function App() {
  // Create the XR store at the top level.
  const store = useXRControls();

  // Example global state (adjust as needed)
  const [position, setPosition] = useState(new Vector3());
  const [energySource, setEnergySource] = useState(null);
  const [device, setDevice] = useState(null);
  const [isPowered, setIsPowered] = useState(false);
  const [isNight, setIsNight] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("#ffcc88");

  // Handlers (adjust as needed)
  const handleEnergySourceChange = (source) => {
    setEnergySource(source);
    if (source === "bike") setIsPowered(true);
    else if (source === "solar") setIsPowered(!isNight);
    else setIsPowered(false);
  };

  const handleDeviceChange = (d) => setDevice(d);
  const toggleNightMode = () => setIsNight((prev) => !prev);

  // (Additional effects, transitions, etc.)

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
      {/* VR Button overlay – it now uses the same store */}
      <VRButton onEnterVR={() => store.enterVR()} />

      {/* Pass the store to World so that XR gets connected */}
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

```

# index.css

```css
/* src/index.css */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  width: 100%;
  height: 100%;
  font-family: Arial, sans-serif;
}

button {
  font-size: 1rem;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
}
```

# main.jsx

```jsx
// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/global.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

# components\CelestialBody.jsx

```jsx
// src/components/CelestialBody.jsx
import React, { useState, useEffect } from "react";
import { useGLTF } from "@react-three/drei";

const CelestialBody = ({ isNight }) => {
  const moon = useGLTF("/models/moon.glb").scene;
  const sun = useGLTF("/models/sun.glb").scene;
  const [positions, setPositions] = useState({ sun: [0, 100, -100], moon: [-10, -50, -100] });

  useEffect(() => {
    const newPositions = isNight
      ? { sun: [0, -50, -100], moon: [-10, 100, -100] }
      : { sun: [0, 100, -100], moon: [-10, -50, -100] };
    setPositions(newPositions);
  }, [isNight]);

  return (
    <group>
      <primitive object={moon} position={positions.moon} scale={[0.7, 0.7, 0.7]} />
      <primitive object={sun} position={positions.sun} scale={[0.05, 0.05, 0.05]} />
      <directionalLight position={positions.sun} intensity={3} color="yellow" castShadow />
    </group>
  );
};

export default CelestialBody;
```

# components\ControlPanel.jsx

```jsx
// src/components/ControlPanel.jsx
import React from "react";
import { Text } from "@react-three/drei";

const ControlPanel = ({ onEnergySourceChange, onDeviceChange, toggleNightMode, isNight }) => (
  <group position={[0, 3, -3]}>
    <mesh scale={[1, 0.2, 1]} onPointerDown={() => onEnergySourceChange("bike")}>
      <boxGeometry />
      <meshStandardMaterial color="blue" />
    </mesh>
    <Text position={[0, -0.3, 0]} fontSize={0.2} color="white">Bike</Text>

    <mesh scale={[1, 0.2, 1]} onPointerDown={() => onEnergySourceChange("solar")}>
      <boxGeometry />
      <meshStandardMaterial color="yellow" />
    </mesh>
    <Text position={[0, -0.3, 0]} fontSize={0.2} color="white">Solar</Text>

    <mesh scale={[1, 0.2, 1]} onPointerDown={toggleNightMode}>
      <boxGeometry />
      <meshStandardMaterial color={isNight ? "blue" : "yellow"} />
    </mesh>
    <Text position={[0, -0.3, 0]} fontSize={0.2} color="white">{isNight ? "Switch to Day" : "Switch to Night"}</Text>
  </group>
);

export default ControlPanel;
```

# components\Fan.jsx

```jsx
// src/components/Fan.jsx
import React, { useEffect, useState } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

const Fan = ({ isPowered }) => {
  const { scene, animations } = useGLTF("/models/fan.glb");
  const { actions } = useAnimations(animations, scene);
  const [animationSpeed, setAnimationSpeed] = useState(0);

  useEffect(() => {
    if (!actions || !actions.Animation) return;
    let targetSpeed = isPowered ? 1 : 0;
    let speedStep = isPowered ? 0.1 : -0.1;
    const interval = setInterval(() => {
      setAnimationSpeed((prev) => {
        let newSpeed = prev + speedStep;
        if ((isPowered && newSpeed >= targetSpeed) || (!isPowered && newSpeed <= targetSpeed)) {
          clearInterval(interval);
          return targetSpeed;
        }
        return newSpeed;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isPowered, actions]);

  useEffect(() => {
    if (actions.Animation) {
      actions.Animation.play();
      actions.Animation.timeScale = animationSpeed;
    }
  }, [animationSpeed, actions]);

  return <primitive object={scene} position={[1.5, 1, -2]} scale={[1, 1, 1]} />;
};

export default Fan;
```

# components\Fence.jsx

```jsx
// src/components/Fence.jsx
import React from "react";
import { useGLTF } from "@react-three/drei";

const Fence = ({ position, rotation, scale }) => {
  const { scene } = useGLTF("/models/fence.glb");
  return <primitive object={scene.clone()} position={position} rotation={rotation} scale={scale} />;
};

export default Fence;


```

# components\GLBModel.jsx

```jsx
// src/components/GLBModel.jsx
import React, { useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

const GLBModel = ({ path, position, scale, rotation, animationSpeed = 1 }) => {
  const { scene, animations } = useGLTF(path);
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    if (actions) {
      Object.values(actions).forEach((action) => {
        action.play();
        action.timeScale = animationSpeed;
      });
    }
  }, [actions, animationSpeed]);

  return <primitive object={scene} position={position} scale={scale} rotation={rotation} />;
};

export default GLBModel;
```

# components\Lamp.jsx

```jsx
// src/components/Lamp.jsx
import React, { useState, useEffect } from "react";
import { useGLTF } from "@react-three/drei";

const Lamp = ({ isPowered }) => {
  const { scene } = useGLTF("/models/lamp.glb");
  const [lightIntensity, setLightIntensity] = useState(0);

  useEffect(() => {
    if (isPowered) {
      setLightIntensity(1);
    } else {
      setLightIntensity(0);
    }
  }, [isPowered]);

  return (
    <group>
      <primitive object={scene} position={[0, 1, 0]} scale={[0.01, 0.01, 0.01]} />
      {lightIntensity > 0 && <pointLight intensity={lightIntensity} distance={5} position={[0, 1.2, 0.2]} color="yellow" />}
    </group>
  );
};

export default Lamp;
```

# components\SpinningCloud.jsx

```jsx
// src/components/SpinningCloud.jsx
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

const SpinningCloud = ({ position, scale, rotationSpeed = 0.0001 }) => {
  const cloudRef = useRef();
  const { scene } = useGLTF("/models/cloud.glb");
  useFrame(() => {
    if (cloudRef.current) {
      cloudRef.current.rotation.y += rotationSpeed;
    }
  });
  return <primitive ref={cloudRef} object={scene} position={position} scale={scale} />;
};

export default SpinningCloud;

```

# components\StreetLight.jsx

```jsx
// src/components/StreetLight.jsx
import React from "react";
import { useGLTF } from "@react-three/drei";

const StreetLight = () => {
  return (
    <group>
      <primitive object={useGLTF("/models/street_light.glb").scene} position={[-10, 0, -7]} scale={[1, 1, 1]} />
      <pointLight intensity={10} distance={10} position={[-8, 1, -5]} color="yellow" />
    </group>
  );
};

export default StreetLight;
```

# components\SunLight.jsx

```jsx
// src/components/SunLight.jsx
import React from "react";

const SunLight = ({ isNight }) => (
  <>
    <directionalLight position={[5, 10, 5]} intensity={isNight ? 0.2 : 1.5} color={isNight ? "blue" : "yellow"} />
    <ambientLight intensity={isNight ? 0.02 : 0.5} />
  </>
);

export default SunLight;
```

# components\VRButton.jsx

```jsx
// src/components/VRButton.jsx
import React from "react";

const VRButton = ({ onEnterVR }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(3px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
      }}
    >
      <button
        onClick={onEnterVR}
        style={{
          padding: "1rem 2rem",
          fontSize: "1.5rem",
          backgroundColor: "#ffcc88",
          border: "none",
          borderRadius: "8px",
          color: "black",
          cursor: "pointer",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "scale(1.1)";
          e.target.style.boxShadow = "0 6px 8px rgba(0, 0, 0, 0.2)";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "scale(1)";
          e.target.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
        }}
      >
        Enter VR
      </button>
    </div>
  );
};

export default VRButton;

```

# hooks\useSceneEffects.js

```javascript
// src/hooks/useSceneEffects.js
import { useEffect } from "react";
import * as THREE from "three";

const useSceneEffects = (isNight, setBackgroundColor) => {
  useEffect(() => {
    let targetColor = isNight ? "#0b1d3d" : "#ffcc88";
    let step = 0;
    const transitionInterval = setInterval(() => {
      setBackgroundColor((prev) => {
        let c1 = new THREE.Color(prev);
        let c2 = new THREE.Color(targetColor);
        let interpolated = c1.lerp(c2, step / 50);
        step++;
        if (step >= 50) {
          clearInterval(transitionInterval);
          return targetColor;
        }
        return `#${interpolated.getHexString()}`;
      });
    }, 30);
    return () => clearInterval(transitionInterval);
  }, [isNight]);
};

export default useSceneEffects;

```

# hooks\useXRControls.js

```javascript
// src/hooks/useXRControls.js
import { createXRStore } from "@react-three/xr";

const useXRControls = () => {
  return createXRStore({
    hand: { teleportPointer: true },
    controller: { teleportPointer: true },
  });
};

export default useXRControls;
```

# models\useModelLoader.js

```javascript
// src/models/useModelLoader.js
import { useGLTF } from "@react-three/drei";

const useModelLoader = (path) => {
  const { scene, animations } = useGLTF(path);
  return { scene, animations };
};

export default useModelLoader;
```

# scenes\Environment.jsx

```jsx
// src/scenes/Environment.jsx
import React from "react";
import SunLight from "../components/SunLight";
import CelestialBody from "../components/CelestialBody";

const Environment = ({ isNight }) => (
  <>
    <SunLight isNight={isNight} />
    <CelestialBody isNight={isNight} />
  </>
);

export default Environment;
```

# scenes\World.jsx

```jsx
// src/scenes/World.jsx
import React from "react";
import { Canvas } from "@react-three/fiber";
import { XR, XROrigin, TeleportTarget } from "@react-three/xr";
import { Vector3 } from "three";

// Import scene and component modules
import Environment from "./Environment";
import XRScene from "./XRScene";
import SpinningCloud from "../components/SpinningCloud";
import ControlPanel from "../components/ControlPanel";
import GLBModel from "../components/GLBModel";

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
  return (
    <Canvas
      camera={{ position: [5, 3, 5] }}
      onCreated={({ gl }) => {
        gl.xr.enabled = true; // Enable XR on the renderer
      }}
    >
      {/* Pass the store from App.jsx */}
      <XR store={store}>
        {/* Set the background color */}
        <color attach="background" args={[backgroundColor]} />

        {/* Environment (lights, sky, celestial bodies, etc.) */}
        <Environment isNight={isNight} />

        {/* A spinning cloud */}
        <SpinningCloud position={[0, 50, 0]} scale={[1, 1, 1]} />

        {/* XR origin and teleport target */}
        <XROrigin position={position.toArray()} />
        <TeleportTarget onTeleport={onTeleport}>
          <mesh scale={[20, 1, 20]} position={[0, -0.5, 0]}>
            <boxGeometry />
            <meshStandardMaterial color="#664422" />
          </mesh>
        </TeleportTarget>

        {/* Main XR scene objects */}
        <XRScene isNight={isNight} isPowered={isPowered} device={device} />

        {/* Control Panel for interactions */}
        <ControlPanel
          onEnergySourceChange={handleEnergySourceChange}
          onDeviceChange={handleDeviceChange}
          toggleNightMode={toggleNightMode}
          isNight={isNight}
        />

        {/* Conditional models based on energy source */}
        {energySource === "bike" && (
          <group>
            <GLBModel
              path="/models/bike.glb"
              position={[-2, 0.1, -4]}
              scale={[1, 1, 1]}
              animationSpeed={1}
            />
            <GLBModel
              path="/models/treadmill.glb"
              position={[-2, 0, -4]}
              scale={[1.2, 1.2, 1.2]}
              rotation={[0, Math.PI / 2, 0]}
            />
          </group>
        )}

        {energySource === "solar" && (
          <GLBModel
            path="/models/solar.glb"
            position={[6, 0, -6]}
            scale={[1, 1, 1]}
          />
        )}
      </XR>
    </Canvas>
  );
};

export default World;

```

# scenes\XRScene.jsx

```jsx
// src/scenes/XRScene.jsx
import React from "react";
import GLBModel from "/src/components/GLBModel.jsx";
import Fence from "../components/Fence";
import StreetLight from "../components/StreetLight";
import Lamp from "../components/Lamp";
import Fan from "../components/Fan";

const XRScene = ({ isNight, isPowered, device }) => {
  return (
    <>
      <GLBModel path="/models/generator.glb" position={[0, 1, -4]} scale={[0.6, 0.6, 0.6]} />
      <GLBModel path="/models/tree.glb" position={[3, 0, -10]} scale={[3, 3, 3]} />
      <Fence position={[0, 0, -10]} scale={[0.007, 0.007, 0.007]} />
      <StreetLight />
      {device === "lamp" && <Lamp isPowered={isPowered} />}
      {device === "fan" && <Fan isPowered={isPowered} />}
    </>
  );
};

export default XRScene;
```

# styles\global.css

```css
/* src/styles/global.css */
body {
  margin: 0;
  overflow: hidden;
  background-color: #222;
}

.app-container {
  position: relative;
  width: 100vw;
  height: 100vh;
}
```

# styles\theme.js

```javascript
// src/styles/theme.js
export const theme = {
    colors: {
      primary: "#ffcc88",
      background: "#222",
      text: "#fff",
    },
  };
```

# utils\animations.js

```javascript
// src/utils/animations.js
export const animatePosition = (object, targetPosition, speed = 0.1) => {
    if (!object.position) return;
    object.position.lerp(targetPosition, speed);
  };
  
  export const animateRotation = (object, targetRotation, speed = 0.1) => {
    if (!object.rotation) return;
    object.rotation.lerp(targetRotation, speed);
  };
```

# utils\helpers.js

```javascript
// src/utils/helpers.js
export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export const lerp = (start, end, alpha) => start * (1 - alpha) + end * alpha;
```


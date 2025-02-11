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
// Refactored with minimal changes, 2-space indentation, and minimal comments
import React, { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { XR, XROrigin, TeleportTarget, createXRStore } from "@react-three/xr";
import { OrbitControls, useGLTF, useAnimations, Text } from "@react-three/drei";
import * as THREE from "three";
import { Vector3 } from "three";

const store = createXRStore({
  hand: { rayPointer: { rayModel: { color: "red" } }, teleportPointer: true },
  controller: { teleportPointer: true },
});

// GLB model loader
function GLBModel({ path, position, scale, rotation, animationSpeed }) {
  const { scene, animations } = useGLTF(path);
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    const animationName = "M_rig_Action_S";
    if (actions && actions[animationName]) {
      actions[animationName].play();
      actions[animationName].timeScale = animationSpeed;
    }
    return () => {
      if (actions && actions[animationName]) {
        actions[animationName].stop();
      }
    };
  }, [actions, animationSpeed]);

  if (rotation) scene.rotation.set(...rotation);

  return <primitive object={scene} position={position} scale={scale} />;
}

function CelestialBody({ isNight }) {
  const moonRef = useRef();
  const sunRef = useRef();
  const [sunPosition, setSunPosition] = useState([0, 100, -100]);
  const [moonPosition, setMoonPosition] = useState([-10, -50, -100]);

  useEffect(() => {
    let targetSunY = isNight ? -50 : 100;
    let targetMoonY = isNight ? 100 : -50;
    let speed = 10;
    const interval = setInterval(() => {
      setSunPosition((prev) => {
        let newY = prev[1] + (isNight ? -speed : speed);
        if (
          (isNight && newY <= targetSunY) ||
          (!isNight && newY >= targetSunY)
        ) {
          clearInterval(interval);
          return [prev[0], targetSunY, prev[2]];
        }
        return [prev[0], newY, prev[2]];
      });
      setMoonPosition((prev) => {
        let newY = prev[1] + (isNight ? speed : -speed);
        if (
          (isNight && newY >= targetMoonY) ||
          (!isNight && newY <= targetMoonY)
        ) {
          clearInterval(interval);
          return [prev[0], targetMoonY, prev[2]];
        }
        return [prev[0], newY, prev[2]];
      });
    }, 50);
    return () => clearInterval(interval);
  }, [isNight]);

  return (
    <group>
      {/* Moon */}
      <primitive
        ref={moonRef}
        object={useGLTF("/models/moon.glb").scene}
        position={moonPosition}
        scale={[0.7, 0.7, 0.7]}
      />
      {/* Sun */}
      <primitive
        ref={sunRef}
        object={useGLTF("/models/sun.glb").scene}
        position={sunPosition}
        scale={[0.05, 0.05, 0.05]}
      />
      <directionalLight
        position={sunPosition}
        intensity={3}
        color="yellow"
        castShadow
      />
    </group>
  );
}

function Fence({ position, rotation, scale }) {
  const { scene } = useGLTF("/models/fence.glb");
  return (
    <primitive
      object={scene.clone()}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}

function SunLight({ isNight }) {
  return (
    <>
      <directionalLight
        position={[5, 10, 5]}
        intensity={isNight ? 0.2 : 1.5}
        color={isNight ? "blue" : "yellow"}
        castShadow
      />
      <ambientLight intensity={isNight ? 0.02 : 0.5} />
    </>
  );
}

function Fan({ isPowered }) {
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
        if (
          (isPowered && newSpeed >= targetSpeed) ||
          (!isPowered && newSpeed <= targetSpeed)
        ) {
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
}

function Lamp({ isPowered }) {
  const [lightIntensity, setLightIntensity] = useState(0);
  const [blinking, setBlinking] = useState(false);

  useEffect(() => {
    if (blinking) return;
    if (isPowered) {
      setBlinking(true);
      let blinkCount = 0;
      const blinkInterval = setInterval(() => {
        setLightIntensity((prev) => (prev > 0 ? 0 : 1));
        blinkCount++;
        if (blinkCount >= 4) {
          clearInterval(blinkInterval);
          setBlinking(false);
          setLightIntensity(1);
        }
      }, 200);
    } else {
      let intensity = lightIntensity;
      const fadeInterval = setInterval(() => {
        intensity -= 0.1;
        if (intensity <= 0) {
          clearInterval(fadeInterval);
          setLightIntensity(0);
        } else {
          setLightIntensity(intensity);
        }
      }, 100);
    }
  }, [isPowered]);

  return (
    <group position={[1.5, 0, -2]}>
      <GLBModel path="/models/lamp.glb" position={[0, 1, 0]} scale={[0.01, 0.01, 0.01]} />
      {lightIntensity > 0 && (
        <pointLight
          intensity={lightIntensity}
          distance={5}
          position={[0, 1.2, 0.2]}
          color="yellow"
        />
      )}
    </group>
  );
}

function StreetLight() {
  return (
    <group position={[1.5, 0, -2]}>
      <GLBModel
        path="/models/street_light.glb"
        position={[-10, 0, -7]}
        scale={[1, 1, 1]}
        rotation={[0, Math.PI / 4, 0]}
      />
      <pointLight intensity={10} distance={10} position={[-8, 1, -5]} color="yellow" />
    </group>
  );
}

function ControlPanel({ onEnergySourceChange, onDeviceChange, toggleNightMode, isNight }) {
  return (
    <group position={[0, 3, -3]}>
      <group position={[-2, 0, 0]}>
        <mesh
          scale={[1, 0.2, 1]}
          onPointerDown={() => onEnergySourceChange("bike")}
        >
          <boxGeometry />
          <meshStandardMaterial color="blue" />
        </mesh>
        <Text
          position={[0, -0.3, 0]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Bike
        </Text>
      </group>
      <group position={[0, 0, 0]}>
        <mesh
          scale={[1, 0.2, 1]}
          onPointerDown={() => onEnergySourceChange("solar")}
        >
          <boxGeometry />
          <meshStandardMaterial color="blue" />
        </mesh>
        <Text
          position={[0, -0.3, 0]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Solar
        </Text>
      </group>

      {/* Toggle Day/Night */}
      <group position={[0, -2, 1]}>
        <mesh scale={[1, 0.2, 1]} onPointerDown={toggleNightMode}>
          <boxGeometry />
          <meshStandardMaterial color={isNight ? "blue" : "yellow"} />
        </mesh>
        <Text
          position={[0, -0.3, 0]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {isNight ? "Switch to Day" : "Switch to Night"}
        </Text>
      </group>

      <group position={[2, 0, 0]}>
        <mesh
          scale={[1, 0.2, 1]}
          onPointerDown={() => onDeviceChange("lamp")}
        >
          <boxGeometry />
          <meshStandardMaterial color="green" />
        </mesh>
        <Text
          position={[0, -0.3, 0]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Lamp
        </Text>
      </group>
      <group position={[4, 0, 0]}>
        <mesh
          scale={[1, 0.2, 1]}
          onPointerDown={() => onDeviceChange("fan")}
        >
          <boxGeometry />
          <meshStandardMaterial color="green" />
        </mesh>
        <Text
          position={[0, -0.3, 0]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Fan
        </Text>
      </group>
    </group>
  );
}

function SpinningCloud({ position, scale, rotationSpeed = 0.0001 }) {
  const cloudRef = useRef();
  const { scene } = useGLTF("/models/cloud.glb");
  useFrame(() => {
    if (cloudRef.current) {
      cloudRef.current.rotation.y += rotationSpeed;
    }
  });
  return <primitive ref={cloudRef} object={scene} position={position} scale={scale} />;
}

// const clock = new THREE.Clock(); // Example clock if needed
// const timeOffset = 0; // Example offset if needed

function App() {
  const [position, setPosition] = useState(new Vector3());
  const [energySource, setEnergySource] = useState(null);
  const [device, setDevice] = useState(null);
  const [isPowered, setIsPowered] = useState(false);
  const [isNight, setIsNight] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("#ffcc88");

  const handleEnergySourceChange = (source) => {
    setEnergySource(source);
    if (source === "bike") {
      setIsPowered(true);
    } else if (source === "solar") {
      setIsPowered(!isNight);
    } else {
      setIsPowered(false);
    }
  };

  const handleDeviceChange = (d) => setDevice(d);
  const toggleNightMode = () => setIsNight((prev) => !prev);

  // Solar logic
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

  // Smooth background transition
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
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Simple overlay with VR button */}
      <div
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(3px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
        }}
      >
        <button
          onClick={() => store.enterVR()}
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

      <Canvas camera={{ position: [5, 3, 5] }}>
        <XR store={store}>
          {/* <OrbitControls /> */}
          <color attach="background" args={[backgroundColor]} />
          <SunLight isNight={isNight} />
          <CelestialBody isNight={isNight} />
          <SpinningCloud position={[0, 50, 0]} scale={[1, 1, 1]} />

          <XROrigin position={position.toArray()} />
          <TeleportTarget onTeleport={(newPosition) => setPosition(newPosition)}>
            <mesh scale={[20, 1, 20]} position={[0, -0.5, 0]}>
              <boxGeometry />
              <meshStandardMaterial color="#664422" />
            </mesh>
          </TeleportTarget>

          <GLBModel
            path="/models/generator.glb"
            position={[0, 1, -4]}
            scale={[0.6, 0.6, 0.6]}
          />
          <GLBModel
            path="/models/tree.glb"
            position={[3, 0, -10]}
            scale={[3, 3, 3]}
          />
          <GLBModel
            path="/models/table.glb"
            position={[2, 0, -2]}
            scale={[0.3, 0.3, 0.3]}
          />

          {fencePositions.map((props, index) => (
            <Fence key={index} {...props} scale={[0.007, 0.007, 0.007]} />
          ))}

          <StreetLight />

          {/* <SpeedControl
            position={[0, 1, -2]}
            onChange={(newSpeed) => setSpeed(newSpeed)}
          /> */}

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

          <ControlPanel
            onEnergySourceChange={handleEnergySourceChange}
            onDeviceChange={handleDeviceChange}
            toggleNightMode={toggleNightMode}
            isNight={isNight}
          />

          {device === "lamp" && <Lamp isPowered={isPowered} />}
          {device === "fan" && <Fan isPowered={isPowered} />}
        </XR>
      </Canvas>
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

# scenes\XRScene.jsx

```jsx
// src/scenes/XRScene.jsx
import React from "react";
import { GLBModel } from "../components/GLBModel";
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


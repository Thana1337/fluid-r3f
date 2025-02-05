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

function GLBModel({ path, position, scale, rotation, animationSpeed }) {
  const { scene, animations } = useGLTF(path);
  const { actions } = useAnimations(animations, scene);

  React.useEffect(() => {
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

  if (rotation) {
    scene.rotation.set(...rotation);
  }

  return <primitive object={scene} position={position} scale={scale} />;
}

function CelestialBody({ isNight }) {
  const moonRef = useRef();
  const sunRef = useRef();
  const [sunPosition, setSunPosition] = useState([0, 100, -100]); // Start high
  const [moonPosition, setMoonPosition] = useState([-10, -50, -100]); // Start below horizon

  useEffect(() => {
    let targetSunY = isNight ? -50 : 100; // Sun moves down at night, up in day
    let targetMoonY = isNight ? 100 : -50; // Moon moves up at night, down in day
    let speed = 10; // Controls how smooth the transition is

    const interval = setInterval(() => {
      setSunPosition((prev) => {
        let newY = prev[1] + (isNight ? -speed : speed);
        if ((isNight && newY <= targetSunY) || (!isNight && newY >= targetSunY)) {
          clearInterval(interval);
          return [prev[0], targetSunY, prev[2]];
        }
        return [prev[0], newY, prev[2]];
      });

      setMoonPosition((prev) => {
        let newY = prev[1] + (isNight ? speed : -speed);
        if ((isNight && newY >= targetMoonY) || (!isNight && newY <= targetMoonY)) {
          clearInterval(interval);
          return [prev[0], targetMoonY, prev[2]];
        }
        return [prev[0], newY, prev[2]];
      });
    }, 50); // Runs every 50ms for smooth transition

    return () => clearInterval(interval);
  }, [isNight]); // Runs when isNight changes

  return (
    <group>
      {/* Moon Model (Rises at Night, Falls in Day) */}
      <primitive
        ref={moonRef}
        object={useGLTF("/models/moon.glb").scene}
        position={moonPosition}
        scale={[0.7, 0.7, 0.7]}
      />
      
      {/* Sun Model (Falls at Night, Rises in Day) */}
      <primitive
        ref={sunRef}
        object={useGLTF("/models/sun.glb").scene}
        position={sunPosition}
        scale={[0.05, 0.05, 0.05]}
      />
      <directionalLight position={sunPosition} intensity={3} color="yellow" castShadow />
    </group>
  );
}

function Fence({ position, rotation, scale }) {
  const { scene } = useGLTF("/models/fence.glb");
  return <primitive object={scene.clone()} position={position} rotation={rotation} scale={scale} />;
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
  const [animationSpeed, setAnimationSpeed] = useState(0); // Start at 0 speed

  useEffect(() => {
    if (!actions || !actions.Animation) return;

    let targetSpeed = isPowered ? 1 : 0; // Full speed when on, stop when off
    let speedStep = isPowered ? 0.1 : -0.1; // Increase when turning on, decrease when off

    const interval = setInterval(() => {
      setAnimationSpeed((prev) => {
        let newSpeed = prev + speedStep;
        if ((isPowered && newSpeed >= targetSpeed) || (!isPowered && newSpeed <= targetSpeed)) {
          clearInterval(interval); // Stop updating when reaching target
          return targetSpeed;
        }
        return newSpeed;
      });
    }, 100); // Adjust every 100ms for smooth transition

    return () => clearInterval(interval);
  }, [isPowered, actions]);

  useEffect(() => {
    if (actions.Animation) {
      actions.Animation.play();
      actions.Animation.timeScale = animationSpeed; // Adjust fan speed smoothly
    }
  }, [animationSpeed, actions]);

  return <primitive object={scene} position={[1.5, 1, -2]} scale={[1, 1, 1]} />;
}


function Lamp({ isPowered }) {
  const [lightIntensity, setLightIntensity] = useState(0); // Start with light off
  const [blinking, setBlinking] = useState(false); // Track blinking state

  useEffect(() => {
    if (blinking) return; // Prevent multiple blinking sequences

    if (isPowered) {
      // Simulate blinking effect before turning on
      setBlinking(true);
      let blinkCount = 0;
      const blinkInterval = setInterval(() => {
        setLightIntensity((prev) => (prev > 0 ? 0 : 1)); // Toggle light
        blinkCount++;
        if (blinkCount >= 4) {
          clearInterval(blinkInterval);
          setBlinking(false);
          setLightIntensity(1); // Fully turn on the lamp
        }
      }, 200); // Blink every 200ms
    } else {
      // Smoothly turn off
      let intensity = lightIntensity;
      const fadeInterval = setInterval(() => {
        intensity -= 0.1;
        if (intensity <= 0) {
          clearInterval(fadeInterval);
          setLightIntensity(0); // Fully turn off
        } else {
          setLightIntensity(intensity);
        }
      }, 100); // Gradually decrease every 100ms
    }
  }, [isPowered]);

  return (
    <group position={[1.5, 0, -2]}>
      <GLBModel path="/models/lamp.glb" position={[0, 1, 0]} scale={[0.01, 0.01, 0.01]} />
      {lightIntensity > 0 && (
        <pointLight intensity={lightIntensity} distance={5} position={[0, 1.2, 0.2]} color="yellow" />
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
        rotation={[0, Math.PI / 4, 0]} // Rotate 45 degrees (PI/4 radians) around the Y-axis
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

              {/* Toggle Day/Night Button */}
              <group position={[0, -2, 1]}>
        <mesh
          scale={[1, 0.2, 1]}
          onPointerDown={toggleNightMode}  // Change from onClick to onPointerDown
        >
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

function SpinningCloud({position, scale, rotationSpeed = 0.0001 }) {
  const cloudRef = useRef();
  const { scene } = useGLTF("/models/cloud.glb");

  // Animate rotation
  useFrame(() => {
    if (cloudRef.current) {
      cloudRef.current.rotation.y += rotationSpeed; // Spin around Y-axis
    }
  });

  return <primitive ref={cloudRef} object={scene} position={position} scale={scale} />;
}

// function SpeedControl({ position, onChange }) {
//   const knobRef = React.useRef();
//   const [dragging, setDragging] = useState(false);
//   const [value, setValue] = useState(1);

//   const trackLength = 2; // Length of the slider track

//   const handlePointerMove = (event) => {
//     if (dragging) {
//       const knobPosition = Math.min(
//         Math.max(event.point.x, -trackLength / 2),
//         trackLength / 2
//       );
//       knobRef.current.position.x = knobPosition;

//       // Normalize value to range [0.1, 3] based on knob position
//       const newValue = ((knobPosition + trackLength / 2) / trackLength) * 2.9 + 0.1;
//       setValue(newValue);
//       onChange(newValue);
//     }
//   };

//   return (
//     <group position={position}>
//       {/* Track */}
//       <mesh position={[0, 0, 0]}>
//         <boxGeometry args={[trackLength, 0.1, 0.1]} />
//         <meshStandardMaterial color="gray" />
//       </mesh>

//       {/* Knob */}
//       <mesh
//         ref={knobRef}
//         position={[-trackLength / 2, 0, 0]}
//         onPointerDown={() => setDragging(true)}
//         onPointerUp={() => setDragging(false)}
//         onPointerMove={handlePointerMove}
//         onPointerOut={() => setDragging(false)}
//         castShadow
//       >
//         <boxGeometry args={[0.2, 0.2, 0.2]} />
//         <meshStandardMaterial color="orange" />
//       </mesh>

//       {/* Value Display */}
//       <Text
//         position={[0, 0.5, 0]}
//         fontSize={0.2}
//         color="black"
//         anchorX="center"
//         anchorY="middle"
//       >
//         Speed: {value.toFixed(2)}x
//       </Text>
//     </group>
//   );
// }
const clock = new THREE.Clock();
const timeOffset = 0;

function App() {
  const [position, setPosition] = useState(new Vector3());
  const [energySource, setEnergySource] = useState(null);
  const [device, setDevice] = useState(null);
  const [isPowered, setIsPowered] = useState(false);
  const [isNight, setIsNight] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("#ffcc88"); 
  // const [speed, setSpeed] = useState(1);

  const handleEnergySourceChange = (source) => {
    setEnergySource(source);
    if (source === "bike") {
      setIsPowered(true); // Bike generates power anytime
    } else if (source === "solar") {
      setIsPowered(!isNight); // Solar only works in the daytime
    } else {
      setIsPowered(false); // No power
    }
  };

  const handleDeviceChange = (device) => {
    setDevice(device);
  };

  const toggleNightMode = () => {
    setIsNight((prev) => !prev);
  };

  useEffect(() => {
    if (energySource === "solar") {
      if (isNight) {
        console.log("Solar power is unavailable at night. Devices are turned off.");
        setIsPowered(false); // Turn off solar power at night
      } else {
        console.log("Daytime detected! Solar power is now active.");
        setIsPowered(true); // Automatically turn on devices when switching to daytime
      }
    }
  }, [isNight, energySource]); // Runs when isNight or energySource changes
  
    // Smooth transition effect for background
    useEffect(() => {
      let targetColor = isNight ? "#0b1d3d" : "#ffcc88"; // Dark blue at night, warm yellow in day
      let step = 0;
  
      const transitionInterval = setInterval(() => {
        setBackgroundColor((prev) => {
          // Interpolate between current and target color
          let newColor = interpolateColor(prev, targetColor, step / 50);
          step++;
          if (step >= 50) {
            clearInterval(transitionInterval);
            return targetColor;
          }
          return newColor;
        });
      }, 30); // Gradually update every 30ms for smooth effect
  
      return () => clearInterval(transitionInterval);
    }, [isNight]);
  
    // Function to interpolate between two colors smoothly
    function interpolateColor(color1, color2, factor) {
      let c1 = new THREE.Color(color1);
      let c2 = new THREE.Color(color2);
      let interpolated = c1.lerp(c2, factor);
      return `#${interpolated.getHexString()}`;
    }

    const fencePositions = [
      { position: [-10, 0, -6.5], rotation: [0, Math.PI / 2, 0] },// Left
      { position: [-10, 0, 0.2], rotation: [0, Math.PI / 2, 0] },// Left
      { position: [-10, 0, 6.5], rotation: [0, Math.PI / 2, 0] },// Left
      { position: [10, 0, -6.5], rotation: [0, Math.PI / 2, 0] },// Right
      { position: [10, 0, 0.2], rotation: [0, Math.PI / 2, 0] },// Right
      { position: [10, 0, 6.5], rotation: [0, Math.PI / 2, 0] },// Right
      { position: [-6.6, 0, -10], rotation: [0, 0, 0] },// Back
      { position: [0.2, 0, -10], rotation: [0, 0, 0] },// Back
      { position: [6.6, 0, -10], rotation: [0, 0, 0] },// Back
      { position: [-6.6, 0, 10], rotation: [0, 0, 0] },// Front
      { position: [0.2, 0, 10], rotation: [0, 0, 0] },// Front
      { position: [6.6, 0, 10], rotation: [0, 0, 0] },// Front
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
          <OrbitControls/>
          <color attach="background" args={[backgroundColor]} />
          <SunLight isNight={isNight} />
          <CelestialBody isNight={isNight} />
          <SpinningCloud position={[0, 50, 0]} scale={[1, 1, 1]} />
          <XROrigin position={position.toArray()} />
          <TeleportTarget
            onTeleport={(newPosition) => setPosition(newPosition)}
          >
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

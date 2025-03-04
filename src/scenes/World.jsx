// src/scenes/World.jsx
import React, { useState, useEffect, Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { XR, XROrigin, TeleportTarget } from "@react-three/xr";
import { Html } from '@react-three/drei';
import { getQuestions } from '../hooks/useApi';

import SunLight from "../components/SunLight";
import CelestialBody from "../components/CelestialBody";
import SpinningCloud from "../components/SpinningCloud";
import GLBModel from "../components/GLBModel";
import Fence from "../components/Fence";
import Lamp from "../components/Lamp";
import Fan from "../components/Fan";
import Pipe from "../components/Pipe";
import Wall_light from "../components/Wall_light";
import Wheels from "../components/Wheels";
import Water from "../components/Water";
import GameTip from "../components/GameTip";
import SleepingBagWithTip from "../components/SleepingBagWithTip";
import InteractiveWithTip from "../components/InteractiveWithTip";
import VRMenuController from "../components/VRMenuController";
import Multiplayer from "../components/Multiplayer";
import QuestionList from "../components/QuestionList";
import TextOverlay from "../components/TextOverlay";

const World = ({
  store,
  position,
  backgroundColor,
  onTeleport,
  handleEnergySourceChange,
  toggleNightMode,
  isNight,
  energySource,
  isPowered,
  isInVR,
}) => {
  // Memoize static arrays to avoid re-creating them on every render
  const fencePositions = useMemo(() => ([
    { position: [-10, -1, -6.5], rotation: [0, Math.PI / 2, 0] },
    { position: [-10, -1, 0.2], rotation: [0, Math.PI / 2, 0] },
    { position: [-10, -1, 6.5], rotation: [0, Math.PI / 2, 0] },
    { position: [10, -1, -6.5], rotation: [0, Math.PI / 2, 0] },
    { position: [10, -1, 0.2], rotation: [0, Math.PI / 2, 0] },
    { position: [10, -1, 6.5], rotation: [0, Math.PI / 2, 0] },
    { position: [-6.6, -1, -10], rotation: [0, 0, 0] },
    { position: [0.2, -1, -10], rotation: [0, 0, 0] },
    { position: [6.6, -1, -10], rotation: [0, 0, 0] },
    { position: [-6.6, -1, 10], rotation: [0, 0, 0] },
    { position: [0.2, -1, 10], rotation: [0, 0, 0] },
    { position: [6.6, -1, 10], rotation: [0, 0, 0] },
  ]), []);

  const wallLightPositions = useMemo(() => ([
    { position: [8, 4, -9.6], rotation: [0, 0, 0]},
    { position: [0, 4, -9.6], rotation: [0, 0, 0]},
    { position: [-8, 4, -9.6], rotation: [0, 0, 0]},
    { position: [-8, 4, 9.7], rotation: [0, Math.PI, 0]},
    { position: [8, 4, 9.7], rotation: [0, Math.PI, 0]},
    { position: [0, 4, 9.7], rotation: [0, Math.PI, 0]},
    { position: [9.6, 4, 8], rotation: [0, -Math.PI / 2, 0]},
    { position: [9.6, 4, 0], rotation: [0, -Math.PI / 2, 0]},
    { position: [9.6, 4, -8], rotation: [0, -Math.PI / 2, 0]},
    { position: [-9.6, 4, 8], rotation: [0, Math.PI / 2, 0]},
    { position: [-9.6, 4, 0], rotation: [0, Math.PI / 2, 0]},
    { position: [-9.6, 4, -8], rotation: [0, Math.PI / 2, 0]},
  ]), []);

  const pipePositions = useMemo(() => ([
    { position: [-6.5, -3, -10.2] },
    { position: [0, -3, -10.2] },
    { position: [6, -3, -10.2] },
  ]), []);

  const [leftParticlesOn, setLeftParticlesOn] = useState(true);
  const [rightParticlesOn, setRightParticlesOn] = useState(true);
  const toggleLeftParticles = () => setLeftParticlesOn((prev) => !prev);
  const toggleRightParticles = () => setRightParticlesOn((prev) => !prev);

  const wheelsIntensity = useMemo(() => (
    leftParticlesOn && rightParticlesOn ? 1 : !leftParticlesOn && !rightParticlesOn ? 0 : 0.5
  ), [leftParticlesOn, rightParticlesOn]);

  const [questions, setQuestions] = useState([]);
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getQuestions();
        setQuestions(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchQuestions();
  }, []);

  return (
    <Canvas
      shadows
      camera={{ position: [5, 3, 5] }}
      onCreated={({ gl }) => {
        gl.xr.enabled = true;
      }}
    >
      <Suspense fallback={<Html center>Loading...</Html>}>
        <XR store={store}>
          {/* Set the background color */}
          <color attach="background" args={[backgroundColor]} />
          <SunLight isNight={isNight} />
          <CelestialBody isNight={isNight} />
          <SpinningCloud position={[0, 50, 0]} scale={[1, 1, 1]} />
          <QuestionList questions={questions} position={[0, 4, -3]} visible={true} />
          <XROrigin position={position.toArray()}>
            <VRMenuController />
          </XROrigin>
          <TeleportTarget onTeleport={onTeleport}>
            <mesh scale={[17, 1, 19.5]} position={[-1.3, -0.5, 0]} receiveShadow castShadow>
              <boxGeometry />
              <meshStandardMaterial color="#36454F" />
            </mesh>
          </TeleportTarget>
          <Multiplayer />
          <Pipe
            leftParticlesOn={leftParticlesOn}
            toggleLeftParticles={toggleLeftParticles}
            rightParticlesOn={rightParticlesOn}
            toggleRightParticles={toggleRightParticles}
          />
          <Wheels
            leftSpin={leftParticlesOn ? 1 : 0}
            rightSpin={rightParticlesOn ? 1 : 0}
          />
          <Water position={[9, -0.5, 0]} scale={[0.5, 3, 1]} />
          <group>
            <GLBModel path="/models/sewer_opening.glb" position={[8, -0.5, -9.6]} scale={[1.5, 0.2, 1]} />
            <GLBModel path="/models/sewer_opening.glb" position={[8.3, -0.5, 9.6]} scale={[1.5, 0.2, 1]} />
            <mesh scale={[5, 0.7, 0.01]} position={[8, -0.4, -9.7]}>
              <boxGeometry />
              <meshStandardMaterial color="black" />
            </mesh>
          </group>
          <GLBModel path="/models/electric_distribution_box.glb" position={[0, 1.5, -9.4]} scale={2.5} animationSpeed={0} />
          <GLBModel path="/models/dumpster_large.glb" position={[-9, 0.8, 7]} scale={2.5} />
          <GLBModel path="/models/table.glb" position={[2, 0, -2]} scale={[0.3, 0.3, 0.3]} />
          <GLBModel path="/models/low_poly_computer_chair.glb" position={[2, 0, -1]} scale={0.35} rotation={[0, -Math.PI/1.5, 0]} />
          <GLBModel path="/models/laptop.glb" position={[1.7, 1, -1.7]} scale={[0.5, 0.5, 0.5]} />
          <GLBModel path="/models/papers.glb" position={[-7, 0, -2]} scale={[1, 1, 1]} />
          <GLBModel path="/models/debris_pile.glb" position={[-7, 0, 5]} scale={[1, 1, 1]} />
          <GLBModel path="/models/env_pipe.glb" position={[6.5, -0.1, 7.5]} scale={[1, 1, 1]} />
          <GLBModel path="/models/env_pipe.glb" position={[-4, 4, -9.9]} scale={[1, 1, 1]} rotation={[0, Math.PI / 2, Math.PI / 2]} />
          <GLBModel path="/models/env/giant_low_poly_tree.glb" position={[-15,2,-11]} scale={1} />
          <GLBModel path="/models/env/giant_low_poly_tree.glb" position={[15,5,-11]} scale={1.5} rotation={[0, Math.PI / 2, 0]} />
          <GLBModel path="/models/env/tree_low-poly_3d_model.glb" position={[-40,2,11]} scale={0.04} />
          <GLBModel path="/models/env/tree.glb" position={[-15,2,-30]} scale={0.02} animationSpeed={1} />
          <GLBModel path="/models/env/tree.glb" position={[15,2,30]} scale={0.02} animationSpeed={1} />
          <GLBModel path="/models/cloud.glb" position={[15,50,30]} scale={0.5} animationSpeed={1} />
          <GLBModel path="/models/env/low_poly_building.glb" position={[15,2,30]} scale={5} />
          <GLBModel path="/models/env/low_poly_building.glb" position={[15,2,30]} scale={5} rotation={[0, Math.PI / 2, 0]} />
          <GLBModel path="/models/env/low_poly_buidling_gray.glb" position={[-30,2,40]} scale={4} rotation={[0, Math.PI / 2, 0]} />
          <GLBModel path="/models/env/low_poly_building_big.glb" position={[-30,2,-60]} scale={2} rotation={[0, Math.PI / 2, 0]} />
          <GLBModel path="/models/env/low_poly_building_big.glb" position={[-20,2,-120]} scale={2} rotation={[0, Math.PI / 2, 0]} />
          <GLBModel path="/models/env/low_poly_building_big.glb" position={[20,-2,-120]} scale={2} rotation={[0, Math.PI / 4, 0]} />
          <GLBModel path="/models/env/set_of_4_low-poly_buildings.glb" position={[50,-2,0]} scale={5} rotation={[0, Math.PI / 4, 0]} />
          <GLBModel path="/models/env/set_of_4_low-poly_buildings.glb" position={[50,-2,-50]} scale={5} rotation={[0, Math.PI, 0]} />
          <SleepingBagWithTip toggleNightMode={toggleNightMode} />
          {pipePositions.map((props, index) => (
            <GLBModel key={index} path="/models/env_pipe_1.glb" {...props} scale={[2, 2, 2]} />
          ))}
          {wallLightPositions.map((props, index) => (
            <Wall_light key={index} {...props} scale={0.15} intensity={wheelsIntensity} />
          ))}
          <pointLight position={[0,5,0]} intensity={20} distance={10} color="yellow" castShadow/>
          {fencePositions.map((props, index) => (
            <Fence key={index} {...props} scale={[2.5, 4, 3]} />
          ))}

          <TextOverlay/>

          {isInVR && (
            <>
              <InteractiveWithTip
                tip="Tap here to select Bike"
                tipPosition={[-2, 2.5, -4]}
                onClick={() => handleEnergySourceChange("bike")}
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
              </InteractiveWithTip>
              <InteractiveWithTip
                tip="Tap here to select Solar"
                tipPosition={[0, 2, -9]}
                onClick={() => handleEnergySourceChange("solar")}
              >
                <GLBModel
                  path="/models/solar.glb"
                  position={[0, 6.1, -11.3]}
                  scale={1.5}
                />
              </InteractiveWithTip>
              <GameTip
                tip="You are getting power from the treadmill!"
                position={[-2, 1, -3]}
                visible={energySource === "bike"}
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
              <GameTip
                tip="Your device is not receiving any power. Please check your power source!"
                position={[1.9, 1.7, -2]}
                visible={!isPowered}
              />
            </>
          )}
          <Lamp isPowered={isPowered} />
          <Fan isPowered={isPowered} />
        </XR>
      </Suspense>
    </Canvas>
  );
};

export default World;

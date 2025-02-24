// src/scenes/World.jsx
import React, {useState} from "react";
import { Canvas } from "@react-three/fiber";
import { XR, XROrigin, TeleportTarget } from "@react-three/xr";
import { useGLTF, Preload, Html } from '@react-three/drei';



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

useGLTF.preload("/models/lamp.glb");
useGLTF.preload("/models/fan.glb");
useGLTF.preload("/models/solar.glb");
useGLTF.preload("/models/bike.glb");
useGLTF.preload("/models/treadmill.glb");



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
  ];

  const wallLightPositions = [
    { position: [8, 4, -9.6], rotation: [0, 0, 0]},
    { position: [0, 4, -9.6], rotation: [0, 0, 0]},
    { position: [-8, 4, -9.6], rotation: [0, 0, 0]},
    { position: [-8, 4, 9.7], rotation: [0, Math.PI / 1, 0]},
    { position: [8, 4, 9.7], rotation: [0, Math.PI / 1, 0]},
    { position: [0, 4, 9.7], rotation: [0, Math.PI / 1, 0]},
    { position: [9.6, 4, 8], rotation: [0, -Math.PI / 2, 0]},
    { position: [9.6, 4, 0], rotation: [0, -Math.PI / 2, 0]},
    { position: [9.6, 4, -8], rotation: [0, -Math.PI / 2, 0]},
    { position: [-9.6, 4, 8], rotation: [0, Math.PI / 2, 0]},
    { position: [-9.6, 4, 0], rotation: [0, Math.PI / 2, 0]},
    { position: [-9.6, 4, -8], rotation: [0, Math.PI / 2, 0]},

  ]

  const pipePosition = [
    {position:[-6.5, -3, -10.2]},
    {position:[0, -3, -10.2]},
    {position:[6, -3, -10.2]},
  ]

  const [leftParticlesOn, setLeftParticlesOn] = useState(true);
  const [rightParticlesOn, setRightParticlesOn] = useState(true);

  const toggleLeftParticles = () => {
    setLeftParticlesOn((prev) => !prev);
  };

  const toggleRightParticles = () => {
    setRightParticlesOn((prev) => !prev);
  };

  const wheelsIntensity =
  leftParticlesOn && rightParticlesOn
    ? 1
    : !leftParticlesOn && !rightParticlesOn
    ? 0
    : 0.5;
    

  return (
    <Canvas
    shadows
    camera={{ position: [5, 3, 5] }}
    onCreated={({ gl }) => {
      gl.xr.enabled = true;
      
    }}
    >
      <Preload all />
      <XR store={store}>
        {/* Background color */}
        <color attach="background" args={[backgroundColor]} />

        {/* Environment */}
        {/* <City scale={1.5} position={[75,-1,50]}/> */}
        <SunLight isNight={isNight} />
        <CelestialBody isNight={isNight} />
        <SpinningCloud position={[0, 50, 0]} scale={[1, 1, 1]} />

        {/* XR Origin and Teleport Target */}
        <XROrigin position={position.toArray()}>
        <VRMenuController />
        </XROrigin> 
        <TeleportTarget onTeleport={onTeleport}>
          <mesh scale={[17, 1, 19.5]} position={[-1.3, -0.5, 0]} receiveShadow castShadow >
            <boxGeometry />
            <meshStandardMaterial color="#36454F" /> 
          </mesh>
        </TeleportTarget>
        {/* Models */}
        <Pipe
          leftParticlesOn={leftParticlesOn}
          toggleLeftParticles={toggleLeftParticles}
          rightParticlesOn={rightParticlesOn}
          toggleRightParticles={toggleRightParticles}
        />
        {/* Wheels spin only when their corresponding pipe is on */}
        <Wheels leftSpin={leftParticlesOn ? 1 : 0} rightSpin={rightParticlesOn ? 1 : 0} />
        <Water position={[9, -0.5, 0]} scale={[0.5, 3, 1]} />;
        <group>
        <GLBModel path="/models/sewer_opening.glb" position={[8, -0.5, -9.6]} scale={[1.5,0.2,1]} />
        <GLBModel path="/models/sewer_opening.glb" position={[8.3, -0.5, 9.6]} scale={[1.5,0.2,1]} />
        <mesh scale={[5, 0.7, 0.01]} position={[8, -0.4, -9.7]}>
            <boxGeometry />
            <meshStandardMaterial color="black" />
        </mesh>
        </group>


        {/* <mesh scale={[10, 0.1, 0.1]} position={[0, 0, 0]}>
            <boxGeometry />
            <meshStandardMaterial color="black" />
        </mesh> */}


        {/* Env */}
        <GLBModel path="/models/electric_distribution_box.glb" position={[0, 1.5, -9.4]} scale={2.5} animationSpeed={0} />
        <GLBModel path="/models/dumpster_large.glb" position={[-9, .8, 7]} scale={2.5} />
        <GLBModel path="/models/table.glb" position={[2, 0, -2]} scale={[0.3, 0.3, 0.3]} />
        <GLBModel path="/models/low_poly_computer_chair.glb" position={[2, 0, -1]} scale={0.35} rotation={[0,-Math.PI/1.5,0]}/>
        <GLBModel path="/models/laptop.glb" position={[1.7, 1, -1.7]} scale={[0.5, 0.5, 0.5]} />
        <GLBModel path="/models/papers.glb" position={[-7, 0, -2]} scale={[1, 1, 1]} />
        <GLBModel path="/models/debris_pile.glb" position={[-7, 0, 5]} scale={[1, 1, 1]} />
        <GLBModel path="/models/env_pipe.glb" position={[6.5, -0.1, 7.5]} scale={[1, 1, 1]} />
        <GLBModel path="/models/env_pipe.glb" position={[-4, 4, -9.9]} scale={[1, 1, 1]} rotation={[0, Math.PI / 2 ,Math.PI / 2]} />

        <GLBModel path="/models/env/giant_low_poly_tree.glb" position={[-15,2,-11]} scale={1} />
        <GLBModel path="/models/env/giant_low_poly_tree.glb" position={[15,5,-11]} scale={1.5}  rotation={[0, Math.PI / 2 ,0]}/>
        <GLBModel path="/models/env/tree_low-poly_3d_model.glb" position={[-40,2,11]} scale={0.04} />
        <GLBModel path="/models/env/tree.glb" position={[-15,2,-30]} scale={0.02} animationSpeed={1} />
        <GLBModel path="/models/env/tree.glb" position={[15,2,30]} scale={0.02} animationSpeed={1} />
        <GLBModel path="/models/cloud.glb" position={[15,50,30]} scale={0.5} animationSpeed={1} />

        <GLBModel path="/models/env/low_poly_building.glb" position={[15,2,30]} scale={5}/>
        <GLBModel path="/models/env/low_poly_building.glb" position={[15,2,30]} scale={5} rotation={[0, Math.PI / 2 ,0]}/>
        <GLBModel path="/models/env/low_poly_buidling_gray.glb" position={[-30,2,40]} scale={4} rotation={[0, Math.PI / 2 ,0]}/>
        <GLBModel path="/models/env/low_poly_building_big.glb" position={[-30,2,-60]} scale={2} rotation={[0, Math.PI / 2 ,0]}/>
        <GLBModel path="/models/env/low_poly_building_big.glb" position={[-20,2,-120]} scale={2} rotation={[0, Math.PI / 2 ,0]}/>
        <GLBModel path="/models/env/low_poly_building_big.glb" position={[20,-2,-120]} scale={2} rotation={[0, Math.PI / 4 ,0]}/>
        <GLBModel path="/models/env/set_of_4_low-poly_buildings.glb" position={[50,-2,0]} scale={5} rotation={[0, Math.PI / 4 ,0]}/>
        <GLBModel path="/models/env/set_of_4_low-poly_buildings.glb" position={[50,-2,-50]} scale={5} rotation={[0, Math.PI / 1 ,0]}/>


        <SleepingBagWithTip toggleNightMode={toggleNightMode} />

        {pipePosition.map((props, index) => (
          <GLBModel path="/models/env_pipe_1.glb" key={index} {...props} scale={[2, 2, 2]} />
        ))}
        {wallLightPositions.map((props, index) => (
          <Wall_light 
            key={index} 
            {...props} 
            scale={0.15} 
            intensity={wheelsIntensity} 
          />
        ))}
        <pointLight position={[0,5,0]} intensity={20} distance={10} color="yellow" castShadow/>
        {fencePositions.map((props, index) => (
          <Fence key={index} {...props} scale={[2.5, 4, 3]} />
        ))}



        {/* ===== Direct Energy Source Selection ===== */}
        <InteractiveWithTip
          tip="Tap here to select Bike"
          tipPosition={[-2, 0.1, -4]} 
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
          tipPosition={[0, 6.5, -11]} // Adjust the tip position if necessary
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
          position={[-2, 2, -4]} 
          visible={energySource === "bike"}  
        />
        <GameTip
          tip={
            energySource === "solar" && isNight && !isPowered
              ? "Solar will only work when the sun is up!"
              : "You are getting power from the solarpanel!"
          }
          position={[0, 10, -14]}
          visible={energySource === "solar"} 
        />
        <GameTip
          tip="Your devices is not receiving any power. Please check your power source!"
          position={[1.9, 1.7, -2]} 
          visible={!isPowered}  
        />

        {/* Devices */}
        <Lamp isPowered={isPowered} />
        <Fan isPowered={isPowered} />
      </XR>
    </Canvas>
  );
};

export default World;

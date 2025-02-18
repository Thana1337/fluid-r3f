import React from "react";
import GLBModel from "./GLBModel";
import Particles from "./Particle";
import { Text } from "@react-three/drei";
import Lever from '../components/Lever'

const Pipe = ({ 
  leftParticlesOn, 
  toggleLeftParticles, 
  rightParticlesOn, 
  toggleRightParticles 
}) => {
  return (
    <>
      {/* Left Pipe Group */}
      <group>
        <GLBModel
          position={[-8, 4, -9]}
          animationSpeed={0}
          scale={[0.05, 0.05, 0.05]}
          rotation={[0, Math.PI / 2, 0]}
          path="/models/pipe_segment.glb"
        />
        <Particles
          active={leftParticlesOn} // Always rendered; fades based on active prop.
          flowDirection={[0, 0, 1]}
          base={[-8, 4, -9]}
          spread={7}
          color="white"
          particleSize={0.4}
          numParticles={100}
          particleType="steam"
        />
        <group position={[-8, 4, -9]}>
          <mesh onPointerDown={toggleLeftParticles} position={[0, -1.5, 0]}>
            <boxGeometry args={[0.3, 1.5, 0.3]} />
            <meshStandardMaterial color={leftParticlesOn ? "green" : "red"} />
          </mesh>
          <Text
            position={[0, -2.5, 0]}
            fontSize={0.3}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {leftParticlesOn ? "On" : "Off"}
          </Text>
        </group>
      </group>

      {/* Right Pipe Group */}
      <group>
        <GLBModel
          position={[8, 4, -9]}
          animationSpeed={0}
          scale={[0.05, 0.05, 0.05]}
          rotation={[0, Math.PI / 2, 0]}
          path="/models/pipe_segment.glb"
        />
        <Particles
          active={rightParticlesOn}
          flowDirection={[0, 0, 1]}
          base={[8, 4, -9]}
          spread={6}
          color="#296510"
          particleSize={0.5}
          numParticles={100}
          particleType="water"
        />
        <group position={[8, 1, -9.5]}>
          <Lever isOn={rightParticlesOn} toggle={toggleRightParticles} />
          <Text
            position={[0, -2.5, 0]}
            fontSize={0.3}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {rightParticlesOn ? "On" : "Off"}
          </Text>
        </group>
      </group>
    </>
  );
};

export default Pipe;

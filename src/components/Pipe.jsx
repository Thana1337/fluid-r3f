import GLBModel from "./GLBModel";
import Particles from "./Particle";

const Pipe = () => {


    return(
        <>
        <group>
            <GLBModel position={[-8,4,-9]} animationSpeed={0} scale={[0.05,0.05,0.05]} rotation={[0, Math.PI / 2, 0]} path="/models/pipe_segment.glb"/>
            <Particles 
            flowDirection={[0, 0, 1]}
            base={[-8, 4,-9]}         
            spread={7}
            color="white" 
            particleSize={0.4}
            numParticles={100}
            particleType="steam"       
            />
        </group>
        <group>
            <GLBModel position={[8,4,-9]} animationSpeed={0} scale={[0.05,0.05,0.05]} rotation={[0, Math.PI / 2, 0]} path="/models/pipe_segment.glb"/>
            <Particles 
            flowDirection={[0, 0, 1]}
            base={[8, 4,-9]}         
            spread={6}
            color="#296510" 
            particleSize={0.5}
            numParticles={100}
            steamAcceleration={2}
            particleType="water"       
            />
        </group>
        </>
    )
}

export default Pipe;
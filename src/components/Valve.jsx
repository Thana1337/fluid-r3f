import GLBModel from "./GLBModel";
import Particles from "../components/Particle";

const Valve = () => {


    return(
        <group>
            <GLBModel position={[2,0,2]} animationSpeed={0} scale={[0.02,0.02,0.02]} path="/models/valve.glb"/>
            <Particles/>
        </group>
    )
}

export default Valve;
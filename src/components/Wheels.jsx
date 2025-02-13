import GLBModel from "./GLBModel";

const Wheels = () => {

    return(
        <>
        <GLBModel path="models/wheel.glb" animationSpeed={1} position={[8,2,-5]} scale={[1,1,1]}/>
        <GLBModel path="models/wheel.glb" animationSpeed={1} position={[-8,2,-5]} scale={[1,1,1]}/>
        </>
    )
}

export default Wheels;
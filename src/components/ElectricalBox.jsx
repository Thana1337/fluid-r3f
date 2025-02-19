import React from "react";

const ElectricalBox = ({ position = [0, 0, 0] }) => {
  // Dimensions for the electrical unit
  const boxWidth = 2;
  const boxHeight = 3; // Taller box
  const boxDepth = 1;

  // Define an array of button configurations.
  // Each button includes its type, position (on the front face), color, and geometry parameters.
  const buttons = [
    {
      type: "cylinder",
      position: [-0.6, 0.8, boxDepth / 2 + 0.01],
      color: "red",
      args: [0.1, 0.1, 0.05, 32],
    },
    {
      type: "box",
      position: [0, 0.8, boxDepth / 2 + 0.01],
      color: "green",
      args: [0.15, 0.15, 0.05],
    },
    {
      type: "sphere",
      position: [0.6, 0.8, boxDepth / 2 + 0.01],
      color: "blue",
      args: [0.1, 32, 16],
    },
    {
      type: "cylinder",
      position: [-0.6, 0, boxDepth / 2 + 0.01],
      color: "yellow",
      args: [0.1, 0.1, 0.05, 32],
    },
    {
      type: "box",
      position: [0, 0, boxDepth / 2 + 0.01],
      color: "purple",
      args: [0.15, 0.15, 0.05],
    },
    {
      type: "sphere",
      position: [0.6, 0, boxDepth / 2 + 0.01],
      color: "orange",
      args: [0.1, 32, 16],
    },
    {
      type: "cylinder",
      position: [-0.6, -0.8, boxDepth / 2 + 0.01],
      color: "cyan",
      args: [0.1, 0.1, 0.05, 32],
    },
    {
      type: "box",
      position: [0, -0.8, boxDepth / 2 + 0.01],
      color: "magenta",
      args: [0.15, 0.15, 0.05],
    },
    {
      type: "sphere",
      position: [0.6, -0.8, boxDepth / 2 + 0.01],
      color: "white",
      args: [0.1, 32, 16],
    },
  ];

  return (
    <group position={position}>
      {/* Main electrical box */}
      <mesh>
        <boxGeometry args={[boxWidth, boxHeight, boxDepth]} />
        <meshStandardMaterial color="darkgray" metalness={0.7} roughness={0.5} />
      </mesh>
      {/* Visual buttons */}
      {buttons.map((btn, index) => {
        let geometry = null;
        if (btn.type === "cylinder") {
          geometry = <cylinderGeometry args={btn.args} />;
        } else if (btn.type === "box") {
          geometry = <boxGeometry args={btn.args} />;
        } else if (btn.type === "sphere") {
          geometry = <sphereGeometry args={btn.args} />;
        }
        return (
          <mesh
            key={index}
            position={btn.position}
            rotation={btn.type === "cylinder" ? [Math.PI / 2, 0, 0] : [0, 0, 0]}
          >
            {geometry}
            <meshStandardMaterial color={btn.color} />
          </mesh>
        );
      })}
    </group>
  );
};

export default ElectricalBox;

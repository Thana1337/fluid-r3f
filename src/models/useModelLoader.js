// src/models/useModelLoader.js
import { useGLTF } from "@react-three/drei";

const useModelLoader = (path) => {
  const { scene, animations } = useGLTF(path);
  return { scene, animations };
};

export default useModelLoader;
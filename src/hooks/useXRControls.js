// src/hooks/useXRControls.js
import { createXRStore } from "@react-three/xr";

const useXRControls = () => {
  return createXRStore({
    hand: { teleportPointer: true },
    controller: { teleportPointer: true },
  });
};

export default useXRControls;
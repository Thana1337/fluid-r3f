import React, { createContext, useContext } from 'react';
import { useLiveKitRoom } from '../hooks/useLiveKitRoom';

const LiveKitRoomContext = createContext(null);

export function LiveKitRoomProvider({ token, wsUrl, children }) {
  const room = useLiveKitRoom(token, wsUrl);

  return (
    <LiveKitRoomContext.Provider value={room}>
      {children}
    </LiveKitRoomContext.Provider>
  );
}

export function useRoom() {
  return useContext(LiveKitRoomContext);
}

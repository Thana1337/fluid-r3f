import { Room } from 'livekit-client';
import { useEffect, useState } from 'react';


export function useLiveKitRoom(token, wsUrl) {
  const [room, setRoom] = useState(null);

  useEffect(() => {
    async function joinRoom() {
      try {
        const room = new Room();
        await room.connect(wsUrl, token);
        setRoom(room);
      } catch (error) {
        console.error('LiveKit connection error:', error);
      }
    }
    joinRoom();
    return () => {
      if (room) room.disconnect();
    };
  }, [token, wsUrl]);

  return room;
}

export default useLiveKitRoom;

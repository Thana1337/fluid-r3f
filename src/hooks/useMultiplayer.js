import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const useMultiplayer = () => {
  const [socket, setSocket] = useState(null);
  const [players, setPlayers] = useState({});

  useEffect(() => {
    const SERVER_API = import.meta.env.VITE_SERVER_API;
    const newSocket = io(SERVER_API);
    console.log("SERVER_API:", import.meta.env.VITE_SERVER_API);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected with socket ID:', newSocket.id);
    });

    newSocket.on('playerJoined', (data) => {
      console.log('Player joined:', data);
      setPlayers((prev) => ({ ...prev, [data.id]: { position: [0, 0, 0] } }));
    });

    newSocket.on('playerMoved', (data) => {
      setPlayers((prev) => ({ ...prev, [data.id]: { position: data.position } }));
    });

    newSocket.on('playerLeft', (data) => {
      setPlayers((prev) => {
        const updated = { ...prev };
        delete updated[data.id];
        return updated;
      });
    });

    return () => newSocket.close();
  }, []);

  const updateMyPosition = (position) => {
    if (socket) {
      socket.emit('updatePosition', position);
    }
  };

  return { players, updateMyPosition };
};

export default useMultiplayer;

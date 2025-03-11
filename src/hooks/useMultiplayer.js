import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const useMultiplayer = () => {
  const [socket, setSocket] = useState(null);
  // Store other players as an object keyed by their socket IDs.
  const [players, setPlayers] = useState({});

  useEffect(() => {
    const newSocket = io('http://localhost:4000'); // update to your server URL
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

  // Function to send the current player position
  const updateMyPosition = (position) => {
    if (socket) {
      socket.emit('updatePosition', position);
    }
  };

  return { players, updateMyPosition };
};

export default useMultiplayer;

// useChatHub.js
import { useState, useEffect } from 'react';
import * as signalR from '@microsoft/signalr';

const useChatHub = () => {
  const [connection, setConnection] = useState(null);
  // Load initial messages from sessionStorage (if any)
  const [messages, setMessages] = useState(() => {
    const stored = sessionStorage.getItem('chatMessages');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    // Build and start the connection
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7232/chathub')
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    newConnection.start()
      .then(() => {
        console.log('Connected to SignalR hub');
        setConnection(newConnection);
      })
      .catch(err => console.error('Connection failed: ', err));

    // Clean up on unmount
    return () => {
      if (newConnection) {
        newConnection.stop();
      }
    };
  }, []);

  // Persist messages in sessionStorage whenever they change
  useEffect(() => {
    sessionStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (connection) {
      // Set up handler for receiving messages
      connection.on('ReceiveMessage', (user, message) => {
        setMessages(prevMessages => [...prevMessages, { user, message }]);
      });
    }
  }, [connection]);

  // Function to send a message
  const sendMessage = (user, message) => {
    if (connection) {
      connection.send('SendMessage', user, message)
        .catch(err => console.error('Sending message failed: ', err));
    }
  };

  return { messages, sendMessage };
};

export default useChatHub;

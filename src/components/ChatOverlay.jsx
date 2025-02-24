// ChatOverlay.jsx
import React, { useState } from 'react';
import useChatHub from '../hooks/useChatHub';

const ChatOverlay = () => {
  const { messages, sendMessage } = useChatHub();
  const [user] = useState('User1');
  const [inputMessage, setInputMessage] = useState('');

  const handleSend = () => {
    if (inputMessage.trim() !== '') {
      sendMessage(user, inputMessage);
      setInputMessage('');
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '250px'
    }}>
      <div style={{
        background: 'rgba(0,0,0,0.85)',
        padding: '8px',
        borderBottom: '1px solid gray',
        fontSize: '1.2em',
        textAlign: 'center'
      }}>
        Chat
      </div>
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '8px',
        fontSize: '1em'
      }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: '4px' }}>
            <strong>{msg.user}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', borderTop: '1px solid gray' }}>
        <input
          type="text"
          value={inputMessage}
          onChange={e => setInputMessage(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1, padding: '6px', border: 'none', outline: 'none' }}
        />
        <button onClick={handleSend} style={{
          padding: '6px 12px',
          background: 'teal',
          color: 'white',
          border: 'none',
          cursor: 'pointer'
        }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatOverlay;

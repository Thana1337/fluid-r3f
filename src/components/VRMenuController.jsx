// VRMenuController.jsx
import React from 'react';
import useBButtonToggle from '../hooks/useBButtonToggle';
import ChatOverlay from './ChatOverlay';
import StickyChatOverlay from './StickyChatOverlay';

const VRMenuController = () => {
  const isChatOpen = useBButtonToggle();

  return (
    <>
      {isChatOpen && (
        <StickyChatOverlay>
          <ChatOverlay />
        </StickyChatOverlay>
      )}
    </>
  );
};

export default VRMenuController;

import React from 'react';
import useBButtonToggle from '../hooks/useBButtonToggle';
import ChatOverlay3D from './ChatOverlay3D';
import StickyChatOverlay from './StickyChatOverlay';

const VRMenuController = () => {
  const isChatOpen = useBButtonToggle();

  return (
    <>
      {isChatOpen && (
        <StickyChatOverlay>
          <ChatOverlay3D />
        </StickyChatOverlay>
      )}
    </>
  );
};

export default VRMenuController;

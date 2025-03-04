import React from 'react';
import useXButtonToggle from '../hooks/useXButtonToggle';
import ChatOverlay3D from './ChatOverlay3D';
import StickyChatOverlay from './StickyChatOverlay';

const VRMenuController = () => {
  const isChatOpen = useXButtonToggle();

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

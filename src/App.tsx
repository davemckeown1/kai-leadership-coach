import React, { useState } from 'react';
import { FloatingBubble } from './components/FloatingBubble';
import { SidePanel } from './components/SidePanel';

export const App: React.FC = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleExpand = () => {
    setIsPanelOpen(true);
  };

  const handleClose = () => {
    setIsPanelOpen(false);
  };

  return (
    <>
      <FloatingBubble onExpand={handleExpand} />
      <SidePanel isOpen={isPanelOpen} onClose={handleClose} />
    </>
  );
}; 
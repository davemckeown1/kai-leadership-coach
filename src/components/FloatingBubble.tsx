import React, { useState } from 'react';
import { motion, useDragControls } from 'framer-motion';

interface FloatingBubbleProps {
  onExpand: () => void;
}

export const FloatingBubble: React.FC<FloatingBubbleProps> = ({ onExpand }) => {
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const dragControls = useDragControls();

  return (
    <motion.div
      drag
      dragControls={dragControls}
      dragMomentum={false}
      dragElastic={0}
      onDragEnd={(event, info) => {
        // Snap to nearest edge
        const { x, y } = info.point;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        let newX = x;
        let newY = y;
        
        // Snap to edges with 20px margin
        if (x < 20) newX = 20;
        if (x > windowWidth - 60) newX = windowWidth - 60;
        if (y < 20) newY = 20;
        if (y > windowHeight - 60) newY = windowHeight - 60;
        
        setPosition({ x: newX, y: newY });
      }}
      initial={position}
      animate={position}
      className="fixed z-50 w-12 h-12 bg-blue-600 rounded-full shadow-lg cursor-pointer hover:bg-blue-700 transition-colors"
      onClick={onExpand}
    >
      <div className="flex items-center justify-center h-full">
        <span className="text-white text-xl font-bold">K</span>
      </div>
    </motion.div>
  );
}; 
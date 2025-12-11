/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { Music } from 'lucide-react';

const CustomCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  
  // Initialize off-screen to prevent flash
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  
  // Smooth spring animation
  const springConfig = { damping: 25, stiffness: 400, mass: 0.1 }; 
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement;
      const clickable = target.closest('button') || 
                        target.closest('a') || 
                        target.closest('[data-hover="true"]');
      setIsHovering(!!clickable);
    };

    window.addEventListener('mousemove', updateMousePosition, { passive: true });
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference hidden md:block"
      style={{ x, y, translateX: '-50%', translateY: '-50%' }}
    >
      <motion.div
        className="relative flex items-center"
        animate={{
          scale: isHovering ? 1.1 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Main Cursor Body: Musical Note Circle */}
        <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)]">
           <Music className={`w-5 h-5 transition-transform duration-300 ${isHovering ? 'scale-110 rotate-12' : ''}`} fill="currentColor" />
        </div>

        {/* Despegable Label (Unfolding Tag) */}
        <motion.div
          className="absolute left-[20px] top-1/2 -translate-y-1/2 bg-white text-black h-8 flex items-center rounded-r-full overflow-hidden"
          initial={{ width: 0, opacity: 0 }}
          animate={{ 
            width: isHovering ? 'auto' : 0, 
            opacity: isHovering ? 1 : 0,
            paddingLeft: isHovering ? 30 : 0, // Space for the circle overlap
            paddingRight: isHovering ? 16 : 0
          }}
          transition={{ duration: 0.3, ease: "circOut" }}
          style={{ 
             zIndex: 0,
          }}
        >
           <span className="font-black uppercase text-[10px] tracking-widest whitespace-nowrap">
             VER
           </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default CustomCursor;
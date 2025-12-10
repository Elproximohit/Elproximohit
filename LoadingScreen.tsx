/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { motion } from 'framer-motion';
import { Mic2, Music } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
      className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center overflow-hidden"
    >
      {/* 3D Perspective Container */}
      <div className="relative w-64 h-64 flex items-center justify-center [perspective:1000px]">
        
        {/* Central Microphone (Axis) */}
        <motion.div
          animate={{ 
            rotateY: [0, 360],
            filter: ["drop-shadow(0 0 10px #FF0000)", "drop-shadow(0 0 30px #FF0000)", "drop-shadow(0 0 10px #FF0000)"]
          }}
          transition={{ 
            rotateY: { duration: 4, repeat: Infinity, ease: "linear" },
            filter: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
          className="relative z-10"
        >
          <Mic2 className="w-24 h-24 text-white" strokeWidth={1} />
          <div className="absolute inset-0 bg-[#FF0000] blur-xl opacity-20" />
        </motion.div>

        {/* Orbiting Music Note (Simulating 3D Orbit) */}
        <motion.div
          className="absolute top-1/2 left-1/2"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          style={{ 
            width: '100%', 
            height: '100%', 
            translateX: '-50%', 
            translateY: '-50%',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* The Note element that moves in a circle but keeps facing forward */}
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 -mt-8"
            animate={{ 
              scale: [1, 1.5, 1], // Simulates getting closer/further (Z-axis depth)
              opacity: [0.5, 1, 0.5], // Simulates depth fog
              rotate: -360 // Counter-rotate to keep upright
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <div className="relative">
              <Music className="w-12 h-12 text-[#FF00FF]" strokeWidth={2} />
              <div className="absolute inset-0 bg-[#FF00FF] blur-md opacity-40" />
            </div>
          </motion.div>
        </motion.div>

        {/* Orbital Rings for visual context */}
        <div className="absolute inset-0 border border-white/10 rounded-full scale-[0.8] rotate-x-[60deg] animate-pulse" />
        <div className="absolute inset-0 border border-[#FF0000]/20 rounded-full scale-[1.2] rotate-y-[60deg]" />

      </div>

      {/* Loading Text with Glitch Effect */}
      <motion.div 
        className="mt-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-2xl font-heading font-bold tracking-[0.3em] text-white">
          CARGANDO
        </h2>
        <motion.div 
          className="h-1 w-48 bg-white/10 mt-4 rounded-full overflow-hidden mx-auto"
        >
          <motion.div 
            className="h-full bg-gradient-to-r from-[#FF0000] to-[#FF00FF]"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default LoadingScreen;
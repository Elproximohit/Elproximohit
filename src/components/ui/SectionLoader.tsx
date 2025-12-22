import React from 'react';
import { motion } from 'framer-motion';

const SectionLoader: React.FC = () => {
    return (
        <div className="w-full h-[50vh] flex items-center justify-center bg-black/50 border-y border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
            <div className="flex flex-col items-center gap-4 relative z-10 opacity-50">
                <motion.div
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-12 h-12 rounded-full border-2 border-white/20 border-t-[#FF00FF] animate-spin"
                />
                <p className="text-xs text-gray-500 font-mono tracking-widest uppercase">Cargando...</p>
            </div>
        </div>
    );
};

export default SectionLoader;

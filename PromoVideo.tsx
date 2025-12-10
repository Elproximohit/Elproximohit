import React, { useRef } from 'react';
import { motion } from 'framer-motion';

const PromoVideo: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Video de stock gratuito de Mixkit
  const STOCK_VIDEO_URL = "https://assets.mixkit.co/videos/preview/mixkit-hands-adjusting-faders-on-a-mixing-console-2664-large.mp4";

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(255,0,0,0.2)] bg-black group">
      <video 
          ref={videoRef}
          src={STOCK_VIDEO_URL} 
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
          autoPlay 
          muted 
          loop 
          playsInline
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#FF0000]/20 to-[#FF00FF]/20 mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-6">
          <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.5 }}
             className="text-left"
          >
             <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 bg-[#FF0000] rounded-full animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF0000]">Live Studio Feed</span>
             </div>
             <p className="text-white font-heading font-bold text-lg md:text-2xl leading-tight drop-shadow-lg">GANA UNA PRODUCCIÓN COMPLETA</p>
             <p className="text-gray-300 text-xs md:text-sm mt-1 max-w-sm drop-shadow-md">
                Coaching • Grabación • Mezcla • Mastering • Video
             </p>
          </motion.div>
      </div>
    </div>
  );
};

export default PromoVideo;

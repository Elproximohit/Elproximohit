/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef } from 'react';
import { Loader2, AlertCircle, Film } from 'lucide-react';
import { motion } from 'framer-motion';

const PromoVideo: React.FC = () => {
  // Cambia esta ruta al video que quieras mostrar
  const [videoUrl, setVideoUrl] = useState<string>("/videos/trailer.mp4");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // En este caso no necesitamos API Key ni generación de video
  // Mantendremos los loaders por compatibilidad visual
  // Puedes activar "loading" temporalmente si quieres simular carga
  // setLoading(true); luego setLoading(false);

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(255,0,0,0.2)] bg-black">
      {loading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90">
           <div className="relative">
             <Loader2 className="w-12 h-12 text-[#FF0000] animate-spin" />
             <div className="absolute inset-0 blur-lg bg-[#FF0000]/30 animate-pulse" />
           </div>
           <p className="mt-4 text-[#FF00FF] font-mono text-xs animate-pulse tracking-widest uppercase">Cargando video...</p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90">
           <AlertCircle className="w-10 h-10 text-red-500 mb-2" />
           <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {videoUrl ? (
        <video 
            ref={videoRef}
            src={videoUrl} 
            className="w-full h-full object-cover"
            autoPlay 
            muted 
            loop 
            playsInline 
        />
      ) : (
         !loading && !error && (
            <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                <p className="text-gray-500 text-xs">Esperando video...</p>
            </div>
         )
      )}
      
      {/* Overlay Content */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
          <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 2 }}
             className="text-left"
          >
             <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 bg-[#FF0000] rounded-full animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF0000]">Live Preview</span>
             </div>
             <p className="text-white font-heading font-bold text-lg leading-tight">GANA UNA PRODUCCIÓN COMPLETA</p>
             <p className="text-gray-300 text-xs mt-1 max-w-sm">Incluye: Guía PDF Secretos de Mezcla + Plantilla Pro Tools + Coaching.</p>
          </motion.div>
      </div>
    </div>
  );
};

export default PromoVideo;

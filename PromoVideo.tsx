/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect, useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Loader2, Play, AlertCircle, Film } from 'lucide-react';
import { motion } from 'framer-motion';

const PromoVideo: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    checkKey();
  }, []);

  const checkKey = async () => {
    if (window.aistudio && window.aistudio.hasSelectedApiKey) {
      const has = await window.aistudio.hasSelectedApiKey();
      setHasKey(has);
      if (has && !videoUrl && !loading) {
        generatePromoVideo();
      }
    }
  };

  const handleSelectKey = async () => {
    if (window.aistudio && window.aistudio.openSelectKey) {
        await window.aistudio.openSelectKey();
        // Assume success to avoid race condition
        setHasKey(true);
        generatePromoVideo();
    }
  };

  const generatePromoVideo = async () => {
    setLoading(true);
    setError(null);
    setStatus('Iniciando estudio de IA...');

    try {
      // Create instance right before call
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      setStatus('Renderizando Trailer con Veo (Esto toma unos minutos)...');
      
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: "Cinematic commercial shot. A professional music recording studio with moody neon red and purple lighting. Close up on a computer screen showing a complex Pro Tools session. Pan to a sleek digital tablet displaying a PDF titled 'Mixing Secrets'. Ends with a golden trophy appearing. High resolution, photorealistic, 4k, energetic.",
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({operation: operation});
        setStatus('Procesando video frame por frame...');
      }

      if (operation.response?.generatedVideos?.[0]?.video?.uri) {
        const downloadLink = operation.response.generatedVideos[0].video.uri;
        setStatus('Descargando stream...');
        
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        
        setVideoUrl(url);
      } else {
        throw new Error("No video returned");
      }
    } catch (err: any) {
      console.error(err);
      
      // Handle specific error for invalid key/project
      if (err.message && err.message.includes("Requested entity was not found")) {
        setHasKey(false);
        if (window.aistudio && window.aistudio.openSelectKey) {
            await window.aistudio.openSelectKey();
        }
      } else {
        setError("No se pudo generar el video. Intenta recargar.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!hasKey) {
     return (
        <div className="w-full h-full flex items-center justify-center bg-black/80 border border-[#FF0000]/30 rounded-xl p-6 backdrop-blur-sm">
           <div className="text-center">
              <Film className="w-10 h-10 text-[#FF0000] mx-auto mb-3" />
              <h3 className="text-white font-bold mb-2">Ver Trailer del Sorteo</h3>
              <p className="text-gray-400 text-xs mb-4">Se requiere acceso API para generar el video.</p>
              <button 
                onClick={handleSelectKey}
                className="bg-[#FF0000] hover:bg-[#FF00FF] text-white px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors"
              >
                 Habilitar Video
              </button>
               <div className="mt-4 text-[10px] text-gray-500">
                  <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline hover:text-white">
                    Información de facturación
                  </a>
               </div>
           </div>
        </div>
     )
  }

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(255,0,0,0.2)] bg-black">
      {loading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90">
           <div className="relative">
             <Loader2 className="w-12 h-12 text-[#FF0000] animate-spin" />
             <div className="absolute inset-0 blur-lg bg-[#FF0000]/30 animate-pulse" />
           </div>
           <p className="mt-4 text-[#FF00FF] font-mono text-xs animate-pulse tracking-widest uppercase">{status}</p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90">
           <AlertCircle className="w-10 h-10 text-red-500 mb-2" />
           <p className="text-red-400 text-sm">{error}</p>
           <button onClick={generatePromoVideo} className="mt-4 text-xs underline text-white">Reintentar</button>
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
         // Placeholder while initializing
         !loading && !error && (
            <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                <p className="text-gray-500 text-xs">Esperando señal...</p>
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

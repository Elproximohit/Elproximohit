import React from 'react';
import { motion, AnimatePresence, MotionValue } from 'framer-motion';
import { Disc, Music, Download } from 'lucide-react';
import GradientText from '../../components/GlitchText';
import { MAX_PARTICIPANTS } from '../../data/content';

interface HeroProps {
    y: MotionValue<number>;
    currentParticipants: number;
    progressPercentage: number;
    isHoveringProgress: boolean;
    setIsHoveringProgress: (hovering: boolean) => void;
    scrollToSection: (id: string) => void;
}

const Hero: React.FC<HeroProps> = ({
    y,
    currentParticipants,
    progressPercentage,
    isHoveringProgress,
    setIsHoveringProgress,
    scrollToSection
}) => {
    return (
        <header className="relative h-[100svh] min-h-[700px] flex flex-col items-center justify-center overflow-hidden px-4 pt-20">
            <motion.div style={{ y }} className="z-10 text-center flex flex-col items-center w-full max-w-6xl">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }} className="flex flex-col items-center gap-2 mb-8 w-full max-w-md">
                    <div className="flex justify-between w-full text-xs font-mono text-[#FF00FF] tracking-widest uppercase mb-1">
                        <span>Ronda Actual</span>
                        <span>{currentParticipants} / {MAX_PARTICIPANTS} Ventas</span>
                    </div>
                    <div className="relative w-full group cursor-help" onMouseEnter={() => setIsHoveringProgress(true)} onMouseLeave={() => setIsHoveringProgress(false)}>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden border border-white/5">
                            <motion.div className="h-full bg-gradient-to-r from-[#FF0000] to-[#FF00FF]" initial={{ width: 0 }} animate={{ width: `${progressPercentage}%` }} transition={{ duration: 1.5, ease: "easeOut" }} />
                        </div>
                        <motion.div className="absolute top-0 left-0 h-full pointer-events-none" initial={{ width: 0 }} animate={{ width: `${progressPercentage}%` }} transition={{ duration: 1.5, ease: "easeOut" }}>
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-20">
                                <div className="relative flex items-center justify-center">
                                    <div className="absolute inset-0 bg-[#FF00FF] blur-sm rounded-full opacity-80 animate-pulse" />
                                    <div className="bg-black rounded-full p-1 border border-[#FF00FF]/50 shadow-[0_0_10px_#FF00FF]">
                                        <Music className="w-3 h-3 text-white" />
                                    </div>
                                </div>
                            </div>
                            <AnimatePresence>
                                {isHoveringProgress && (
                                    <motion.div initial={{ opacity: 0, y: 10, scale: 0.8 }} animate={{ opacity: 1, y: -35, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.8 }} className="absolute right-0 -top-2 translate-x-1/2">
                                        <div className="bg-black/90 backdrop-blur border border-[#FF0000] px-3 py-1.5 rounded text-xs font-bold text-white shadow-[0_0_15px_rgba(255,0,0,0.5)] flex gap-2 items-center whitespace-nowrap">
                                            <span className="w-2 h-2 rounded-full bg-[#00FF00] animate-pulse" />
                                            {currentParticipants} VENTAS REGISTRADAS
                                        </div>
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black border-r border-b border-[#FF0000] rotate-45" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </motion.div>

                <div className="relative w-full flex flex-col justify-center items-center">
                    <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ duration: 1.2, ease: "backOut", delay: 0.5 }} className="mb-6 relative w-20 h-20 flex items-center justify-center">
                        <Disc className="w-full h-full text-[#FF0000] animate-[spin_8s_linear_infinite]" />
                        <div className="absolute inset-0 bg-[#FF0000]/30 blur-2xl rounded-full" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Music className="w-8 h-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                        </div>
                    </motion.div>

                    <h2 className="text-sm md:text-xl tracking-[0.5em] uppercase text-gray-400 mb-2">Crea Tu Legado</h2>
                    <GradientText text="EL PROXIMO" as="h1" className="text-[12vw] md:text-[8vw] leading-[0.9] font-black tracking-tighter text-center" />
                    <GradientText text="HIT" as="h1" className="text-[15vw] md:text-[10vw] leading-[0.9] font-black tracking-tighter text-center text-[#FF0000]" />
                    <motion.div className="absolute -z-20 w-[60vw] h-[60vw] bg-[#FF0000]/10 blur-[80px] rounded-full pointer-events-none" animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 4, repeat: Infinity }} />
                </div>

                <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }} className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-[#FF00FF] to-transparent mt-8 mb-8" />

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 1 }} className="flex flex-col items-center gap-6">
                    <p className="text-base md:text-xl font-light max-w-2xl mx-auto text-gray-300 leading-relaxed px-4">
                        <span className="text-white font-bold text-xl block mb-2">TU COMPRA TIENE VALOR REAL:</span>
                        Recibe la Guía Profesional y la Plantilla Pro Tools instantáneamente.
                        <span className="text-[#FF00FF] font-bold block mt-2">La entrada al Giveaway es un BONUS gratuito incluido.</span>
                    </p>

                    <button onClick={() => scrollToSection('download')} className="mt-4 group relative px-8 py-4 bg-[#FF0000] text-white font-bold tracking-widest uppercase overflow-hidden hover:bg-[#DC143C] transition-colors cursor-pointer">
                        <span className="relative z-10 flex items-center gap-2">
                            Comprar Guía + Giveaway - $10 <Download className="w-4 h-4" />
                        </span>
                        <div className="absolute inset-0 bg-white/20 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-out" />
                    </button>
                </motion.div>
            </motion.div>

            <div className="absolute bottom-12 md:bottom-0 left-0 w-full py-3 bg-[#FF0000] text-black z-20 overflow-hidden border-y border-white/10">
                <motion.div className="flex w-fit" animate={{ x: "-50%" }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
                    {[0, 1, 2, 3].map((key) => (
                        <div key={key} className="flex whitespace-nowrap shrink-0 items-center">
                            <span className="text-lg md:text-xl font-heading font-bold px-8 flex items-center gap-4">
                                GANA UNA PRODUCCIÓN COMPLETA DE CANCIÓN <Disc className="w-5 h-5 animate-spin" /> MEZCLA Y MASTERIZACIÓN INCLUIDAS
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </header>
    );
};

export default Hero;

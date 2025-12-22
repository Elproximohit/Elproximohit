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

                {/* 1. MAIN TITLE - Brand Icon Restored & Integrated */}
                <div className="relative w-full flex flex-col justify-center items-center mb-12">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 1.2, ease: "backOut" }}
                        className="mb-4 relative w-16 h-16 flex items-center justify-center"
                    >
                        <Disc className="w-full h-full text-[#FF0000] animate-[spin_8s_linear_infinite]" />
                        <div className="absolute inset-0 bg-[#FF0000]/20 blur-md rounded-full transform-gpu" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Music className="w-6 h-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
                        </div>
                    </motion.div>

                    <h2 className="text-sm md:text-xl tracking-[0.5em] uppercase text-gray-400 mb-2">Crea Tu Legado</h2>
                    <GradientText text="EL PROXIMO" as="h1" className="text-[12vw] md:text-[8vw] leading-[0.9] font-black tracking-tighter text-center" />
                    <GradientText text="HIT" as="h1" className="text-[15vw] md:text-[10vw] leading-[0.9] font-black tracking-tighter text-center text-[#FF0000]" />
                    <motion.div className="absolute -z-20 w-[60vw] h-[60vw] bg-[#FF0000]/10 blur-[40px] rounded-full pointer-events-none transform-gpu" animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 4, repeat: Infinity }} />
                </div>

                {/* 2. GIVEAWAY HOOK - Updated Copy */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="mb-8 bg-zinc-900/80 border border-white/10 px-6 py-4 rounded-2xl relative overflow-hidden group"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF00FF] via-[#7000FF] to-[#FF00FF] animate-shimmer bg-[length:200%_100%]" />
                    <h3 className="text-xl md:text-3xl font-heading font-black text-white mb-1 uppercase italic">
                        <span className="text-[#FF00FF]">GANA</span> UNA PRODUCCIÓN COMPLETA
                    </h3>
                    <p className="text-gray-300 text-xs md:text-sm tracking-widest uppercase">
                        Valorada en <span className="font-bold text-[#FF00FF]">$2,500 USD</span> • Incluye Beat, Mezcla y Master
                    </p>
                </motion.div>

                {/* 3. PROGRESS BAR - Updated Copy & Colors (Softer Glow) */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.8 }} className="flex flex-col items-center gap-4 mb-10 w-full max-w-2xl px-4">
                    <div className="flex justify-between w-full text-xs md:text-sm font-bold font-mono text-gray-400 tracking-widest uppercase mb-1">
                        <span className="flex items-center gap-2 text-[#FF00FF]"><div className="w-2 h-2 bg-[#FF00FF] rounded-full animate-pulse" /> Oportunidad Activa</span>
                        <span className="text-white">{currentParticipants} / {MAX_PARTICIPANTS} Guías Vendidas</span>
                    </div>

                    <div className="relative w-full h-8 bg-black/50 rounded-lg overflow-hidden border border-white/20 shadow-[0_0_20px_rgba(255,0,255,0.05)]">
                        <motion.div
                            className="h-full bg-gradient-to-r from-[#FF00FF] via-[#7000FF] to-[#FF00FF] bg-[length:200%_100%] animate-shimmer"
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercentage}%` }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                        />
                        <div className="absolute top-0 right-0 h-full w-[2px] bg-white blur-[2px] opacity-70" style={{ left: `${progressPercentage}%` }} />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none mix-blend-difference">
                            <span className="text-[10px] md:text-xs font-black text-white uppercase tracking-[0.2em] opacity-80">
                                FALTAN {MAX_PARTICIPANTS - currentParticipants} VENTAS PARA LA SELECCIÓN DEL PARTICIPANTE ELIGIBLE
                            </span>
                        </div>
                    </div>
                </motion.div>

                <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.5, delay: 1, ease: "circOut" }} className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-[#FF00FF] to-transparent mb-8" />

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 1 }} className="flex flex-col items-center gap-6">
                    <p className="text-base md:text-xl font-light max-w-2xl mx-auto text-gray-300 leading-relaxed px-4">
                        <span className="text-white font-bold text-xl block mb-2">TU COMPRA TIENE VALOR REAL:</span>
                        Recibe la Guía Profesional y la Plantilla Pro Tools instantáneamente.
                        <span className="text-[#FF00FF] font-bold block mt-2">La participación es un REGALO gratuito incluido.</span>
                    </p>

                    <button onClick={() => scrollToSection('download')} className="mt-4 group relative px-8 py-4 bg-[#FF0000] text-white font-bold tracking-widest uppercase overflow-hidden hover:bg-[#DC143C] transition-colors cursor-pointer rounded-lg shadow-[0_0_30px_rgba(255,0,0,0.2)]">
                        <span className="relative z-10 flex items-center gap-2">
                            Comprar Guía + Regalo - $10 <Download className="w-4 h-4" />
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

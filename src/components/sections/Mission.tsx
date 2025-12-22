import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, MapPin, Heart, ArrowLeft } from 'lucide-react';
import GradientText from '../../components/GlitchText';

interface MissionProps {
    scrollToSection: (id: string) => void;
}

const Mission: React.FC<MissionProps> = ({ scrollToSection }) => {
    return (
        <section id="mission" className="relative z-10 py-20 md:py-32 bg-black/80">
            <div className="max-w-6xl mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
                    <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="text-[#FF0000] w-6 h-6" />
                            <span className="text-[#FF0000] font-mono tracking-widest uppercase text-xs">El Origen</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-heading font-bold uppercase leading-none mb-8">
                            La Industria es <br /> <GradientText text="COSTOSA" className="text-5xl md:text-7xl" />
                        </h2>
                        <div className="space-y-6 text-gray-300 text-lg md:text-xl font-light leading-relaxed">
                            <p>Sabemos lo que se siente. El talento en <span className="text-white font-bold">Puerto Rico y Estados Unidos</span> sobra, pero a menudo los recursos faltan. La barrera de entrada para un sonido profesional es demasiado alta.</p>
                            <p className="border-l-4 border-[#FF00FF] pl-4 italic">"Creamos esto para darte la llave que nosotros no tuvimos. Tu sueño no debería morir por falta de presupuesto."</p>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-tr from-[#FF0000] to-[#FF00FF] rounded-[2rem] opacity-20 blur-xl" />
                        <div className="relative bg-zinc-900 border border-white/10 p-8 md:p-12 rounded-[2rem] overflow-hidden">
                            <div className="relative z-10 flex flex-col gap-8">
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-500 uppercase tracking-widest mb-1">Desde</span>
                                        <span className="text-2xl font-bold flex items-center gap-2"><MapPin className="w-5 h-5 text-[#FF0000]" /> PUERTO RICO 🇵🇷</span>
                                    </div>
                                    <div className="h-px w-12 bg-white/20" />
                                    <div className="flex flex-col text-right">
                                        <span className="text-xs text-gray-500 uppercase tracking-widest mb-1">Hasta</span>
                                        <span className="text-2xl font-bold flex items-center gap-2">USA 🇺🇸 <MapPin className="w-5 h-5 text-[#FF00FF]" /></span>
                                    </div>
                                </div>
                                <div className="bg-black/50 p-6 rounded-xl border border-white/5">
                                    <h4 className="text-[#FF00FF] font-bold mb-2 flex items-center gap-2"><Heart className="w-4 h-4" /> EL OBJETIVO</h4>
                                    <p className="text-sm text-gray-400">Democratizar el acceso al conocimiento profesional. Nuestra <span className="text-white">Guía PDF</span> y <span className="text-white">Plantilla Pro Tools</span> son las herramientas exactas que usan los grandes estudios.</p>
                                </div>
                                <button onClick={() => scrollToSection('features')} className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors rounded-lg flex items-center justify-center gap-2 cursor-pointer">
                                    Ver Herramientas <ArrowLeft className="w-4 h-4 rotate-180" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Mission;

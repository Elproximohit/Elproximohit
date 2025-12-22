import React from 'react';
import { motion } from 'framer-motion';
import { Star, Music2, Radio, Headphones } from 'lucide-react';

// Placeholder Logos for "Distribution Partners"
const DISTRIBUTORS = [
    { name: 'Spotify', icon: Music2 },
    { name: 'Apple Music', icon: Radio },
    { name: 'Tidal', icon: Headphones },
    { name: 'Amazon Music', icon: Star }, // Using Star as placeholder
];

const TESTIMONIALS = [
    {
        id: 1,
        name: "Alex M.",
        role: "Productor Independiente",
        text: "Esta guía me ahorró años de errores. La sección de contratos es oro puro.",
        rating: 5
    },
    {
        id: 2,
        name: "Sofia R.",
        role: "Cantautora",
        text: "Por fin entiendo cómo funcionan las regalías. ¡Ya recuperé la inversión en mi primer mes!",
        rating: 5
    },
    {
        id: 3,
        name: "Javi Beats",
        role: "Beatmaker",
        text: "El bonus de la comunidad es increíble. He conocido a gente muy talentosa aquí.",
        rating: 5
    }
];

const SocialProof: React.FC = () => {
    return (
        <section id="social-proof" className="py-20 bg-black relative overflow-hidden">
            {/* Background Glow - Reduced blur for performance */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[500px] bg-[#FF00FF]/5 blur-[60px] rounded-full pointer-events-none transform-gpu" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* LOGOS SECTION */}
                <div className="text-center mb-24">
                    <p className="text-gray-500 text-xs font-bold tracking-[0.2em] uppercase mb-8">
                        Aprende a distribuir tu música en
                    </p>
                    <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Text-based representation for now as we don't have SVGs */}
                        {DISTRIBUTORS.map((dist, idx) => (
                            <div key={idx} className="flex items-center gap-2 group cursor-default">
                                <dist.icon className="w-8 h-8 text-white group-hover:text-[#FF00FF] transition-colors" />
                                <span className="text-xl font-bold font-heading text-gray-400 group-hover:text-white transition-colors">{dist.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* TESTIMONIALS SECTION */}
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-5xl font-heading font-black text-white mb-6"
                    >
                        ARTISTAS QUE ESTÁN <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF00FF] to-[#FF0000]">ROMPIÉNDOLA</span>
                    </motion.h2>
                    <p className="text-gray-300 max-w-2xl mx-auto">
                        Únete a cientos de productores y artistas que ya están tomando control de su carrera.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {TESTIMONIALS.map((t, i) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="bg-white/5 border border-white/10 p-8 rounded-2xl relative hover:border-[#FF00FF]/50 transition-colors group"
                        >
                            <div className="flex gap-1 mb-4 text-[#FF00FF]">
                                {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                            </div>
                            <p className="text-gray-300 mb-6 italic">"{t.text}"</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-black flex items-center justify-center font-bold text-white border border-white/20">
                                    {t.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-sm">{t.name}</h4>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider">{t.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default SocialProof;

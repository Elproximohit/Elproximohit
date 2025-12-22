import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Download, Gift, ArrowRight } from 'lucide-react';

const STEPS = [
    {
        id: 1,
        title: "Adquiere el Manual",
        desc: "Compra la Guía Profesional y la Plantilla Pro Tools por solo $10 USD.",
        icon: ShoppingCart,
        color: "from-blue-500 to-cyan-400"
    },
    {
        id: 2,
        title: "Acceso Instantáneo",
        desc: "Recibe tus archivos de inmediato en tu correo y accede a la Comunidad.",
        icon: Download,
        color: "from-purple-500 to-pink-500"
    },
    {
        id: 3,
        title: "Entra al Giveaway",
        desc: "Tu compra te da un pase automático para la selección de producción gratis.",
        icon: Gift,
        color: "from-red-500 to-orange-500"
    }
];

const Process: React.FC = () => {
    return (
        <section className="py-24 bg-zinc-950 relative overflow-hidden" id="process">
            {/* Background Glows - Optimized blur for performance */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none transform-gpu" />
            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 bg-purple-500/10 blur-[60px] rounded-full pointer-events-none transform-gpu" />

            <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center mb-16 md:mb-24">
                    <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-6 uppercase tracking-tight">
                        TU CAMINO AL <span className="text-[#FF0000]">HIT</span> EN 3 PASOS
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Sin complicaciones. Una inversión mínima para un valor masivo y una oportunidad real de profesionalizar tu música.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-[45px] left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                    {STEPS.map((step, idx) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.2 }}
                            className="flex flex-col items-center text-center group"
                        >
                            <div className="relative mb-8">
                                {/* Number Badge */}
                                <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-white text-black font-black flex items-center justify-center text-sm z-20 shadow-xl">
                                    {step.id}
                                </div>

                                {/* Icon Circle */}
                                <div className={`relative w-24 h-24 rounded-3xl bg-gradient-to-br ${step.color} p-px`}>
                                    <div className="w-full h-full rounded-[23px] bg-zinc-900 flex items-center justify-center group-hover:bg-transparent transition-colors duration-500">
                                        <step.icon className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    {/* Shadow/Glow */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${step.color} blur-2xl opacity-20 group-hover:opacity-40 transition-opacity`} />
                                </div>
                            </div>

                            <h3 className="text-xl md:text-2xl font-bold text-white mb-4 uppercase">
                                {step.title}
                            </h3>
                            <p className="text-gray-400 leading-relaxed max-w-[280px]">
                                {step.desc}
                            </p>

                            {idx < STEPS.length - 1 && (
                                <div className="md:hidden mt-8 text-white/20">
                                    <ArrowRight className="w-6 h-6 rotate-90" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Process;

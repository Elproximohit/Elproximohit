import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, BookOpen, Brain, TrendingUp, DollarSign, Users } from 'lucide-react';

const MODULES = [
    {
        id: 1,
        title: "MÓDULO 1: Mentalidad de Artista Pro",
        icon: Brain,
        desc: "Deja de pensar como amateur. Aprende a gestionar tu carrera como un CEO.",
        lessons: [
            "El mito del 'Talento' vs. Disciplina",
            "Cómo superar el bloqueo creativo",
            "Definiendo tu identidad visual y sonora"
        ]
    },
    {
        id: 2,
        title: "MÓDULO 2: El Negocio de la Música",
        icon: DollarSign,
        desc: "Todo sobre contratos, regalías y cómo proteger tu obra.",
        lessons: [
            "Entendiendo el Copyright y Royalties",
            "Sync Licensing: Tu música en TV y Cine",
            "Registro de obras: ASCAP, BMI, y más"
        ]
    },
    {
        id: 3,
        title: "MÓDULO 3: Marketing Viral & Redes",
        icon: TrendingUp,
        desc: "Estrategias probadas para crecer en TikTok y Reels sin bailar.",
        lessons: [
            "El algoritmo de TikTok explicado",
            "Cómo crear contenido que enganche en 3 segundos",
            "De follower a fan: El embudo de ventas"
        ]
    },
    {
        id: 4,
        title: "BONUS: Construyendo tu Fanbase",
        icon: Users,
        desc: "Cómo crear una comunidad leal que compre tu merch y tickets.",
        lessons: [
            "Discord & Telegram: Tu arma secreta",
            "Email Marketing para músicos",
            "Lanzamiento de tu primer single: Checklist"
        ]
    }
];

const Curriculum: React.FC = () => {
    const [activeModule, setActiveModule] = useState<number | null>(null);

    return (
        <section className="py-20 bg-black relative" id="curriculum">
            <div className="max-w-4xl mx-auto px-6">

                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-6 uppercase">
                        Lo Que Aprenderás <span className="text-[#FF00FF]">Dentro</span>
                    </h2>
                    <p className="text-gray-400">
                        Un sistema paso a paso, diseñado para llevarte de cero a vivir de la música.
                    </p>
                </div>

                <div className="space-y-4">
                    {MODULES.map((module) => (
                        <div
                            key={module.id}
                            className={`border rounded-xl overflow-hidden transition-all duration-300 ${activeModule === module.id ? 'border-[#FF00FF] bg-white/5 shadow-[0_0_20px_rgba(255,0,255,0.1)]' : 'border-white/10 bg-black hover:border-white/30'}`}
                        >
                            <button
                                onClick={() => setActiveModule(activeModule === module.id ? null : module.id)}
                                className="w-full flex items-center justify-between p-6 text-left"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${activeModule === module.id ? 'bg-[#FF00FF] text-white' : 'bg-white/10 text-gray-400'}`}>
                                        <module.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className={`font-bold text-lg md:text-xl uppercase tracking-wide ${activeModule === module.id ? 'text-white' : 'text-gray-300'}`}>
                                            {module.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1 hidden md:block">{module.desc}</p>
                                    </div>
                                </div>
                                <motion.div
                                    animate={{ rotate: activeModule === module.id ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ChevronDown className={`w-6 h-6 ${activeModule === module.id ? 'text-[#FF00FF]' : 'text-gray-500'}`} />
                                </motion.div>
                            </button>

                            <AnimatePresence>
                                {activeModule === module.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-6 pt-0 border-t border-white/5">
                                            <ul className="space-y-3 mt-4">
                                                {module.lessons.map((lesson, idx) => (
                                                    <motion.li
                                                        key={idx}
                                                        initial={{ x: -10, opacity: 0 }}
                                                        animate={{ x: 0, opacity: 1 }}
                                                        transition={{ delay: idx * 0.1 }}
                                                        className="flex items-center gap-3 text-gray-300 text-sm md:text-base"
                                                    >
                                                        <BookOpen className="w-4 h-4 text-[#FF00FF]" />
                                                        {lesson}
                                                    </motion.li>
                                                ))}
                                            </ul>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Curriculum;

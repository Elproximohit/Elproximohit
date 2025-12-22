import React from 'react';
import { ShieldCheck, CheckCircle, Mic2, Zap, Music, Video } from 'lucide-react';
import GradientText from '../../components/GlitchText';
import PromoVideo from '../../components/PromoVideo';

const Giveaway: React.FC = () => {
    return (
        <section id="giveaway" className="relative z-10 py-20 md:py-32 bg-black border-t border-white/10 overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#FF0000]/20 via-black to-black pointer-events-none" />
            <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-center">

                    {/* Texto Giveaway */}
                    <div className="lg:col-span-5 order-2 lg:order-1">
                        <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6 md:mb-8 leading-tight">
                            El <GradientText text="GIVEAWAY" className="text-5xl md:text-7xl" />
                        </h2>
                        <p className="text-lg md:text-xl text-gray-300 mb-8 md:mb-12 font-light leading-relaxed">
                            <span className="text-[#FF0000] font-bold">BONUS GRATUITO:</span> Al comprar la guía, aseguras un lugar en el sistema. Seleccionamos un artista cada 1,000 ventas.
                        </p>

                        {/* Tarjeta de Transparencia y Reglas */}
                        <div className="mb-10 bg-zinc-900/80 border border-white/10 rounded-xl p-6 relative overflow-hidden group hover:border-[#FF00FF]/50 transition-colors">
                            <div className="absolute top-0 right-0 p-2 opacity-20"><ShieldCheck className="w-16 h-16 text-white" /></div>
                            <h3 className="text-white font-heading font-bold text-lg mb-4 flex items-center gap-2"><ShieldCheck className="text-[#00FF00]" /> TRANSPARENCIA Y REGLAS</h3>
                            <ul className="space-y-3 text-sm text-gray-300">
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-[#FF00FF] mt-0.5 shrink-0" />
                                    <span><strong>Producto Real:</strong> Tu pago es por la Guía PDF y la Plantilla Pro Tools.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-[#FF00FF] mt-0.5 shrink-0" />
                                    <span><strong>Bonus:</strong> El giveaway es un añadido sin costo extra.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-[#FF00FF] mt-0.5 shrink-0" />
                                    <span><strong>Regla de Oro:</strong> Cada 1,000 ventas registradas = 1 Ganador.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-[#FF00FF] mt-0.5 shrink-0" />
                                    <span><strong>Selección:</strong> Vía Random Number Generator (RNG) certificado.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-[#FF00FF] mt-0.5 shrink-0" />
                                    <span><strong>Contacto:</strong> El ganador será notificado exclusivamente por Email.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-6 md:space-y-8">
                            {[
                                { icon: Mic2, title: 'Productor Profesional', desc: 'Trabaja 1 a 1 con un veterano de la industria para perfeccionar tu sonido.' },
                                { icon: Zap, title: 'Tiempo de Estudio', desc: 'Acceso total a una instalación de grabación de clase mundial.' },
                                { icon: Music, title: 'Mezcla y Masterización', desc: 'Postproducción estándar de la industria para poner tu canción en Spotify.' },
                                { icon: Video, title: 'Video Musical', desc: 'Una grabación de video profesional para lanzar los visuales de tu sencillo.' },
                            ].map((feature, i) => (
                                <div key={i} className="flex items-start gap-6">
                                    <div className="p-4 rounded-2xl bg-[#FF0000]/10 border border-[#FF0000]/30"><feature.icon className="w-6 h-6 text-[#FF0000]" /></div>
                                    <div><h4 className="text-lg md:text-xl font-bold mb-1 md:mb-2 font-heading">{feature.title}</h4><p className="text-sm text-gray-400">{feature.desc}</p></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Video Promo */}
                    <div className="lg:col-span-7 relative w-full order-1 lg:order-2">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#FF0000] to-[#FF00FF] rounded-3xl rotate-3 opacity-20 blur-xl" />
                        <PromoVideo />
                        <div className="absolute -bottom-6 -right-6 md:bottom-[-20px] md:right-[-20px] z-20 hidden md:block">
                            <div className="bg-black/90 border border-white/20 p-4 rounded-xl backdrop-blur-md">
                                <div className="text-2xl font-heading font-bold text-white mb-1">VALOR: $5,000+</div>
                                <div className="text-xs font-bold tracking-widest uppercase text-[#FF00FF]">No pierdas tu oportunidad</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Giveaway;

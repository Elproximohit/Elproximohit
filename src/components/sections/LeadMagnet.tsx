import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle, Loader2, Download } from 'lucide-react';

const LeadMagnet: React.FC = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        try {
            await fetch('/api/register-lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    name: 'Lead Magnet User',
                    newsletter: true,
                    source: 'lead_magnet_checklist'
                }),
            });
            // Simulate success delay
            setTimeout(() => setStatus('success'), 1000);
            setEmail('');
        } catch (err) {
            console.error(err);
            setStatus('error');
        }
    };

    return (
        <section className="py-24 bg-gradient-to-b from-black to-[#0a0a0a] relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">

                {/* TEXT CONTENT */}
                <div>
                    <div className="inline-block bg-[#FF00FF]/10 border border-[#FF00FF]/20 px-4 py-1 rounded-full text-[#FF00FF] text-xs font-bold uppercase tracking-widest mb-6">
                        Recurso Gratuito
                    </div>
                    <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-6 leading-tight">
                        NO ESTÁS LISTO PARA INVERTIR HOY?
                    </h2>
                    <p className="text-xl text-gray-300 mb-8">
                        No te preocupes. Descarga nuestra <span className="font-bold text-white">Checklist de Lanzamiento Viral</span> y empieza a ordenar tu carrera sin costo.
                    </p>

                    <ul className="space-y-4 mb-8">
                        {[
                            "Los 10 pasos antes de subir tu canción a Spotify.",
                            "Plantilla de mensaje para contactar playlists.",
                            "Calendario de contenidos para 30 días."
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-gray-400">
                                <CheckCircle className="w-5 h-5 text-[#00FF00]" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* FORM CARD */}
                <div className="bg-white/5 border border-white/10 p-8 md:p-10 rounded-3xl relative">
                    <div className="absolute top-0 right-0 -mt-6 -mr-6 bg-[#FF0000] text-white font-bold px-4 py-2 rounded-lg transform rotate-6 shadow-xl text-sm">
                        VALOR REAL: $19 USD
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2">Descarga Gratis Ahora</h3>
                    <p className="text-sm text-gray-500 mb-6">Te enviaremos el PDF directamente a tu correo.</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <input
                                type="email"
                                placeholder="tucorreo@ejemplo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black border border-white/20 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#FF00FF] transition-colors placeholder:text-gray-600"
                                required
                            />
                        </div>

                        <AnimatePresence mode="wait">
                            {status === 'success' ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-[#00FF00]/10 border border-[#00FF00]/30 rounded-xl p-4 text-[#00FF00] font-bold text-center flex items-center justify-center gap-2"
                                >
                                    <CheckCircle className="w-5 h-5" /> ¡Enviado! Revisa tu bandeja.
                                </motion.div>
                            ) : (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={status === 'loading'}
                                    className="w-full bg-white text-black font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                                >
                                    {status === 'loading' ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <Download className="w-5 h-5" /> Descargar Checklist
                                        </>
                                    )}
                                </motion.button>
                            )}
                        </AnimatePresence>

                        {status === 'error' && (
                            <p className="text-[#FF0000] text-xs text-center mt-2">Hubo un error. Intenta de nuevo.</p>
                        )}
                    </form>
                </div>

            </div>
        </section>
    );
};

export default LeadMagnet;

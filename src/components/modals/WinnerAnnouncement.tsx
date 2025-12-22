import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell } from 'lucide-react';

interface WinnerAnnouncementProps {
    showWinnerAnnouncement: boolean;
    setShowWinnerAnnouncement: (show: boolean) => void;
}

const WinnerAnnouncement: React.FC<WinnerAnnouncementProps> = ({ showWinnerAnnouncement, setShowWinnerAnnouncement }) => {
    return (
        <AnimatePresence>
            {showWinnerAnnouncement && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl" onClick={() => setShowWinnerAnnouncement(false)}>
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-full max-w-lg bg-gradient-to-br from-black to-zinc-900 border border-[#FF00FF] rounded-3xl p-8 text-center relative overflow-hidden shadow-[0_0_100px_rgba(255,0,255,0.3)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />

                        <div className="relative z-10">
                            <div className="w-20 h-20 mx-auto bg-[#FF00FF] rounded-full flex items-center justify-center mb-6 animate-bounce shadow-lg shadow-[#FF00FF]/50">
                                <Bell className="w-10 h-10 text-white" />
                            </div>

                            <h2 className="text-4xl md:text-5xl font-heading font-black text-white mb-2 leading-none">
                                ¡META ALCANZADA!
                            </h2>
                            <h3 className="text-2xl font-bold text-[#FF00FF] mb-6">
                                1,000 VENTAS REGISTRADAS
                            </h3>

                            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                                El sistema ha cerrado la ronda actual. El giveaway oficial se realizará en vivo en los próximos <strong>7 Días</strong>.
                            </p>

                            <div className="bg-black/50 border border-white/10 rounded-xl p-4 mb-8">
                                <div className="flex items-center justify-center gap-2 text-xl font-bold text-white mb-1">
                                    <span className="w-3 h-3 bg-[#FF0000] rounded-full animate-pulse" />
                                    TIKTOK LIVE
                                </div>
                                <p className="text-sm text-gray-400">Síguenos para recibir la notificación</p>
                            </div>

                            <button onClick={() => setShowWinnerAnnouncement(false)} className="bg-white text-black font-bold uppercase tracking-widest px-8 py-3 rounded-full hover:bg-[#FF00FF] hover:text-white transition-colors">
                                Entendido
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default WinnerAnnouncement;

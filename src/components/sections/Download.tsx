import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Ticket, Download as DownloadIcon, Lock, CreditCard } from 'lucide-react';
import { PDF_DOWNLOAD_LINK } from '../../data/content';

interface DownloadProps {
    purchased: boolean;
    purchasing: boolean;
    handleOneTimeDownload: () => void;
    setShowPaymentModal: (show: boolean) => void;
    currentParticipants: number;
}

const Download: React.FC<DownloadProps> = ({
    purchased,
    purchasing,
    handleOneTimeDownload,
    setShowPaymentModal,
    currentParticipants
}) => {
    return (
        <section id="download" className="relative z-10 py-20 md:py-32 px-4 md:px-6 bg-black/50 backdrop-blur-lg">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-6xl font-heading font-bold text-white mb-4">COMIENZA TU VIAJE</h2>
                    <p className="text-gray-400 max-w-xl mx-auto">Obtén valor real inmediato con nuestros recursos profesionales y califica automáticamente para el bonus.</p>
                </div>
                <motion.div whileHover={{ y: -10 }} className={`relative p-8 md:p-12 border border-[#FF0000] bg-black/80 backdrop-blur-md flex flex-col items-center text-center transition-all duration-300 shadow-[0_0_50px_rgba(255,0,0,0.1)]`}>
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF0000] via-[#FF00FF] to-[#FF0000]" />
                    <div className="mb-6">
                        <h3 className="text-3xl md:text-4xl font-heading font-bold mb-2 text-white">EL PAQUETE PRO</h3>
                        <div className="text-6xl md:text-8xl font-black text-[#FF0000] tracking-tighter my-6">$10</div>
                        <p className="text-[#FF00FF] font-mono uppercase tracking-widest text-sm mb-8">Producto Digital Instantáneo</p>
                    </div>
                    <ul className="text-left space-y-4 mb-10 w-full max-w-md mx-auto">
                        <li className="flex items-center gap-3 text-gray-300"><CheckCircle className="w-5 h-5 text-[#FF0000]" /> <span>Guía de Producción PDF Completa (Valor Real)</span></li>
                        <li className="flex items-center gap-3 text-gray-300"><CheckCircle className="w-5 h-5 text-[#FF0000]" /> <span>Plantilla DAW Pro Tools (Valor Real)</span></li>
                        <li className="flex items-center gap-3 text-[#FF00FF] font-black text-lg bg-[#FF00FF]/10 p-3 rounded-lg border border-[#FF00FF]/30 shadow-[0_0_15px_rgba(255,0,255,0.2)] transform scale-105 origin-center my-2">
                            <Ticket className="w-6 h-6 text-white animate-pulse" /> <span className="uppercase tracking-widest">Bonus: Entrada al Giveaway</span>
                        </li>
                    </ul>

                    {purchased ? (
                        <a
                            href={PDF_DOWNLOAD_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            onClick={handleOneTimeDownload}
                            className="w-full max-w-md py-5 text-base font-bold uppercase tracking-[0.2em] transition-all duration-300 relative overflow-hidden group bg-[#00FF00] text-black hover:bg-[#32CD32] block text-center shadow-lg shadow-green-500/20 cursor-pointer"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                <DownloadIcon className="w-5 h-5 animate-bounce" /> Descargar Ahora (1 Uso)
                            </span>
                            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-out" />
                        </a>
                    ) : (
                        <>
                            {localStorage.getItem('product_downloaded_v1') ? (
                                <button disabled className="w-full max-w-md py-5 text-base font-bold uppercase tracking-[0.2em] bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700">
                                    <span className="flex items-center justify-center gap-2"><Lock className="w-5 h-5" /> Descarga Finalizada</span>
                                </button>
                            ) : (
                                <button onClick={() => setShowPaymentModal(true)} disabled={purchasing} className={`w-full max-w-md py-5 text-base font-bold uppercase tracking-[0.2em] transition-all duration-300 relative overflow-hidden group ${purchasing ? 'bg-white/20 text-white cursor-wait' : 'bg-[#FF0000] text-white hover:bg-[#FF00FF] shadow-lg shadow-red-600/20'}`}>
                                    <span className="relative z-10 flex items-center justify-center gap-2">{purchasing ? 'Procesando...' : <><CreditCard className="w-5 h-5" /> Comprar Guía - $10</>}</span>
                                    <div className="absolute inset-0 bg-white/20 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-out" />
                                </button>
                            )}
                        </>
                    )}
                    <p className="mt-6 text-xs text-gray-500">
                        {localStorage.getItem('product_downloaded_v1')
                            ? "Tu enlace de descarga ha expirado por seguridad."
                            : `Pago seguro vía PayPal o Stripe. Ronda Actual: ${currentParticipants}/1000 Ventas Registradas.`}
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default Download;

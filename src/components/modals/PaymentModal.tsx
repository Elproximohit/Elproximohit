import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X, Loader2, LogOut, CreditCard, Mail, CheckCircle } from 'lucide-react';
import { STRIPE_PAYMENT_LINK, PAYPAL_LINK } from '../../data/content';

export interface UserProfile {
    name: string;
    email: string;
    avatar: string;
    provider: 'google' | 'facebook';
}

interface PaymentModalProps {
    showPaymentModal: boolean;
    setShowPaymentModal: (show: boolean) => void;
    isLoggedIn: boolean;
    userProfile: UserProfile | null;
    handleSocialLogin: (provider: 'google' | 'facebook') => void;
    handleLogout: () => void;
    loginProcessing: boolean;
    email: string;
    setEmail: (email: string) => void;
    emailError: string;
    setEmailError: (error: string) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
    showPaymentModal,
    setShowPaymentModal,
    isLoggedIn,
    userProfile,
    handleSocialLogin,
    handleLogout,
    loginProcessing,
    email,
    setEmail,
    emailError,
    setEmailError
}) => {
    const [paymentStep, setPaymentStep] = useState<'selection' | 'confirmation'>('selection');
    const [selectedMethod, setSelectedMethod] = useState<'paypal' | 'stripe' | null>(null);

    // Reset internal state when modal opens/closes
    useEffect(() => {
        if (!showPaymentModal) {
            const timer = setTimeout(() => {
                setPaymentStep('selection');
                setSelectedMethod(null);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [showPaymentModal]);

    const handleMethodSelect = (method: 'paypal' | 'stripe') => {
        setSelectedMethod(method);
        setPaymentStep('confirmation');
    };

    const validateEmail = (email: string) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const executePayment = () => {
        if (!validateEmail(email)) {
            setEmailError('Por favor ingresa un correo electrónico válido.');
            return;
        }
        setEmailError('');

        // Aquí es donde ocurre la redirección al link de Stripe o PayPal
        const paymentUrl = selectedMethod === 'paypal'
            ? PAYPAL_LINK
            : STRIPE_PAYMENT_LINK;

        // Redirigimos en la misma pestaña para que la experiencia de "regreso" sea fluida
        window.location.href = paymentUrl;
    };

    return (
        <AnimatePresence>
            {showPaymentModal && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" onClick={() => setShowPaymentModal(false)}>
                    <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md bg-[#0a0a0a] border border-[#FF0000]/30 rounded-2xl p-8 shadow-2xl shadow-[#FF0000]/20">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                {paymentStep === 'confirmation' && <button onClick={() => setPaymentStep('selection')} className="text-gray-400 hover:text-white"><ArrowLeft className="w-5 h-5" /></button>}
                                <h3 className="text-2xl font-heading font-bold text-white">{paymentStep === 'confirmation' ? 'Confirmar Detalles' : (isLoggedIn ? 'Completar Compra' : 'Pagar')}</h3>
                            </div>
                            <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
                        </div>

                        {paymentStep === 'selection' ? (
                            <>
                                {!isLoggedIn ? (
                                    <div className="mb-8">
                                        <p className="text-gray-400 text-xs mb-4 font-mono uppercase tracking-wider">Inicia sesión para registrar tu compra</p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <button onClick={() => handleSocialLogin('google')} disabled={loginProcessing} className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-colors disabled:opacity-70 cursor-pointer relative overflow-hidden">
                                                {loginProcessing ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                        <span className="text-xs">Conectando...</span>
                                                    </>
                                                ) : <>Google</>}
                                            </button>
                                            <button onClick={() => handleSocialLogin('facebook')} disabled={loginProcessing} className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#1877F2] text-white font-bold hover:bg-[#1864D9] transition-colors disabled:opacity-70 cursor-pointer relative overflow-hidden">
                                                {loginProcessing ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                        <span className="text-xs">Conectando...</span>
                                                    </>
                                                ) : <>Facebook</>}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mb-8 bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {userProfile?.avatar && (
                                                <img src={userProfile.avatar} alt="Avatar" className="w-10 h-10 rounded-full border border-white/20" />
                                            )}
                                            <div>
                                                <p className="text-sm font-bold text-white">{userProfile?.name}</p>
                                                <p className="text-xs text-[#FF00FF]">{userProfile?.email}</p>
                                            </div>
                                        </div>
                                        <button onClick={handleLogout} className="text-gray-500 hover:text-white transition-colors" title="Cerrar Sesión">
                                            <LogOut className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <button onClick={() => handleMethodSelect('paypal')} className="w-full flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-[#003087] hover:border-[#003087] hover:text-white transition-all group cursor-pointer">
                                        <span className="font-bold text-lg">PayPal</span>
                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20"><span className="italic font-serif font-black">P</span></div>
                                    </button>
                                    <button onClick={() => handleMethodSelect('stripe')} className="w-full flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-[#635BFF] hover:border-[#635BFF] hover:text-white transition-all group cursor-pointer">
                                        <span className="font-bold text-lg">Tarjeta (Stripe)</span>
                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20"><CreditCard className="w-4 h-4" /></div>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                                    <div className="flex justify-between items-center mb-2"><span className="text-sm text-gray-500">Guía + Plantilla</span><span className="text-sm text-gray-300">$10.00</span></div>
                                    <div className="flex justify-between items-center mb-4"><span className="text-sm text-gray-500">Bonus: Entrada Giveaway</span><span className="text-sm text-[#FF00FF] font-bold">Gratis</span></div>
                                    <div className="flex justify-between items-center pt-4 border-t border-white/10"><span className="font-bold text-lg text-white">Total a Pagar</span><span className="font-black text-2xl text-[#FF0000]">$10.00</span></div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                        <Mail className="w-3 h-3 text-[#FF00FF]" />
                                        {isLoggedIn ? 'Confirmar Correo de Envío' : 'Correo de Envío y Contacto'}
                                    </label>
                                    <input type="email" placeholder="tucorreo@ejemplo.com" value={email} onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(''); }} className={`w-full bg-black border ${emailError ? 'border-[#FF0000]' : 'border-white/20'} rounded-lg p-3 text-white focus:outline-none focus:border-[#FF00FF] transition-colors`} />
                                    {emailError && <p className="text-[#FF0000] text-xs animate-pulse">{emailError}</p>}
                                    <p className="text-[10px] text-gray-500">*Este correo será usado para contactarte si resultas ganador.</p>
                                </div>
                                <button onClick={executePayment} className="w-full py-4 bg-[#00FF00] text-black font-black uppercase tracking-widest hover:bg-[#32CD32] transition-all rounded-xl shadow-[0_0_20px_rgba(0,255,0,0.3)] flex items-center justify-center gap-2 group cursor-pointer">
                                    Confirmar y Pagar <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PaymentModal;

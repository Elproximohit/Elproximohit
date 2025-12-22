import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';

interface AuthModalProps {
    showAuthModal: boolean;
    setShowAuthModal: (show: boolean) => void;
    // For now we simulate login/register via parent state or context if needed, 
    // but here we primarily focus on "Register" -> Lead capture.
    onLoginSuccess?: (email: string, name: string) => void;
}

import { supabase } from '../../lib/supabaseClient';

const AuthModal: React.FC<AuthModalProps> = ({ showAuthModal, setShowAuthModal, onLoginSuccess }) => {
    const [mode, setMode] = useState<'login' | 'register'>('register');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [newsletter, setNewsletter] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setIsLoading(true);

        try {
            if (mode === 'register') {
                const { data, error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: name,
                            newsletter_opt_in: newsletter,
                        }
                    }
                });

                if (signUpError) throw signUpError;

                // Sync with Google Sheets Lead API for compatibility
                fetch('/api/register-lead', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, name, newsletter }),
                }).catch(err => console.error('Sheet Sync Error:', err));

                if (data.user?.identities?.length === 0) {
                    setError('Este correo ya está registrado.');
                } else {
                    setSuccessMsg('¡Cuenta creada! Revisa tu email para confirmar.');
                    if (onLoginSuccess) onLoginSuccess(email, name);
                    setTimeout(() => setShowAuthModal(false), 3000);
                }
            } else {
                const { data, error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (signInError) throw signInError;

                if (onLoginSuccess) onLoginSuccess(email, data.user?.user_metadata?.full_name || 'Usuario');
                setShowAuthModal(false);
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Error al procesar la solicitud.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {showAuthModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
                    onClick={() => setShowAuthModal(false)}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-md bg-[#0a0a0a] border border-[#FF0000]/30 rounded-2xl p-8 shadow-2xl shadow-[#FF0000]/20 relative overflow-hidden"
                    >
                        {/* Background Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#FF00FF]/10 blur-[100px] pointer-events-none" />

                        <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"><X className="w-6 h-6" /></button>

                        <div className="flex gap-8 mb-8 border-b border-white/10 pb-4 relative z-10">
                            {(['login', 'register'] as const).map((modalMode) => (
                                <button
                                    key={modalMode}
                                    onClick={() => setMode(modalMode)}
                                    className={`relative text-xl font-heading font-bold uppercase transition-colors pb-2 ${mode === modalMode ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    {modalMode === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
                                    {mode === modalMode && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute bottom-[-17px] left-0 right-0 h-[2px] bg-gradient-to-r from-[#FF00FF] to-[#FF0000]"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                            {mode === 'register' && (
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest text-[#FF00FF] font-bold flex items-center gap-2">
                                        <User className="w-3 h-3" /> Nombre
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF00FF] focus:bg-white/10 transition-all placeholder:text-gray-600"
                                        placeholder="Tu Nombre"
                                        required
                                    />
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-widest text-[#FF00FF] font-bold flex items-center gap-2">
                                    <Mail className="w-3 h-3" /> Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF00FF] focus:bg-white/10 transition-all placeholder:text-gray-600"
                                    placeholder="tucorreo@ejemplo.com"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-widest text-[#FF00FF] font-bold flex items-center gap-2">
                                    <Lock className="w-3 h-3" /> Contraseña
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF00FF] focus:bg-white/10 transition-all placeholder:text-gray-600"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            {mode === 'register' && (
                                <div className="flex items-start gap-3 pt-2 group cursor-pointer" onClick={() => setNewsletter(!newsletter)}>
                                    <div className={`mt-1 w-4 h-4 rounded border flex items-center justify-center transition-colors ${newsletter ? 'bg-[#FF00FF] border-[#FF00FF]' : 'border-gray-500 group-hover:border-gray-300'}`}>
                                        {newsletter && <CheckCircle className="w-3 h-3 text-white" />}
                                    </div>
                                    <label className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed cursor-pointer select-none">
                                        Quiero recibir noticias exclusivas, actualizaciones del <strong>Giveaway</strong> y lanzamientos.
                                    </label>
                                </div>
                            )}

                            {error && <p className="text-[#FF0000] text-xs font-bold animate-pulse">{error}</p>}
                            {successMsg && <p className="text-[#00FF00] text-xs font-bold flex items-center gap-2"><CheckCircle className="w-3 h-3" /> {successMsg}</p>}

                            <motion.button
                                disabled={isLoading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`w-full py-4 mt-6 font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg ${mode === 'register' ? 'bg-gradient-to-r from-[#FF00FF] to-[#FF0000] text-white shadow-[#FF00FF]/25' : 'bg-white text-black hover:bg-gray-100'}`}
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <>
                                        {mode === 'register' ? 'UNIRME AHORA' : 'ENTRAR'} <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </motion.button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AuthModal;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';

interface AuthModalProps {
    showAuthModal: boolean;
    setShowAuthModal: (show: boolean) => void;
    onLoginSuccess?: (email: string, name: string) => void;
    handleSocialLogin?: (provider: 'google' | 'facebook') => void;
    loginProcessing?: boolean;
}

import { supabase } from '../../lib/supabaseClient';

const AuthModal: React.FC<AuthModalProps> = ({
    showAuthModal,
    setShowAuthModal,
    onLoginSuccess,
    handleSocialLogin,
    loginProcessing
}) => {
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

                        {handleSocialLogin && (
                            <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
                                <button
                                    onClick={() => handleSocialLogin('google')}
                                    disabled={loginProcessing}
                                    className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white hover:bg-white/10 transition-all disabled:opacity-50"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335" />
                                    </svg>
                                    <span className="text-xs font-bold uppercase tracking-wider">Google</span>
                                </button>
                                <button
                                    onClick={() => handleSocialLogin('facebook')}
                                    disabled={loginProcessing}
                                    className="flex items-center justify-center gap-3 bg-[#1877F2]/10 border border-[#1877F2]/20 rounded-xl py-3 px-4 text-white hover:bg-[#1877F2]/20 transition-all disabled:opacity-50"
                                >
                                    <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                    <span className="text-xs font-bold uppercase tracking-wider">Facebook</span>
                                </button>
                            </div>
                        )}

                        <div className="relative flex items-center justify-center mb-6 relative z-10">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <span className="relative px-4 text-[10px] uppercase tracking-widest text-gray-500 bg-[#0a0a0a] font-bold">
                                O continuar con email
                            </span>
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

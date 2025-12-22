import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Disc, Music, Menu, X, Instagram, Facebook, Twitter, User } from 'lucide-react';
import { UserProfile } from '../modals/PaymentModal';

interface NavbarProps {
    scrollToSection: (id: string) => void;
    mobileMenuOpen: boolean;
    setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onLoginClick: () => void;
    isLoggedIn: boolean;
    userProfile: UserProfile | null;
}

const Navbar: React.FC<NavbarProps> = ({ scrollToSection, mobileMenuOpen, setMobileMenuOpen, onLoginClick, isLoggedIn, userProfile }) => {
    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-8 py-6 bg-black/95 border-b border-white/5">
                <motion.div
                    className="font-heading text-lg md:text-xl font-bold tracking-tighter text-white cursor-pointer z-50 flex items-center gap-3"
                    whileHover={{ scale: 1.05 }}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                    <motion.div
                        className="relative flex items-center justify-center w-8 h-8 rounded-full"
                        animate={{ boxShadow: ["0 0 0px rgba(255, 0, 0, 0)", "0 0 15px rgba(255, 0, 0, 0.5)", "0 0 0px rgba(255, 0, 0, 0)"] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <Disc className="w-full h-full text-[#FF0000] animate-[spin_4s_linear_infinite]" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Music className="w-3 h-3 text-white" />
                        </div>
                    </motion.div>
                    <span className="text-white">EL PROXIMO HIT</span>
                </motion.div>

                <div className="hidden md:flex gap-10 text-xs font-bold tracking-widest uppercase items-center">
                    {[
                        { label: 'El Manual', id: 'curriculum' },
                        { label: 'Giveaway', id: 'giveaway' },
                        { label: 'Comunidad', id: 'social-proof' },
                        { label: 'Preguntas', id: 'faq' }
                    ].map((item) => (
                        <button key={item.id} onClick={() => scrollToSection(item.id)} className="hover:text-[#FF00FF] transition-colors text-white bg-transparent border-none cursor-pointer">
                            {item.label}
                        </button>
                    ))}

                    {!isLoggedIn ? (
                        <motion.button
                            onClick={onLoginClick}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="text-white bg-transparent border border-white/20 px-4 py-1.5 rounded-full cursor-pointer flex items-center gap-2 hover:border-[#FF00FF] hover:text-[#FF00FF] hover:shadow-[0_0_15px_rgba(255,0,255,0.4)] transition-all duration-300"
                        >
                            <User className="w-3 h-3" /> INGRESAR
                        </motion.button>
                    ) : (
                        <div className="flex items-center gap-2 text-[#00FF00]">
                            <div className="w-6 h-6 rounded-full bg-gray-800 border border-[#00FF00] overflow-hidden flex items-center justify-center text-[10px]">
                                {userProfile?.avatar ? <img src={userProfile.avatar} alt="User" /> : userProfile?.name.charAt(0)}
                            </div>
                            <span className="max-w-[100px] truncate">{userProfile?.name}</span>
                        </div>
                    )}

                    <button onClick={() => scrollToSection('download')} className="border border-[#FF0000] px-6 py-2 text-xs font-bold tracking-widest uppercase hover:bg-[#FF0000] hover:text-white transition-all duration-300 text-[#FF0000] bg-transparent cursor-pointer font-heading">
                        Comprar Ahora
                    </button>
                </div>

                <button className="md:hidden text-white z-50 relative w-10 h-10 flex items-center justify-center" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </nav>

            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-30 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden"
                    >
                        {[
                            { label: 'El Manual', id: 'curriculum' },
                            { label: 'Giveaway', id: 'giveaway' },
                            { label: 'Comunidad', id: 'social-proof' },
                            { label: 'Preguntas', id: 'faq' }
                        ].map((item) => (
                            <button key={item.id} onClick={() => scrollToSection(item.id)} className="text-3xl font-heading font-bold text-white hover:text-[#FF00FF] transition-colors uppercase bg-transparent border-none">
                                {item.label}
                            </button>
                        ))}

                        <button onClick={() => scrollToSection('download')} className="text-4xl font-heading font-black text-[#FF0000] hover:scale-110 transition-transform bg-transparent border-none">
                            COMPRAR
                        </button>

                        <button onClick={() => { setMobileMenuOpen(false); onLoginClick(); }} className="text-2xl font-bold text-[#FF00FF] pt-4">
                            {isLoggedIn ? 'MI PERFIL' : 'INGRESAR / REGISTRARSE'}
                        </button>

                        <div className="absolute bottom-10 flex gap-6">
                            <Instagram className="text-white w-6 h-6" />
                            <Facebook className="text-white w-6 h-6" />
                            <Twitter className="text-white w-6 h-6" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;

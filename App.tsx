import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Download, Globe, Zap, Music, Menu, X, CheckCircle, Mic2, Video, Instagram, Facebook, Twitter, Disc, CreditCard, Loader2, MapPin, Heart, TrendingUp, ArrowLeft, Mail, ShieldCheck, Ticket, UserCheck, Bell, Scale, Gavel, FileText, AlertTriangle, Lock, LogOut } from 'lucide-react';
import FluidBackground from './components/FluidBackground';
import GradientText from './components/GlitchText';
import CustomCursor from './components/CustomCursor';
import FeatureCard from './components/ArtistCard';
import AIChat from './components/AIChat';
import FAQ from './components/FAQ';
import PromoVideo from './components/PromoVideo';
import LoadingScreen from './components/LoadingScreen';
import { FeatureItem } from './types';

// --- CONFIGURACIÓN DE PAGOS ---
// Enlace de pago de Stripe configurado
const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/test_6oUcN6a2g2wD4Ur10fcIE00"; 
const PAYPAL_LINK = "https://www.paypal.me/Bred210"; 

const FEATURES: FeatureItem[] = [
  { 
    id: '1', 
    title: 'Plantilla de Pro Tools', 
    category: 'Esenciales DAW', 
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1000&auto=format&fit=crop',
    description: 'La estructura de sesión exacta usada en los éxitos número uno. Busses pre-enrutados, cadenas de efectos y trucos de flujo de trabajo.'
  },
  { 
    id: '2', 
    title: 'Secretos de Mezcla', 
    category: 'Guía PDF', 
    image: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?q=80&w=1000&auto=format&fit=crop',
    description: 'Un desglose completo de técnicas de EQ, Compresión y Procesamiento Espacial para que tus pistas suenen listas para la radio.'
  },
  { 
    id: '3', 
    title: 'Cadena Vocal', 
    category: 'Preset', 
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1000&auto=format&fit=crop',
    description: 'Consigue ese sonido vocal moderno y nítido al instante. Incluye presets para voces principales, ad-libs y armonías.'
  },
  { 
    id: '4', 
    title: 'Masterización 101', 
    category: 'Capítulo de Guía', 
    image: 'https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=1000&auto=format&fit=crop',
    description: 'Aprende a llevar tus pistas a un volumen comercial sin sacrificar la dinámica. El pulido final que tu música necesita.'
  },
];

const PDF_DOWNLOAD_LINK = "https://drive.google.com/uc?export=download&id=16FriG8rNgc-tRi-ff1w2rY0CDv2nZnUi";

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  provider: 'google' | 'facebook';
}

const App: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  
  // Loading State
  const [isLoading, setIsLoading] = useState(true);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<FeatureItem | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  const [purchasing, setPurchasing] = useState(false);
  const [purchased, setPurchased] = useState(false);
  
  const [paymentStep, setPaymentStep] = useState<'selection' | 'confirmation'>('selection');
  const [selectedMethod, setSelectedMethod] = useState<'paypal' | 'stripe' | null>(null);
  
  // Auth & User Data State
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginProcessing, setLoginProcessing] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const MAX_PARTICIPANTS = 1000;
  const [currentParticipants, setCurrentParticipants] = useState(985); 
  const [isHoveringProgress, setIsHoveringProgress] = useState(false);
  const [showWinnerAnnouncement, setShowWinnerAnnouncement] = useState(false);

  // Efecto de Carga Inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2800); 

    return () => clearTimeout(timer);
  }, []);

  // VERIFICACIÓN DE PAGO REAL Y ÚNICO
  useEffect(() => {
    // 1. Verificar si hay parámetro de éxito en la URL
    const query = new URLSearchParams(window.location.search);
    const isSuccess = query.get('success');

    // 2. Verificar si este navegador YA descargó el archivo (Protección Local)
    const hasAlreadyDownloaded = localStorage.getItem('product_downloaded_v1');

    if (isSuccess) {
      // Limpiamos la URL INMEDIATAMENTE para que un refresh no sirva
      window.history.replaceState(null, '', window.location.pathname);

      if (hasAlreadyDownloaded) {
        // Si ya descargó antes, no permitimos activar el estado de compra
        setPurchased(false);
        alert("El enlace de descarga ya fue utilizado anteriormente.");
      } else {
        // Si es la primera vez y viene de Stripe, activamos la descarga
        setPurchased(true);
        setTimeout(() => {
          scrollToSection('download');
        }, 1000);
      }
    }
  }, []);

  // Simulación de ventas entrando en tiempo real (solo visual)
  useEffect(() => {
    const interval = setInterval(() => {
       setCurrentParticipants(prev => {
         if (prev >= 1000) {
            if (!showWinnerAnnouncement) setShowWinnerAnnouncement(true);
            return 1000;
         }
         return prev + (Math.random() > 0.8 ? 1 : 0);
       });
    }, 4000);
    return () => clearInterval(interval);
  }, [showWinnerAnnouncement]);

  useEffect(() => {
    if (!showPaymentModal) {
      const timer = setTimeout(() => {
        setPaymentStep('selection');
        setSelectedMethod(null);
        // No limpiamos el email si está logueado para mantener la sesión "viva" en la UI
        if (!isLoggedIn) {
            setEmail('');
        }
        setEmailError('');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [showPaymentModal]);

  const progressPercentage = (currentParticipants / MAX_PARTICIPANTS) * 100;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedFeature) return;
      if (e.key === 'ArrowLeft') navigateFeature('prev');
      if (e.key === 'ArrowRight') navigateFeature('next');
      if (e.key === 'Escape') setSelectedFeature(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedFeature]);

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

    setPurchasing(true);
    
    // Aquí es donde ocurre la redirección al link de Stripe o PayPal
    const paymentUrl = selectedMethod === 'paypal' 
      ? PAYPAL_LINK
      : STRIPE_PAYMENT_LINK;
      
    // Redirigimos en la misma pestaña para que la experiencia de "regreso" sea fluida
    window.location.href = paymentUrl;
  };

  const handleSocialLogin = (provider: 'google' | 'facebook') => {
    setLoginProcessing(true);
    
    // Simulamos una redirección y captura de datos de API OAuth
    setTimeout(() => {
      setLoginProcessing(false);
      setIsLoggedIn(true);
      
      // Datos simulados que vendrían del proveedor
      const mockUserData: UserProfile = {
          name: provider === 'google' ? 'Usuario de Google' : 'Usuario de Facebook',
          email: provider === 'google' ? 'usuario.demo@gmail.com' : 'usuario.demo@facebook.com',
          avatar: provider === 'google' 
            ? 'https://lh3.googleusercontent.com/a/default-user=s96-c' 
            : 'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=1000000&height=50&width=50&ext=1699999999&hash=AeQx',
          provider: provider
      };
      
      setUserProfile(mockUserData);
      setEmail(mockUserData.email); // Auto-completamos el email para el pago
    }, 2000);
  };

  const handleLogout = () => {
      setIsLoggedIn(false);
      setUserProfile(null);
      setEmail('');
  };

  // Manejo de la descarga ÚNICA
  const handleOneTimeDownload = () => {
    // 1. Marcamos en el navegador que ya se descargó
    localStorage.setItem('product_downloaded_v1', 'true');
    
    // 2. Damos un pequeño tiempo para que inicie la descarga antes de bloquear
    setTimeout(() => {
      setPurchased(false);
      alert("Descarga iniciada. Por seguridad, este enlace ha caducado.");
    }, 2000);
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    let targetId = id.toLowerCase();
    if (targetId === 'misión') targetId = 'mission';
    if (targetId === 'características') targetId = 'features';
    if (targetId === 'giveaway') targetId = 'giveaway';
    if (targetId === 'legal') targetId = 'legal';
    if (targetId === 'download') targetId = 'download';
    
    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const navigateFeature = (direction: 'next' | 'prev') => {
    if (!selectedFeature) return;
    const currentIndex = FEATURES.findIndex(a => a.id === selectedFeature.id);
    let nextIndex;
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % FEATURES.length;
    } else {
      nextIndex = (currentIndex - 1 + FEATURES.length) % FEATURES.length;
    }
    setSelectedFeature(FEATURES[nextIndex]);
  };
  
  return (
    <div className="relative min-h-screen text-white selection:bg-[#FF00FF] selection:text-white cursor-auto md:cursor-none overflow-x-hidden">
      <CustomCursor />
      
      <AnimatePresence>
        {isLoading && <LoadingScreen />}
      </AnimatePresence>

      <FluidBackground />
      <AIChat />
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-8 py-6 mix-blend-screen bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
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
          {['Misión', 'Características', 'Giveaway'].map((item) => (
            <button key={item} onClick={() => scrollToSection(item)} className="hover:text-[#FF00FF] transition-colors text-white bg-transparent border-none cursor-pointer">
              {item}
            </button>
          ))}
          <button onClick={() => scrollToSection('download')} className="border border-[#FF0000] px-6 py-2 text-xs font-bold tracking-widest uppercase hover:bg-[#FF0000] hover:text-white transition-all duration-300 text-[#FF0000] bg-transparent cursor-pointer">
            Descargar Guía
          </button>
        </div>

        <button className="md:hidden text-white z-50 relative w-10 h-10 flex items-center justify-center" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
           {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {[{ label: 'Misión', id: 'mission' }, { label: 'Características', id: 'features' }, { label: 'Giveaway', id: 'giveaway' }, { label: 'Descargar', id: 'download' }].map((item) => (
              <button key={item.id} onClick={() => scrollToSection(item.id)} className="text-4xl font-heading font-bold text-white hover:text-[#FF00FF] transition-colors uppercase bg-transparent border-none">
                {item.label}
              </button>
            ))}
            <div className="absolute bottom-10 flex gap-6">
               <Instagram className="text-white w-6 h-6" />
               <Facebook className="text-white w-6 h-6" />
               <Twitter className="text-white w-6 h-6" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <header className="relative h-[100svh] min-h-[700px] flex flex-col items-center justify-center overflow-hidden px-4 pt-20">
        <motion.div style={{ y }} className="z-10 text-center flex flex-col items-center w-full max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }} className="flex flex-col items-center gap-2 mb-8 w-full max-w-md">
            <div className="flex justify-between w-full text-xs font-mono text-[#FF00FF] tracking-widest uppercase mb-1">
               <span>Ronda Actual</span>
               <span>{currentParticipants} / {MAX_PARTICIPANTS} Ventas</span>
            </div>
            <div className="relative w-full group cursor-help" onMouseEnter={() => setIsHoveringProgress(true)} onMouseLeave={() => setIsHoveringProgress(false)}>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden border border-white/5">
                 <motion.div className="h-full bg-gradient-to-r from-[#FF0000] to-[#FF00FF]" initial={{ width: 0 }} animate={{ width: `${progressPercentage}%` }} transition={{ duration: 1.5, ease: "easeOut" }} />
              </div>
              <motion.div className="absolute top-0 left-0 h-full pointer-events-none" initial={{ width: 0 }} animate={{ width: `${progressPercentage}%` }} transition={{ duration: 1.5, ease: "easeOut" }}>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-20">
                     <div className="relative flex items-center justify-center">
                        <div className="absolute inset-0 bg-[#FF00FF] blur-sm rounded-full opacity-80 animate-pulse" />
                        <div className="bg-black rounded-full p-1 border border-[#FF00FF]/50 shadow-[0_0_10px_#FF00FF]">
                           <Music className="w-3 h-3 text-white" />
                        </div>
                     </div>
                  </div>
                  <AnimatePresence>
                      {isHoveringProgress && (
                          <motion.div initial={{ opacity: 0, y: 10, scale: 0.8 }} animate={{ opacity: 1, y: -35, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.8 }} className="absolute right-0 -top-2 translate-x-1/2">
                             <div className="bg-black/90 backdrop-blur border border-[#FF0000] px-3 py-1.5 rounded text-xs font-bold text-white shadow-[0_0_15px_rgba(255,0,0,0.5)] flex gap-2 items-center whitespace-nowrap">
                                <span className="w-2 h-2 rounded-full bg-[#00FF00] animate-pulse"/>
                                {currentParticipants} VENTAS REGISTRADAS
                             </div>
                             <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black border-r border-b border-[#FF0000] rotate-45" />
                          </motion.div>
                      )}
                  </AnimatePresence>
              </motion.div>
            </div>
          </motion.div>

          <div className="relative w-full flex flex-col justify-center items-center">
            <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ duration: 1.2, ease: "backOut", delay: 0.5 }} className="mb-6 relative w-20 h-20 flex items-center justify-center">
                <Disc className="w-full h-full text-[#FF0000] animate-[spin_8s_linear_infinite]" />
                <div className="absolute inset-0 bg-[#FF0000]/30 blur-2xl rounded-full" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Music className="w-8 h-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                </div>
            </motion.div>

            <h2 className="text-sm md:text-xl tracking-[0.5em] uppercase text-gray-400 mb-2">Crea Tu Legado</h2>
            <GradientText text="EL PROXIMO" as="h1" className="text-[12vw] md:text-[8vw] leading-[0.9] font-black tracking-tighter text-center" />
            <GradientText text="HIT" as="h1" className="text-[15vw] md:text-[10vw] leading-[0.9] font-black tracking-tighter text-center text-[#FF0000]" />
            <motion.div className="absolute -z-20 w-[60vw] h-[60vw] bg-[#FF0000]/10 blur-[80px] rounded-full pointer-events-none" animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 4, repeat: Infinity }} />
          </div>
          
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }} className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-[#FF00FF] to-transparent mt-8 mb-8" />

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 1 }} className="flex flex-col items-center gap-6">
            <p className="text-base md:text-xl font-light max-w-2xl mx-auto text-gray-300 leading-relaxed px-4">
              <span className="text-white font-bold text-xl block mb-2">TU COMPRA TIENE VALOR REAL:</span>
              Recibe la Guía Profesional y la Plantilla Pro Tools instantáneamente.
              <span className="text-[#FF00FF] font-bold block mt-2">La entrada al Giveaway es un BONUS gratuito incluido.</span>
            </p>
            
            <button onClick={() => scrollToSection('download')} className="mt-4 group relative px-8 py-4 bg-[#FF0000] text-white font-bold tracking-widest uppercase overflow-hidden hover:bg-[#DC143C] transition-colors cursor-pointer">
              <span className="relative z-10 flex items-center gap-2">
                Comprar Guía + Giveaway - $10 <Download className="w-4 h-4" />
              </span>
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-out" />
            </button>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-12 md:bottom-0 left-0 w-full py-3 bg-[#FF0000] text-black z-20 overflow-hidden border-y border-white/10">
          <motion.div className="flex w-fit" animate={{ x: "-50%" }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
             {[0, 1, 2, 3].map((key) => (
              <div key={key} className="flex whitespace-nowrap shrink-0 items-center">
                 <span className="text-lg md:text-xl font-heading font-bold px-8 flex items-center gap-4">
                    GANA UNA PRODUCCIÓN COMPLETA DE CANCIÓN <Disc className="w-5 h-5 animate-spin" /> MEZCLA Y MASTERIZACIÓN INCLUIDAS
                 </span>
              </div>
            ))}
          </motion.div>
        </div>
      </header>

      {/* Mission Section */}
      <section id="mission" className="relative z-10 py-20 md:py-32 bg-black/80">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
             <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                <div className="flex items-center gap-2 mb-4">
                   <TrendingUp className="text-[#FF0000] w-6 h-6" />
                   <span className="text-[#FF0000] font-mono tracking-widest uppercase text-xs">El Origen</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-heading font-bold uppercase leading-none mb-8">
                   La Industria es <br /> <GradientText text="COSTOSA" className="text-5xl md:text-7xl" />
                </h2>
                <div className="space-y-6 text-gray-300 text-lg md:text-xl font-light leading-relaxed">
                   <p>Sabemos lo que se siente. El talento en <span className="text-white font-bold">Puerto Rico y Estados Unidos</span> sobra, pero a menudo los recursos faltan. La barrera de entrada para un sonido profesional es demasiado alta.</p>
                   <p className="border-l-4 border-[#FF00FF] pl-4 italic">"Creamos esto para darte la llave que nosotros no tuvimos. Tu sueño no debería morir por falta de presupuesto."</p>
                </div>
             </motion.div>

             <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="relative">
                <div className="absolute -inset-4 bg-gradient-to-tr from-[#FF0000] to-[#FF00FF] rounded-[2rem] opacity-20 blur-xl" />
                <div className="relative bg-zinc-900 border border-white/10 p-8 md:p-12 rounded-[2rem] overflow-hidden">
                   <div className="relative z-10 flex flex-col gap-8">
                      <div className="flex items-center justify-between">
                         <div className="flex flex-col">
                            <span className="text-xs text-gray-500 uppercase tracking-widest mb-1">Desde</span>
                            <span className="text-2xl font-bold flex items-center gap-2"><MapPin className="w-5 h-5 text-[#FF0000]" /> PUERTO RICO 🇵🇷</span>
                         </div>
                         <div className="h-px w-12 bg-white/20" />
                         <div className="flex flex-col text-right">
                            <span className="text-xs text-gray-500 uppercase tracking-widest mb-1">Hasta</span>
                            <span className="text-2xl font-bold flex items-center gap-2">USA 🇺🇸 <MapPin className="w-5 h-5 text-[#FF00FF]" /></span>
                         </div>
                      </div>
                      <div className="bg-black/50 p-6 rounded-xl border border-white/5">
                         <h4 className="text-[#FF00FF] font-bold mb-2 flex items-center gap-2"><Heart className="w-4 h-4" /> EL OBJETIVO</h4>
                         <p className="text-sm text-gray-400">Democratizar el acceso al conocimiento profesional. Nuestra <span className="text-white">Guía PDF</span> y <span className="text-white">Plantilla Pro Tools</span> son las herramientas exactas que usan los grandes estudios.</p>
                      </div>
                      <button onClick={() => scrollToSection('features')} className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors rounded-lg flex items-center justify-center gap-2 cursor-pointer">
                         Ver Herramientas <ArrowLeft className="w-4 h-4 rotate-180" />
                      </button>
                   </div>
                </div>
             </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 md:py-32">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16 px-4">
             <h2 className="text-5xl md:text-7xl font-heading font-bold uppercase leading-[0.9] w-full md:w-auto">
              Qué hay <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF0000] to-[#FF00FF]">Dentro</span>
            </h2>
             <p className="text-gray-400 font-mono text-sm md:text-base max-w-md mt-4 md:mt-0 text-right">Todo lo que necesitas para transformar tu demo en un éxito de radio.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-white/10 bg-black/40 backdrop-blur-sm">
            {FEATURES.map((feature) => (
              <FeatureCard key={feature.id} artist={feature} onClick={() => setSelectedFeature(feature)} />
            ))}
          </div>
        </div>
      </section>

      {/* Giveaway Section */}
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

      {/* Download Section */}
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
                    <Download className="w-5 h-5 animate-bounce"/> Descargar Ahora (1 Uso)
                 </span>
                 <div className="absolute inset-0 bg-white/20 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-out" />
               </a>
             ) : (
                <>
                {localStorage.getItem('product_downloaded_v1') ? (
                    <button disabled className="w-full max-w-md py-5 text-base font-bold uppercase tracking-[0.2em] bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700">
                        <span className="flex items-center justify-center gap-2"><Lock className="w-5 h-5"/> Descarga Finalizada</span>
                    </button>
                ) : (
                   <button onClick={() => setShowPaymentModal(true)} disabled={purchasing} className={`w-full max-w-md py-5 text-base font-bold uppercase tracking-[0.2em] transition-all duration-300 relative overflow-hidden group ${purchasing ? 'bg-white/20 text-white cursor-wait' : 'bg-[#FF0000] text-white hover:bg-[#FF00FF] shadow-lg shadow-red-600/20'}`}>
                     <span className="relative z-10 flex items-center justify-center gap-2">{purchasing ? 'Procesando...' : <><CreditCard className="w-5 h-5"/> Comprar Guía - $10</>}</span>
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

      <FAQ />

      {/* Legal Section */}
      <section id="legal" className="relative z-10 py-16 px-4 md:px-6 bg-zinc-950 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
           <div className="flex items-center gap-3 mb-10">
              <Scale className="w-6 h-6 text-gray-500" />
              <h3 className="text-xl md:text-2xl font-heading font-bold uppercase text-gray-400">Información <span className="text-white">Legal & Reglas</span></h3>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1: Fundamento Legal */}
              <div className="bg-black/40 border border-white/5 p-6 rounded-xl hover:border-[#FF0000]/30 transition-colors">
                 <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center mb-4"><Gavel className="w-5 h-5 text-[#FF0000]" /></div>
                 <h4 className="font-bold text-white mb-2 text-sm uppercase tracking-wider">Jurisdicción & Ley</h4>
                 <p className="text-xs text-gray-400 leading-relaxed">
                    Esta acción promocional se rige por el <strong>Reglamento de Prácticas Comerciales del DACO</strong> (Puerto Rico). Cualquier controversia será resuelta exclusivamente ante los tribunales competentes del Estado Libre Asociado de Puerto Rico.
                 </p>
              </div>

              {/* Card 2: Elegibilidad */}
              <div className="bg-black/40 border border-white/5 p-6 rounded-xl hover:border-[#FF0000]/30 transition-colors">
                 <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center mb-4"><UserCheck className="w-5 h-5 text-[#FF00FF]" /></div>
                 <h4 className="font-bold text-white mb-2 text-sm uppercase tracking-wider">Elegibilidad</h4>
                 <ul className="text-xs text-gray-400 space-y-2 list-disc pl-4">
                    <li>Participantes deben ser mayores de <strong>18 años</strong>.</li>
                    <li>Residentes legales con capacidad legal.</li>
                    <li>Deberán proveer <strong>datos veraces</strong> y completos.</li>
                    <li>Se requerirá identificación válida (Licencia/Electoral) para reclamar.</li>
                 </ul>
              </div>

              {/* Card 3: Mecánica y Entrega */}
              <div className="bg-black/40 border border-white/5 p-6 rounded-xl hover:border-[#FF0000]/30 transition-colors">
                 <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center mb-4"><FileText className="w-5 h-5 text-blue-400" /></div>
                 <h4 className="font-bold text-white mb-2 text-sm uppercase tracking-wider">Mecánica del Giveaway</h4>
                 <p className="text-xs text-gray-400 leading-relaxed mb-2">
                    Al agotar las guías/templates (meta de 1,000 ventas), se anunciará fecha/hora.
                 </p>
                 <ol className="text-xs text-gray-500 space-y-1 list-decimal pl-4">
                    <li>Selección en vivo vía <strong>Instagram & TikTok Live</strong>.</li>
                    <li>Contacto telefónico inmediato para validación.</li>
                    <li>Coordinación de entrega tras verificación de identidad.</li>
                 </ol>
              </div>

              {/* Card 4: Impuestos y Publicidad */}
              <div className="bg-black/40 border border-white/5 p-6 rounded-xl hover:border-[#FF0000]/30 transition-colors">
                 <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center mb-4"><AlertTriangle className="w-5 h-5 text-yellow-500" /></div>
                 <h4 className="font-bold text-white mb-2 text-sm uppercase tracking-wider">Impuestos & Imagen</h4>
                 <p className="text-xs text-gray-400 leading-relaxed">
                    El premio constituye <strong>ingreso tributable</strong> (Código Rentas Internas PR 2011/USA). El ganador es único responsable de las contribuciones.
                 </p>
                 <p className="text-xs text-gray-500 mt-2 italic border-t border-white/5 pt-2">
                    *El ganador acepta la publicación de su identidad y documentación de la entrega con fines promocionales.
                 </p>
              </div>
           </div>
           
           <div className="mt-8 text-center border-t border-white/5 pt-6">
              <p className="text-[10px] text-gray-600 font-mono">
                 © 2025 EL PROXIMO HIT. Todos los derechos reservados. El Próximo Hit se hace responsable de hacer entrega del premio a la persona seleccionada conforme a estas reglas.
              </p>
           </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 py-12 bg-black">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-heading text-xl font-bold tracking-tighter text-white flex items-center gap-3">
             <div className="relative flex items-center justify-center w-6 h-6">
                <Disc className="w-full h-full text-[#FF0000] animate-[spin_4s_linear_infinite]" />
                <div className="absolute inset-0 flex items-center justify-center"><Music className="w-2.5 h-2.5 text-white" /></div>
             </div>
             EL PROXIMO HIT
          </div>
          <div className="text-xs font-mono text-gray-500">CONSTRUYENDO LEGADOS</div>
        </div>
      </footer>
      
      {/* Modal de Anuncio de Ganador (Meta Alcanzada) */}
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

      {/* Modales (Pago y Detalles) */}
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
                           <input type="email" placeholder="tucorreo@ejemplo.com" value={email} onChange={(e) => { setEmail(e.target.value); if(emailError) setEmailError(''); }} className={`w-full bg-black border ${emailError ? 'border-[#FF0000]' : 'border-white/20'} rounded-lg p-3 text-white focus:outline-none focus:border-[#FF00FF] transition-colors`} />
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
      <AnimatePresence>
        {selectedFeature && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedFeature(null)} className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-auto">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} onClick={(e) => e.stopPropagation()} className="relative w-full max-w-5xl bg-black border border-[#FF0000]/30 overflow-hidden flex flex-col md:flex-row shadow-2xl shadow-[#FF0000]/10">
              <button onClick={() => setSelectedFeature(null)} className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-white hover:text-black transition-colors cursor-pointer"><X className="w-6 h-6" /></button>
              <button onClick={(e) => { e.stopPropagation(); navigateFeature('prev'); }} className="absolute left-4 bottom-4 translate-y-0 md:top-1/2 md:bottom-auto md:-translate-y-1/2 z-20 p-3 rounded-full bg-black/50 text-white hover:bg-white hover:text-black transition-colors border border-white/10 backdrop-blur-sm cursor-pointer"><ArrowLeft className="w-6 h-6" /></button>
              <button onClick={(e) => { e.stopPropagation(); navigateFeature('next'); }} className="absolute right-4 bottom-4 translate-y-0 md:top-1/2 md:bottom-auto md:-translate-y-1/2 z-20 p-3 rounded-full bg-black/50 text-white hover:bg-white hover:text-black transition-colors border border-white/10 backdrop-blur-sm md:right-8 cursor-pointer"><ArrowLeft className="w-6 h-6 rotate-180" /></button>
              <div className="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img key={selectedFeature.id} src={selectedFeature.image} alt={selectedFeature.title} initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="absolute inset-0 w-full h-full object-cover grayscale" />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent md:bg-gradient-to-r" />
              </div>
              <div className="w-full md:w-1/2 p-8 pb-24 md:p-12 flex flex-col justify-center relative">
                <motion.div key={selectedFeature.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
                  <div className="flex items-center gap-3 text-[#FF0000] mb-4"><CheckCircle className="w-4 h-4" /><span className="font-mono text-sm tracking-widest uppercase">{selectedFeature.category}</span></div>
                  <h3 className="text-3xl md:text-5xl font-heading font-bold uppercase leading-none mb-2 text-white">{selectedFeature.title}</h3>
                  <div className="h-px w-20 bg-[#FF00FF]/50 my-6" />
                  <p className="text-gray-300 leading-relaxed text-lg font-light mb-8">{selectedFeature.description}</p>
                   <button onClick={() => { setSelectedFeature(null); scrollToSection('download'); }} className="inline-block border border-[#FF0000] text-[#FF0000] px-8 py-3 text-sm font-bold tracking-widest uppercase hover:bg-[#FF0000] hover:text-white transition-all duration-300 cursor-pointer">Obtenlo Ahora</button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;

import React, { useState, useEffect, Suspense } from 'react';
import { useScroll, useTransform, AnimatePresence } from 'framer-motion';
import FluidBackground from './components/FluidBackground';
import CustomCursor from './components/CustomCursor';
import AIChat from './components/AIChat';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import SectionLoader from './components/ui/SectionLoader';

// Lazy Load Heavy Components
const Mission = React.lazy(() => import('./components/sections/Mission'));
const Features = React.lazy(() => import('./components/sections/Features'));
const Team = React.lazy(() => import('./components/sections/Team'));
const Giveaway = React.lazy(() => import('./components/sections/Giveaway'));
const Download = React.lazy(() => import('./components/sections/Download'));
const Legal = React.lazy(() => import('./components/sections/Legal'));
const SocialProof = React.lazy(() => import('./components/sections/SocialProof'));
const Curriculum = React.lazy(() => import('./components/sections/Curriculum'));
const LeadMagnet = React.lazy(() => import('./components/sections/LeadMagnet'));
const FAQ = React.lazy(() => import('./components/FAQ'));
const Process = React.lazy(() => import('./components/sections/Process'));
const WinnerAnnouncement = React.lazy(() => import('./components/modals/WinnerAnnouncement'));

import FeatureModal from './components/modals/FeatureModal';
import PaymentModal, { UserProfile } from './components/modals/PaymentModal';
import AuthModal from './components/modals/AuthModal';
import { FEATURES, MAX_PARTICIPANTS } from './data/content';
import { FeatureItem } from './types';
import { supabase } from './lib/supabaseClient';

const App: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  // Loading State
  const [isLoading, setIsLoading] = useState(true);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<FeatureItem | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [purchasing, setPurchasing] = useState(false);
  const [purchased, setPurchased] = useState(false);

  // Auth & User Data State
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginProcessing, setLoginProcessing] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const [currentParticipants, setCurrentParticipants] = useState(17);
  const [isHoveringProgress, setIsHoveringProgress] = useState(false);
  const [showWinnerAnnouncement, setShowWinnerAnnouncement] = useState(false);

  // Efecto de Carga Inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // VERIFICACIÓN DE PAGO REAL Y ÚNICO
  useEffect(() => {
    // 1. Verificar si hay parámetro de éxito en la URL o si ya se detectó en esta sesión
    const query = new URLSearchParams(window.location.search);
    const isSuccess = query.get('success');
    const hasSessionPurchase = sessionStorage.getItem('session_purchased_v1') === 'true';

    // 2. Verificar si este navegador YA descargó el archivo (Protección Local)
    const hasAlreadyDownloaded = localStorage.getItem('product_downloaded_v1');

    if (isSuccess || hasSessionPurchase) {
      if (isSuccess) {
        window.history.replaceState(null, '', window.location.pathname);
        sessionStorage.setItem('session_purchased_v1', 'true');
      }

      if (hasAlreadyDownloaded) {
        setPurchased(false);
        if (isSuccess) alert("El enlace de descarga ya fue utilizado anteriormente.");
      } else {
        setPurchased(true);
        if (isSuccess) {
          setTimeout(() => {
            scrollToSection('download');
          }, 1000);
        }
      }
    }
  }, []);

  // Fetch Real Participant Count on Mount
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch('/api/get-participant-count');
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data.count === 'number') {
            setCurrentParticipants(data.count);
          }
        }
      } catch (error) {
        console.error("Error fetching count:", error);
      }
    };

    fetchCount();
  }, []);

  // Supabase Auth Listener
  useEffect(() => {
    // Check active session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsLoggedIn(true);
        setUserProfile({
          name: session.user.user_metadata.full_name || 'Usuario',
          email: session.user.email || '',
          avatar: session.user.user_metadata.avatar_url || '',
          provider: session.user.app_metadata.provider as any || 'email'
        });
        setEmail(session.user.email || '');
      }
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setIsLoggedIn(true);
        setUserProfile({
          name: session.user.user_metadata.full_name || 'Usuario',
          email: session.user.email || '',
          avatar: session.user.user_metadata.avatar_url || '',
          provider: session.user.app_metadata.provider as any || 'email'
        });
        setEmail(session.user.email || '');
      } else {
        setIsLoggedIn(false);
        setUserProfile(null);
        setEmail('');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Cleanup payment modal state on close
  useEffect(() => {
    if (!showPaymentModal) {
      const timer = setTimeout(() => {
        // No limpiamos el email si está logueado para mantener la sesión "viva" en la UI
        if (!isLoggedIn) {
          setEmail('');
        }
        setEmailError('');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [showPaymentModal, isLoggedIn]);

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

  const handleAuthSuccess = (email: string, name: string) => {
    setIsLoggedIn(true);
    setUserProfile({
      name: name,
      email: email,
      avatar: '',
      provider: 'google' // simulado o 'email' si tuviéramos ese tipo
    });
    setEmail(email);
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setLoginProcessing(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err) {
      console.error('Social Login Error:', err);
      setLoginProcessing(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
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
    if (targetId === 'faq' || targetId === 'preguntas') targetId = 'faq';
    if (targetId === 'curriculum' || targetId === 'el manual') targetId = 'curriculum';
    if (targetId === 'social-proof' || targetId === 'comunidad') targetId = 'social-proof';
    if (targetId === 'process' || targetId === 'pasos') targetId = 'process';

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

      <Navbar
        scrollToSection={scrollToSection}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onLoginClick={() => setShowAuthModal(true)}
        isLoggedIn={isLoggedIn}
        userProfile={userProfile}
      />

      {/* Hero Section - Keeps eager loading for LCP */}
      <Hero
        y={y}
        currentParticipants={currentParticipants}
        progressPercentage={progressPercentage}
        isHoveringProgress={isHoveringProgress}
        setIsHoveringProgress={setIsHoveringProgress}
        scrollToSection={scrollToSection}
      />

      {/* Lazy Loaded Sections */}
      <Suspense fallback={<SectionLoader />}>
        <SocialProof />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <Process />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <Mission scrollToSection={scrollToSection} />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <Curriculum />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <Features features={FEATURES} setSelectedFeature={setSelectedFeature} />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <Team />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <Giveaway />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <LeadMagnet />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <Download
          purchased={purchased}
          purchasing={purchasing}
          handleOneTimeDownload={handleOneTimeDownload}
          setShowPaymentModal={setShowPaymentModal}
          currentParticipants={currentParticipants}
        />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <FAQ />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <Legal />
      </Suspense>

      <Footer />

      <Suspense fallback={null}>
        <WinnerAnnouncement
          showWinnerAnnouncement={showWinnerAnnouncement}
          setShowWinnerAnnouncement={setShowWinnerAnnouncement}
        />
      </Suspense>

      <WinnerAnnouncement
        showWinnerAnnouncement={showWinnerAnnouncement}
        setShowWinnerAnnouncement={setShowWinnerAnnouncement}
      />

      <PaymentModal
        showPaymentModal={showPaymentModal}
        setShowPaymentModal={setShowPaymentModal}
        isLoggedIn={isLoggedIn}
        userProfile={userProfile}
        handleSocialLogin={handleSocialLogin}
        handleLogout={handleLogout}
        loginProcessing={loginProcessing}
        email={email}
        setEmail={setEmail}
        emailError={emailError}
        setEmailError={setEmailError}
      />

      <AuthModal
        showAuthModal={showAuthModal}
        setShowAuthModal={setShowAuthModal}
        onLoginSuccess={handleAuthSuccess}
        handleSocialLogin={handleSocialLogin}
        loginProcessing={loginProcessing}
      />

      <FeatureModal
        selectedFeature={selectedFeature}
        setSelectedFeature={setSelectedFeature}
        navigateFeature={navigateFeature}
        scrollToSection={scrollToSection}
      />
    </div>
  );
};

export default App;

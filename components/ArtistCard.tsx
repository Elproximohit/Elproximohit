/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FeatureItem } from '../types';
import { CheckCircle, Share2, Check, Copy, Mail, MessageCircle, Twitter, X, MessageSquare } from 'lucide-react';

interface FeatureCardProps {
  artist: FeatureItem;
  onClick: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ artist, onClick }) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const shareData = {
    title: 'El Proximo Hit',
    text: `Mira esto: ${artist.title} - ${artist.description}`,
    url: typeof window !== 'undefined' ? window.location.href : '',
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowShareMenu(!showShareMenu);
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleSocialShare = (platform: 'email' | 'whatsapp' | 'twitter' | 'sms', e: React.MouseEvent) => {
    e.stopPropagation();
    let url = '';
    const encodedText = encodeURIComponent(shareData.text);
    const encodedUrl = encodeURIComponent(shareData.url);

    switch (platform) {
      case 'email':
        url = `mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodedText}%0A%0A${encodedUrl}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'sms':
        url = `sms:?&body=${encodedText}%20${encodedUrl}`;
        break;
    }

    if (url) {
      window.open(url, '_blank');
      setShowShareMenu(false);
    }
  };

  return (
    <motion.div
      className="group relative h-[400px] md:h-[500px] w-full overflow-hidden border-b md:border-r border-white/10 bg-black cursor-pointer"
      initial="rest"
      whileHover="hover"
      whileTap="hover"
      animate="rest"
      data-hover="true"
      onClick={onClick}
    >
      {/* Image Background with Skeleton + Blur */}
      <div className="absolute inset-0 overflow-hidden">
        {!loaded && (
          <div className="absolute inset-0 bg-gray-800 animate-pulse" />
        )}

        <motion.img
          src={artist.image}
          alt={artist.title}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`h-full w-full object-cover transition-transform duration-700 ease-out 
            ${loaded ? 'blur-0 opacity-100' : 'blur-sm opacity-0'}`}
          variants={{
            rest: { scale: 1, opacity: 0.4, filter: 'grayscale(100%)' },
            hover: { scale: 1.07, opacity: 0.85, filter: 'grayscale(0%)' },
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
        <motion.div
          className="absolute inset-0 bg-black/50 transition-colors duration-500"
          variants={{
            rest: { backgroundColor: 'rgba(0,0,0,0.5)' },
            hover: { backgroundColor: 'rgba(255,0,0,0.1)' },
          }}
        />
      </div>

      {/* Overlay Info */}
      <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between pointer-events-none">
        <div className="flex justify-between items-start relative z-20">
           <span className="text-xs font-mono border border-[#FF00FF]/50 text-[#FF00FF] px-2 py-1 rounded-sm backdrop-blur-md uppercase tracking-wider">
             {artist.category}
           </span>
           
           <div className="flex items-center gap-3 relative">
             <motion.button
               onClick={handleShareClick}
               className={`pointer-events-auto p-2 rounded-full border transition-colors backdrop-blur-md z-10 ${showShareMenu ? 'bg-white text-black border-white' : 'bg-black/50 border-white/20 text-white hover:bg-white hover:text-black'}`}
               whileHover={{ scale: 1.1 }}
               whileTap={{ scale: 0.9 }}
               aria-label="Compartir"
               data-hover="true"
             >
                {showShareMenu ? <X className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
             </motion.button>

             {/* Share Menu */}
             <AnimatePresence>
               {showShareMenu && (
                 <motion.div
                   initial={{ opacity: 0, scale: 0.9, y: 10, x: 10 }}
                   animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                   exit={{ opacity: 0, scale: 0.9, y: 10, x: 10 }}
                   className="absolute top-12 right-0 bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl p-2 w-48 shadow-2xl pointer-events-auto flex flex-col gap-1 overflow-hidden"
                 >
                   <button
                     onClick={handleCopy}
                     className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-white/10 text-sm text-gray-200 hover:text-white transition-colors text-left"
                   >
                     {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                     {copied ? 'Copiado' : 'Copiar Link'}
                   </button>

                   <div className="h-px bg-white/10 my-1" />

                   <button
                     onClick={(e) => handleSocialShare('whatsapp', e)}
                     className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-[#25D366]/20 text-sm text-gray-200 hover:text-[#25D366] transition-colors text-left"
                   >
                     <MessageCircle className="w-4 h-4" /> WhatsApp
                   </button>
                   
                   <button
                     onClick={(e) => handleSocialShare('email', e)}
                     className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-white/10 text-sm text-gray-200 hover:text-white transition-colors text-left"
                   >
                     <Mail className="w-4 h-4" /> Email
                   </button>

                   <button
                     onClick={(e) => handleSocialShare('sms', e)}
                     className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-white/10 text-sm text-gray-200 hover:text-white transition-colors text-left md:hidden"
                   >
                     <MessageSquare className="w-4 h-4" /> SMS
                   </button>
                   
                   <button
                     onClick={(e) => handleSocialShare('twitter', e)}
                     className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-[#1DA1F2]/20 text-sm text-gray-200 hover:text-[#1DA1F2] transition-colors text-left"
                   >
                     <Twitter className="w-4 h-4" /> Twitter
                   </button>
                 </motion.div>
               )}
             </AnimatePresence>

             <motion.div
               variants={{
                 rest: { opacity: 0, x: 20, y: -20 },
                 hover: { opacity: 1, x: 0, y: 0 }
               }}
               className="bg-[#FF0000] text-white rounded-full p-2 will-change-transform"
             >
               <CheckCircle className="w-6 h-6" />
             </motion.div>
           </div>
        </div>

        <div>
          <div className="overflow-hidden">
            <motion.h3 
              className="font-heading text-2xl md:text-3xl font-bold uppercase text-white mix-blend-screen will-change-transform leading-tight"
              variants={{
                rest: { y: 0 },
                hover: { y: -5 }
              }}
              transition={{ duration: 0.4 }}
            >
              {artist.title}
            </motion.h3>
          </div>
          <motion.p 
            className="text-sm font-medium uppercase tracking-widest text-[#FF00FF] mt-2 will-change-transform line-clamp-2"
            variants={{
              rest: { opacity: 0.7, y: 0 },
              hover: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {artist.description}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};

export default FeatureCard;

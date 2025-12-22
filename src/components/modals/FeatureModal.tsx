import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, ArrowLeft } from 'lucide-react';
import { FeatureItem } from '../../types';

interface FeatureModalProps {
    selectedFeature: FeatureItem | null;
    setSelectedFeature: (feature: FeatureItem | null) => void;
    navigateFeature: (direction: 'next' | 'prev') => void;
    scrollToSection: (id: string) => void;
}

const FeatureModal: React.FC<FeatureModalProps> = ({ selectedFeature, setSelectedFeature, navigateFeature, scrollToSection }) => {
    return (
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
    );
};

export default FeatureModal;

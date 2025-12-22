import React from 'react';
import FeatureCard from '../ArtistCard';
import { FeatureItem } from '../../types';

interface FeaturesProps {
    features: FeatureItem[];
    setSelectedFeature: (feature: FeatureItem) => void;
}

const Features: React.FC<FeaturesProps> = ({ features, setSelectedFeature }) => {
    return (
        <section id="features" className="relative z-10 py-20 md:py-32">
            <div className="max-w-[1600px] mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16 px-4">
                    <h2 className="text-5xl md:text-7xl font-heading font-bold uppercase leading-[0.9] w-full md:w-auto">
                        Qué hay <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF0000] to-[#FF00FF]">Dentro</span>
                    </h2>
                    <p className="text-gray-400 font-mono text-sm md:text-base max-w-md mt-4 md:mt-0 text-right">Todo lo que necesitas para transformar tu demo en un éxito de radio.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-white/10 bg-black/40 backdrop-blur-sm">
                    {features.map((feature) => (
                        <FeatureCard key={feature.id} artist={feature} onClick={() => setSelectedFeature(feature)} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;

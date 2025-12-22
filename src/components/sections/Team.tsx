import React from 'react';
import FeatureCard from '../ArtistCard';
import { FeatureItem } from '../../types';
import { quienesSomos } from '../../data/content';

const Team: React.FC = () => {
    return (
        <section id="quienes-somos" className="relative z-10 py-20 md:py-32">
            <div className="max-w-[1600px] mx-auto px-4 md:px-6">

                <div className="mb-12">
                    <h2 className="text-5xl md:text-7xl font-heading font-bold uppercase">
                        Quiénes <span className="text-[#FF0000]">Somos</span>
                    </h2>
                    <p className="text-gray-400 mt-4 max-w-xl">
                        El equipo detrás de El Próximo Hit.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-white/10">
                    {quienesSomos.map((member) => (
                        <FeatureCard
                            key={member.id}
                            artist={member}
                            onClick={() => { }}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Team;

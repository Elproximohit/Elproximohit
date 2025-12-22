import React from 'react';
import { Disc, Music } from 'lucide-react';

const Footer: React.FC = () => {
    return (
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
    );
};

export default Footer;

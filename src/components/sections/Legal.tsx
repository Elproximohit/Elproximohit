import React from 'react';
import { Scale, Gavel, UserCheck, FileText, AlertTriangle } from 'lucide-react';

const Legal: React.FC = () => {
    return (
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
                            Esta acción promocional se rige por las leyes y reglamentos de <strong>Prácticas Comerciales Aplicables</strong>. Cualquier controversia será resuelta exclusivamente ante los tribunales competentes del Estado Libre Asociado de Puerto Rico.
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
    );
};

export default Legal;

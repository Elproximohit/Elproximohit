/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Mail, Send, AlertCircle, Check } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "¿Cómo recibo la Plantilla de Pro Tools y la Guía?",
    answer: "Inmediatamente después de tu compra, recibirás un correo electrónico automático a la dirección que registres en el pago. Este correo contiene los enlaces de descarga directa para la Guía PDF y el archivo de sesión de la plantilla."
  },
  {
    question: "¿Qué pasa si no uso Pro Tools?",
    answer: "¡No hay problema! El valor principal es la Guía PDF 'Secretos de Mezcla', que enseña conceptos universales aplicables en FL Studio, Ableton, Logic o cualquier DAW. La plantilla es un bono extra para usuarios de Pro Tools."
  },
  {
    question: "¿Cómo funciona el sorteo?",
    answer: "Cada compra de $10 cuenta como una (1) entrada automática. Nuestro sistema registra tu correo electrónico en la base de datos del sorteo. Cuando alcancemos las 1,000 ventas, un sistema aleatorio seleccionará un ganador que será contactado vía email y anunciado en nuestras redes sociales."
  },
  {
    question: "¿Es seguro el pago?",
    answer: "Absolutamente. Usamos procesadores de pago líderes en la industria (PayPal y Stripe). Nosotros no almacenamos tu información bancaria; solo guardamos tu email para enviarte los productos y registrarte en el sorteo."
  },
  {
    question: "¿Puedo comprar más de una vez para tener más oportunidades?",
    answer: "Sí. Cada transacción única genera una nueva entrada en nuestra base de datos, aumentando tus probabilidades matemáticas de ganar la producción completa."
  }
];

const FAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Contact Form State
  const [contactEmail, setContactEmail] = useState('');
  const [contactQuestion, setContactQuestion] = useState('');
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [emailError, setEmailError] = useState('');

  const toggleIndex = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Reset previous errors
    setEmailError('');

    // Validation
    if (!contactEmail) {
      setEmailError('El correo es obligatorio.');
      return;
    }
    if (!validateEmail(contactEmail)) {
      setEmailError('Por favor ingresa un correo electrónico válido.');
      return;
    }
    if (!contactQuestion.trim()) {
      // Small inline check for question content
      return;
    }

    setFormStatus('submitting');

    // Simulate API call
    setTimeout(() => {
      console.log(`Question submitted: ${contactQuestion} from ${contactEmail}`);
      setFormStatus('success');
      setContactEmail('');
      setContactQuestion('');

      // Reset success message after 5 seconds
      setTimeout(() => setFormStatus('idle'), 5000);
    }, 1500);
  };

  return (
    <section id="faq" className="relative z-10 py-20 px-4 md:px-6 bg-black border-t border-white/10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-10 justify-center">
          <HelpCircle className="w-6 h-6 text-[#FF0000]" />
          <h2 className="text-3xl md:text-5xl font-heading font-bold uppercase text-white text-center">
            Preguntas <span className="text-[#FF00FF]">Frecuentes</span>
          </h2>
        </div>

        {/* Accordion List */}
        <div className="space-y-4 mb-20">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-white/10 rounded-xl overflow-hidden bg-white/5 hover:border-[#FF0000]/50 transition-colors duration-300"
            >
              <button
                onClick={() => toggleIndex(index)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <span className="text-lg font-bold text-gray-200 font-heading tracking-wide pr-4">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: activeIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className={`w-5 h-5 ${activeIndex === index ? 'text-[#FF00FF]' : 'text-gray-500'}`} />
                </motion.div>
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 pt-0 text-gray-400 font-light leading-relaxed border-t border-white/5 mt-2">
                      <div className="pt-4">
                        {faq.answer}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Contact Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-zinc-900/50 border border-white/10 rounded-2xl p-8 md:p-10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF00FF]/10 blur-[80px] rounded-full pointer-events-none" />

          <div className="relative z-10 text-center mb-8">
            <h3 className="text-2xl font-heading font-bold mb-2 text-white">¿No encuentras tu respuesta?</h3>
            <p className="text-gray-400 text-sm">Déjanos tu duda y te responderemos por correo.</p>
          </div>

          {formStatus === 'success' ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center justify-center py-10 gap-4 text-green-500"
            >
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-2">
                <Check className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-white">¡Mensaje Enviado!</h4>
              <p className="text-gray-400 text-center max-w-sm">
                Hemos recibido tu pregunta. Te contactaremos a tu correo electrónico pronto.
              </p>
              <button
                onClick={() => setFormStatus('idle')}
                className="mt-4 text-sm underline text-white hover:text-[#FF00FF]"
              >
                Enviar otra pregunta
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleContactSubmit} className="max-w-md mx-auto space-y-4">
              <div className="space-y-2 text-left">
                <label className="text-xs uppercase tracking-widest text-gray-500 font-bold ml-1">Tu Correo Electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => {
                      setContactEmail(e.target.value);
                      if (emailError) setEmailError('');
                    }}
                    placeholder="ejemplo@email.com"
                    className={`w-full bg-black/50 border ${emailError ? 'border-[#FF0000]' : 'border-white/20'} rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#FF00FF] transition-colors placeholder:text-gray-600`}
                  />
                </div>
                {emailError && (
                  <div className="flex items-center gap-2 text-[#FF0000] text-xs mt-1 animate-pulse">
                    <AlertCircle className="w-3 h-3" />
                    <span>{emailError}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 text-left">
                <label className="text-xs uppercase tracking-widest text-gray-500 font-bold ml-1">Tu Pregunta</label>
                <textarea
                  rows={3}
                  value={contactQuestion}
                  onChange={(e) => setContactQuestion(e.target.value)}
                  placeholder="¿En qué podemos ayudarte?"
                  className="w-full bg-black/50 border border-white/20 rounded-lg p-4 text-white focus:outline-none focus:border-[#FF00FF] transition-colors placeholder:text-gray-600 resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={formStatus === 'submitting'}
                className="w-full bg-white text-black font-bold uppercase tracking-widest py-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-wait"
              >
                {formStatus === 'submitting' ? 'Enviando...' : (
                  <>Enviar Mensaje <Send className="w-4 h-4" /></>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;

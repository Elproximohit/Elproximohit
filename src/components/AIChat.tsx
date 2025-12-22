import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage } from '../types';

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: '🔥 ¿Buscas el sonido pro? Soy Hit Maker. Pregúntame sobre el sorteo, la plantilla o el precio.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current;
      chatContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const getBotResponse = (text: string): string => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('precio') || lowerText.includes('costo') || lowerText.includes('$')) return "💰 El paquete completo cuesta solo $10 USD.";
    if (lowerText.includes('sorteo') || lowerText.includes('ganar')) return "🏆 ¡El premio es una producción completa! Se elige un ganador cada 1,000 ventas.";
    if (lowerText.includes('plantilla') || lowerText.includes('pro tools')) return "🎚️ La plantilla viene pre-mezclada con el ruteo de los pros.";
    return "🎧 Soy Hit Maker. ¿Te interesa la Guía, la Plantilla o el Sorteo?";
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setTimeout(scrollToBottom, 100);

    setTimeout(() => {
      const responseText = getBotResponse(userMessage.text);
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-end pointer-events-auto">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 w-[90vw] md:w-96 bg-black/90 backdrop-blur-xl border border-[#FF0000]/30 rounded-2xl overflow-hidden shadow-2xl shadow-[#FF0000]/20"
          >
            <div className="bg-gradient-to-r from-[#8B0000] to-black p-4 flex justify-between items-center border-b border-[#FF0000]/20">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FF00FF] animate-pulse" />
                <h3 className="font-heading font-bold text-white tracking-wider">HIT MAKER BOT</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div ref={chatContainerRef} className="h-64 md:h-80 overflow-y-auto p-4 space-y-3 scroll-smooth">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-[#FF0000] text-white rounded-tr-none' : 'bg-white/10 text-gray-200 rounded-tl-none border border-white/5'}`}>{msg.text}</div>
                </div>
              ))}
              {isLoading && <div className="text-gray-500 text-xs p-2">Escribiendo...</div>}
            </div>
            <div className="p-3 border-t border-white/10 bg-black flex gap-2">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Escribe aquí..." className="flex-1 bg-transparent text-white placeholder-white/30 text-sm focus:outline-none" />
              <button onClick={handleSend} className="bg-[#FF0000] p-2 rounded-lg"><Send className="w-4 h-4 text-white" /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button whileHover={{ scale: 1.1 }} onClick={() => setIsOpen(!isOpen)} className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FF0000] to-[#FF00FF] flex items-center justify-center shadow-lg border border-white/20 z-50">
        {isOpen ? <X className="w-5 h-5 text-white" /> : <MessageCircle className="w-5 h-5 text-white" />}
      </motion.button>
    </div>
  );
};
export default AIChat;

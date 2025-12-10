import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

let chatSession: Chat | null = null;

export const initializeChat = (): Chat => {
  if (chatSession) return chatSession;

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `Eres 'Hit Maker', el Asistente de IA para la guía de producción musical 'EL PROXIMO HIT'.
      
      El Producto:
      - Una Guía PDF + Plantilla DAW Pro Tools.
      - Precio: $10.
      - Incentivo: La compra ingresa al cliente en un sorteo.
      
      El Sorteo:
      - Premio: Un paquete completo de producción de canciones (Coaching, Productor, Tiempo de Estudio, Mezcla, Masterización, Video).
      - Ganadores: 1 ganador por cada 1,000 participantes.
      - Notificación: A través de las redes sociales.
      
      Tono: Profesional, alentador, experto en la industria musical. Usa emojis como 🎚️, 🎹, 🎧, 🔥.
      Idioma: Español.
      
      Objetivo: Animar a los usuarios a comprar la guía de $10 para mejorar sus habilidades de producción y entrar en el sorteo.`,
    },
  });

  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Sistemas de estudio desconectados. (Falta API Key en archivo .env)";
  }

  try {
    const chat = initializeChat();
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "Conexión con la sala de control perdida.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Señal interrumpida. Por favor, intenta de nuevo.";
  }
};
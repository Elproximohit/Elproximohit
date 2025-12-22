import { FeatureItem } from '../types';

// --- IMÁGENES MISIÓN / QUIÉNES SOMOS ---
export const missionImages = {
    bRed: '/images/bred.jpg',
    erios: '/images/erios.jpg',
};

// --- CONFIGURACIÓN DE PAGOS ---
export const MAX_PARTICIPANTS = 1000;
export const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/test_6oUcN6a2g2wD4Ur10fcIE00";
export const PAYPAL_LINK = "https://www.paypal.me/Bred210";
export const PDF_DOWNLOAD_LINK = "https://drive.google.com/uc?export=download&id=16FriG8rNgc-tRi-ff1w2rY0CDv2nZnUi";

export const FEATURES: FeatureItem[] = [
    {
        id: '1',
        title: 'Plantilla de Pro Tools',
        category: 'Esenciales DAW',
        image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1000&auto=format&fit=crop',
        description: 'La estructura de sesión exacta usada en los éxitos número uno. Busses pre-enrutados, cadenas de efectos y trucos de flujo de trabajo.'
    },
    {
        id: '2',
        title: 'Secretos de Mezcla',
        category: 'Guía PDF',
        image: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?q=80&w=1000&auto=format&fit=crop',
        description: 'Un desglose completo de técnicas de EQ, Compresión y Procesamiento Espacial para que tus pistas suenen listas para la radio.'
    },
    {
        id: '3',
        title: 'Cadena Vocal',
        category: 'Preset',
        image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1000&auto=format&fit=crop',
        description: 'Consigue ese sonido vocal moderno y nítido al instante. Incluye presets para voces principales, ad-libs y armonías.'
    },
    {
        id: '4',
        title: 'Masterización 101',
        category: 'Capítulo de Guía',
        image: 'https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=1000&auto=format&fit=crop',
        description: 'Aprende a llevar tus pistas a un volumen comercial sin sacrificar la dinámica. El pulido final que tu música necesita.'
    },
];

// --- ARRAY DE QUIÉNES SOMOS ---
export const quienesSomos: FeatureItem[] = [
    {
        id: 'bRed',
        title: 'B-RED',
        description: 'Artista y escritor puertorriqueño con más de una década en el juego. Como ingeniero de audio graduado, combina la técnica precisa con la pasión artística para crear sonidos que definen géneros.',
        image: missionImages.bRed,
        category: 'Fundador & Ing. Audio',
    },
    {
        id: 'erios',
        title: 'ERIOS',
        description: 'Productor visionario que ha colaborado con gigantes como Joyce Santana, Brray y Casper Mágico. Su oído para el hit es inigualable y será el encargado de grabar y producir la canción ganadora.',
        image: missionImages.erios,
        category: 'Productor Ejecutivo',
    },
];

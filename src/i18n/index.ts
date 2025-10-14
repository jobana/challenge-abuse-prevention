import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { detectLanguage } from './detector';

// Importar traducciones
import esAR from './locales/es-AR.json';
import ptBR from './locales/pt-BR.json';

const resources = {
  'es-AR': {
    translation: esAR,
  },
  'pt-BR': {
    translation: ptBR,
  },
};

// Detectar idioma inicial
const detectedLanguage = detectLanguage();

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: detectedLanguage,
    fallbackLng: 'es-AR',
    
    // Configuración del detector
    detection: {
      order: ['querystring', 'localStorage', 'navigator', 'htmlTag'],
      lookupQuerystring: 'locale',
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },
    
    // Configuración de interpolación
    interpolation: {
      escapeValue: false, // React ya escapa por defecto
    },
    
    // Configuración de namespaces
    defaultNS: 'translation',
    ns: ['translation'],
    
    // Configuración de debug (solo en desarrollo)
    debug: process.env.NODE_ENV === 'development',
    
    // Configuración de react
    react: {
      useSuspense: false, // Evitar problemas con SSR
    },
  });

export default i18n;

/**
 * Detector de idioma basado en dominio y otros factores
 */

export type SupportedLocale = 'es-AR' | 'pt-BR';

export const SUPPORTED_LOCALES: SupportedLocale[] = ['es-AR', 'pt-BR'];

export const DEFAULT_LOCALE: SupportedLocale = 'es-AR';

/**
 * Mapeo de dominios a idiomas
 */
const DOMAIN_LOCALE_MAP: Record<string, SupportedLocale> = {
  'mercadolibre.com.ar': 'es-AR',
  'mercadolivre.com.br': 'pt-BR',
  'localhost': 'es-AR', // Para desarrollo
};

/**
 * Detecta el idioma basado en el dominio del hostname
 */
export const detectLanguageFromDomain = (): SupportedLocale | null => {
  if (typeof window === 'undefined') {
    return null; // SSR
  }
  
  const hostname = window.location.hostname;
  
  // Buscar coincidencia exacta
  if (DOMAIN_LOCALE_MAP[hostname]) {
    return DOMAIN_LOCALE_MAP[hostname];
  }
  
  // Buscar coincidencia parcial (para subdominios)
  for (const [domain, locale] of Object.entries(DOMAIN_LOCALE_MAP)) {
    if (hostname.includes(domain)) {
      return locale;
    }
  }
  
  return null;
};

/**
 * Detecta el idioma desde query params
 */
export const detectLanguageFromQuery = (): SupportedLocale | null => {
  if (typeof window === 'undefined') {
    return null; // SSR
  }
  
  const urlParams = new URLSearchParams(window.location.search);
  const locale = urlParams.get('locale') as SupportedLocale;
  
  if (locale && SUPPORTED_LOCALES.includes(locale)) {
    return locale;
  }
  
  return null;
};

/**
 * Detecta el idioma desde localStorage
 */
export const detectLanguageFromStorage = (): SupportedLocale | null => {
  if (typeof window === 'undefined') {
    return null; // SSR
  }
  
  try {
    const stored = localStorage.getItem('i18nextLng') as SupportedLocale;
    if (stored && SUPPORTED_LOCALES.includes(stored)) {
      return stored;
    }
  } catch (error) {
    console.warn('Error reading from localStorage:', error);
  }
  
  return null;
};

/**
 * Detecta el idioma desde el navegador
 */
export const detectLanguageFromBrowser = (): SupportedLocale | null => {
  if (typeof window === 'undefined') {
    return null; // SSR
  }
  
  const browserLang = navigator.language || navigator.languages?.[0];
  
  if (!browserLang) {
    return null;
  }
  
  // Mapear códigos de idioma del navegador a nuestros locales
  const langMap: Record<string, SupportedLocale> = {
    'es': 'es-AR',
    'es-AR': 'es-AR',
    'es-ES': 'es-AR',
    'es-MX': 'es-AR',
    'pt': 'pt-BR',
    'pt-BR': 'pt-BR',
    'pt-PT': 'pt-BR',
  };
  
  // Buscar coincidencia exacta
  if (langMap[browserLang]) {
    return langMap[browserLang];
  }
  
  // Buscar coincidencia parcial (solo el idioma principal)
  const mainLang = browserLang.split('-')[0];
  if (langMap[mainLang]) {
    return langMap[mainLang];
  }
  
  return null;
};

/**
 * Función principal de detección de idioma
 * Orden de prioridad:
 * 1. Query param (?locale=)
 * 2. Dominio
 * 3. localStorage
 * 4. Navegador
 * 5. Fallback por defecto
 */
export const detectLanguage = (): SupportedLocale => {
  // 1. Query param
  const queryLang = detectLanguageFromQuery();
  if (queryLang) {
    return queryLang;
  }
  
  // 2. Dominio
  const domainLang = detectLanguageFromDomain();
  if (domainLang) {
    return domainLang;
  }
  
  // 3. localStorage
  const storageLang = detectLanguageFromStorage();
  if (storageLang) {
    return storageLang;
  }
  
  // 4. Navegador
  const browserLang = detectLanguageFromBrowser();
  if (browserLang) {
    return browserLang;
  }
  
  // 5. Fallback
  return DEFAULT_LOCALE;
};

/**
 * Guarda el idioma seleccionado en localStorage
 */
export const saveLanguagePreference = (locale: SupportedLocale): void => {
  if (typeof window === 'undefined') {
    return; // SSR
  }
  
  try {
    localStorage.setItem('i18nextLng', locale);
  } catch (error) {
    console.warn('Error saving language preference:', error);
  }
};

/**
 * Obtiene información del idioma actual
 */
export const getLanguageInfo = (locale: SupportedLocale) => {
  const info = {
    'es-AR': {
      name: 'Español (Argentina)',
      flag: '🇦🇷',
      domain: 'mercadolibre.com.ar',
    },
    'pt-BR': {
      name: 'Português (Brasil)',
      flag: '🇧🇷',
      domain: 'mercadolivre.com.br',
    },
  };
  
  return info[locale];
};

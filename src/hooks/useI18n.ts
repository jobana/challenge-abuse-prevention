import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import { SupportedLocale, SUPPORTED_LOCALES, saveLanguagePreference, getLanguageInfo } from '../i18n/detector';

/**
 * Hook personalizado para i18n con funcionalidades adicionales
 */
export const useI18n = () => {
  const { t, i18n } = useTranslation();

  /**
   * Cambia el idioma y guarda la preferencia
   */
  const changeLanguage = useCallback(async (locale: SupportedLocale) => {
    if (!SUPPORTED_LOCALES.includes(locale)) {
      console.warn(`Unsupported locale: ${locale}`);
      return;
    }

    try {
      await i18n.changeLanguage(locale);
      saveLanguagePreference(locale);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  }, [i18n]);

  /**
   * Obtiene información del idioma actual
   */
  const getCurrentLanguageInfo = useCallback(() => {
    const currentLocale = i18n.language as SupportedLocale;
    return getLanguageInfo(currentLocale);
  }, [i18n.language]);

  /**
   * Verifica si el idioma actual es RTL
   */
  const isRTL = useCallback(() => {
    // Por ahora, ninguno de nuestros idiomas soportados es RTL
    return false;
  }, []);

  /**
   * Formatea un número según el idioma actual
   */
  const formatNumber = useCallback((number: number, options?: Intl.NumberFormatOptions) => {
    return new Intl.NumberFormat(i18n.language, options).format(number);
  }, [i18n.language]);

  /**
   * Formatea una fecha según el idioma actual
   */
  const formatDate = useCallback((date: Date | string, options?: Intl.DateTimeFormatOptions) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(i18n.language, options).format(dateObj);
  }, [i18n.language]);

  /**
   * Formatea una moneda según el idioma actual
   */
  const formatCurrency = useCallback((amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat(i18n.language, {
      style: 'currency',
      currency,
    }).format(amount);
  }, [i18n.language]);

  /**
   * Traduce con interpolación de variables
   */
  const translate = useCallback((key: string, options?: any) => {
    return t(key, options);
  }, [t]);

  /**
   * Verifica si una clave de traducción existe
   */
  const hasTranslation = useCallback((key: string) => {
    return t(key) !== key;
  }, [t]);

  return {
    // Funciones básicas de i18next
    t: translate,
    i18n,
    ready: i18n.isInitialized,
    language: i18n.language as SupportedLocale,
    
    // Funciones personalizadas
    changeLanguage,
    getCurrentLanguageInfo,
    isRTL,
    formatNumber,
    formatDate,
    formatCurrency,
    hasTranslation,
    
    // Información del idioma actual
    currentLanguageInfo: getCurrentLanguageInfo(),
    
    // Idiomas soportados
    supportedLocales: SUPPORTED_LOCALES,
  };
};

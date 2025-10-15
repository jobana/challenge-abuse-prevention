import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import { SupportedLocale, SUPPORTED_LOCALES, saveLanguagePreference } from '../i18n/detector';

/**
 * Hook simplificado para i18n
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

  return {
    t,
    i18n,
    ready: i18n.isInitialized,
    language: i18n.language as SupportedLocale,
    changeLanguage,
  };
};

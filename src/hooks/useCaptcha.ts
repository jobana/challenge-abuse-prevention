import { useRef, useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export interface CaptchaState {
  isLoaded: boolean;
  isVerified: boolean;
  error: string | null;
  token: string | null;
}

export const useCaptcha = () => {
  const { t } = useTranslation();
  const captchaRef = useRef<any>(null);
  
  const [captchaState, setCaptchaState] = useState<CaptchaState>({
    isLoaded: false,
    isVerified: false,
    error: null,
    token: null,
  });

  // Cargar el script de reCAPTCHA dinámicamente
  useEffect(() => {
    const loadCaptchaScript = () => {
      // Verificar si ya está cargado
      if (window.grecaptcha) {
        setCaptchaState(prev => ({ ...prev, isLoaded: true }));
        return;
      }

      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=explicit&hl=${t('captcha.language')}`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        setCaptchaState(prev => ({ ...prev, isLoaded: true }));
      };
      
      script.onerror = () => {
        setCaptchaState(prev => ({ 
          ...prev, 
          error: t('captcha.errors.loadFailed') 
        }));
      };

      document.head.appendChild(script);
    };

    loadCaptchaScript();
  }, [t]);

  // Callback cuando el CAPTCHA se verifica exitosamente
  const onCaptchaSuccess = useCallback((token: string) => {
    setCaptchaState(prev => ({
      ...prev,
      isVerified: true,
      token,
      error: null,
    }));
  }, []);

  // Callback cuando el CAPTCHA expira
  const onCaptchaExpired = useCallback(() => {
    setCaptchaState(prev => ({
      ...prev,
      isVerified: false,
      token: null,
    }));
  }, []);

  // Callback cuando hay un error en el CAPTCHA
  const onCaptchaError = useCallback((error: string) => {
    setCaptchaState(prev => ({
      ...prev,
      isVerified: false,
      token: null,
      error: error || t('captcha.errors.verificationFailed'),
    }));
  }, [t]);

  // Ejecutar el CAPTCHA manualmente
  const executeCaptcha = useCallback(async (): Promise<string | null> => {
    if (!captchaState.isLoaded || !captchaRef.current) {
      throw new Error(t('captcha.errors.notLoaded'));
    }

    try {
      const token = await captchaRef.current.executeAsync();
      if (token) {
        onCaptchaSuccess(token);
        return token;
      }
      throw new Error(t('captcha.errors.noToken'));
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : t('captcha.errors.executionFailed');
      onCaptchaError(errorMessage);
      return null;
    }
  }, [captchaState.isLoaded, onCaptchaSuccess, onCaptchaError, t]);

  // Resetear el CAPTCHA
  const resetCaptcha = useCallback(() => {
    if (captchaRef.current) {
      captchaRef.current.reset();
    }
    setCaptchaState(prev => ({
      ...prev,
      isVerified: false,
      token: null,
      error: null,
    }));
  }, []);

  // Verificar si el CAPTCHA está listo para usar
  const isCaptchaReady = captchaState.isLoaded && !captchaState.error;

  // Obtener la clave pública del CAPTCHA desde las variables de entorno
  const getCaptchaSiteKey = (): string => {
    const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
    if (!siteKey) {
      console.warn('VITE_RECAPTCHA_SITE_KEY no está definida en las variables de entorno');
      return '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'; // Clave de prueba de Google
    }
    return siteKey;
  };

  return {
    // Referencias
    captchaRef,
    
    // Estado
    isCaptchaLoaded: captchaState.isLoaded,
    isCaptchaVerified: captchaState.isVerified,
    captchaError: captchaState.error,
    captchaToken: captchaState.token,
    isCaptchaReady,
    
    // Funciones
    executeCaptcha,
    resetCaptcha,
    onCaptchaSuccess,
    onCaptchaExpired,
    onCaptchaError,
    getCaptchaSiteKey,
  };
};

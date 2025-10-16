import { useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export interface CaptchaState {
  isVerified: boolean;
  error: string | null;
  token: string | null;
}

export const useCaptcha = () => {
  const { t } = useTranslation();
  const captchaRef = useRef<any>(null);

  const [captchaState, setCaptchaState] = useState<CaptchaState>({
    isVerified: false,
    error: null,
    token: null,
  });

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
      return '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'; // Clave de prueba de Google
    }
    return siteKey;
  };

  return {
    // Referencias
    captchaRef,

    // Estado
    isCaptchaVerified: captchaState.isVerified,
    captchaError: captchaState.error,
    captchaToken: captchaState.token,

    // Funciones
    executeCaptcha,
    resetCaptcha,
    onCaptchaSuccess,
    onCaptchaExpired,
    onCaptchaError,
    getCaptchaSiteKey,
  };
};

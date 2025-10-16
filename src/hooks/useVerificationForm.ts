import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useCountries } from './useCountries';
import { useCaptcha } from './useCaptcha';
import { DecodedQueryParams } from '../types/queryParams.types';
import { createMicrofrontendOutput, sendMicrofrontendOutput } from '../utils/microfrontendOutput';

// Tipos para el formulario
export interface VerificationFormData {
  name: string;
  country: string;
  address: string;
}

export interface VerificationFormState {
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
}

export const useVerificationForm = (initialData?: DecodedQueryParams) => {
  const { t } = useTranslation();
  const { countries, loading: countriesLoading, error: countriesError } = useCountries();
  const {
    captchaRef,
    isCaptchaVerified,
    captchaToken,
    captchaError,
    resetCaptcha,
    executeCaptcha,
    onCaptchaSuccess,
    onCaptchaExpired,
    onCaptchaError,
    getCaptchaSiteKey
  } = useCaptcha();

  // Esquema de validación con Yup
  const validationSchema = yup.object({
    name: yup
      .string()
      .required(t('form.validation.name.required'))
      .min(2, t('form.validation.name.minLength'))
      .max(100, t('form.validation.name.maxLength'))
      .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, t('form.validation.name.invalid')),
    
    country: yup
      .string()
      .required(t('form.validation.country.required')),
    
    address: yup
      .string()
      .required(t('form.validation.address.required'))
      .min(10, t('form.validation.address.minLength'))
      .max(200, t('form.validation.address.maxLength')),
  });

  // Configurar react-hook-form con datos iniciales de query params
  const form = useForm<VerificationFormData>({
    resolver: yupResolver(validationSchema),
    mode: 'onBlur',
    defaultValues: {
      name: initialData?.customerData
        ? `${initialData.customerData.firstName || ''} ${initialData.customerData.lastName || ''}`.trim()
        : '',
      country: initialData?.customerData?.country || '',
      address: initialData?.shippingData?.address || '',
    },
  });

  const { handleSubmit, formState: rhfFormState, reset, setError, clearErrors } = form;

  // Estado del formulario
  const [formState, setFormState] = useState<VerificationFormState>({
    isSubmitting: false,
    isSuccess: false,
    error: null,
  });

  // Función para enviar el formulario
  const onSubmit = async (data: VerificationFormData) => {
    try {
      setFormState(prev => ({ ...prev, isSubmitting: true, error: null }));

      // Verificar CAPTCHA - el usuario debe haber hecho clic en el checkbox
      if (!isCaptchaVerified || !captchaToken) {
        throw new Error(t('form.errors.captchaRequired'));
      }

      // Enviar a la API
      const response = await fetch('/api/verification/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          captchaToken: captchaToken,
          referrer: initialData?.referrer || '/',
          token: initialData?.token || '',
          customerData: initialData?.customerData || {},
          shippingData: initialData?.shippingData || {},
          billingData: initialData?.billingData || {},
          paymentData: initialData?.paymentData || {},
          orderData: initialData?.orderData || {},
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || t('form.errors.submitFailed'));
      }

      const result = await response.json();

      setFormState(prev => ({
        ...prev,
        isSubmitting: false,
        isSuccess: true
      }));

      // Crear y enviar output del microfrontend
      const microfrontendOutput = createMicrofrontendOutput(
        initialData?.referrer || 1,  // referrer como número
        captchaToken || '',
        true,  // verified = true porque llegó exitosamente
        {
          name: data.name,
          country: data.country,
          address: data.address,
          verificationId: result.data?.id,
          timestamp: result.data?.timestamp,
        }
      );

      sendMicrofrontendOutput(microfrontendOutput);

    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : t('form.errors.submitFailed');
      
      setFormState(prev => ({ 
        ...prev, 
        isSubmitting: false, 
        error: errorMessage 
      }));

      // error de validación del servidor
      if (error instanceof Error && error.message.includes('validation')) {
        
      }
    }
  };

  // Función para resetear el formulario
  const resetForm = () => {
    reset();
    resetCaptcha();
    setFormState({
      isSubmitting: false,
      isSuccess: false,
      error: null,
    });
    clearErrors();
  };

  // Función para validar un campo específico
  const validateField = async (fieldName: keyof VerificationFormData) => {
    try {
      await form.trigger(fieldName);
    } catch (error) {
      // Error silencioso - react-hook-form maneja los errores de validación
    }
  };

  // Función para obtener el estado de validación de un campo
  const getFieldState = (fieldName: keyof VerificationFormData) => {
    const field = rhfFormState.errors[fieldName];
    return {
      hasError: !!field,
      errorMessage: field?.message,
      isValid: !field && rhfFormState.touchedFields[fieldName],
    };
  };

  return {
    // Form methods
    form,
    handleSubmit: handleSubmit(onSubmit),
    resetForm,
    validateField,
    getFieldState,
    
    // Form state
    formState,
    isSubmitting: formState.isSubmitting,
    isSuccess: formState.isSuccess,
    error: formState.error,
    
    // Countries data
    countries,
    countriesLoading,
    countriesError,
    
    // CAPTCHA
    captchaRef,
    isCaptchaVerified,
    captchaError,
    resetCaptcha,
    getCaptchaSiteKey,
    onCaptchaSuccess,
    onCaptchaExpired,
    onCaptchaError,
    
    // Validation state
    isValid: rhfFormState.isValid,
    isDirty: rhfFormState.isDirty,
    touchedFields: rhfFormState.touchedFields,
    errors: rhfFormState.errors,
  };
};

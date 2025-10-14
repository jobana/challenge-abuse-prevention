import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useCountries } from './useCountries';
import { useCaptcha } from './useCaptcha';

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

export const useVerificationForm = () => {
  const { t } = useTranslation();
  const { countries, isLoading: countriesLoading, error: countriesError } = useCountries();
  const { 
    captchaRef, 
    isCaptchaLoaded, 
    isCaptchaVerified, 
    captchaError,
    resetCaptcha,
    executeCaptcha 
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

  // Configurar react-hook-form
  const form = useForm<VerificationFormData>({
    resolver: yupResolver(validationSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      country: '',
      address: '',
    },
  });

  const { handleSubmit, formState, reset, setError, clearErrors } = form;

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

      // Verificar CAPTCHA
      if (!isCaptchaVerified) {
        const captchaToken = await executeCaptcha();
        if (!captchaToken) {
          throw new Error(t('form.errors.captchaRequired'));
        }
      }

      // Simular envío a la API
      const response = await fetch('/api/verification/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          captchaToken: isCaptchaVerified || await executeCaptcha(),
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

      // Resetear formulario después del éxito
      reset();
      resetCaptcha();

    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : t('form.errors.submitFailed');
      
      setFormState(prev => ({ 
        ...prev, 
        isSubmitting: false, 
        error: errorMessage 
      }));

      // Si es un error de validación del servidor, mostrarlo en el campo correspondiente
      if (error instanceof Error && error.message.includes('validation')) {
        // Aquí podrías parsear el error y usar setError para campos específicos
        console.error('Validation error:', error.message);
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
      console.error(`Error validating field ${fieldName}:`, error);
    }
  };

  // Función para obtener el estado de validación de un campo
  const getFieldState = (fieldName: keyof VerificationFormData) => {
    const field = formState.errors[fieldName];
    return {
      hasError: !!field,
      errorMessage: field?.message,
      isValid: !field && formState.touchedFields[fieldName],
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
    isCaptchaLoaded,
    isCaptchaVerified,
    captchaError,
    resetCaptcha,
    
    // Validation state
    isValid: formState.isValid,
    isDirty: formState.isDirty,
    touchedFields: formState.touchedFields,
    errors: formState.errors,
  };
};

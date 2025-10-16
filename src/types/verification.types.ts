// Tipos simplificados para formulario de verificación básico
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

// Tipo para datos de verificación (usado en queryParams)
export interface VerificationData {
  verified: boolean;
  timestamp?: string;
  captchaToken?: string;
}

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

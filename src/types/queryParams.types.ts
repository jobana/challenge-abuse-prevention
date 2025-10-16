import { VerificationData } from './verification.types';

export interface QueryParams {
  customerData?: string;
  shippingData?: string;
  billingData?: string;
  paymentData?: string;
  orderData?: string;
  referrer?: number; // ID numérico del paso/página previa
  token?: string;    // Token de la sesión/transacción
  step?: string;
}

export interface DecodedQueryParams {
  customerData?: any;
  shippingData?: any;
  billingData?: any;
  paymentData?: any;
  orderData?: any;
  referrer?: number; // ID numérico del paso/página previa
  token?: string;    // Token de la sesión/transacción
  step?: string;
}

// Datos de salida del microfrontend
export interface MicrofrontendOutput {
  referrer: number;        // Mismo ID que vino de entrada
  captchaToken: string;    // Token del captcha verificado
  verified: boolean;       // Estado de verificación
  timestamp: string;       // Timestamp de la verificación
  userData?: any;          // Datos verificados del usuario (opcional)
}

export interface QueryParamsContextType {
  params: DecodedQueryParams;
  updateParam: (key: keyof QueryParams, value: any) => void;
  updateParams: (params: Partial<QueryParams>) => void;
  clearParams: () => void;
  getEncodedParams: () => string;
}

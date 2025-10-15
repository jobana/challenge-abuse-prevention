import { VerificationFormData } from './verification.types';
import { ApiResponse, ApiError } from './common.types';

// Tipos para meli-countries API
export interface Country {
  id: string;
  name: string;
  code: string;
  flag: string;
  currency: string;
  timezone: string;
  locale: string;
}

export interface CountriesResponse extends ApiResponse<Country[]> {
  data: Country[];
}

// Tipos para CAPTCHA
export interface CaptchaResponse {
  success: boolean;
  score?: number;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
}

export interface VerificationSubmitRequest {
  data: VerificationFormData;
  token: string;
}

export interface VerificationSubmitResponse extends ApiResponse<{ orderId: string }> {
  data: {
    orderId: string;
    confirmationUrl: string;
  };
}

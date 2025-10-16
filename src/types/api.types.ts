import { VerificationFormData } from './verification.types';
import type { ApiResponse, ApiError } from './common.types';

// Re-exportar tipos comunes para facilitar importaciones
export type { ApiResponse, ApiError };

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

// Tipos para meli-users API
export interface UserAddress {
  street: string;
  number: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface UserPreferences {
  language: string;
  currency: string;
  notifications: boolean;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: UserAddress;
  preferences: UserPreferences;
}

export interface UserResponse extends ApiResponse<User> {
  data: User;
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

import { VerificationData, VerificationFormData } from './verification.types';
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

// Tipos para meli-users API
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: UserAddress;
  preferences: UserPreferences;
}

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

export interface UserResponse extends ApiResponse<User> {
  data: User;
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

export interface CustomerApiResponse extends ApiResponse<any> {
  data: {
    customer: any;
  };
}

export interface ShippingApiResponse extends ApiResponse<any> {
  data: {
    shipping: any;
  };
}

export interface BillingApiResponse extends ApiResponse<any> {
  data: {
    billing: any;
  };
}

export interface PaymentApiResponse extends ApiResponse<any> {
  data: {
    payment: any;
  };
}

export interface OrderApiResponse extends ApiResponse<any> {
  data: {
    order: any;
  };
}

export interface VerificationApiResponse extends ApiResponse<VerificationData> {
  data: VerificationData;
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

export type ApiResponseType = 
  | CustomerApiResponse
  | ShippingApiResponse
  | BillingApiResponse
  | PaymentApiResponse
  | OrderApiResponse
  | VerificationApiResponse
  | VerificationSubmitResponse
  | ApiError;

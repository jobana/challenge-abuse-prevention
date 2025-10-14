import { VerificationData, VerificationFormData } from './verification.types';
import { ApiResponse, ApiError } from './common.types';

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

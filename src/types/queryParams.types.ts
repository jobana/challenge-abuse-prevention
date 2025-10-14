import { VerificationData } from './verification.types';

export interface QueryParams {
  customerData?: string;
  shippingData?: string;
  billingData?: string;
  paymentData?: string;
  orderData?: string;
  referrer?: string;
  token?: string;
  step?: string;
}

export interface DecodedQueryParams {
  customerData?: any;
  shippingData?: any;
  billingData?: any;
  paymentData?: any;
  orderData?: any;
  referrer?: string;
  token?: string;
  step?: string;
}

export interface QueryParamsContextType {
  params: DecodedQueryParams;
  updateParam: (key: keyof QueryParams, value: any) => void;
  updateParams: (params: Partial<QueryParams>) => void;
  clearParams: () => void;
  getEncodedParams: () => string;
}

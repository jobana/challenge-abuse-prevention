import { QueryParams, DecodedQueryParams } from '@types/queryParams.types';
import { QUERY_PARAMS, QUERY_PARAM_ENCODING } from '@constants/queryParams.constants';

export const encodeQueryParam = (value: any): string => {
  if (!value) return '';
  
  try {
    const jsonString = JSON.stringify(value);
    return QUERY_PARAM_ENCODING.ENCODE ? encodeURIComponent(jsonString) : jsonString;
  } catch (error) {
    console.error('Error encoding query param:', error);
    return '';
  }
};

export const decodeQueryParam = (value: string): any => {
  if (!value) return null;
  
  try {
    const decodedString = QUERY_PARAM_ENCODING.DECODE ? decodeURIComponent(value) : value;
    return JSON.parse(decodedString);
  } catch (error) {
    console.error('Error decoding query param:', error);
    return null;
  }
};

export const getQueryParams = (): QueryParams => {
  if (typeof window === 'undefined') return {};
  
  const urlParams = new URLSearchParams(window.location.search);
  const params: QueryParams = {};
  
  Object.values(QUERY_PARAMS).forEach(key => {
    const value = urlParams.get(key);
    if (value) {
      params[key as keyof QueryParams] = value;
    }
  });
  
  return params;
};

export const getDecodedQueryParams = (): DecodedQueryParams => {
  const params = getQueryParams();
  const decoded: DecodedQueryParams = {};
  
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      if (key.includes('Data')) {
        decoded[key as keyof DecodedQueryParams] = decodeQueryParam(value);
      } else {
        decoded[key as keyof DecodedQueryParams] = value;
      }
    }
  });
  
  return decoded;
};

export const updateQueryParam = (key: keyof QueryParams, value: any): void => {
  if (typeof window === 'undefined') return;
  
  const url = new URL(window.location.href);
  
  if (value === null || value === undefined || value === '') {
    url.searchParams.delete(key);
  } else {
    const encodedValue = key.includes('Data') ? encodeQueryParam(value) : String(value);
    url.searchParams.set(key, encodedValue);
  }
  
  window.history.replaceState({}, '', url.toString());
};

export const updateQueryParams = (params: Partial<QueryParams>): void => {
  if (typeof window === 'undefined') return;
  
  const url = new URL(window.location.href);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') {
      url.searchParams.delete(key);
    } else {
      const encodedValue = key.includes('Data') ? encodeQueryParam(value) : String(value);
      url.searchParams.set(key, encodedValue);
    }
  });
  
  window.history.replaceState({}, '', url.toString());
};

export const clearQueryParams = (): void => {
  if (typeof window === 'undefined') return;
  
  const url = new URL(window.location.href);
  url.search = '';
  window.history.replaceState({}, '', url.toString());
};

export const getEncodedQueryString = (params: Partial<QueryParams>): string => {
  const urlParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      const encodedValue = key.includes('Data') ? encodeQueryParam(value) : String(value);
      urlParams.set(key, encodedValue);
    }
  });
  
  return urlParams.toString();
};

export const buildQueryString = (params: Partial<QueryParams>): string => {
  const queryString = getEncodedQueryString(params);
  return queryString ? `?${queryString}` : '';
};

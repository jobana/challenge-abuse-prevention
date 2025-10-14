/**
 * Exportaciones centralizadas de clientes API
 */

// Cliente base
export { ApiClient, ApiError, apiClient, simulateLatency } from './base';
export type { ApiResponse, RequestConfig } from './base';

// Clientes específicos
export { MeliCountriesClient, meliCountriesClient } from './meliCountries';
export { MeliUsersClient, meliUsersClient } from './meliUsers';

// Re-exportar tipos de API
export type {
  Country,
  CountriesResponse,
  User,
  UserAddress,
  UserPreferences,
  UserResponse,
  CaptchaResponse,
} from '@types/api.types';

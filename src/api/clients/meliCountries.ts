import { ApiClient, simulateLatency } from './base';
import { Country, CountriesResponse } from '@types/api.types';
import { getMockCountriesResponse, searchCountries, getCountryByCode } from '@api/mocks/countries.mock';

/**
 * Cliente para la API meli-countries
 * Maneja la obtención de países y búsquedas
 */
export class MeliCountriesClient extends ApiClient {
  constructor(baseURL: string = '/api/meli-countries') {
    super(baseURL, 5000); // 5 segundos timeout para países
  }

  /**
   * Obtiene todos los países disponibles
   */
  async getCountries(): Promise<CountriesResponse> {
    try {
      // En desarrollo, usar datos mock
      if (process.env.NODE_ENV === 'development') {
        await simulateLatency(100, 300);
        const countries = await getMockCountriesResponse();
        
        return {
          data: countries,
          success: true,
        };
      }

      // En producción, hacer petición real
      return await this.get<Country[]>('/countries');
    } catch (error) {
      console.error('Error fetching countries:', error);
      throw error;
    }
  }

  /**
   * Busca países por nombre o código
   */
  async searchCountries(query: string): Promise<CountriesResponse> {
    try {
      // En desarrollo, usar datos mock
      if (process.env.NODE_ENV === 'development') {
        await simulateLatency(50, 200);
        const countries = await searchCountries(query);
        
        return {
          data: countries,
          success: true,
        };
      }

      // En producción, hacer petición real
      return await this.get<Country[]>(`/countries/search?q=${encodeURIComponent(query)}`);
    } catch (error) {
      console.error('Error searching countries:', error);
      throw error;
    }
  }

  /**
   * Obtiene un país específico por su código
   */
  async getCountryByCode(code: string): Promise<Country | null> {
    try {
      // En desarrollo, usar datos mock
      if (process.env.NODE_ENV === 'development') {
        await simulateLatency(50, 150);
        return await getCountryByCode(code);
      }

      // En producción, hacer petición real
      const response = await this.get<Country>(`/countries/${code}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching country ${code}:`, error);
      return null;
    }
  }

  /**
   * Obtiene países por región
   */
  async getCountriesByRegion(region: string): Promise<CountriesResponse> {
    try {
      // En desarrollo, usar datos mock filtrados
      if (process.env.NODE_ENV === 'development') {
        await simulateLatency(100, 250);
        const allCountries = await getMockCountriesResponse();
        
        // Filtrar por región (simplificado)
        const filteredCountries = allCountries.filter(country => {
          const regions: Record<string, string[]> = {
            'south-america': ['AR', 'BR', 'CL', 'CO', 'EC', 'PE', 'UY', 'PY', 'BO', 'VE'],
            'central-america': ['CR', 'PA', 'GT', 'HN', 'SV', 'NI'],
            'caribbean': ['CU', 'DO', 'PR'],
            'north-america': ['MX'],
          };
          
          return regions[region]?.includes(country.code) || false;
        });
        
        return {
          data: filteredCountries,
          success: true,
        };
      }

      // En producción, hacer petición real
      return await this.get<Country[]>(`/countries/region/${region}`);
    } catch (error) {
      console.error(`Error fetching countries for region ${region}:`, error);
      throw error;
    }
  }

  /**
   * Obtiene información de monedas por país
   */
  async getCurrencyInfo(countryCode: string): Promise<{ currency: string; symbol: string; rate: number } | null> {
    try {
      // En desarrollo, usar datos mock
      if (process.env.NODE_ENV === 'development') {
        await simulateLatency(50, 150);
        const country = await getCountryByCode(countryCode);
        
        if (!country) {
          return null;
        }
        
        // Simular información de moneda
        const currencyInfo = {
          currency: country.currency,
          symbol: this.getCurrencySymbol(country.currency),
          rate: Math.random() * 100 + 1, // Tasa de cambio simulada
        };
        
        return currencyInfo;
      }

      // En producción, hacer petición real
      const response = await this.get<{ currency: string; symbol: string; rate: number }>(
        `/countries/${countryCode}/currency`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching currency info for ${countryCode}:`, error);
      return null;
    }
  }

  /**
   * Obtiene el símbolo de moneda
   */
  private getCurrencySymbol(currency: string): string {
    const symbols: Record<string, string> = {
      'ARS': '$',
      'BRL': 'R$',
      'MXN': '$',
      'COP': '$',
      'CLP': '$',
      'PEN': 'S/',
      'UYU': '$U',
      'PYG': '₲',
      'BOB': 'Bs',
      'USD': '$',
      'VES': 'Bs.S',
      'CRC': '₡',
      'PAB': 'B/.',
      'GTQ': 'Q',
      'HNL': 'L',
      'NIO': 'C$',
      'CUP': '$',
      'DOP': '$',
    };
    
    return symbols[currency] || currency;
  }
}

// Instancia singleton del cliente
export const meliCountriesClient = new MeliCountriesClient();

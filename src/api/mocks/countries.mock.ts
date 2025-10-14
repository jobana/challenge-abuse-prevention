import { Country } from '@types/api.types';

/**
 * Datos mock para la API meli-countries
 * Simula países de Latinoamérica con información completa
 */
export const MOCK_COUNTRIES: Country[] = [
  {
    id: 'AR',
    name: 'Argentina',
    code: 'AR',
    flag: '🇦🇷',
    currency: 'ARS',
    timezone: 'America/Argentina/Buenos_Aires',
    locale: 'es-AR',
  },
  {
    id: 'BR',
    name: 'Brasil',
    code: 'BR',
    flag: '🇧🇷',
    currency: 'BRL',
    timezone: 'America/Sao_Paulo',
    locale: 'pt-BR',
  },
  {
    id: 'MX',
    name: 'México',
    code: 'MX',
    flag: '🇲🇽',
    currency: 'MXN',
    timezone: 'America/Mexico_City',
    locale: 'es-MX',
  },
  {
    id: 'CO',
    name: 'Colombia',
    code: 'CO',
    flag: '🇨🇴',
    currency: 'COP',
    timezone: 'America/Bogota',
    locale: 'es-CO',
  },
  {
    id: 'CL',
    name: 'Chile',
    code: 'CL',
    flag: '🇨🇱',
    currency: 'CLP',
    timezone: 'America/Santiago',
    locale: 'es-CL',
  },
  {
    id: 'PE',
    name: 'Perú',
    code: 'PE',
    flag: '🇵🇪',
    currency: 'PEN',
    timezone: 'America/Lima',
    locale: 'es-PE',
  },
  {
    id: 'UY',
    name: 'Uruguay',
    code: 'UY',
    flag: '🇺🇾',
    currency: 'UYU',
    timezone: 'America/Montevideo',
    locale: 'es-UY',
  },
  {
    id: 'PY',
    name: 'Paraguay',
    code: 'PY',
    flag: '🇵🇾',
    currency: 'PYG',
    timezone: 'America/Asuncion',
    locale: 'es-PY',
  },
  {
    id: 'BO',
    name: 'Bolivia',
    code: 'BO',
    flag: '🇧🇴',
    currency: 'BOB',
    timezone: 'America/La_Paz',
    locale: 'es-BO',
  },
  {
    id: 'EC',
    name: 'Ecuador',
    code: 'EC',
    flag: '🇪🇨',
    currency: 'USD',
    timezone: 'America/Guayaquil',
    locale: 'es-EC',
  },
  {
    id: 'VE',
    name: 'Venezuela',
    code: 'VE',
    flag: '🇻🇪',
    currency: 'VES',
    timezone: 'America/Caracas',
    locale: 'es-VE',
  },
  {
    id: 'CR',
    name: 'Costa Rica',
    code: 'CR',
    flag: '🇨🇷',
    currency: 'CRC',
    timezone: 'America/Costa_Rica',
    locale: 'es-CR',
  },
  {
    id: 'PA',
    name: 'Panamá',
    code: 'PA',
    flag: '🇵🇦',
    currency: 'PAB',
    timezone: 'America/Panama',
    locale: 'es-PA',
  },
  {
    id: 'GT',
    name: 'Guatemala',
    code: 'GT',
    flag: '🇬🇹',
    currency: 'GTQ',
    timezone: 'America/Guatemala',
    locale: 'es-GT',
  },
  {
    id: 'HN',
    name: 'Honduras',
    code: 'HN',
    flag: '🇭🇳',
    currency: 'HNL',
    timezone: 'America/Tegucigalpa',
    locale: 'es-HN',
  },
  {
    id: 'SV',
    name: 'El Salvador',
    code: 'SV',
    flag: '🇸🇻',
    currency: 'USD',
    timezone: 'America/El_Salvador',
    locale: 'es-SV',
  },
  {
    id: 'NI',
    name: 'Nicaragua',
    code: 'NI',
    flag: '🇳🇮',
    currency: 'NIO',
    timezone: 'America/Managua',
    locale: 'es-NI',
  },
  {
    id: 'CU',
    name: 'Cuba',
    code: 'CU',
    flag: '🇨🇺',
    currency: 'CUP',
    timezone: 'America/Havana',
    locale: 'es-CU',
  },
  {
    id: 'DO',
    name: 'República Dominicana',
    code: 'DO',
    flag: '🇩🇴',
    currency: 'DOP',
    timezone: 'America/Santo_Domingo',
    locale: 'es-DO',
  },
  {
    id: 'PR',
    name: 'Puerto Rico',
    code: 'PR',
    flag: '🇵🇷',
    currency: 'USD',
    timezone: 'America/Puerto_Rico',
    locale: 'es-PR',
  },
];

/**
 * Simula la respuesta de la API meli-countries
 */
export const getMockCountriesResponse = async (): Promise<Country[]> => {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 100));
  
  // Simular error ocasional (5% de probabilidad)
  if (Math.random() < 0.05) {
    throw new Error('Failed to fetch countries');
  }
  
  return MOCK_COUNTRIES;
};

/**
 * Busca países por nombre o código
 */
export const searchCountries = async (query: string): Promise<Country[]> => {
  const countries = await getMockCountriesResponse();
  
  if (!query.trim()) {
    return countries;
  }
  
  const searchTerm = query.toLowerCase().trim();
  
  return countries.filter(country => 
    country.name.toLowerCase().includes(searchTerm) ||
    country.code.toLowerCase().includes(searchTerm)
  );
};

/**
 * Obtiene un país por su código
 */
export const getCountryByCode = async (code: string): Promise<Country | null> => {
  const countries = await getMockCountriesResponse();
  return countries.find(country => country.code === code) || null;
};

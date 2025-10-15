import { Country } from '@types/api.types';

/**
 * Datos mock para la API meli-countries
 * Enfocado en Argentina y Brasil para el microfrontend
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

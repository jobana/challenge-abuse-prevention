import { useState, useEffect, useCallback } from 'react';
import { meliCountriesClient } from '@api/clients';
import { Country } from '@types/api.types';

interface UseCountriesState {
  countries: Country[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
}

interface UseCountriesActions {
  searchCountries: (query: string) => void;
  clearSearch: () => void;
  refreshCountries: () => void;
  getCountryByCode: (code: string) => Country | null;
}

/**
 * Hook para manejar la obtención y búsqueda de países
 */
export const useCountries = (): UseCountriesState & UseCountriesActions => {
  const [state, setState] = useState<UseCountriesState>({
    countries: [],
    loading: false,
    error: null,
    searchQuery: '',
  });

  /**
   * Carga todos los países
   */
  const loadCountries = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await meliCountriesClient.getCountries();
      setState(prev => ({
        ...prev,
        countries: response.data,
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Error loading countries',
      }));
    }
  }, []);

  /**
   * Busca países por query
   */
  const searchCountries = useCallback(async (query: string) => {
    setState(prev => ({ ...prev, searchQuery: query, loading: true, error: null }));

    try {
      if (!query.trim()) {
        // Si no hay query, cargar todos los países
        await loadCountries();
        return;
      }

      const response = await meliCountriesClient.searchCountries(query);
      setState(prev => ({
        ...prev,
        countries: response.data,
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Error searching countries',
      }));
    }
  }, [loadCountries]);

  /**
   * Limpia la búsqueda y recarga todos los países
   */
  const clearSearch = useCallback(() => {
    setState(prev => ({ ...prev, searchQuery: '' }));
    loadCountries();
  }, [loadCountries]);

  /**
   * Refresca la lista de países
   */
  const refreshCountries = useCallback(() => {
    if (state.searchQuery) {
      searchCountries(state.searchQuery);
    } else {
      loadCountries();
    }
  }, [state.searchQuery, searchCountries, loadCountries]);

  /**
   * Obtiene un país por su código
   */
  const getCountryByCode = useCallback((code: string): Country | null => {
    return state.countries.find(country => country.code === code) || null;
  }, [state.countries]);

  // Cargar países al montar el componente
  useEffect(() => {
    loadCountries();
  }, [loadCountries]);

  return {
    ...state,
    searchCountries,
    clearSearch,
    refreshCountries,
    getCountryByCode,
  };
};

/**
 * Hook para obtener un país específico por código
 */
export const useCountry = (code: string) => {
  const [country, setCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCountry = useCallback(async () => {
    if (!code) {
      setCountry(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const countryData = await meliCountriesClient.getCountryByCode(code);
      setCountry(countryData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error loading country');
    } finally {
      setLoading(false);
    }
  }, [code]);

  useEffect(() => {
    loadCountry();
  }, [loadCountry]);

  return {
    country,
    loading,
    error,
    refresh: loadCountry,
  };
};

/**
 * Hook para obtener información de moneda por país
 */
export const useCurrencyInfo = (countryCode: string) => {
  const [currencyInfo, setCurrencyInfo] = useState<{
    currency: string;
    symbol: string;
    rate: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCurrencyInfo = useCallback(async () => {
    if (!countryCode) {
      setCurrencyInfo(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const info = await meliCountriesClient.getCurrencyInfo(countryCode);
      setCurrencyInfo(info);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error loading currency info');
    } finally {
      setLoading(false);
    }
  }, [countryCode]);

  useEffect(() => {
    loadCurrencyInfo();
  }, [loadCurrencyInfo]);

  return {
    currencyInfo,
    loading,
    error,
    refresh: loadCurrencyInfo,
  };
};

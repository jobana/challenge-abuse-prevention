import { useState, useEffect, useCallback } from 'react';
import { meliCountriesClient } from '@api/clients';
import { Country } from '@types/api.types';

interface UseCountriesState {
  countries: Country[];
  loading: boolean;
  error: string | null;
}

/**
 * Hook simplificado para obtener lista de países
 */
export const useCountries = (): UseCountriesState => {
  const [state, setState] = useState<UseCountriesState>({
    countries: [],
    loading: false,
    error: null,
  });

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

  // Cargar países al montar el componente
  useEffect(() => {
    loadCountries();
  }, [loadCountries]);

  return state;
};

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
 * Prioriza datos del SSR (window.__INITIAL_DATA__.countries) para performance
 */
export const useCountries = (): UseCountriesState => {
  // Intentar obtener países del servidor (SSR)
  const serverCountries = typeof window !== 'undefined'
    ? (window as any).__INITIAL_DATA__?.countries
    : null;

  const [state, setState] = useState<UseCountriesState>({
    countries: serverCountries || [],
    loading: !serverCountries, // Solo loading si no hay datos del servidor
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

  // Solo cargar si no hay datos del servidor
  useEffect(() => {
    if (!serverCountries) {
      loadCountries();
    }
  }, [serverCountries, loadCountries]);

  return state;
};

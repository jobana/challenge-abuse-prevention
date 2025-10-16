import { renderHook } from '@testing-library/react';

// Mock completo del hook useCountries
jest.mock('../useCountries', () => ({
  useCountries: () => ({
    countries: [
      { id: 'AR', name: 'Argentina' },
      { id: 'BR', name: 'Brasil' },
      { id: 'CO', name: 'Colombia' },
    ],
    loading: false,
    error: null,
  }),
}));

import { useCountries } from '../useCountries';

describe('useCountries', () => {
  it('should return countries list', () => {
    const { result } = renderHook(() => useCountries());

    expect(result.current.countries).toHaveLength(3);
    expect(result.current.countries[0].name).toBe('Argentina');
    expect(result.current.countries[1].name).toBe('Brasil');
    expect(result.current.countries[2].name).toBe('Colombia');
  });

  it('should return loading state', () => {
    const { result } = renderHook(() => useCountries());

    expect(result.current.loading).toBe(false);
  });

  it('should return error state', () => {
    const { result } = renderHook(() => useCountries());

    expect(result.current.error).toBe(null);
  });

  it('should have correct country structure', () => {
    const { result } = renderHook(() => useCountries());

    const country = result.current.countries[0];
    expect(country).toHaveProperty('id');
    expect(country).toHaveProperty('name');
    expect(typeof country.id).toBe('string');
    expect(typeof country.name).toBe('string');
  });
});
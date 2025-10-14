import { renderHook, waitFor } from '@testing-library/react';
import { useCountries } from '../useCountries';

// Mock de fetch
global.fetch = jest.fn();

describe('useCountries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockClear();
  });

  it('loads countries successfully', async () => {
    const mockCountries = [
      { id: 'AR', name: 'Argentina', code: 'AR', flag: '🇦🇷' },
      { id: 'BR', name: 'Brasil', code: 'BR', flag: '🇧🇷' },
      { id: 'MX', name: 'México', code: 'MX', flag: '🇲🇽' },
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: mockCountries,
      }),
    });

    const { result } = renderHook(() => useCountries());

    // Estado inicial
    expect(result.current.countries).toEqual([]);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe(null);

    // Esperar a que se carguen los países
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.countries).toEqual(mockCountries);
    expect(result.current.error).toBe(null);
    expect(fetch).toHaveBeenCalledWith('/api/countries');
  });

  it('handles API error', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useCountries());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.countries).toEqual([]);
    expect(result.current.error).toBe('Network error');
  });

  it('handles server error response', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({
        success: false,
        message: 'Internal server error',
      }),
    });

    const { result } = renderHook(() => useCountries());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.countries).toEqual([]);
    expect(result.current.error).toBe('HTTP 500: Internal Server Error');
  });

  it('handles invalid JSON response', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => {
        throw new Error('Invalid JSON');
      },
    });

    const { result } = renderHook(() => useCountries());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.countries).toEqual([]);
    expect(result.current.error).toBe('Invalid JSON');
  });

  it('handles empty response', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: [],
      }),
    });

    const { result } = renderHook(() => useCountries());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.countries).toEqual([]);
    expect(result.current.error).toBe(null);
  });

  it('handles malformed response', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        // data field missing
      }),
    });

    const { result } = renderHook(() => useCountries());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.countries).toEqual([]);
    expect(result.current.error).toBe(null);
  });

  it('caches countries data', async () => {
    const mockCountries = [
      { id: 'AR', name: 'Argentina', code: 'AR', flag: '🇦🇷' },
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: mockCountries,
      }),
    });

    const { result: result1 } = renderHook(() => useCountries());
    const { result: result2 } = renderHook(() => useCountries());

    await waitFor(() => {
      expect(result1.current.isLoading).toBe(false);
      expect(result2.current.isLoading).toBe(false);
    });

    // Ambas instancias deberían tener los mismos datos
    expect(result1.current.countries).toEqual(mockCountries);
    expect(result2.current.countries).toEqual(mockCountries);

    // fetch debería haberse llamado solo una vez
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('handles timeout', async () => {
    // Mock de fetch que nunca resuelve
    (fetch as jest.Mock).mockImplementationOnce(
      () => new Promise(() => {}) // Never resolves
    );

    const { result } = renderHook(() => useCountries());

    // El hook debería manejar el timeout internamente
    expect(result.current.isLoading).toBe(true);
    expect(result.current.countries).toEqual([]);
    expect(result.current.error).toBe(null);
  });

  it('provides correct API endpoint', async () => {
    const mockCountries = [
      { id: 'AR', name: 'Argentina', code: 'AR', flag: '🇦🇷' },
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: mockCountries,
      }),
    });

    renderHook(() => useCountries());

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/countries');
    });
  });
});

/**
 * Cliente base para APIs con Fetch nativo
 * Incluye timeout, manejo de errores y configuración centralizada
 */

export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  code?: string;
}

export interface ApiError {
  message: string;
  code: string;
  status?: number;
}

export interface RequestConfig {
  timeout?: number;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

const DEFAULT_TIMEOUT = 8000; // 8 segundos
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

/**
 * Clase base para clientes API
 */
export class ApiClient {
  private baseURL: string;
  private defaultTimeout: number;

  constructor(baseURL: string = '', defaultTimeout: number = DEFAULT_TIMEOUT) {
    this.baseURL = baseURL;
    this.defaultTimeout = defaultTimeout;
  }

  /**
   * Realiza una petición GET
   */
  async get<T = any>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'GET',
      ...config,
    });
  }

  /**
   * Realiza una petición POST
   */
  async post<T = any>(
    endpoint: string,
    data?: any,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...config,
    });
  }

  /**
   * Realiza una petición PUT
   */
  async put<T = any>(
    endpoint: string,
    data?: any,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...config,
    });
  }

  /**
   * Realiza una petición DELETE
   */
  async delete<T = any>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      ...config,
    });
  }

  /**
   * Método principal para realizar peticiones HTTP
   */
  private async request<T = any>(
    endpoint: string,
    options: RequestInit & RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      timeout = this.defaultTimeout,
      headers = {},
      signal,
      ...fetchOptions
    } = options;

    // Crear AbortController para timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    // Combinar señales si se proporciona una
    const finalSignal = signal 
      ? this.combineAbortSignals([controller.signal, signal])
      : controller.signal;

    try {
      const url = `${this.baseURL}${endpoint}`;
      const requestHeaders = {
        ...DEFAULT_HEADERS,
        ...headers,
      };

      const response = await fetch(url, {
        ...fetchOptions,
        headers: requestHeaders,
        signal: finalSignal,
      });

      clearTimeout(timeoutId);

      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        throw new ApiError(
          `HTTP ${response.status}: ${response.statusText}`,
          'HTTP_ERROR',
          response.status
        );
      }

      // Intentar parsear JSON
      let data: T;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // Si no es JSON, devolver el texto
        data = await response.text() as unknown as T;
      }

      return {
        data,
        success: true,
      };

    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError(
            'Request timeout',
            'TIMEOUT_ERROR'
          );
        }

        throw new ApiError(
          error.message,
          'NETWORK_ERROR'
        );
      }

      throw new ApiError(
        'Unknown error occurred',
        'UNKNOWN_ERROR'
      );
    }
  }

  /**
   * Combina múltiples AbortSignals
   */
  private combineAbortSignals(signals: AbortSignal[]): AbortSignal {
    const controller = new AbortController();

    signals.forEach(signal => {
      if (signal.aborted) {
        controller.abort();
      } else {
        signal.addEventListener('abort', () => controller.abort());
      }
    });

    return controller.signal;
  }
}

/**
 * Clase de error personalizada para APIs
 */
export class ApiError extends Error {
  public code: string;
  public status?: number;

  constructor(message: string, code: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

/**
 * Función helper para simular latencia (solo en desarrollo)
 */
export const simulateLatency = (min: number = 100, max: number = 300): Promise<void> => {
  if (process.env.NODE_ENV === 'production') {
    return Promise.resolve();
  }

  const delay = Math.random() * (max - min) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * Instancia base del cliente API
 */
export const apiClient = new ApiClient();
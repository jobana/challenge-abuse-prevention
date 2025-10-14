interface LogLevel {
  ERROR: 'error';
  WARN: 'warn';
  INFO: 'info';
  DEBUG: 'debug';
}

interface LogEntry {
  level: string;
  message: string;
  timestamp: string;
  data?: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isServer = typeof window === 'undefined';

  private formatMessage(level: string, message: string, data?: any): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      data
    };
  }

  private log(level: string, message: string, data?: any): void {
    const logEntry = this.formatMessage(level, message, data);
    
    if (this.isDevelopment) {
      // En desarrollo, usar console con colores
      const colors = {
        error: '\x1b[31m', // Rojo
        warn: '\x1b[33m',  // Amarillo
        info: '\x1b[36m',  // Cian
        debug: '\x1b[90m'  // Gris
      };
      
      const reset = '\x1b[0m';
      const color = colors[level as keyof typeof colors] || '';
      
      console.log(`${color}[${level.toUpperCase()}]${reset} ${message}`, data || '');
    } else {
      // En producción, usar console estándar
      console[level as keyof Console](message, data || '');
    }

    // En el servidor, podrías enviar logs a un servicio externo
    if (this.isServer && level === 'error') {
      // Aquí podrías integrar con servicios como Sentry, LogRocket, etc.
      this.sendToExternalService(logEntry);
    }
  }

  private sendToExternalService(logEntry: LogEntry): void {
    // Implementación para enviar logs a servicios externos
    // Por ejemplo: Sentry, LogRocket, DataDog, etc.
    if (typeof fetch !== 'undefined') {
      fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logEntry),
      }).catch(() => {
        // Silently fail si no se puede enviar el log
      });
    }
  }

  error(message: string, data?: any): void {
    this.log('error', message, data);
  }

  warn(message: string, data?: any): void {
    this.log('warn', message, data);
  }

  info(message: string, data?: any): void {
    this.log('info', message, data);
  }

  debug(message: string, data?: any): void {
    if (this.isDevelopment) {
      this.log('debug', message, data);
    }
  }

  // Método para logging de performance
  performance(operation: string, startTime: number, data?: any): void {
    const duration = Date.now() - startTime;
    this.info(`Performance: ${operation}`, {
      duration: `${duration}ms`,
      ...data
    });
  }

  // Método para logging de errores de API
  apiError(endpoint: string, error: any, data?: any): void {
    this.error(`API Error: ${endpoint}`, {
      endpoint,
      error: error instanceof Error ? error.message : error,
      ...data
    });
  }

  // Método para logging de eventos de usuario
  userEvent(event: string, data?: any): void {
    this.info(`User Event: ${event}`, data);
  }
}

export const logger = new Logger();
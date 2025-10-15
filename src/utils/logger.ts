class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  error(message: string, data?: any): void {
    console.error(`[ERROR] ${message}`, data || '');
  }

  warn(message: string, data?: any): void {
    console.warn(`[WARN] ${message}`, data || '');
  }

  info(message: string, data?: any): void {
    console.info(`[INFO] ${message}`, data || '');
  }

  debug(message: string, data?: any): void {
    if (this.isDevelopment) {
      console.debug(`[DEBUG] ${message}`, data || '');
    }
  }
}

export const logger = new Logger();
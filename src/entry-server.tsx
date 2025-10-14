import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { App } from './App';
import { logger } from '@utils/logger';

export async function render(url: string, initialData?: any) {
  const startTime = Date.now();
  
  try {
    // Renderizar la aplicación con datos iniciales
    const html = ReactDOMServer.renderToString(
      React.createElement(App, { initialData })
    );
    
    const renderTime = Date.now() - startTime;
    
    // Log de performance
    if (renderTime > 500) {
      logger.warn(`Slow SSR render: ${renderTime}ms`);
    } else {
      logger.info(`SSR render completed in ${renderTime}ms`);
    }
    
    return html;
    
  } catch (error) {
    logger.error('SSR render error:', error);
    
    // Fallback HTML en caso de error
    return `
      <div style="padding: 20px; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
        <h2>Error de carga</h2>
        <p>Estamos experimentando problemas técnicos.</p>
        <p>Por favor, intenta recargar la página.</p>
        <button onclick="window.location.reload()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Recargar
        </button>
      </div>
    `;
  }
}

import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { logger } from '@utils/logger';

// Inicializar i18n
import './i18n';

// Declarar tipos globales
declare global {
  interface Window {
    __INITIAL_DATA__: any;
    __PERFORMANCE_CONFIG__: any;
    __RENDER_TIME__: number;
  }
}

const startTime = Date.now();

// Obtener datos iniciales del servidor
const initialData = window.__INITIAL_DATA__;
const performanceConfig = window.__PERFORMANCE_CONFIG__;
const renderTime = window.__RENDER_TIME__;

// Log de performance
logger.info(`SSR render time: ${renderTime}ms`);

// Configurar axe-core solo en desarrollo
if (process.env.NODE_ENV === 'development') {
  import('@axe-core/react').then((axe) => {
    axe.default(React, ReactDOM, 1000);
    console.log('🔍 Axe-core accessibility testing enabled');
  });
}

// Hidratar la aplicación
const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    const root = ReactDOM.createRoot(rootElement);
    
    root.render(
      React.createElement(App, { 
        initialData,
        performanceConfig 
      })
    );
    
    const hydrationTime = Date.now() - startTime;
    
    // Log de performance de hidratación
    if (hydrationTime > 200) {
      logger.warn(`Slow hydration: ${hydrationTime}ms`);
    } else {
      logger.info(`Hydration completed in ${hydrationTime}ms`);
    }
    
    // Performance metrics
    if (performanceConfig?.PREFETCH_CRITICAL_RESOURCES) {
      // Prefetch recursos críticos
      prefetchCriticalResources();
    }
    
  } catch (error) {
    logger.error('Hydration error:', error);
    
    // Fallback en caso de error de hidratación
    rootElement.innerHTML = `
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
} else {
  logger.error('Root element not found');
}

// Función para prefetch de recursos críticos
function prefetchCriticalResources() {
  // Prefetch CSS crítico
  const criticalCSS = document.createElement('link');
  criticalCSS.rel = 'prefetch';
  criticalCSS.href = '/src/styles/verification.css';
  document.head.appendChild(criticalCSS);
  
  // Prefetch siguiente paso si está disponible
  if (initialData?.referrer) {
    const nextStep = document.createElement('link');
    nextStep.rel = 'prefetch';
    nextStep.href = initialData.referrer;
    document.head.appendChild(nextStep);
  }
}

// Performance monitoring
if (typeof window !== 'undefined' && 'performance' in window) {
  window.addEventListener('load', () => {
    const loadTime = performance.now();
    logger.info(`Page load time: ${loadTime}ms`);
    
    // Reportar métricas si es necesario
    if (loadTime > 3000) {
      logger.warn(`Slow page load: ${loadTime}ms`);
    }
  });
}

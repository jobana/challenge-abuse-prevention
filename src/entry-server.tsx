import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { App } from './App';
import { logger } from './utils/logger';

interface RenderOptions {
  url: string;
  initialData?: any;
  performanceConfig?: any;
}

export function render({ url, initialData, performanceConfig }: RenderOptions) {
  const startTime = Date.now();
  
  try {
    const html = renderToString(
      <StaticRouter location={url}>
        <App 
          initialData={initialData}
          performanceConfig={performanceConfig}
        />
      </StaticRouter>
    );
    
    const renderTime = Date.now() - startTime;
    
    logger.info('SSR render completed', {
      url,
      renderTime,
      htmlLength: html.length
    });
    
    return {
      html,
      renderTime,
      initialData,
      performanceConfig
    };
  } catch (error) {
    const renderTime = Date.now() - startTime;
    
    logger.error('SSR render failed', {
      url,
      renderTime,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    
    // Fallback HTML en caso de error
    return {
      html: '<div id="root"><div class="error">Error loading application</div></div>',
      renderTime,
      initialData,
      performanceConfig,
      error: true
    };
  }
}
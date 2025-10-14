import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { render } from './entry-server';
import { extractDataFromQueryParams } from './middleware/ssr';
import { PERFORMANCE_CONFIG } from './config/performance';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de performance
app.use(compression());
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
}));

// Middleware para parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ruta principal con SSR optimizado
app.get('/', async (req, res) => {
  const startTime = Date.now();
  
  try {
    // Extraer datos de query params de forma optimizada
    const initialData = extractDataFromQueryParams(req.query);
    
    // Validar token rápidamente
    if (!initialData.token) {
      return res.status(400).send('Token requerido');
    }
    
    // Renderizar con SSR
    const html = await render(req.url, initialData);
    
    // Calcular tiempo de renderizado
    const renderTime = Date.now() - startTime;
    
    // Log de performance
    if (renderTime > 1000) {
      console.warn(`Slow render: ${renderTime}ms`);
    }
    
    // Enviar HTML optimizado
    res.send(`
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verificación de Datos</title>
          <meta name="description" content="Verificación rápida de datos de compra">
          
          <!-- Preload crítico -->
          <link rel="preload" href="/src/entry-client.tsx" as="script">
          <link rel="preload" href="/src/styles/globals.css" as="style">
          
          <!-- Critical CSS inline -->
          <style>
            body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
            .loading { display: flex; justify-content: center; align-items: center; height: 100vh; }
            .skeleton { background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: loading 1.5s infinite; }
            @keyframes loading { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
          </style>
          
          <script>
            window.__INITIAL_DATA__ = ${JSON.stringify(initialData)};
            window.__PERFORMANCE_CONFIG__ = ${JSON.stringify(PERFORMANCE_CONFIG)};
            window.__RENDER_TIME__ = ${renderTime};
          </script>
        </head>
        <body>
          <div id="root">${html}</div>
          
          <!-- Fallback para no-JS -->
          <noscript>
            <div style="padding: 20px; text-align: center;">
              <h2>Verificación de Datos</h2>
              <p>Para continuar, habilita JavaScript en tu navegador.</p>
              <p>Si tienes problemas, contacta soporte.</p>
            </div>
          </noscript>
          
          <script type="module" src="/src/entry-client.tsx"></script>
        </body>
      </html>
    `);
    
  } catch (error) {
    console.error('SSR Error:', error);
    
    // Fallback HTML en caso de error
    res.status(500).send(`
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8">
          <title>Error - Verificación de Datos</title>
        </head>
        <body>
          <div style="padding: 20px; text-align: center;">
            <h2>Error temporal</h2>
            <p>Estamos experimentando problemas técnicos.</p>
            <p>Por favor, intenta nuevamente en unos momentos.</p>
            <button onclick="window.location.reload()">Reintentar</button>
          </div>
        </body>
      </html>
    `);
  }
});

// API endpoint para submit optimizado
app.post('/api/verification/submit', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { data, token, referrer } = req.body;
    
    // Validación rápida
    if (!token || !data) {
      return res.status(400).json({
        success: false,
        message: 'Datos requeridos faltantes',
        code: 'MISSING_DATA'
      });
    }
    
    // Simular procesamiento (en producción sería llamada a API real)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const processingTime = Date.now() - startTime;
    
    // Log de performance
    if (processingTime > PERFORMANCE_CONFIG.FORM_SUBMIT_TIMEOUT) {
      console.warn(`Slow submit: ${processingTime}ms`);
    }
    
    // Respuesta exitosa
    res.json({
      success: true,
      message: 'Verificación completada',
      data: {
        orderId: `ORD-${Date.now()}`,
        confirmationUrl: `${referrer}?verified=true&orderId=ORD-${Date.now()}`
      },
      processingTime
    });
    
  } catch (error) {
    console.error('Submit Error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor SSR corriendo en puerto ${PORT}`);
  console.log(`📊 Performance config:`, PERFORMANCE_CONFIG);
});

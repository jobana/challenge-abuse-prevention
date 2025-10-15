import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
// Mock data para testing
const MOCK_COUNTRIES = [
  {
    id: 'AR',
    name: 'Argentina',
    code: 'AR',
    flag: '🇦🇷',
    currency: 'ARS',
    timezone: 'America/Argentina/Buenos_Aires',
    locale: 'es-AR',
  },
  {
    id: 'BR',
    name: 'Brasil',
    code: 'BR',
    flag: '🇧🇷',
    currency: 'BRL',
    timezone: 'America/Sao_Paulo',
    locale: 'pt-BR',
  },
];

const getExampleDataForCountry = (countryCode: string) => {
  const examples = {
    AR: {
      customerData: {
        firstName: 'Juan Carlos',
        lastName: 'Pérez González',
        email: 'juan.perez@mercadolibre.com.ar',
        phone: '+54 11 4567-8901',
        country: 'AR',
      },
      shippingData: {
        address: 'Av. Corrientes 1234, 5A, Buenos Aires, CABA',
        country: 'AR',
        postalCode: '1043',
      },
      billingData: {
        sameAsShipping: true,
        address: {
          street: 'Av. Corrientes',
          number: '1234',
          apartment: '5A',
          city: 'Buenos Aires',
          state: 'CABA',
          postalCode: '1043',
          country: 'AR',
        },
      },
      paymentData: {
        currency: 'ARS',
      },
      orderData: {
        total: 89999,
        currency: 'ARS',
      },
    },
    BR: {
      customerData: {
        firstName: 'Maria Fernanda',
        lastName: 'Silva Santos',
        email: 'maria.silva@mercadolivre.com.br',
        phone: '+55 11 98765-4321',
        country: 'BR',
      },
      shippingData: {
        address: 'Rua das Flores 567, 12B, São Paulo, SP',
        country: 'BR',
        postalCode: '01234-567',
      },
      billingData: {
        sameAsShipping: true,
        address: {
          street: 'Rua das Flores',
          number: '567',
          apartment: '12B',
          city: 'São Paulo',
          state: 'SP',
          postalCode: '01234-567',
          country: 'BR',
        },
      },
      paymentData: {
        currency: 'BRL',
      },
      orderData: {
        total: 299.99,
        currency: 'BRL',
      },
    },
  };

  return examples[countryCode as keyof typeof examples] || null;
};

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

// Función mejorada para detectar idioma basado en dominio MercadoLibre
function detectLanguage(req: express.Request): string {
  const host = req.get('host') || '';
  const referer = req.get('referer') || '';
  const userAgent = req.get('User-Agent') || '';

  // Mapeo de dominios MercadoLibre (coincidencia exacta y parcial)
  const domainMap = {
    'mercadolibre.com.ar': 'es-AR',
    'mercadolivre.com.br': 'pt-BR',
    'mercadolibre.com.mx': 'es-AR', // México usa español
    'mercadolibre.com.co': 'es-AR', // Colombia usa español
    'mercadolibre.cl': 'es-AR',     // Chile usa español
    'localhost': 'es-AR', // Desarrollo
  };

  // 1. Detectar por host exacto
  for (const [domain, locale] of Object.entries(domainMap)) {
    if (host === domain || host.endsWith(`.${domain}`)) {
      console.log(`Language detected by host: ${host} -> ${locale}`);
      return locale;
    }
  }

  // 2. Detectar por referer (cuando viene de otra página ML)
  for (const [domain, locale] of Object.entries(domainMap)) {
    if (referer.includes(domain)) {
      console.log(`Language detected by referer: ${referer} -> ${locale}`);
      return locale;
    }
  }

  // 3. Detectar por query parameter explícito
  const lang = req.query.lang as string || req.query.locale as string;
  if (lang && ['es-AR', 'pt-BR'].includes(lang)) {
    console.log(`Language detected by query: ${lang}`);
    return lang;
  }

  // 4. Detectar por Accept-Language header
  const acceptLanguage = req.get('Accept-Language') || '';
  if (acceptLanguage.includes('pt-BR') || acceptLanguage.includes('pt')) {
    console.log(`Language detected by Accept-Language: pt-BR`);
    return 'pt-BR';
  }

  // 5. Detectar contexto por X-Forwarded-Host (para proxies/CDN)
  const forwardedHost = req.get('X-Forwarded-Host') || req.get('X-Original-Host');
  if (forwardedHost) {
    for (const [domain, locale] of Object.entries(domainMap)) {
      if (forwardedHost.includes(domain)) {
        console.log(`Language detected by X-Forwarded-Host: ${forwardedHost} -> ${locale}`);
        return locale;
      }
    }
  }

  // 6. Default a español (Argentina es el mercado principal)
  console.log('Language fallback to es-AR');
  return 'es-AR';
}

// API endpoint para obtener países usando mocks
app.get('/api/countries', async (req, res) => {
  try {
    // Simular latencia de API
    await new Promise(resolve => setTimeout(resolve, 300));

    res.json({
      success: true,
      data: MOCK_COUNTRIES,
    });

  } catch (error) {
    console.error('Countries API Error:', error);

    res.status(500).json({
      success: false,
      message: 'Error al obtener países',
    });
  }
});

// API endpoint para obtener datos de ejemplo por país
app.get('/api/example-data/:country', async (req, res) => {
  try {
    const { country } = req.params;

    if (!['AR', 'BR'].includes(country)) {
      return res.status(400).json({
        success: false,
        message: 'País no soportado. Solo se permiten AR y BR.',
      });
    }

    const exampleData = getExampleDataForCountry(country);

    if (!exampleData) {
      return res.status(404).json({
        success: false,
        message: 'No se encontraron datos de ejemplo para el país especificado.',
      });
    }

    res.json({
      success: true,
      data: exampleData,
    });

  } catch (error) {
    console.error('Example Data API Error:', error);

    res.status(500).json({
      success: false,
      message: 'Error al obtener datos de ejemplo',
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
  
  // Extraer query params para datos mock
  const queryCountry = req.query.country as string;
  const mockCountry = queryCountry && ['AR', 'BR'].includes(queryCountry) ? queryCountry :
    (locale === 'pt-BR' ? 'BR' : 'AR');

  // Obtener datos de ejemplo basados en el país
  const exampleData = getExampleDataForCountry(mockCountry);

  // Datos iniciales con mock data
  const initialData = {
    locale,
    referrer: req.get('referer'),
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    timestamp: new Date().toISOString(),
    // Incluir datos mock como ejemplo si no hay query params específicos
    customerData: req.query.customerData ? JSON.parse(req.query.customerData as string) : exampleData?.customerData,
    shippingData: req.query.shippingData ? JSON.parse(req.query.shippingData as string) : exampleData?.shippingData,
    billingData: req.query.billingData ? JSON.parse(req.query.billingData as string) : exampleData?.billingData,
    paymentData: req.query.paymentData ? JSON.parse(req.query.paymentData as string) : exampleData?.paymentData,
    orderData: req.query.orderData ? JSON.parse(req.query.orderData as string) : exampleData?.orderData,
    token: req.query.token as string || `demo_token_${Date.now()}`
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
        
        <script type="module" src="/assets/main-18Rzrn87.js"></script>
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

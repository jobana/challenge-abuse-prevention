import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
// Importar mocks compartidos
import { MOCK_COUNTRIES } from './api/mocks/countries.mock.js';
import { getExampleDataForCountry } from './api/mocks/users.mock.js';
// Importar validadores
import { validateVerificationData, sanitizeVerificationData } from './utils/validation.js';

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
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com"  // Permitir Google Fonts
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com"  // Permitir fuentes de Google
      ],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://www.google.com", "https://fonts.googleapis.com"],
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

// Middleware para servir archivos estáticos con MIME types configurados
// Servir archivos de src (CSS, assets en desarrollo)
app.use('/src', (req, res, next) => {
  // Configurar MIME type correcto para archivos TypeScript/JavaScript
  if (req.path.endsWith('.tsx') || req.path.endsWith('.ts')) {
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  } else if (req.path.endsWith('.jsx') || req.path.endsWith('.js')) {
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  } else if (req.path.endsWith('.css')) {
    res.setHeader('Content-Type', 'text/css; charset=utf-8');
  }
  next();
}, express.static(path.join(__dirname, '../src'), {
  maxAge: process.env.NODE_ENV === 'production' ? '1y' : '0',
  etag: true,
  lastModified: true,
}));

// Servir archivos estáticos de dist EXCEPTO index.html (que será servido por la ruta principal con SSR)
app.use('/assets', express.static(path.join(__dirname, '../dist/assets'), {
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

// Función para detectar idioma basado en dominio MercadoLibre
// Esta función se ejecuta en el servidor para soporte No-Script (SSR)
// En producción, detectará automáticamente por dominio (mercadolibre.com.ar vs mercadolivre.com.br)
function detectLanguageFromDomain(req: express.Request): string {
  const host = req.get('host') || '';
  const referer = req.get('referer') || '';

  // Mapeo de dominios MercadoLibre (coincidencia exacta y parcial)
  const domainMap: Record<string, string> = {
    'mercadolibre.com.ar': 'es-AR',
    'mercadolivre.com.br': 'pt-BR',
    'mercadolibre.com.mx': 'es-AR', // México usa español
    'mercadolibre.com.co': 'es-AR', // Colombia usa español
    'mercadolibre.cl': 'es-AR',     // Chile usa español
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
app.get('/api/countries', async (_req, res) => {
  try {
    // Simular latencia de API
    await new Promise(resolve => setTimeout(resolve, 300));

    res.json({
      success: true,
      data: MOCK_COUNTRIES,
    });

  } catch (error) {
    console.error('❌ Countries API Error:', error);

    res.status(500).json({
      success: false,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Error al obtener países',
    });
  }
});

// API endpoint para obtener datos de ejemplo por país
app.get('/api/example-data/:country', async (req, res) => {
  try {
    const { country } = req.params;

    // Validar país
    if (!country || typeof country !== 'string') {
      return res.status(400).json({
        success: false,
        code: 'INVALID_COUNTRY',
        message: 'Country parameter is required',
      });
    }

    const upperCountry = country.toUpperCase();

    if (!['AR', 'BR'].includes(upperCountry)) {
      return res.status(400).json({
        success: false,
        code: 'UNSUPPORTED_COUNTRY',
        message: 'País no soportado. Solo se permiten AR y BR.',
      });
    }

    const exampleData = getExampleDataForCountry(upperCountry);

    if (!exampleData) {
      return res.status(404).json({
        success: false,
        code: 'DATA_NOT_FOUND',
        message: 'No se encontraron datos de ejemplo para el país especificado.',
      });
    }

    res.json({
      success: true,
      data: exampleData,
    });

  } catch (error) {
    console.error('❌ Example Data API Error:', error);

    res.status(500).json({
      success: false,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Error al obtener datos de ejemplo',
    });
  }
});

// API endpoint para verificación
app.post('/api/verification/submit', async (req, res) => {
  try {
    const { name, country, address, captchaToken } = req.body;

    // 1. Validar estructura y formato de datos
    const validationErrors = validateVerificationData({
      name,
      country,
      address,
      captchaToken,
    });

    if (validationErrors.length > 0) {
      console.warn('Validation failed:', validationErrors);
      return res.status(400).json({
        success: false,
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        errors: validationErrors,
      });
    }

    // 2. Sanitizar datos para prevenir XSS
    const sanitizedData = sanitizeVerificationData({
      name,
      country,
      address,
      captchaToken,
    });

    // 3. Simular procesamiento
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('✅ Verification submitted:', {
      ...sanitizedData,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });

    // 4. Retornar respuesta exitosa
    res.json({
      success: true,
      message: 'Verificación completada exitosamente',
      data: {
        id: `verification_${Date.now()}`,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('❌ Verification API Error:', error);

    // Diferenciar errores internos (500) de errores del cliente (ya manejados con 400)
    res.status(500).json({
      success: false,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Error interno del servidor',
    });
  }
});

// Configuración de países soportados
const SUPPORTED_COUNTRIES = {
  AR: { locale: 'es-AR', currency: 'ARS' },
  BR: { locale: 'pt-BR', currency: 'BRL' },
  // Fácilmente extensible para más países:
  // MX: { locale: 'es-MX', currency: 'MXN' },
  // CO: { locale: 'es-CO', currency: 'COP' },
} as const;

const DEFAULT_COUNTRY = 'AR';

// Ruta principal - servir el archivo HTML con inyección de datos
app.get('/:country([A-Z]{2})?', (req, res) => {
  // 1. Extraer país de la ruta (ej: /AR, /BR)
  const countryFromPath = req.params.country?.toUpperCase() as keyof typeof SUPPORTED_COUNTRIES;

  // 2. Validar que el país esté soportado
  const country = countryFromPath && SUPPORTED_COUNTRIES[countryFromPath]
    ? countryFromPath
    : DEFAULT_COUNTRY;

  // 3. Determinar locale con prioridad:
  //    - Si hay país en la ruta (/BR, /AR): usar su locale
  //    - Si no: detectar por dominio/headers (para producción)
  //    - Fallback: usar locale del país default
  const countryConfig = SUPPORTED_COUNTRIES[country];
  const detectedLocale = detectLanguageFromDomain(req);
  const locale = countryFromPath
    ? countryConfig.locale  // Ruta explícita tiene prioridad
    : detectedLocale;        // Sino, usar detección automática

  // Obtener datos de ejemplo basados en el país
  const exampleData = getExampleDataForCountry(country);

  // Extraer query params - referrer (número) y token (string)
  const referrerParam = req.query.referrer as string;
  const referrer = referrerParam ? parseInt(referrerParam, 10) : 1; // Default: paso 1
  const token = (req.query.token as string) || `demo_token_${Date.now()}`;

  // Datos iniciales con mock data
  const initialData = {
    locale,
    country,
    referrer,
    token,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    timestamp: new Date().toISOString(),
    // Incluir datos mock como ejemplo
    customerData: exampleData?.customerData,
    shippingData: exampleData?.shippingData,
    billingData: exampleData?.billingData,
    paymentData: exampleData?.paymentData,
    orderData: exampleData?.orderData,
    // Incluir países para evitar fetch en cliente (performance)
    countries: MOCK_COUNTRIES,
  };

  // Configuración de performance
  const performanceConfig = {
    CAPTCHA_LOAD_TIMEOUT: parseInt(process.env.CAPTCHA_LOAD_TIMEOUT || '10000'),
    FORM_SUBMIT_TIMEOUT: parseInt(process.env.FORM_SUBMIT_TIMEOUT || '30000'),
    API_TIMEOUT: parseInt(process.env.API_TIMEOUT || '8000'),
    RENDER_TIMEOUT: parseInt(process.env.RENDER_TIMEOUT || '5000'),
  };

  // Leer el index.html - usar dist si existe, sino el root
  const distIndexPath = path.join(__dirname, '../dist/index.html');
  const rootIndexPath = path.join(__dirname, '../index.html');

  // Preferir dist/index.html si existe (build hecho)
  const indexPath = fs.existsSync(distIndexPath) ? distIndexPath : rootIndexPath;

  fs.readFile(indexPath, 'utf8', (err: Error | null, html: string) => {
    if (err) {
      console.error('Error reading index.html:', err);
      return res.status(500).send('Error loading page');
    }

    // Inyectar datos iniciales en el HTML
    const modifiedHtml = html
      .replace('<html lang="es">', `<html lang="${locale}">`)
      .replace('</head>', `
        <script>
          window.__INITIAL_DATA__ = ${JSON.stringify(initialData)};
          window.__PERFORMANCE_CONFIG__ = ${JSON.stringify(performanceConfig)};
        </script>
      </head>`);

    res.status(200).send(modifiedHtml);
  });
});


// Manejo de errores global
app.use((error: Error, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Express Error:', error);

  // Si ya se envió la respuesta, pasar al siguiente manejador
  if (res.headersSent) {
    return next(error);
  }

  res.status(500).json({
    success: false,
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Error interno del servidor',
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  const usingDist = fs.existsSync(path.join(__dirname, '../dist/index.html'));
  if (!usingDist) {
    console.log(`⚠️  Run 'npm run build' first to use compiled assets`);
  }
});

export default app;

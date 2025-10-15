import express from 'express';
import { render } from './entry-server.tsx';
import { logger } from './utils/logger';
import { getMockCountriesResponse } from './api/mocks/countries.mock.js';
import { getExampleDataForCountry } from './api/mocks/users.mock.js';
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
            window.__RENDER_TIME__ = ${renderTime};
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
                  <form action="/api/verification/submit" method="POST" style="padding: 2rem;">
                    ${initialData?.token ? `<input type="hidden" name="token" value="${initialData.token}" />` : ''}
                    ${initialData?.referrer ? `<input type="hidden" name="referrer" value="${initialData.referrer}" />` : ''}
                    
                    <div style="margin-bottom: 1.5rem;">
                      <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 500; color: #111827;">
                        ${locale.startsWith('es') ? 'Nombre completo *' : 'Nome completo *'}
                      </label>
                      <input type="text" name="name" required minlength="2" maxlength="100" 
                             style="width: 100%; padding: 0.75rem 1rem; font-size: 1rem; border: 1px solid #d1d5db; border-radius: 0.375rem;"
                             placeholder="${locale.startsWith('es') ? 'Ingresa tu nombre completo' : 'Digite seu nome completo'}" />
                    </div>
                    
                    <div style="margin-bottom: 1.5rem;">
                      <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 500; color: #111827;">
                        ${locale.startsWith('es') ? 'País *' : 'País *'}
                      </label>
                      <select name="country" required style="width: 100%; padding: 0.75rem 1rem; font-size: 1rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
                        <option value="">${locale.startsWith('es') ? 'Selecciona tu país' : 'Selecione seu país'}</option>
                        <option value="AR">🇦🇷 Argentina</option>
                        <option value="BR">🇧🇷 Brasil</option>
                        <option value="MX">🇲🇽 México</option>
                        <option value="CO">🇨🇴 ${locale.startsWith('es') ? 'Colombia' : 'Colômbia'}</option>
                        <option value="CL">🇨🇱 Chile</option>
                        <option value="PE">🇵🇪 ${locale.startsWith('es') ? 'Perú' : 'Peru'}</option>
                        <option value="UY">🇺🇾 ${locale.startsWith('es') ? 'Uruguay' : 'Uruguai'}</option>
                        <option value="PY">🇵🇾 ${locale.startsWith('es') ? 'Paraguay' : 'Paraguai'}</option>
                        <option value="BO">🇧🇴 ${locale.startsWith('es') ? 'Bolivia' : 'Bolívia'}</option>
                        <option value="EC">🇪🇨 ${locale.startsWith('es') ? 'Ecuador' : 'Equador'}</option>
                        <option value="VE">🇻🇪 Venezuela</option>
                        <option value="CR">🇨🇷 Costa Rica</option>
                        <option value="PA">🇵🇦 Panamá</option>
                        <option value="GT">🇬🇹 Guatemala</option>
                        <option value="HN">🇭🇳 Honduras</option>
                        <option value="SV">🇸🇻 El Salvador</option>
                        <option value="NI">🇳🇮 ${locale.startsWith('es') ? 'Nicaragua' : 'Nicarágua'}</option>
                        <option value="CU">🇨🇺 Cuba</option>
                        <option value="DO">🇩🇴 República Dominicana</option>
                        <option value="PR">🇵🇷 ${locale.startsWith('es') ? 'Puerto Rico' : 'Porto Rico'}</option>
                      </select>
                    </div>
                    
                    <div style="margin-bottom: 1.5rem;">
                      <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 500; color: #111827;">
                        ${locale.startsWith('es') ? 'Dirección *' : 'Endereço *'}
                      </label>
                      <input type="text" name="address" required minlength="10" maxlength="200"
                             style="width: 100%; padding: 0.75rem 1rem; font-size: 1rem; border: 1px solid #d1d5db; border-radius: 0.375rem;"
                             placeholder="${locale.startsWith('es') ? 'Ingresa tu dirección completa' : 'Digite seu endereço completo'}" />
                    </div>
                    
                    <div style="margin: 2rem 0; padding: 1.5rem; background: #fffbeb; border: 1px solid #fed7aa; border-radius: 0.375rem; text-align: center;">
                      <p style="margin: 0; font-size: 0.875rem; color: #c2410c; font-weight: 500;">
                        ${locale.startsWith('es') 
                          ? 'Para continuar, habilita JavaScript en tu navegador para completar la verificación de seguridad.'
                          : 'Para continuar, habilite JavaScript no seu navegador para completar a verificação de segurança.'
                        }
                      </p>
                    </div>
                    
                    <div style="display: flex; justify-content: center; margin: 2rem 0 1.5rem 0;">
                      <button type="submit" disabled style="padding: 0.75rem 2rem; font-size: 1rem; font-weight: 500; color: white; background: #9ca3af; border: none; border-radius: 0.375rem; cursor: not-allowed;">
                        ${locale.startsWith('es') ? 'Verificar Datos' : 'Verificar Dados'}
                      </button>
                    </div>
                    
                    <div style="text-align: center; border-top: 1px solid #e5e7eb; padding-top: 1rem;">
                      <p style="margin: 0 0 0.5rem 0; font-size: 0.875rem; color: #9ca3af;">
                        ${locale.startsWith('es') 
                          ? 'Tus datos están protegidos y solo se utilizan para la verificación.'
                          : 'Seus dados estão protegidos e são usados apenas para verificação.'
                        }
                      </p>
                      <p style="margin: 0; font-size: 0.875rem; color: #9ca3af;">
                        ${locale.startsWith('es') 
                          ? 'Los campos marcados con * son obligatorios.'
                          : 'Os campos marcados com * são obrigatórios.'
                        }
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </noscript>
          
          <div id="root" class="js-fallback">${html}</div>
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
    const {
      name,
      country,
      address,
      captchaToken,
      referrer,
      token,
      customerData,
      shippingData,
      billingData,
      paymentData,
      orderData
    } = req.body;

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
      referrer,
      token,
      hasCustomerData: !!customerData,
      hasShippingData: !!shippingData,
      hasBillingData: !!billingData,
      hasPaymentData: !!paymentData,
      hasOrderData: !!orderData,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });

    // Generar orderId único para la respuesta
    const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    res.json({
      success: true,
      orderId,
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

// API endpoint para obtener países usando mocks
app.get('/api/countries', async (req, res) => {
  try {
    const countries = await getMockCountriesResponse();

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
    logger.error('Example Data API Error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      country: req.params.country,
    });

    res.status(500).json({
      success: false,
      message: 'Error al obtener datos de ejemplo',
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

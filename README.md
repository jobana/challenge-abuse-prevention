# Data Verification Microfrontend

Microfrontend autónomo para verificación de datos de usuario con soporte multi-idioma, reCAPTCHA v2 y diseño responsive basado en el sistema Andes UI de MercadoLibre.

## 🚀 Características

- **React 19** con TypeScript
- **Server-Side Rendering (SSR)** con Express.js
- **Internacionalización (i18n)** - es-AR y pt-BR con detección automática
- **Google reCAPTCHA v2** para prevención de bots
- **Validación** client-side (Yup + React Hook Form) y server-side
- **Diseño responsive** - Mobile-first con breakpoints de MercadoLibre
- **Accesibilidad** - WCAG AAA con axe-core testing
- **Seguridad** - Helmet.js, CSP, CORS, sanitización XSS

## 📋 Requisitos

- Node.js 18+
- npm 9+

## 🛠️ Instalación

```bash
# 1. Clonar repositorio
git clone <repository-url>
cd data-verification-microfrontend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
```

Editar `.env` con tus valores:
```env
VITE_RECAPTCHA_SITE_KEY=tu-clave-publica-recaptcha
VITE_RECAPTCHA_SECRET_KEY=tu-clave-secreta-recaptcha
VITE_API_BASE_URL=http://localhost:3000/api
VITE_ALLOWED_ORIGINS=http://localhost:3000,https://mercadolibre.com.ar,https://mercadolivre.com.br
```

## 🚀 Desarrollo

```bash
# Modo desarrollo con SSR (recomendado)
npm run server:dev

# Modo desarrollo solo frontend
npm run dev

# Construcción para producción
npm run build

# Servidor de producción
npm start
```

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Tests en modo watch
npm run test:watch

# Coverage
npm run test:coverage

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix
```

---

## 📖 GUÍA DE USO DEL MICROFRONTEND

### 🔗 Formato de URL

El microfrontend se invoca mediante una URL simple con el código de país y query parameters opcionales:

```
http://localhost:3000/{COUNTRY}?referrer={stepId}&token={sessionToken}
```

### 📥 Parámetros de Entrada

#### URL Path Parameter:
- **`{COUNTRY}`** (opcional): Código de país de 2 letras (`AR`, `BR`)
  - Si se omite, usa `AR` por defecto
  - Determina el idioma y los datos mock a cargar

#### Query Parameters:
- **`referrer`** (opcional): ID numérico del paso previo que invocó al microfrontend
  - Tipo: `number`
  - Default: `1`
  - Ejemplo: `?referrer=3` (viene del paso 3)

- **`token`** (opcional): Token de la sesión/transacción actual
  - Tipo: `string`
  - Default: `demo_token_{timestamp}`
  - Ejemplo: `?token=tx_abc123xyz`

### 🌍 Ejemplos de URLs

#### Argentina (español) - Paso 3
```
http://localhost:3000/AR?referrer=3&token=tx_abc123xyz
```
- Idioma: es-AR
- Datos precargados: Juan Carlos Pérez González
- Dirección: Av. Corrientes 1234, 5A, Buenos Aires

#### Brasil (portugués) - Paso 5
```
http://localhost:3000/BR?referrer=5&token=tx_def456uvw
```
- Idioma: pt-BR
- Datos precargados: Maria Fernanda Silva Santos
- Dirección: Rua das Flores 567, 12B, São Paulo

#### Sin país especificado (default)
```
http://localhost:3000/?referrer=2&token=tx_session_001
```
- Usa país por defecto: `AR`
- Idioma detectado automáticamente

#### Mínima (solo host)
```
http://localhost:3000/
```
- País: `AR`
- referrer: `1`
- token: `demo_token_{timestamp}`

### 📤 Salida del Microfrontend

Al completar la verificación exitosamente, el microfrontend genera un output con la siguiente estructura:

```typescript
interface MicrofrontendOutput {
  referrer: number;        // Mismo ID que vino de entrada
  captchaToken: string;    // Token del reCAPTCHA verificado
  verified: boolean;       // true si la verificación fue exitosa
  timestamp: string;       // Timestamp ISO de la verificación
  userData?: {             // Datos verificados del usuario
    name: string;
    country: string;
    address: string;
    verificationId: string;
    timestamp: string;
  }
}
```

#### Salida en Consola (Demo/Testing)

**Actualmente**, el output se muestra en la **consola del navegador** con formato organizado:

```javascript
📤 MICROFRONTEND OUTPUT - Verificación Completada
  ✅ Estado: VERIFICADO
  🔙 Referrer (paso previo): 3
  🔐 Captcha Token: 03AGdBq24PxwJH8K5n...
  📋 Verification ID: verification_1729034730123
  ⏰ Timestamp: 2025-10-15T23:45:30.123Z
  🔗 URL de redirección: http://...?referrer=3&token=...
  👤 Datos del usuario
     name: Juan Carlos Pérez González
     country: AR
     address: Av. Corrientes 1234, 5A, Buenos Aires, CABA
```

#### Integración en Producción

En producción, el output se enviará mediante una de estas estrategias (a definir según arquitectura):

**Opción 1: postMessage** (si es iframe/microfrontend embebido)
```javascript
window.parent.postMessage({
  type: 'VERIFICATION_COMPLETE',
  payload: microfrontendOutput
}, 'https://mercadolibre.com.ar');
```

**Opción 2: Redirect con query params** (al siguiente paso)
```javascript
window.location.href = `${referrer}?verified=true&token=${captchaToken}&...`;
```

**Opción 3: Callback function** (proporcionada por la app padre)
```javascript
window.onVerificationComplete(microfrontendOutput);
```

**Opción 4: API call** (a endpoint de integración)
```javascript
fetch('/api/integration/verification-complete', {
  method: 'POST',
  body: JSON.stringify(microfrontendOutput)
});
```

> **Nota**: El código de salida está marcado como `PROVISIONAL` en `src/utils/microfrontendOutput.ts` y será reemplazado según la estrategia de integración elegida.

### 🌐 Detección de Idioma

El sistema detecta automáticamente el idioma con el siguiente orden de prioridad:

1. **URL Path** (`/AR`, `/BR`) - Máxima prioridad
2. **Dominio** (`mercadolibre.com.ar` → es-AR, `mercadolivre.com.br` → pt-BR)
3. **Query Parameter** (`?locale=pt-BR`)
4. **localStorage** (preferencia guardada)
5. **Accept-Language Header** (del navegador)
6. **Fallback**: es-AR

### 🔄 Flujo de Datos

```
┌─────────────────┐
│  Paso Previo    │
│  (Checkout)     │
└────────┬────────┘
         │ referrer + token
         ↓
┌─────────────────────────────────────┐
│  Data Verification Microfrontend    │
│  - SSR con datos precargados        │
│  - Formulario + reCAPTCHA            │
│  - Validación client + server       │
└────────┬────────────────────────────┘
         │ MicrofrontendOutput
         ↓
┌─────────────────┐
│  Siguiente Paso │
│  (Confirmation) │
└─────────────────┘
```

### 🔐 Seguridad

- **reCAPTCHA v2** obligatorio antes del submit
- **Validación dual**: client-side (Yup) y server-side
- **Sanitización XSS**: todos los inputs son sanitizados
- **CORS**: restringido a orígenes permitidos
- **CSP**: Content Security Policy configurado
- **Helmet.js**: headers de seguridad

### 📱 Responsive Design

Breakpoints de MercadoLibre:
- **280px**: Pantallas muy pequeñas
- **640px**: Mobile grande
- **817px**: Tablet pequeño
- **992px**: Tablet/Desktop pequeño
- **1064px**: Desktop

### ♿ Accesibilidad

- **WCAG AAA**: Contraste de colores cumple estándar más alto
- **ARIA** labels y roles en todos los elementos
- **Keyboard navigation**: Tab, Enter, Escape
- **Screen reader** compatible
- **axe-core** testing automático en desarrollo

---

## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes React
│   ├── ui/              # Componentes UI reutilizables
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── ErrorMessage.tsx
│   ├── Header.tsx
│   └── VerificationForm.tsx
├── hooks/               # Custom hooks
│   ├── useVerificationForm.ts
│   ├── useCaptcha.ts
│   ├── useCountries.ts
│   └── useI18n.ts
├── api/                 # Clientes API y mocks
│   ├── clients/
│   └── mocks/
├── i18n/                # Internacionalización
│   ├── index.ts
│   ├── detector.ts
│   └── locales/
│       ├── es-AR.json
│       └── pt-BR.json
├── styles/              # Estilos globales
│   ├── globals.css
│   ├── variables.css
│   └── components.css
├── types/               # Tipos TypeScript
├── utils/               # Utilidades
├── constants/           # Constantes
├── App.tsx              # Componente principal
├── main.tsx             # Entry point cliente
└── server.ts            # Servidor Express con SSR
```

## 🔧 API Endpoints

### GET /api/countries
Obtiene la lista de países disponibles.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "AR",
      "name": "Argentina",
      "code": "AR",
      "flag": "🇦🇷",
      "currency": "ARS",
      "timezone": "America/Argentina/Buenos_Aires",
      "locale": "es-AR"
    }
  ]
}
```

### POST /api/verification/submit
Envía los datos de verificación.

**Request:**
```json
{
  "name": "Juan Pérez",
  "country": "AR",
  "address": "Av. Corrientes 1234, Buenos Aires",
  "captchaToken": "03AGdBq25..."
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Verificación completada exitosamente",
  "data": {
    "id": "verification_1234567890",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "code": "VALIDATION_ERROR",
  "message": "Invalid request data",
  "errors": [
    {
      "field": "captchaToken",
      "message": "Captcha token is required"
    }
  ]
}
```

## 🚀 Deployment

### Variables de entorno de producción

```env
NODE_ENV=production
PORT=3000
VITE_RECAPTCHA_SITE_KEY=tu-clave-produccion
VITE_RECAPTCHA_SECRET_KEY=tu-clave-secreta-produccion
VITE_API_BASE_URL=https://api.tudominio.com
VITE_ALLOWED_ORIGINS=https://mercadolibre.com.ar,https://mercadolivre.com.br
```

### URLs de Producción

```
# Argentina
https://verification.mercadolibre.com.ar/AR?referrer=3&token={session_token}

# Brasil
https://verification.mercadolivre.com.br/BR?referrer=5&token={session_token}
```

## 📊 Performance

- **SSR** para first paint rápido
- **Prefetch** de recursos críticos
- **Datos precargados** en `window.__INITIAL_DATA__` (evita fetch inicial)
- **Compression** gzip en servidor
- **Code splitting** automático con Vite
- **React.memo** para optimización de renders

## 🐛 Debugging

```bash
# Ver logs del servidor
npm run server:dev

# Logs en producción
NODE_ENV=production npm start
```

### Herramientas de desarrollo
- **React DevTools** - Inspección de componentes
- **axe DevTools** - Testing de accesibilidad
- **Lighthouse** - Auditoría de performance
- **Console Output** - Evidencia de salida del microfrontend

---

## 📝 Notas Importantes

1. **reCAPTCHA v2**: Se usa la versión 2 (checkbox) según prototipo. No cambiar a v3.
2. **Datos Mock**: Los datos precargados son solo para demo. En producción vendrán de los servicios reales.
3. **Salida Provisional**: El `console.log` de salida es temporal. Será reemplazado por la integración real (postMessage, redirect, etc.).
4. **Idiomas Soportados**: Actualmente es-AR y pt-BR. Fácilmente extensible a otros países de LATAM.

## 📜 Licencia

Proyecto interno de MercadoLibre.

---

**Versión:** 1.0.0
**Última actualización:** 2025-10-16

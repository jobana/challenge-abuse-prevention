# Data Verification Microfrontend

Un microfrontend para verificación de datos de usuario con soporte para múltiples idiomas, CAPTCHA y diseño responsive.

## 🚀 Características

- **React 19** con TypeScript
- **Server-Side Rendering (SSR)** con Express.js
- **Internacionalización (i18n)** con soporte para ES-AR y PT-BR
- **Google reCAPTCHA v2** integrado
- **Formularios reactivos** con validación
- **Diseño responsive** mobile-first
- **Accesibilidad** con axe-core
- **Testing** completo con Jest y React Testing Library
- **Estilos** con SASS y CSS Modules
- **Componentes reutilizables** UI

## 📋 Requisitos

- Node.js 18+ 
- npm 9+

## 🛠️ Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd data-verification-microfrontend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
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

### Modo desarrollo (solo frontend)
```bash
npm run dev
```

### Modo desarrollo (con servidor SSR)
```bash
npm run server:dev
```

### Construcción
```bash
npm run build
```

### Producción
```bash
npm start
```

## 🧪 Testing

### Ejecutar tests
```bash
npm test
```

### Tests en modo watch
```bash
npm run test:watch
```

### Coverage
```bash
npm run test:coverage
```

### Linting
```bash
npm run lint
npm run lint:fix
```

### Type checking
```bash
npm run type-check
```

## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes React
│   ├── ui/              # Componentes UI reutilizables
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Modal.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── ErrorMessage.tsx
│   └── VerificationForm.tsx
├── hooks/               # Custom hooks
│   ├── useVerificationForm.ts
│   ├── useCaptcha.ts
│   ├── useCountries.ts
│   └── useI18n.ts
├── api/                 # Clientes API
│   ├── clients/
│   └── mocks/
├── i18n/                # Internacionalización
│   ├── index.ts
│   ├── detector.ts
│   └── locales/
├── styles/              # Estilos globales
│   ├── globals.scss
│   ├── variables.scss
│   └── _variables.scss
├── types/               # Tipos TypeScript
├── utils/               # Utilidades
├── tests/               # Tests
├── App.tsx              # Componente principal
├── main.tsx             # Entry point cliente
├── entry-server.tsx     # Entry point servidor
└── server.ts            # Servidor Express
```

## 🌐 Internacionalización

El sistema detecta automáticamente el idioma basado en:

1. **Dominio**: `mercadolibre.com.ar` → ES-AR, `mercadolivre.com.br` → PT-BR
2. **Query parameter**: `?lang=pt-BR`
3. **Accept-Language header**: `pt-BR,pt;q=0.9`
4. **Default**: ES-AR

### Agregar nuevos idiomas

1. Crear archivo de traducción en `src/i18n/locales/`
2. Actualizar `src/i18n/detector.ts`
3. Agregar dominio en `VITE_ALLOWED_ORIGINS`

## 🔒 Seguridad

- **CSP Headers** configurados
- **CORS** restringido a orígenes permitidos
- **Helmet.js** para headers de seguridad
- **reCAPTCHA** para prevención de bots
- **Validación** de entrada en cliente y servidor

## 🎨 Componentes UI

### Button
```tsx
<Button 
  variant="primary" 
  size="medium" 
  onClick={handleClick}
  disabled={isLoading}
>
  Click me
</Button>
```

### Input
```tsx
<Input
  label="Nombre"
  placeholder="Ingresa tu nombre"
  required
  error={errors.name?.message}
/>
```

### Select
```tsx
<Select
  label="País"
  placeholder="Selecciona tu país"
  required
>
  <option value="AR">Argentina</option>
  <option value="BR">Brasil</option>
</Select>
```

### Modal
```tsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Confirmación"
  size="medium"
>
  <p>¿Estás seguro?</p>
</Modal>
```

## 📱 Responsive Design

- **Mobile-first** approach
- **Breakpoints**: 480px, 768px, 1024px, 1280px
- **Touch-friendly** interfaces
- **Optimized** para dispositivos móviles

## ♿ Accesibilidad

- **ARIA** labels y roles
- **Keyboard** navigation
- **Screen reader** compatible
- **axe-core** testing integrado
- **High contrast** support
- **Reduced motion** support

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
      "flag": "🇦🇷"
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

**Response:**
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

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📊 Performance

- **Lazy loading** de componentes
- **Code splitting** automático
- **Compresión** gzip
- **Caching** de archivos estáticos
- **SSR** para mejor SEO
- **Prefetching** de recursos críticos

## 🐛 Debugging

### Logs
```bash
# Ver logs del servidor
npm run server:dev

# Logs en producción
NODE_ENV=production npm start
```

### Herramientas de desarrollo
- **React DevTools**
- **Redux DevTools** (si se usa)
- **axe DevTools** para accesibilidad
- **Lighthouse** para performance

## 🤝 Contribución

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

Para soporte, contacta a [tu-email@ejemplo.com](mailto:tu-email@ejemplo.com) o crea un issue en el repositorio.

## 🔄 Changelog

### v1.0.0
- Implementación inicial
- Soporte para ES-AR y PT-BR
- Integración con reCAPTCHA
- Componentes UI reutilizables
- Testing completo
- SSR con Express.js

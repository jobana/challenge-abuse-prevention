Implementación de SSR en nuestro microfrontend
¿Dónde se implementa SSR?
En nuestra estructura, el SSR se implementa en varios puntos clave:
1. Punto de Entrada del Servidor
// src/entry-server.tsx
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { App } from './App';

export async function render(url: string, initialData?: any) {
  const html = ReactDOMServer.renderToString(
    React.createElement(App, { initialData })
  );
  
  return html;
}
2. Servidor Express
// src/app/server.ts
import express from 'express';
import { render } from '../entry-server';

const app = express();

app.get('*', async (req, res) => {
  try {
    // Extraer datos de query params
    const initialData = extractDataFromQueryParams(req.query);
    
    // Renderizar con SSR
    const html = await render(req.url, initialData);
    
    // Enviar HTML completo
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Verificación de Datos</title>
          <script>
            window.__INITIAL_DATA__ = ${JSON.stringify(initialData)};
          </script>
        </head>
        <body>
          <div id="root">${html}</div>
          <script type="module" src="/src/entry-client.tsx"></script>
        </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send('Error interno del servidor');
  }
});
3. Componentes con SSR
// src/components/verification/DataVerification.tsx
import React from 'react';
import { VerificationData } from '@types/verification.types';

interface DataVerificationProps {
  initialData?: VerificationData;
}

export const DataVerification: React.FC<DataVerificationProps> = ({ 
  initialData 
}) => {
  // Los datos ya están disponibles en el servidor
  const [data, setData] = React.useState(initialData);
  
  return (
    <div>
      {/* Contenido renderizado en el servidor */}
      {data && (
        <div>
          <h2>Verificación de Datos</h2>
          {/* Formulario con datos pre-cargados */}
        </div>
      )}
    </div>
  );
};
Ventajas del SSR en nuestro caso:
1. SEO y Accesibilidad
Los datos del formulario son indexables
Mejor experiencia para lectores de pantalla
Contenido visible sin JavaScript
2. Performance
Carga inicial más rápida
Datos pre-renderizados
Menos tiempo de hidratación
3. Experiencia de Usuario
Formulario visible inmediatamente
Datos pre-cargados desde query params
Funciona sin JavaScript
4. Seguridad
Validación en el servidor
Datos sensibles no expuestos en el cliente
Tokens de verificación seguros
Implementación específica para nuestro microfrontend:
1. Extracción de Query Params en el Servidor
// src/app/middleware/ssr.ts
export const extractDataFromQueryParams = (query: any) => {
  return {
    customerData: query.customerData ? JSON.parse(decodeURIComponent(query.customerData)) : null,
    shippingData: query.shippingData ? JSON.parse(decodeURIComponent(query.shippingData)) : null,
    billingData: query.billingData ? JSON.parse(decodeURIComponent(query.billingData)) : null,
    paymentData: query.paymentData ? JSON.parse(decodeURIComponent(query.paymentData)) : null,
    orderData: query.orderData ? JSON.parse(decodeURIComponent(query.orderData)) : null,
    referrer: query.referrer || '/',
    token: query.token || '',
  };
};
2. Hidratación en el Cliente
// src/entry-client.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';

const initialData = window.__INITIAL_DATA__;

ReactDOM.hydrateRoot(
  document.getElementById('root')!,
  React.createElement(App, { initialData })
);
3. Estrategia No-Script
// src/components/forms/DataVerificationForm.tsx
export const DataVerificationForm: React.FC = () => {
  return (
    <form action="/api/verification/submit" method="POST">
      {/* Formulario que funciona sin JavaScript */}
      <input type="hidden" name="token" value={token} />
      <input type="hidden" name="referrer" value={referrer} />
      
      {/* Campos del formulario */}
      
      <button type="submit">Verificar y Continuar</button>
    </form>
  );
};
Beneficios específicos para nuestro microfrontend:
Datos pre-cargados: Los query params se procesan en el servidor
Formulario funcional: Works sin JavaScript
Validación híbrida: Servidor + Cliente
Performance: Carga rápida de datos críticos
SEO: Contenido indexable
Accesibilidad: Funciona con lectores de pantalla
El SSR es crítico en nuestro caso porque:
Los datos vienen por query params (necesitan procesamiento)
Es un formulario crítico (debe funcionar sin JS)
Necesitamos validación en el servidor
Mejor experiencia de usuario
import { MicrofrontendOutput } from '../types/queryParams.types';
import { buildQueryString } from './queryParams';

/**
 * Envía el resultado del microfrontend a la aplicación padre
 *
 * PROVISIONAL: Por ahora solo muestra en consola para testing/demo
 *
 * En producción, esto será reemplazado por una de estas estrategias:
 * - postMessage al parent window (si es iframe)
 * - Callback function proporcionada por la app padre
 * - Redirect con query params al siguiente paso
 * - API call a un endpoint de integración
 */
export function sendMicrofrontendOutput(output: MicrofrontendOutput): void {
  // Construir URL de ejemplo (para mostrar cómo se vería el redirect)
  const redirectParams = {
    token: output.captchaToken,
    referrer: output.referrer,
    verified: output.verified.toString(),
    orderId: output.userData?.verificationId || '',
  };
  const redirectUrl = `${output.referrer}${buildQueryString(redirectParams)}`;

  // Mostrar output en consola de forma organizada
  console.group('📤 MICROFRONTEND OUTPUT - Verificación Completada');
  console.log('✅ Estado:', output.verified ? 'VERIFICADO' : 'NO VERIFICADO');
  console.log('🔙 Referrer (paso previo):', output.referrer);
  console.log('🔐 Captcha Token:', output.captchaToken);
  console.log('📋 Verification ID:', output.userData?.verificationId || 'N/A');
  console.log('⏰ Timestamp:', output.timestamp);
  console.log('🔗 URL de redirección:', redirectUrl);

  if (output.userData) {
    console.group('👤 Datos del usuario');
    Object.entries(output.userData).forEach(([key, value]) => {
      if (key !== 'verificationId' && key !== 'timestamp') {
        console.log(`   ${key}:`, value);
      }
    });
    console.groupEnd();
  }
  console.groupEnd();

  // TODO: Cuando se integren los servicios, reemplazar con la redireccion o envio de la data
}

/**
 * Crea el objeto de salida del microfrontend
 */
export function createMicrofrontendOutput(
  referrer: number,
  captchaToken: string,
  verified: boolean,
  userData?: any
): MicrofrontendOutput {
  return {
    referrer,
    captchaToken,
    verified,
    timestamp: new Date().toISOString(),
    userData,
  };
}

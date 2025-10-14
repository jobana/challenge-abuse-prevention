export const MESSAGES = {
  // Success messages
  SUCCESS: {
    DATA_SAVED: 'Datos guardados correctamente',
    VERIFICATION_COMPLETE: 'Verificación completada exitosamente',
    ORDER_CONFIRMED: 'Orden confirmada exitosamente',
  },
  
  // Error messages
  ERROR: {
    GENERIC: 'Ha ocurrido un error inesperado',
    NETWORK: 'Error de conexión. Verifica tu internet',
    VALIDATION: 'Por favor, corrige los errores en el formulario',
    REQUIRED_FIELD: 'Este campo es obligatorio',
    INVALID_EMAIL: 'Ingresa un email válido',
    INVALID_PHONE: 'Ingresa un teléfono válido',
    INVALID_DOCUMENT: 'Ingresa un documento válido',
    INVALID_CARD: 'Ingresa una tarjeta válida',
    INVALID_DATE: 'Ingresa una fecha válida',
    MIN_LENGTH: 'Debe tener al menos {min} caracteres',
    MAX_LENGTH: 'No puede tener más de {max} caracteres',
    INVALID_FORMAT: 'Formato inválido',
  },
  
  // Loading messages
  LOADING: {
    SAVING: 'Guardando...',
    LOADING: 'Cargando...',
    PROCESSING: 'Procesando...',
    VERIFYING: 'Verificando...',
    SUBMITTING: 'Enviando...',
  },
  
  // Form labels
  LABELS: {
    CUSTOMER_INFO: 'Información del Cliente',
    SHIPPING_INFO: 'Información de Envío',
    BILLING_INFO: 'Información de Facturación',
    PAYMENT_INFO: 'Información de Pago',
    ORDER_SUMMARY: 'Resumen de la Orden',
    VERIFY_DATA: 'Verificar Datos',
    CONFIRM_ORDER: 'Confirmar Orden',
    EDIT: 'Editar',
    SAVE: 'Guardar',
    CANCEL: 'Cancelar',
    CONTINUE: 'Continuar',
    BACK: 'Volver',
    SUBMIT: 'Enviar',
  },
  
  // Security messages
  SECURITY: {
    SECURE_CONNECTION: 'Conexión segura',
    DATA_PROTECTED: 'Tus datos están protegidos',
    SSL_ENCRYPTED: 'Conexión encriptada SSL',
    PRIVACY_POLICY: 'Política de Privacidad',
    TERMS_CONDITIONS: 'Términos y Condiciones',
  },
} as const;

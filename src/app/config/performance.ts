// Configuración de performance optimizada
export const PERFORMANCE_CONFIG = {
  // Timeouts optimizados para UX
  CAPTCHA_LOAD_TIMEOUT: 3000, // 3 segundos máximo para cargar captcha
  FORM_SUBMIT_TIMEOUT: 5000,  // 5 segundos máximo para submit
  API_TIMEOUT: 8000,          // 8 segundos máximo para API calls
  
  // Lazy loading
  CAPTCHA_LAZY_LOAD: true,
  COMPONENTS_LAZY_LOAD: true,
  
  // Prefetch
  PREFETCH_CRITICAL_RESOURCES: true,
  PREFETCH_NEXT_STEP: true,
  
  // Bundle optimization
  CODE_SPLITTING: true,
  TREE_SHAKING: true,
  
  // Caching
  CACHE_STRATEGY: 'aggressive',
  CACHE_DURATION: 300000, // 5 minutos
  
  // Progressive enhancement
  PROGRESSIVE_LOADING: true,
  SKELETON_LOADING: true,
} as const;

export const UX_CONFIG = {
  // Feedback inmediato
  INSTANT_FEEDBACK: true,
  DEBOUNCE_VALIDATION: 300, // 300ms debounce para validación
  
  // UI no bloqueante
  NON_BLOCKING_UI: true,
  PARALLEL_PROCESSING: true,
  
  // Simplicidad
  MINIMAL_FIELDS: true,
  AUTO_SAVE: true,
  AUTO_SAVE_INTERVAL: 2000, // 2 segundos
  
  // Responsive
  MOBILE_FIRST: true,
  TOUCH_OPTIMIZED: true,
  
  // Accesibilidad
  SCREEN_READER_OPTIMIZED: true,
  KEYBOARD_NAVIGATION: true,
} as const;

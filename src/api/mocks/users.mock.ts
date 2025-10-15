import { User, UserAddress, UserPreferences } from '@types/api.types';

/**
 * Datos mock para la API meli-users
 * Un usuario por cada país soportado (AR y BR)
 */
export const MOCK_USERS: User[] = [
  {
    id: 'user-ar-001',
    email: 'juan.perez@mercadolibre.com.ar',
    firstName: 'Juan Carlos',
    lastName: 'Pérez González',
    phone: '+54 11 4567-8901',
    address: {
      street: 'Av. Corrientes',
      number: '1234',
      apartment: '5A',
      city: 'Buenos Aires',
      state: 'CABA',
      postalCode: '1043',
      country: 'AR',
    },
    preferences: {
      language: 'es-AR',
      currency: 'ARS',
      notifications: true,
    },
  },
  {
    id: 'user-br-001',
    email: 'maria.silva@mercadolivre.com.br',
    firstName: 'Maria Fernanda',
    lastName: 'Silva Santos',
    phone: '+55 11 98765-4321',
    address: {
      street: 'Rua das Flores',
      number: '567',
      apartment: '12B',
      city: 'São Paulo',
      state: 'SP',
      postalCode: '01234-567',
      country: 'BR',
    },
    preferences: {
      language: 'pt-BR',
      currency: 'BRL',
      notifications: true,
    },
  },
];

/**
 * Simula la respuesta de la API meli-users
 */
export const getMockUserResponse = async (userId: string): Promise<User | null> => {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 150));
  
  // Simular error ocasional (3% de probabilidad)
  if (Math.random() < 0.03) {
    throw new Error('Failed to fetch user data');
  }
  
  const user = MOCK_USERS.find(u => u.id === userId);
  return user || null;
};

/**
 * Simula la búsqueda de usuarios por email
 */
export const searchUserByEmail = async (email: string): Promise<User | null> => {
  const users = await Promise.all(
    MOCK_USERS.map(user => getMockUserResponse(user.id))
  );

  const validUsers = users.filter(Boolean) as User[];
  return validUsers.find(user => user.email === email) || null;
};

/**
 * Obtiene un usuario mock por código de país
 */
export const getUserByCountry = async (countryCode: string): Promise<User | null> => {
  // Simular latencia
  await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 100));

  const user = MOCK_USERS.find(u => u.address?.country === countryCode);
  return user || null;
};

/**
 * Obtiene datos de ejemplo para inicializar el microfrontend
 */
export const getExampleDataForCountry = (countryCode: string) => {
  const user = MOCK_USERS.find(u => u.address?.country === countryCode);

  if (!user) return null;

  return {
    customerData: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      country: user.address?.country,
    },
    shippingData: {
      address: `${user.address?.street} ${user.address?.number}${user.address?.apartment ? ', ' + user.address.apartment : ''}, ${user.address?.city}, ${user.address?.state}`,
      country: user.address?.country,
      postalCode: user.address?.postalCode,
    },
    billingData: {
      sameAsShipping: true,
      address: user.address,
    },
    paymentData: {
      currency: user.preferences.currency,
    },
    orderData: {
      total: countryCode === 'AR' ? 89999 : 299.99, // Precios ejemplo
      currency: user.preferences.currency,
    },
  };
};

/**
 * Simula la actualización de datos de usuario
 */
export const updateMockUser = async (userId: string, updates: Partial<User>): Promise<User | null> => {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 100));
  
  // Simular error ocasional (2% de probabilidad)
  if (Math.random() < 0.02) {
    throw new Error('Failed to update user data');
  }
  
  const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    return null;
  }
  
  // Actualizar el usuario mock
  MOCK_USERS[userIndex] = {
    ...MOCK_USERS[userIndex],
    ...updates,
  };
  
  return MOCK_USERS[userIndex];
};

/**
 * Simula la validación de datos de usuario
 */
export const validateUserData = async (userData: Partial<User>): Promise<{ valid: boolean; errors: string[] }> => {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50));
  
  const errors: string[] = [];
  
  if (userData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
    errors.push('Invalid email format');
  }
  
  if (userData.phone && !/^\+?[\d\s\-\(\)]+$/.test(userData.phone)) {
    errors.push('Invalid phone format');
  }
  
  if (userData.firstName && userData.firstName.length < 2) {
    errors.push('First name must be at least 2 characters');
  }
  
  if (userData.lastName && userData.lastName.length < 2) {
    errors.push('Last name must be at least 2 characters');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};

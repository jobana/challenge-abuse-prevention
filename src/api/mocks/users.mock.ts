import { User, UserAddress, UserPreferences } from '@types/api.types';

/**
 * Datos mock para la API meli-users
 * Simula usuarios con información completa
 */
export const MOCK_USERS: User[] = [
  {
    id: 'user-001',
    email: 'juan.perez@example.com',
    firstName: 'Juan',
    lastName: 'Pérez',
    phone: '+54 11 1234-5678',
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
    id: 'user-002',
    email: 'maria.silva@example.com',
    firstName: 'Maria',
    lastName: 'Silva',
    phone: '+55 11 9876-5432',
    address: {
      street: 'Rua das Flores',
      number: '567',
      city: 'São Paulo',
      state: 'SP',
      postalCode: '01234-567',
      country: 'BR',
    },
    preferences: {
      language: 'pt-BR',
      currency: 'BRL',
      notifications: false,
    },
  },
  {
    id: 'user-003',
    email: 'carlos.rodriguez@example.com',
    firstName: 'Carlos',
    lastName: 'Rodríguez',
    phone: '+52 55 1111-2222',
    address: {
      street: 'Calle Reforma',
      number: '890',
      apartment: '12B',
      city: 'Ciudad de México',
      state: 'CDMX',
      postalCode: '06600',
      country: 'MX',
    },
    preferences: {
      language: 'es-MX',
      currency: 'MXN',
      notifications: true,
    },
  },
  {
    id: 'user-004',
    email: 'ana.garcia@example.com',
    firstName: 'Ana',
    lastName: 'García',
    phone: '+57 1 333-4444',
    address: {
      street: 'Carrera 7',
      number: '123-45',
      city: 'Bogotá',
      state: 'Cundinamarca',
      postalCode: '110111',
      country: 'CO',
    },
    preferences: {
      language: 'es-CO',
      currency: 'COP',
      notifications: true,
    },
  },
  {
    id: 'user-005',
    email: 'pedro.martinez@example.com',
    firstName: 'Pedro',
    lastName: 'Martínez',
    phone: '+56 2 5555-6666',
    address: {
      street: 'Av. Libertador',
      number: '789',
      city: 'Santiago',
      state: 'RM',
      postalCode: '8320000',
      country: 'CL',
    },
    preferences: {
      language: 'es-CL',
      currency: 'CLP',
      notifications: false,
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

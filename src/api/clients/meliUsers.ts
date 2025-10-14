import { ApiClient, simulateLatency } from './base';
import { User, UserResponse } from '@types/api.types';
import { getMockUserResponse, searchUserByEmail, updateMockUser, validateUserData } from '@api/mocks/users.mock';

/**
 * Cliente para la API meli-users
 * Maneja la obtención y actualización de datos de usuarios
 */
export class MeliUsersClient extends ApiClient {
  constructor(baseURL: string = '/api/meli-users') {
    super(baseURL, 6000); // 6 segundos timeout para usuarios
  }

  /**
   * Obtiene datos de un usuario por ID
   */
  async getUser(userId: string): Promise<UserResponse> {
    try {
      // En desarrollo, usar datos mock
      if (process.env.NODE_ENV === 'development') {
        await simulateLatency(150, 400);
        const user = await getMockUserResponse(userId);
        
        if (!user) {
          throw new Error('User not found');
        }
        
        return {
          data: user,
          success: true,
        };
      }

      // En producción, hacer petición real
      return await this.get<User>(`/users/${userId}`);
    } catch (error) {
      console.error(`Error fetching user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Busca un usuario por email
   */
  async getUserByEmail(email: string): Promise<UserResponse> {
    try {
      // En desarrollo, usar datos mock
      if (process.env.NODE_ENV === 'development') {
        await simulateLatency(100, 300);
        const user = await searchUserByEmail(email);
        
        if (!user) {
          throw new Error('User not found');
        }
        
        return {
          data: user,
          success: true,
        };
      }

      // En producción, hacer petición real
      return await this.get<User>(`/users/email/${encodeURIComponent(email)}`);
    } catch (error) {
      console.error(`Error fetching user by email ${email}:`, error);
      throw error;
    }
  }

  /**
   * Actualiza datos de un usuario
   */
  async updateUser(userId: string, userData: Partial<User>): Promise<UserResponse> {
    try {
      // Validar datos antes de enviar
      const validation = await validateUserData(userData);
      if (!validation.valid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      // En desarrollo, usar datos mock
      if (process.env.NODE_ENV === 'development') {
        await simulateLatency(200, 500);
        const updatedUser = await updateMockUser(userId, userData);
        
        if (!updatedUser) {
          throw new Error('User not found');
        }
        
        return {
          data: updatedUser,
          success: true,
        };
      }

      // En producción, hacer petición real
      return await this.put<User>(`/users/${userId}`, userData);
    } catch (error) {
      console.error(`Error updating user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Crea un nuevo usuario
   */
  async createUser(userData: Omit<User, 'id'>): Promise<UserResponse> {
    try {
      // Validar datos antes de enviar
      const validation = await validateUserData(userData);
      if (!validation.valid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      // En desarrollo, simular creación
      if (process.env.NODE_ENV === 'development') {
        await simulateLatency(300, 600);
        
        // Simular ID generado
        const newUser: User = {
          ...userData,
          id: `user-${Date.now()}`,
        };
        
        return {
          data: newUser,
          success: true,
        };
      }

      // En producción, hacer petición real
      return await this.post<User>('/users', userData);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Elimina un usuario
   */
  async deleteUser(userId: string): Promise<{ success: boolean; message: string }> {
    try {
      // En desarrollo, simular eliminación
      if (process.env.NODE_ENV === 'development') {
        await simulateLatency(100, 300);
        
        return {
          success: true,
          message: 'User deleted successfully',
        };
      }

      // En producción, hacer petición real
      await this.delete(`/users/${userId}`);
      
      return {
        success: true,
        message: 'User deleted successfully',
      };
    } catch (error) {
      console.error(`Error deleting user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Actualiza las preferencias de un usuario
   */
  async updateUserPreferences(userId: string, preferences: Partial<User['preferences']>): Promise<UserResponse> {
    try {
      // En desarrollo, usar datos mock
      if (process.env.NODE_ENV === 'development') {
        await simulateLatency(100, 250);
        
        // Obtener usuario actual
        const currentUser = await getMockUserResponse(userId);
        if (!currentUser) {
          throw new Error('User not found');
        }
        
        // Actualizar preferencias
        const updatedUser = await updateMockUser(userId, {
          preferences: {
            ...currentUser.preferences,
            ...preferences,
          },
        });
        
        return {
          data: updatedUser!,
          success: true,
        };
      }

      // En producción, hacer petición real
      return await this.put<User>(`/users/${userId}/preferences`, preferences);
    } catch (error) {
      console.error(`Error updating preferences for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Actualiza la dirección de un usuario
   */
  async updateUserAddress(userId: string, address: Partial<User['address']>): Promise<UserResponse> {
    try {
      // En desarrollo, usar datos mock
      if (process.env.NODE_ENV === 'development') {
        await simulateLatency(150, 350);
        
        // Obtener usuario actual
        const currentUser = await getMockUserResponse(userId);
        if (!currentUser) {
          throw new Error('User not found');
        }
        
        // Actualizar dirección
        const updatedUser = await updateMockUser(userId, {
          address: {
            ...currentUser.address,
            ...address,
          },
        });
        
        return {
          data: updatedUser!,
          success: true,
        };
      }

      // En producción, hacer petición real
      return await this.put<User>(`/users/${userId}/address`, address);
    } catch (error) {
      console.error(`Error updating address for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Verifica si un email está disponible
   */
  async isEmailAvailable(email: string): Promise<{ available: boolean }> {
    try {
      // En desarrollo, simular verificación
      if (process.env.NODE_ENV === 'development') {
        await simulateLatency(50, 150);
        
        // Simular que algunos emails están ocupados
        const occupiedEmails = ['admin@example.com', 'test@example.com'];
        const available = !occupiedEmails.includes(email.toLowerCase());
        
        return { available };
      }

      // En producción, hacer petición real
      const response = await this.get<{ available: boolean }>(`/users/email-available/${encodeURIComponent(email)}`);
      return response.data;
    } catch (error) {
      console.error(`Error checking email availability for ${email}:`, error);
      throw error;
    }
  }
}

// Instancia singleton del cliente
export const meliUsersClient = new MeliUsersClient();

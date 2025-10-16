/**
 * Exporta todos los mocks para uso compartido entre server y client
 */

export { MOCK_COUNTRIES, getMockCountriesResponse, searchCountries, getCountryByCode } from './countries.mock';
export {
  MOCK_USERS,
  getMockUserResponse,
  searchUserByEmail,
  updateMockUser,
  validateUserData,
  getExampleDataForCountry,
  getUserByCountry
} from './users.mock';

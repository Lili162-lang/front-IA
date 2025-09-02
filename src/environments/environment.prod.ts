export const environment = {
  production: true,
  apiUrl: 'https://10.72.4.32:7110/api/v1',
  apiTimeout: 30000,
  enableLogging: false,
  auth: {
    tokenKey: 'accessToken',
    refreshTokenKey: 'refreshToken',
    userKey: 'userData'
  },
  features: {
    enableMockData: false,
    enableDebugMode: false
  }
};

export const environment = {
  production: false,
  apiUrl: 'https://10.72.4.32:7110/api/v1',
  apiTimeout: 30000,
  enableLogging: true,
  auth: {
    tokenKey: 'accessToken',
    refreshTokenKey: 'refreshToken',
    userKey: 'userData'
  },
  features: {
    enableMockData: true,
    enableDebugMode: true
  }
};

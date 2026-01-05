export const environment = {
  production: false,
  apiGateway: 'http://localhost:9000', // Best practice: Use a Gateway
  // If direct access is needed:
  services: {
    auth: 'http://localhost:8081/api',
    claims: 'http://localhost:8082/api',
    hospital: 'http://localhost:8083/api',
    policy: 'http://localhost:8084/api',
    user: 'http://localhost:8085/api'
  }
};
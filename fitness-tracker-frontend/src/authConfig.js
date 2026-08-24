const keycloakBaseUrl = import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8181';

const authConfig = {
  clientId: 'oauth2-pkce-client',
  authorizationEndpoint: `${keycloakBaseUrl}/realms/fitness-oauth2/protocol/openid-connect/auth`,
  tokenEndpoint: `${keycloakBaseUrl}/realms/fitness-oauth2/protocol/openid-connect/token`,
  redirectUri: typeof window !== 'undefined' ? `${window.location.origin}/` : 'http://localhost:5173/',
  scope: 'openid profile email offline_access',
  autoLogin: false,
  onRefreshTokenExpire: (event) => event.logIn(),
}

export default authConfig;

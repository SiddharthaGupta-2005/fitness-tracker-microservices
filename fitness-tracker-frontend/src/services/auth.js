import axios from 'axios';

const KEYCLOAK_TOKEN_URL = 'http://localhost:8181/realms/fitness-oauth2/protocol/openid-connect/token';
const CLIENT_ID = 'oauth2-pkce-client';

export const parseJwt = (token) => {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error parsing JWT:', e);
    return null;
  }
};

export const loginWithCredentials = async (username, password) => {
  const params = new URLSearchParams();
  params.append('client_id', CLIENT_ID);
  params.append('grant_type', 'password');
  params.append('username', username.trim());
  params.append('password', password);
  params.append('scope', 'openid profile email');

  const response = await axios.post(KEYCLOAK_TOKEN_URL, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const { access_token, id_token, refresh_token } = response.data;
  const user = parseJwt(id_token || access_token);

  return {
    token: access_token,
    user: user,
    refreshToken: refresh_token,
  };
};

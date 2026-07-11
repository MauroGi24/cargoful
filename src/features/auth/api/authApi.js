import { AUTH_TOKEN_EXPIRES_IN_MINS } from '../../../core/config/constants';
import { httpClient } from '../../../core/api';

export async function login({ username, password }) {
  return httpClient.post('/auth/login', {
    username,
    password,
    expiresInMins: AUTH_TOKEN_EXPIRES_IN_MINS,
  });
}

export async function getMe() {
  return httpClient.get('/auth/me');
}

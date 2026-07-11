import { API_BASE_URL } from '../config/constants';
import { ApiError } from './types';

export function createHttpClient({ baseUrl = API_BASE_URL, getAccessToken } = {}) {
  async function request(path, options = {}) {
    const { headers: customHeaders, body, ...fetchOptions } = options;

    const headers = {
      Accept: 'application/json',
      ...customHeaders,
    };

    if (body !== undefined) {
      headers['Content-Type'] = 'application/json';
    }

    if (getAccessToken) {
      const token = await getAccessToken();

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    const url = `${baseUrl}${path}`;

    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw await ApiError.fromResponse(response);
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  }

  return {
    get: (path, options) => request(path, { ...options, method: 'GET' }),
    post: (path, body, options) => request(path, { ...options, method: 'POST', body })
  };
}

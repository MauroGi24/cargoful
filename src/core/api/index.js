import { tokenStorage } from '../storage';
import { createAuthInterceptor } from './authInterceptor';
import { createHttpClient } from './httpClient';

export { ApiError, isApiError } from './types';

export const httpClient = createHttpClient({
  getAccessToken: createAuthInterceptor(tokenStorage),
});

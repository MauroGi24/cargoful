import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { isApiError } from '../../../core/api';
import { tokenStorage } from '../../../core/storage';
import { getMe, login as loginRequest } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      try {
        const hasToken = await tokenStorage.hasAccessToken();

        if (!hasToken) {
          return;
        }

        const user = await getMe();

        setUser(user);
        setIsAuthenticated(true);
      } catch {
        await tokenStorage.clearTokens();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  const login = useCallback(async ({ username, password }) => {
    const response = await loginRequest({ username, password });

    await tokenStorage.saveTokens({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    });

    setUser(response);
    setIsAuthenticated(true);

    return response;
  }, []);

  const logout = useCallback(async () => {
    await tokenStorage.clearTokens();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
    }),
    [user, isAuthenticated, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve essere usato dentro AuthProvider');
  }

  return context;
}

export function getLoginErrorMessage(error) {
  if (isApiError(error)) {
    return 'Credenziali non valide. Riprova.';
  }

  return 'Errore di connessione. Riprova.';
}

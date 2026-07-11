import * as SecureStore from 'expo-secure-store';

const TOKEN_STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
};

export class SecureTokenStorage {
  async getAccessToken() {
    return SecureStore.getItemAsync(TOKEN_STORAGE_KEYS.ACCESS_TOKEN);
  }

  async saveTokens({ accessToken, refreshToken }) {
    await SecureStore.setItemAsync(TOKEN_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    await SecureStore.setItemAsync(TOKEN_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  }

  async clearTokens() {
    await SecureStore.deleteItemAsync(TOKEN_STORAGE_KEYS.ACCESS_TOKEN);
    await SecureStore.deleteItemAsync(TOKEN_STORAGE_KEYS.REFRESH_TOKEN);
  }

  async hasAccessToken() {
    const token = await this.getAccessToken();
    return Boolean(token);
  }
}

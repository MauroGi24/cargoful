export function createAuthInterceptor(storage) {
  return async function resolveAccessToken() {
    return storage.getAccessToken();
  };
}

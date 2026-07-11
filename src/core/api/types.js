export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }

  static async fromResponse(response) {
    let data = null;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    const message = data?.message || response.statusText || 'Richiesta non riuscita';

    return new ApiError(message, response.status, data);
  }
}

export function isApiError(error) {
  return error instanceof ApiError;
}

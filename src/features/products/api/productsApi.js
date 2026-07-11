import { PRODUCTS_PAGE_SIZE } from '../../../core/config/constants';
import { httpClient } from '../../../core/api';

export async function getProducts({ limit = PRODUCTS_PAGE_SIZE, skip = 0 } = {}) {
  const params = new URLSearchParams({
    limit: String(limit),
    skip: String(skip),
  });

  return httpClient.get(`/products?${params.toString()}`);
}

export async function searchProducts({ q, limit = PRODUCTS_PAGE_SIZE, skip = 0 }) {
  const params = new URLSearchParams({
    q,
    limit: String(limit),
    skip: String(skip),
  });

  return httpClient.get(`/products/search?${params.toString()}`);
}

export async function getProductById(id) {
  return httpClient.get(`/products/${id}`);
}

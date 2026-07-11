import { useQuery } from '@tanstack/react-query';

import { getProductById } from '../api/productsApi';

export function useProductDetail(productId) {
  const query = useQuery({
    queryKey: ['products', productId],
    queryFn: () => getProductById(productId),
    enabled: Boolean(productId),
  });

  return {
    product: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

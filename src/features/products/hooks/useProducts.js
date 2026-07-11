import { useInfiniteQuery } from '@tanstack/react-query';

import { PRODUCTS_PAGE_SIZE } from '../../../core/config/constants';
import { getProducts } from '../api/productsApi';

export function useProducts({ enabled = true } = {}) {
  const query = useInfiniteQuery({
    queryKey: ['products'],
    queryFn: ({ pageParam }) =>
      getProducts({
        limit: PRODUCTS_PAGE_SIZE,
        skip: pageParam,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.skip + lastPage.limit;

      return nextSkip < lastPage.total ? nextSkip : undefined;
    },
    enabled,
  });

  const products = query.data?.pages.flatMap((page) => page.products) ?? [];

  return {
    products,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
  };
}

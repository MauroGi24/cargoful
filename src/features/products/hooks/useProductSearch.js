import { useInfiniteQuery } from '@tanstack/react-query';

import { PRODUCTS_PAGE_SIZE } from '../../../core/config/constants';
import { searchProducts } from '../api/productsApi';

export function useProductSearch(searchQuery, { enabled = true } = {}) {
  const query = useInfiniteQuery({
    queryKey: ['products', 'search', searchQuery],
    queryFn: ({ pageParam }) =>
      searchProducts({
        q: searchQuery,
        limit: PRODUCTS_PAGE_SIZE,
        skip: pageParam,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.skip + lastPage.limit;

      return nextSkip < lastPage.total ? nextSkip : undefined;
    },
    enabled: enabled && searchQuery.length > 0,
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

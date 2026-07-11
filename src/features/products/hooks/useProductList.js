import { useProducts } from './useProducts';
import { useProductSearch } from './useProductSearch';

export function useProductList(debouncedSearchQuery) {
  const trimmedQuery = debouncedSearchQuery.trim();
  const isSearchMode = trimmedQuery.length > 0;

  const browseQuery = useProducts({ enabled: !isSearchMode });
  const searchQuery = useProductSearch(trimmedQuery, { enabled: isSearchMode });

  const activeQuery = isSearchMode ? searchQuery : browseQuery;

  return {
    ...activeQuery,
    isSearchMode,
    searchQuery: trimmedQuery,
  };
}

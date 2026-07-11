import { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '../../../components/EmptyState';
import { ErrorView } from '../../../components/ErrorView';
import { LoadingView } from '../../../components/LoadingView';
import { colors } from '../../../theme/colors';
import { fontSizes } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import { useProductList } from '../hooks/useProductList';
import { ProductCard } from './ProductCard';

const LOAD_MORE_ZONE_HEIGHT = 72;
const LOAD_MORE_EXTRA_OFFSET = spacing.lg;

export function ProductList({ debouncedSearchQuery = '', onProductPress }) {
  const insets = useSafeAreaInsets();
  const loadMoreBottom = insets.bottom + LOAD_MORE_EXTRA_OFFSET;
  const loadMoreReservedHeight = LOAD_MORE_ZONE_HEIGHT + loadMoreBottom;
  const {
    products,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isSearchMode,
    searchQuery,
  } = useProductList(debouncedSearchQuery);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const renderItem = useCallback(
    ({ item }) => <ProductCard product={item} onPress={onProductPress} />,
    [onProductPress],
  );

  const keyExtractor = useCallback((item) => String(item.id), []);

  if (isLoading) {
    return (
      <LoadingView
        message={isSearchMode ? 'Ricerca in corso...' : 'Caricamento prodotti...'}
      />
    );
  }

  if (isError) {
    return (
      <ErrorView
        message={error?.message ?? 'Impossibile caricare i prodotti.'}
        onRetry={refetch}
      />
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        title={isSearchMode ? 'Nessun risultato' : 'Nessun prodotto'}
        message={
          isSearchMode
            ? `Nessun prodotto trovato per "${searchQuery}".`
            : 'Non ci sono prodotti da mostrare.'
        }
      />
    );
  }

  return (
    <View style={styles.wrapper}>
      <FlatList
        data={products}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        style={
          hasNextPage
            ? [styles.list, { marginBottom: loadMoreReservedHeight }]
            : styles.list
        }
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={ListSeparator}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
        keyboardShouldPersistTaps="handled"
      />

      {hasNextPage ? (
        <View style={[styles.loadMoreZone, { bottom: loadMoreBottom, height: LOAD_MORE_ZONE_HEIGHT }]}>
          {isFetchingNextPage ? (
            <>
              <ActivityIndicator color={colors.primary} size="small" />
              <Text style={styles.loadMoreText}>Caricamento altri prodotti...</Text>
            </>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

function ListSeparator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    gap: spacing.sm,
    padding: spacing.md,
    paddingBottom: spacing.md,
  },
  separator: {
    height: spacing.sm,
  },
  loadMoreZone: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    gap: spacing.sm,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
  },
  loadMoreText: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
  },
});

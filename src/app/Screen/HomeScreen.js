import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../../features/auth/context/AuthContext';
import { Button } from '../../components/Button';
import { ProductList } from '../../features/products/components/ProductList';
import { SearchBar } from '../../features/products/components/SearchBar';
import { SEARCH_DEBOUNCE_MS } from '../../core/config/constants';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { colors } from '../../theme/colors';
import { fontSizes, fontWeights } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

export function HomeScreen() {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebouncedValue(searchQuery, SEARCH_DEBOUNCE_MS);
  const isDebouncing = searchQuery.trim() !== debouncedSearchQuery.trim();

  const handleProductPress = useCallback(
    (product) => {
      navigation.navigate('ProductDetail', { productId: product.id });
    },
    [navigation],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>Prodotti</Text>
          {user?.firstName ? (
            <Text style={styles.greeting}>Ciao, {user.firstName}</Text>
          ) : null}
        </View>
        <Button title="Logout" onPress={logout} variant="secondary" />
      </View>

      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          isSearching={isDebouncing}
        />
      </View>

      <View style={styles.listContainer}>
        <ProductList
          debouncedSearchQuery={debouncedSearchQuery}
          onProductPress={handleProductPress}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  header: {
    alignItems: 'center',
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  headerText: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
  },
  greeting: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
  },
  searchContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  listContainer: {
    flex: 1,
  },
});

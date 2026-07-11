import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { Button } from '../../components/Button';
import { ErrorView } from '../../components/ErrorView';
import { LoadingView } from '../../components/LoadingView';
import { usePurchaseProduct } from '../../features/purchase/hooks/usePurchaseProduct';
import { useProductDetail } from '../../features/products/hooks/useProductDetail';
import { formatPrice } from '../../features/products/utils/formatPrice';
import { colors } from '../../theme/colors';
import { fontSizes, fontWeights } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

export function ProductDetailScreen({ route }) {
  const productId = route.params.productId;
  const { product, isLoading, isError, error, refetch } = useProductDetail(productId);
  const purchase = usePurchaseProduct();
  const [purchaseMessage, setPurchaseMessage] = useState('');
  const [purchaseError, setPurchaseError] = useState('');

  async function handleBuy() {
    setPurchaseMessage('');
    setPurchaseError('');

    try {
      await purchase.mutateAsync({ title: product.title });
      setPurchaseMessage('Acquisto inviato con successo!');
    } catch (err) {
      setPurchaseError(err?.message ?? 'Invio non riuscito. Riprova.');
    }
  }

  if (isLoading) {
    return <LoadingView message="Caricamento prodotto..." />;
  }

  if (isError || !product) {
    return (
      <ErrorView
        message={error?.message ?? 'Impossibile caricare il prodotto.'}
        onRetry={refetch}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image source={{ uri: product.thumbnail }} style={styles.thumbnail} resizeMode="cover" />
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
        <Text style={styles.description}>{product.description}</Text>
      </ScrollView>

      <View style={styles.footer}>
        {purchaseError ? <Text style={styles.purchaseError}>{purchaseError}</Text> : null}
        {purchaseMessage ? <Text style={styles.purchaseMessage}>{purchaseMessage}</Text> : null}
        <Button title="Buy" onPress={handleBuy} loading={purchase.isPending} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  scrollContent: {
    gap: spacing.md,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  thumbnail: {
    alignSelf: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    height: 220,
    width: 220,
  },
  title: {
    color: colors.text,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
  },
  price: {
    color: colors.primary,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
  },
  description: {
    color: colors.textSecondary,
    fontSize: fontSizes.base,
    lineHeight: 24,
  },
  footer: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    gap: spacing.sm,
    padding: spacing.md,
  },
  purchaseError: {
    color: colors.error,
    fontSize: fontSizes.sm,
    textAlign: 'center',
  },
  purchaseMessage: {
    color: colors.primary,
    fontSize: fontSizes.sm,
    textAlign: 'center',
  },
});

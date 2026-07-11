import { ActivityIndicator, StyleSheet, TextInput, View } from 'react-native';

import { colors } from '../../../theme/colors';
import { fontSizes } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';

export function SearchBar({ value, onChangeText, isSearching = false, placeholder = 'Cerca prodotti...' }) {
  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        clearButtonMode="while-editing"
        style={styles.input}
      />
      {isSearching ? (
        <View style={styles.indicator}>
          <ActivityIndicator color={colors.primary} size="small" />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.text,
    fontSize: fontSizes.base,
    minHeight: 44,
    paddingHorizontal: spacing.md,
    paddingRight: spacing.xl + spacing.sm,
    paddingVertical: spacing.sm,
  },
  indicator: {
    position: 'absolute',
    right: spacing.md,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
});

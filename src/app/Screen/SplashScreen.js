import { Image, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { colors } from '../../theme/colors';

const logoSource = require('../../../assets/images/logo.png');

export function SplashScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image
        source={logoSource}
        style={styles.logo}
        resizeMode="contain"
        accessibilityLabel="Cargoful logo"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.splash,
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    height: 80,
    width: 300,
  },
});

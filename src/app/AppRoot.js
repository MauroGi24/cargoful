import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import * as ExpoSplashScreen from 'expo-splash-screen';

import { useAuth } from '../features/auth/context/AuthContext';
import { SPLASH_DURATION_MS } from '../core/config/constants';
import { MainNavigator } from './navigation/MainNavigator';
import { LoginScreen } from './Screen/LoginScreen';
import { SplashScreen } from './Screen/SplashScreen';

ExpoSplashScreen.preventAutoHideAsync().catch(() => {});

export function AppRoot() {
  const { isAuthenticated, isLoading } = useAuth();
  const [isSplashDone, setIsSplashDone] = useState(false);
  const hasHiddenNativeSplash = useRef(false);

  useEffect(() => {
    let isMounted = true;

    async function runSplash() {
      await new Promise((resolve) => {
        setTimeout(resolve, SPLASH_DURATION_MS);
      });

      if (isMounted) {
        setIsSplashDone(true);
      }
    }

    runSplash();

    return () => {
      isMounted = false;
    };
  }, []);

  const onSplashLayout = useCallback(async () => {
    if (hasHiddenNativeSplash.current) {
      return;
    }

    hasHiddenNativeSplash.current = true;
    await ExpoSplashScreen.hideAsync();
  }, []);

  if (!isSplashDone || isLoading) {
    return (
      <View style={styles.root} onLayout={onSplashLayout}>
        <SplashScreen />
      </View>
    );
  }

  return isAuthenticated ? <MainNavigator /> : <LoginScreen />;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

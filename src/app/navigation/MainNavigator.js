import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeScreen } from '../Screen/HomeScreen';
import { ProductDetailScreen } from '../Screen/ProductDetailScreen';

const Stack = createNativeStackNavigator();

export function MainNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
          options={{ title: 'Dettaglio prodotto' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

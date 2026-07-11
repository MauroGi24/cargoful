import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { loginSchema } from '../../features/auth/schemas/loginSchema';
import { getLoginErrorMessage, useAuth } from '../../features/auth/context/AuthContext';
import { Button } from '../../components/Button';
import { TextField } from '../../components/TextField';
import { mapSchemaErrors } from '../../features/auth/schemas/mapSchemaErrors';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fontSizes } from '../../theme/typography';

const logoSource = require('../../../assets/images/logo.png');

const INITIAL_FORM = {
  username: '',
  password: '',
};

export function LoginScreen() {
  const { login } = useAuth();
  const [form, setForm] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
    setFormError('');
  }

  async function handleLogin() {
    const result = loginSchema.safeParse(form);

    if (!result.success) {
      setFieldErrors(mapSchemaErrors(result.error.issues));
      return;
    }

    setFieldErrors({});
    setFormError('');
    setLoading(true);

    try {
      await login(result.data);
    } catch (error) {
      setFormError(getLoginErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Image
              source={logoSource}
              style={styles.logo}
              resizeMode="contain"
              accessibilityLabel="Cargoful logo"
            />
            <Text style={styles.subtitle}>Accedi al tuo account</Text>
          </View>

          <View style={styles.form}>
            <TextField
              label="Username"
              value={form.username}
              onChangeText={(value) => updateField('username', value)}
              placeholder="es. emilys"
              autoCapitalize="none"
              autoCorrect={false}
              error={fieldErrors.username}
            />
            <TextField
              label="Password"
              value={form.password}
              onChangeText={(value) => updateField('password', value)}
              placeholder="Inserisci la password"
              secureTextEntry
              error={fieldErrors.password}
            />

            {formError ? <Text style={styles.formError}>{formError}</Text> : null}

            <Button title="Accedi" onPress={handleLogin} loading={loading} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  logo: {
    height: 64,
    width: 280,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: fontSizes.base,
    textAlign: 'center',
  },
  form: {
    gap: spacing.md,
  },
  formError: {
    color: colors.error,
    fontSize: fontSizes.sm,
    textAlign: 'center',
  },
});

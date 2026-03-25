import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type AuthUser = {
  id: string;
  tenantId: string;
  email: string;
  name: string;
  role: 'owner' | 'dispatcher' | 'technician';
};

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000';
const TOKEN_KEY = 'fixora.mobile.accessToken';
const TENANT_KEY = 'fixora.mobile.tenantId';
const USER_KEY = 'fixora.mobile.user';

const theme = {
  bg: '#F5EFE4',
  card: '#FFFDF8',
  text: '#20252B',
  muted: '#5D6470',
  brand: '#C26527',
  border: '#D7D0C5',
};

export default function App() {
  const [tenantId, setTenantId] = useState('tenant-acme');
  const [email, setEmail] = useState('owner@acme.fixora.local');
  const [password, setPassword] = useState('Passw0rd!');
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [activeUser, setActiveUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const [savedToken, savedTenant, savedUserJson] = await Promise.all([
          AsyncStorage.getItem(TOKEN_KEY),
          AsyncStorage.getItem(TENANT_KEY),
          AsyncStorage.getItem(USER_KEY),
        ]);

        if (savedToken && savedTenant && savedUserJson) {
          const parsedUser = JSON.parse(savedUserJson) as AuthUser;
          setAccessToken(savedToken);
          setTenantId(savedTenant);
          setActiveUser(parsedUser);
        }
      } finally {
        setIsBootstrapping(false);
      }
    };

    void bootstrap();
  }, []);

  const login = async () => {
    setIsLoading(true);
    setNotice(null);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ tenantId, email, password }),
      });

      if (!response.ok) {
        const reason = await response.text();
        throw new Error(reason || 'Login failed');
      }

      const loginData = (await response.json()) as LoginResponse;
      setAccessToken(loginData.accessToken);
      setActiveUser(loginData.user);
      setNotice(`Signed in as ${loginData.user.name}`);

      await Promise.all([
        AsyncStorage.setItem(TOKEN_KEY, loginData.accessToken),
        AsyncStorage.setItem(TENANT_KEY, loginData.user.tenantId),
        AsyncStorage.setItem(USER_KEY, JSON.stringify(loginData.user)),
      ]);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unexpected login error');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);

    try {
      if (accessToken && activeUser) {
        const response = await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            authorization: `Bearer ${accessToken}`,
            'x-tenant-id': activeUser.tenantId,
          },
        });

        if (!response.ok) {
          const reason = await response.text();
          throw new Error(reason || 'Logout failed');
        }
      }

      setAccessToken(null);
      setActiveUser(null);
      setNotice('Logged out successfully.');
      await Promise.all([
        AsyncStorage.removeItem(TOKEN_KEY),
        AsyncStorage.removeItem(TENANT_KEY),
        AsyncStorage.removeItem(USER_KEY),
      ]);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unexpected logout error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isBootstrapping) {
    return (
      <SafeAreaView style={styles.screenCentered}>
        <ActivityIndicator color={theme.brand} />
        <Text style={styles.notice}>Loading session...</Text>
        <StatusBar style="dark" />
      </SafeAreaView>
    );
  }

  const isAuthenticated = Boolean(accessToken && activeUser);
  const user = activeUser;

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        {!isAuthenticated ? (
          <>
            <Text style={styles.eyebrow}>FIELD SERVICE APP</Text>
            <Text style={styles.title}>Fixora Login</Text>
            <Text style={styles.subtitle}>
              Sign in with tenant credentials to access your mobile operations dashboard.
            </Text>

            <View style={styles.authCard}>
              <Text style={styles.authTitle}>Tenant Login</Text>
              <TextInput
                style={styles.input}
                value={tenantId}
                onChangeText={setTenantId}
                placeholder="tenant id"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="email"
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="password"
                secureTextEntry
              />

              <View style={styles.authButtons}>
                <Pressable style={styles.primaryButton} onPress={login} disabled={isLoading}>
                  <Text style={styles.primaryButtonText}>Login</Text>
                </Pressable>
              </View>

              {isLoading ? <ActivityIndicator color={theme.brand} style={styles.loader} /> : null}
              {notice ? <Text style={styles.notice}>{notice}</Text> : null}
            </View>
          </>
        ) : (
          <>
            <Text style={styles.eyebrow}>AUTHENTICATED</Text>
            <Text style={styles.title}>Mobile Dashboard</Text>
            <Text style={styles.subtitle}>
              Welcome {user?.name} ({user?.role}) from {user?.tenantId}.
            </Text>

            <View style={styles.grid}>
              <View style={styles.tile}>
                <Text style={styles.tileTitle}>Today</Text>
                <Text style={styles.tileBody}>4 assigned jobs</Text>
              </View>
              <View style={styles.tile}>
                <Text style={styles.tileTitle}>Next Feature</Text>
                <Text style={styles.tileBody}>Jobs create/update flow starts here.</Text>
              </View>
            </View>

            <View style={styles.authButtons}>
              <Pressable style={styles.primaryButton} onPress={logout} disabled={isLoading}>
                <Text style={styles.primaryButtonText}>Log Out</Text>
              </Pressable>
            </View>
            {isLoading ? <ActivityIndicator color={theme.brand} style={styles.loader} /> : null}
            {notice ? <Text style={styles.notice}>{notice}</Text> : null}
          </>
        )}
      </View>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  screenCentered: {
    flex: 1,
    backgroundColor: theme.bg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 22,
    gap: 10,
  },
  eyebrow: {
    color: theme.brand,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
  },
  title: {
    color: theme.text,
    fontSize: 36,
    lineHeight: 40,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 4,
    color: theme.muted,
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 360,
  },
  grid: {
    marginTop: 14,
    gap: 10,
  },
  tile: {
    backgroundColor: theme.card,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  tileTitle: {
    color: theme.brand,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  tileBody: {
    marginTop: 4,
    color: theme.text,
    fontSize: 15,
    fontWeight: '600',
  },
  authCard: {
    marginTop: 14,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 16,
    backgroundColor: theme.card,
    padding: 12,
    gap: 8,
  },
  authTitle: {
    color: theme.text,
    fontSize: 14,
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: theme.text,
  },
  authButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: theme.brand,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: theme.text,
    fontSize: 13,
    fontWeight: '700',
  },
  loader: {
    marginTop: 2,
  },
  notice: {
    color: theme.muted,
    fontSize: 12,
  },
});

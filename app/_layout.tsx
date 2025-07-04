import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { SplashScreenController } from '../components/SplashScreenController';
import { useAuth } from '../context/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <SplashScreenController />
      <RootNavigator />
    </AuthProvider>
  );
}

function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="(tabs)" />
      ) : (
        <Stack.Screen name="sign-in" />
      )}
    </Stack>
  );
}

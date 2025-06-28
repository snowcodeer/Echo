import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { gradients } from '@/styles/globalStyles';

export default function AuthLayout() {
  return (
    <LinearGradient colors={gradients.background} style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack>
    </LinearGradient>
  );
}
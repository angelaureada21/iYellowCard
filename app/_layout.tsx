import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(Page)/login" options={{ headerShown: false }} />
      <Stack.Screen name="(Page)/register" options={{ headerShown: false }} />
      <Stack.Screen name="(Page)/(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(Page)/feedback" options={{ headerShown: true, headerTitle: '' }} />
    </Stack>
  );
}

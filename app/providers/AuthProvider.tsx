/*import React, {
  useEffect,
  useState,
  createContext,
  useContext,
  PropsWithChildren,
} from 'react';
import { useRouter, useSegments } from 'expo-router';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../../firebase.client';
import { View, ActivityIndicator } from 'react-native';

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const segments = useSegments();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Firebase loading
  const [navigationReady, setNavigationReady] = useState(false); // Prevent render before redirect

  // 1. Listen to auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false); // Firebase check done
    });

    return unsubscribe;
  }, []);

  // 2. Redirect logic after Firebase is ready
  useEffect(() => {
    if (loading) return;

    const inTabsGroup = segments[1] === '(tabs)';
    const inLoginPage = segments[1] === 'login';

    if (!user && !inLoginPage) {
      router.replace('/(Page)/login');
    } else if (user && !inTabsGroup) {
      router.replace('/(Page)/(tabs)/home');
    }

    // Whether redirect or not, navigation is ready
    setNavigationReady(true);
  }, [user, loading, segments]);

  // 3. Block rendering until navigation is ready
  if (loading || !navigationReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 4. Show children once auth + redirect is resolved
  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);*/

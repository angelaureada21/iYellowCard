import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { registerForPushNotificationsAsync } from './src/services/NotificationService';
import { Slot } from 'expo-router';

export default function App() {
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  return <Slot />;
}

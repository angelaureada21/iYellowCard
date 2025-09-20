// src/services/notificationService.ts

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase.client';

export async function registerForPushNotificationsAsync() {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Push Token:', token);

    // Save token to Firestore or AsyncStorage if needed
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}

export async function sendPushNotification(expoPushToken: string, title: string, body: string) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title,
    body,
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

// Optional: Save notification to Firestore
export async function saveNotificationToFirestore(title: string, body: string) {
  await addDoc(collection(db, 'notifications'), {
    title,
    body,
    createdAt: serverTimestamp(),
  });
}

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { db } from "../../../firebase.client";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

// ✅ Notification handler (must be top-level, outside component)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: false,
    shouldShowList: false,
  }),
});


// ✅ Function to register for push notifications
async function registerForPushNotificationsAsync(userId: string) {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Expo Push Token:", token);

    // 👉 Save token to Firestore if you want
    // await setDoc(doc(db, "userTokens", userId), { token });
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [readNotifs, setReadNotifs] = useState<string[]>([]);

  useEffect(() => {
    // 👇 Replace with actual logged-in user ID (e.g. Firebase auth.currentUser.uid)
    const userId = "user123";
    registerForPushNotificationsAsync(userId);

    const loadReadNotifs = async () => {
      const stored = await AsyncStorage.getItem("readNotifs");
      if (stored) {
        setReadNotifs(JSON.parse(stored));
      }
    };
    loadReadNotifs();

    const q = query(
      collection(db, "notifications"),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotifications(notifList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const markAsRead = async (id: string) => {
    if (!readNotifs.includes(id)) {
      const updatedReads = [...readNotifs, id];
      setReadNotifs(updatedReads);
      await AsyncStorage.setItem("readNotifs", JSON.stringify(updatedReads));
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header with fade effect */}
      <View style={styles.fullWidthWrapper}>
        <View style={styles.headerImageFullWidth}>
          <Image
            source={require("../../../assets/images/notification.jpg")}
            style={styles.headerImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={["transparent", "#FFF9E4"]}
            style={styles.fadeEffect}
          />
        </View>
      </View>

      {notifications.length === 0 ? (
        <Text style={styles.empty}>No notifications yet</Text>
      ) : (
        notifications.map((notif) => {
          const isRead = readNotifs.includes(notif.id);
          return (
            <TouchableOpacity
              key={notif.id}
              style={[styles.card, isRead && styles.readCard]}
              onPress={() => markAsRead(notif.id)}
            >
              <Text style={styles.title}>{notif.title}</Text>
              <Text style={styles.body}>{notif.body}</Text>
              {notif.createdAt?.seconds && (
                <Text style={styles.date}>
                  {new Date(notif.createdAt.seconds * 1000).toLocaleString()}
                </Text>
              )}
            </TouchableOpacity>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF9E4",
    paddingHorizontal: 16,
  },
  fullWidthWrapper: {
    marginHorizontal: -16,
  },
  headerImageFullWidth: {
    width: "100%",
    height: 220,
    overflow: "hidden",
    position: "relative",
    marginBottom: 12,
    paddingHorizontal: -50,
  },
  headerImage: {
    width: "100%",
    height: "100%",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  fadeEffect: {
    position: "absolute",
    width: "100%",
    height: "100%",
    bottom: 0,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  readCard: {
    opacity: 0.6,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  body: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  date: {
    fontSize: 12,
    color: "#999",
    marginTop: 8,
  },
  empty: {
    textAlign: "center",
    color: "#777",
    marginTop: 20,
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

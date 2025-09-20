import React, { useEffect, useState } from "react";
import { Tabs } from "expo-router";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { db } from "../../../firebase.client";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Layout() {
  const [notifs, setNotifs] = useState<any[]>([]);
  const [readNotifs, setReadNotifs] = useState<string[]>([]);

  useEffect(() => {
    // Load stored read notifications
    const fetchRead = async () => {
      const storedReads = await AsyncStorage.getItem("readNotifs");
      if (storedReads) {
        setReadNotifs(JSON.parse(storedReads));
      }
    };
    fetchRead();

    // Real-time listener for notifications
    const q = query(collection(db, "notifications"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotifs(notifList);
    });

    return () => unsubscribe();
  }, []);

  // Calculate unread notifications
  const unreadCount = notifs.filter(n => !readNotifs.includes(n.id)).length;
  const badgeValue = unreadCount > 99 ? "99+" : unreadCount > 0 ? unreadCount : undefined;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#0066cc",
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="benefits"
        options={{
          title: "Annoucement",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="gift-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="chatbot"
        options={{
          title: "Chat",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="notificationsscreen"
        options={{
          title: "Notif",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons
              name="notifications-none"
              size={size}
              color={color}
            />
          ),
          tabBarBadge: badgeValue, // 🔴 Live unread count
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  Image,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../../firebase.client";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Benefits() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [readPosts, setReadPosts] = useState<string[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Load read post IDs from AsyncStorage
        const storedReads = await AsyncStorage.getItem("readPosts"); // ✅ fixed key
        if (storedReads) {
          setReadPosts(JSON.parse(storedReads));
        }

        // Query posts in descending order
        const q = query(
          collection(db, "announcements"),
          orderBy("timestamp", "desc")
        );
        const querySnapshot = await getDocs(q);
        const fetchedPosts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching announcement: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const openModal = async (post: any) => {
    setSelectedPost(post);
    setModalVisible(true);

    // Mark post as read
    if (!readPosts.includes(post.id)) {
      const updatedReads = [...readPosts, post.id];
      setReadPosts(updatedReads);
      await AsyncStorage.setItem("readPosts", JSON.stringify(updatedReads)); // ✅ consistent
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedPost(null);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading announcements...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Full-width header image */}
        <View style={styles.headerWrapper}>
          <Image
            source={require("../../../assets/images/annoucementheader.jpg")}
            style={styles.headerImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={["transparent", "#FFF9E4"]}
            style={styles.fadeEffect}
          />
        </View>

        <Text style={styles.sectionHeader}>Announcements</Text>

        {posts.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {item.title || "Untitled Post"}
              </Text>
              <TouchableOpacity onPress={() => openModal(item)}>
                <Text style={styles.viewLink}>View</Text>
              </TouchableOpacity>
            </View>

            {item.category && (
              <Text style={styles.cardCategory}>
                Category: {item.category}
              </Text>
            )}

            {item.content && (
              <Text style={styles.cardContent} numberOfLines={3}>
                {item.content}
              </Text>
            )}

            {/* Read/Unread Indicator */}
            <Text
              style={{
                marginTop: 6,
                fontSize: 12,
                fontWeight: "bold",
                color: readPosts.includes(item.id) ? "green" : "red",
              }}
            >
              {readPosts.includes(item.id) ? "Read" : "Unread"}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Modal for full content */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedPost?.title || "Untitled"}
            </Text>
            {selectedPost?.category && (
              <Text style={styles.modalCategory}>
                Category: {selectedPost.category}
              </Text>
            )}
            <ScrollView style={{ marginVertical: 10 }}>
              <Text style={styles.modalText}>{selectedPost?.content}</Text>

              {/* ✅ Attachment display */}
              {selectedPost?.attachment && (
                <View style={{ marginTop: 15 }}>
                  {selectedPost.attachment.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                    <Image
                      source={{ uri: selectedPost.attachment }}
                      style={{
                        width: "100%",
                        height: 200,
                        borderRadius: 10,
                        marginTop: 10,
                      }}
                      resizeMode="contain"
                    />
                  ) : (
                    <Text
                      style={{ color: "blue", marginTop: 10 }}
                      onPress={() => Linking.openURL(selectedPost.attachment)}
                    >
                      View Attachment
                    </Text>
                  )}
                </View>
              )}
            </ScrollView>

            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF9E4",
  },
  scrollContent: {
    paddingBottom: 32,
  },
  headerWrapper: {
    position: "relative",
    width: "100%",
    height: 200,
    marginBottom: 20,
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
    bottom: -1,
  },
  sectionHeader: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#DAA520",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    height: 150,
    justifyContent: "space-between",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
    maxWidth: "80%",
  },
  viewLink: {
    color: "#007AFF",
    fontSize: 13,
    fontWeight: "600",
  },
  cardCategory: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },
  cardContent: {
    fontSize: 14,
    color: "#444",
    marginTop: 6,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#FFF9E4",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#555",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalCategory: {
    fontSize: 14,
    fontWeight: "600",
    color: "#888",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: "#DAA520",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  closeText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

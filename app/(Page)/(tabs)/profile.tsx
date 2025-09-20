import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  Alert,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { auth, db } from "../../../firebase.client";
import {
  signOut,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [loading, setLoading] = useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    memberId: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Error", "No user is currently logged in.");
        return;
      }

      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            memberId: data.memberId || "",
            email: data.email || user.email || "",
            role: data.role || "",
          });
        } else {
          Alert.alert("Error", "User profile not found in the database.");
        }
      } catch (error: any) {
        console.error("Error fetching profile:", error);
        Alert.alert("Error", error.message || "Failed to fetch profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const openModal = (content: string) => {
    setModalContent(content);
    setModalVisible(true);
  };

  const handleChangePassword = async () => {
    const user = auth.currentUser;

    if (!user || !user.email) {
      Alert.alert("Error", "User not found.");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "New password should be at least 6 characters.");
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      Alert.alert("Success", "Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setModalVisible(false);
    } catch (error: any) {
      console.log(error);
      Alert.alert("Error", error.message || "Failed to update password.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("Logged Out", "You have been successfully logged out.");
      router.replace("/");
    } catch (error) {
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  };

  const getModalText = () => {
    switch (modalContent) {
      case "FAQ":
        return "❓ Frequently Asked Questions:\n\n1. How to get a Yellow Card?\n2. Where can I use it?\n3. Who do I contact for support?";
      case "About":
        return "ℹ️ About This App:\n\nThis app was developed to help Lucena City residents access Yellow Card services, view announcements, and receive government updates easily.";
      case "Help":
        return "🛠️ Help & Support:\n\nFor assistance, contact your Suby1 Leader or email support@lucenacity.gov.ph.";
      case "Feedback":
        return "✉️ Send Feedback:\n\nWe value your thoughts. Please send suggestions or issues to support@lucenacity.gov.ph.";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#DAA520" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      <FontAwesome name="user-circle" size={100} color="#DAA520" style={styles.icon} />
      <View style={styles.roleBadge}>
        <Text style={styles.roleText}>{profile.role}</Text>
      </View>

      <Text style={styles.name}>
        {profile.firstName} {profile.lastName}
      </Text>
      <Text style={styles.memberId}>ID Number: {profile.memberId}</Text>
      <Text style={styles.email}>{profile.email}</Text>

      <TouchableOpacity style={styles.option} onPress={() => openModal("FAQ")}>
        <Text style={styles.optionText}>📖 FAQ</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={() => openModal("About")}>
        <Text style={styles.optionText}>ℹ️ About This App</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={() => openModal("Help")}>
        <Text style={styles.optionText}>🛠️ Help & Support</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={() => router.push("/feedback")}>
        <Text style={styles.optionText}>✉️ Send Feedback</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={() => openModal("ChangePassword")}>
        <Text style={styles.optionText}>🔒 Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.option, styles.logout]} onPress={handleLogout}>
        <Text style={[styles.optionText, { color: "#fff" }]}>🚪 Log Out</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView>
              <Text style={styles.modalTitle}>{modalContent}</Text>

              {modalContent === "ChangePassword" ? (
                <>
                  <Text style={styles.modalText}>
                    Enter your current password and new password below.
                  </Text>

                  <View style={styles.passwordField}>
                    <TextInput
                      style={styles.input}
                      placeholder="Current Password"
                      value={currentPassword}
                      onChangeText={setCurrentPassword}
                      secureTextEntry={!showCurrentPassword}
                    />
                    <TouchableOpacity
                      onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      <FontAwesome
                        name={showCurrentPassword ? "eye-slash" : "eye"}
                        size={17}
                        color="#888"
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.passwordField}>
                    <TextInput
                      style={styles.input}
                      placeholder="New Password"
                      value={newPassword}
                      onChangeText={setNewPassword}
                      secureTextEntry={!showNewPassword}
                    />
                    <TouchableOpacity
                      onPress={() => setShowNewPassword(!showNewPassword)}
                    >
                      <FontAwesome
                        name={showNewPassword ? "eye-slash" : "eye"}
                        size={20}
                        color="#888"
                      />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity style={styles.saveButton} onPress={handleChangePassword}>
                    <Text style={styles.saveButtonText}>Update Password</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <Text style={styles.modalText}>{getModalText()}</Text>
              )}
            </ScrollView>

            <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#FFF9E4",
    flexGrow: 1,
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF9E4",
  },
  icon: {
    marginTop: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",

  },
  name: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#222",
    marginTop: 3,
  },
  memberId: {
    fontSize: 15,
    color: "#444",
    marginVertical: 4,
  },
  email: {
    fontSize: 15,
    color: "#666",
    marginBottom: 50,
  },
  roleBadge: {
    backgroundColor: "#DAA520",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 10,
  },
  roleText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  option: {
    backgroundColor: "#fef4cd",
    padding: 15,
    borderRadius: 15,
    width: "100%",
    marginBottom: 12,
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  logout: {
    backgroundColor: "#D9534F",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  modalText: {
    fontSize: 16,
    color: "#444",
    lineHeight: 22,
    marginBottom: 12,
  },
  passwordField: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 12,
    backgroundColor: "white",
    minHeight: 50,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: "black",
  },
  saveButton: {
    backgroundColor: "#DAA520",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 16,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    alignSelf: "center",
    backgroundColor: "#DAA520",
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 30,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

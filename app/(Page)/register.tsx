import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase.client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { getFirestore, setDoc, doc } from "firebase/firestore";

const db = getFirestore();

export default function Register() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [memberId, setMemberId] = useState("");

  const handleRegister = async () => {
    if (!email || !password || !firstName || !lastName) {
      Alert.alert("Missing Fields", "Please fill out all required fields");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const finalMemberId =
        memberId.trim() !== "" ? memberId : `M${Date.now()}`;

      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        memberId: finalMemberId,
        role: "member",
        email: user.email,
      });

      await AsyncStorage.setItem(
        "userProfile",
        JSON.stringify({
          firstName,
          lastName,
          memberId: finalMemberId,
          role: "member",
        })
      );

      Alert.alert("Success", "Account created!");
      router.replace("/");
    } catch (error: any) {
      Alert.alert("Registration Error", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.avoid}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={require("../../assets/images/background.png")}
          style={styles.logo}
        />

        <Text style={styles.header}>Create Account</Text>
        <Text style={styles.subtext}>Join the Yellow Card platform</Text>

        <TextInput
          placeholder="First Name"
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          placeholder="Last Name"
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          placeholder="Member ID (optional)"
          style={styles.input}
          value={memberId}
          onChangeText={setMemberId}
        />
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Password"
          style={styles.input}
          value={password}
          secureTextEntry
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => router.push("/(Page)/login")}>
          <Text style={styles.loginLink}>Log In</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  avoid: {
    flex: 1,
    backgroundColor: "#FFF9E4",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  logo: {
    width: 180,
    height: 130,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 6,
    textAlign: "center",
    color: "#FFC436",
  },
  subtext: {
    fontSize: 15,
    textAlign: "center",
    color: "#555",
    marginBottom: 24,
  },
  input: {
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 14,
    borderColor: "#ddd",
    borderWidth: 1,
    fontSize: 15,
  },
  button: {
    backgroundColor: "#FFC436",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: "#333",
    fontSize: 17,
    fontWeight: "bold",
  },
  footerText: {
    textAlign: "center",
    color: "#666",
  },
  loginLink: {
    textAlign: "center",
    marginTop: 6,
    color: "#FFC436",
    fontWeight: "600",
    fontSize: 15,
  },
});

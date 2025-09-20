import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Modal,
} from "react-native";
import { useState, useEffect } from "react";
import { auth, db } from "../../firebase.client"; // db is your Firestore instance
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem("savedEmail");
        const savedPassword = await AsyncStorage.getItem("savedPassword");

        if (savedEmail) setEmail(savedEmail);
        if (savedPassword) setPassword(savedPassword);
      } catch (error) {
        console.error("Failed to load saved credentials:", error);
      }
    };

    loadCredentials();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      showError("Please enter email and password.");
      return;
    }

    try {
      // Sign in
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Check role in Firestore
      const userDoc = await getDoc(doc(db, "users", uid));

      if (!userDoc.exists()) {
        await signOut(auth);
        showError("No account record found. Contact administrator.");
        return;
      }

      const role = userDoc.data().role;

      if (role !== "member") {
        await signOut(auth);
        showError("Access denied. Members only.");
        return;
      }

      // Save credentials
      await AsyncStorage.setItem("savedEmail", email);
      await AsyncStorage.setItem("savedPassword", password);

      // Redirect to member home
      router.replace("/(Page)/(tabs)/home");

    } catch (error: any) {
      let msg = "Login failed";
      if (error.code === "auth/user-not-found") {
        msg = "User not found. Please check your email.";
      } else if (error.code === "auth/wrong-password") {
        msg = "Wrong password. Please try again.";
      } else if (error.code === "auth/invalid-email") {
        msg = "Invalid email format.";
      }
      showError(msg);
    }
  };

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setModalVisible(true);
  };

  return (
    <ImageBackground
      source={require("../../assets/images/background.png")}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>iYellowCard Member</Text>
        <text style = {styles.secsub}>Please log in to continue</text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#999"
          style={styles.input}
          value={email}
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Password"
            placeholderTextColor="#999"
            style={styles.passwordInput}
            value={password}
            secureTextEntry={!showPassword}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.showButton}
          >
            <Text style={styles.showText}>
              {showPassword ? "Hide" : "Show"}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => router.push("/(Page)/register")}>
          <Text style={styles.loginLink}>Register</Text>
        </TouchableOpacity>
      </View>

      {/* Modal Warning */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Login Error</Text>
            <Text style={styles.modalMessage}>{errorMessage}</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>Okay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#FFF9E4",
  },
  backgroundImage: {
    resizeMode: "cover",
    opacity: 0.08,
    width: "100%",
    height: "100%",
  },
  container: {
    paddingHorizontal: 30,
    justifyContent: "center",
  },
  subtitle: {
        fontSize: 33,
    fontWeight: "bold",
      marginBottom: 50,
    textAlign: "center",
    color: "#e0a00aff", 
    letterSpacing: 1,
  },
  secsub: {
    fontSize: 18,
    color: "#6b6b6bff",  
    textAlign: "center",
    marginBottom: 20,

  },

  title: {
    fontSize: 75,
    fontWeight: "bold",
    textAlign: "center",
    color: "#e0a00aff", // bright, welcoming yellow
    letterSpacing: 1, // more official look
},

  input: {
    height: 50,
    borderColor: "#ddd",
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: "#fff",
    color: "#333",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    height: 50,
  },
  passwordInput: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    paddingVertical: 0,
  },
  showButton: {
    paddingHorizontal: 10,
    justifyContent: "center",
    height: "100%",
  },
  showText: {
    color: "#007AFF",
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#FFC436",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: "#333",
    fontSize: 19,
    fontWeight: "bold",
  },
  footerText: {
    textAlign: "center",
    color: "#666",
  },
  loginLink: {
    textAlign: "center",
    marginTop: 4,
    color: "#FFC436",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#cc0000",
  },
  modalMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
    color: "#555",
  },
  modalButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

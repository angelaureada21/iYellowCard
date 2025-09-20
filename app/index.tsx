import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function auth() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Your image in the center */}
      <Image source={require("../assets/images/background.png")} style={styles.image} />

      {/* Register Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("./(Page)/register")}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("./(Page)/login")}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    backgroundColor: "#FFF9E4",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#FFC436",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#000000ff",
    fontSize: 20,
    fontWeight: "bold",
  },
});
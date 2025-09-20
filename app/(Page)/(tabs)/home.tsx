import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Image,
  ActivityIndicator,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../../firebase.client";
import { LinearGradient } from "expo-linear-gradient";

export default function Home() {
  const [benefits, setBenefits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBenefit, setSelectedBenefit] = useState<any>(null);
  const [readBenefits, setReadBenefits] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false); // ✅ FIX: Added modal state

  const officials = [
    { name: "Hon. Mark Don Victor B. Alcala", position: "City Mayor", image: require("../../../assets/images/mayormark.jpg") },
    { name: "Hon. Helen D. Tan, M.D.", position: "Governor", image: require("../../../assets/images/governor.jpg") },
    { name: "Hon. Roderick A. Alcala", position: "Vice Mayor", image: require("../../../assets/images/vicemayor.jpg") },
    { name: "Hon. Danilo B. Faller", position: "Councilor", image: require("../../../assets/images/faller.jpg") },
    { name: "Hon. Americo Q. Lacerna", position: "Councilor", image: require("../../../assets/images/lacerna.jpg") },
    { name: "Hon. Wilbert Mckinly L. Noche", position: "Councilor", image: require("../../../assets/images/noche.png") },
    { name: "Hon. Patrick Norman E. Nadera", position: "Councilor", image: require("../../../assets/images/nadera.png") },
    { name: "Hon. Benito G. Brizuela, Jr.", position: "Councilor", image: require("../../../assets/images/brizuela.jpg") },
    { name: "Hon. Jose Christian O. Ona", position: "Councilor", image: require("../../../assets/images/ona.jpg") },
    { name: "Hon. Elizabeth U. Sio", position: "Councilor", image: require("../../../assets/images/sio.jpg") },
    { name: "Hon. Ryan Caezar E. Alcala", position: "Councilor", image: require("../../../assets/images/ryan.jpg") },
    { name: "Hon. Sunshine C. Abcede", position: "Councilor", image: require("../../../assets/images/abcede.jpg") },
    { name: "Hon. Edwin J. Pureza, M.D.", position: "Councilor", image: require("../../../assets/images/pureza.png") },
  ];

  const sceneries = [
    { title: "Lucena Boulevard", description: "A peaceful place to walk and relax.", image: require("../../../assets/images/lucena_boulevard.jpg") },
    { title: "Perez Park", description: "Great for family bonding and jogging.", image: require("../../../assets/images/perez_park.jpg") },
    { title: "Lucena Public Market", description: "A bustling place to shop for local produce, seafood, and native delicacies.", image: require("../../../assets/images/lucena_public_market.webp") },
    { title: "Barangay Dalahican Seawall", description: "A relaxing spot to watch the sunset and feel the sea breeze.", image: require("../../../assets/images/dalahican_seawall.webp") },
    { title: "Quezon Provincial Capitol Grounds", description: "Open park space perfect for early morning walks and casual meetups.", image: require("../../../assets/images/capitol_grounds.webp") },
    { title: "Sacred Heart College Grounds", description: "A serene and well-maintained campus known for its peaceful vibe.", image: require("../../../assets/images/sacred_heart_college.jpg") },
    { title: "Lucena City Heritage Building", description: "A historical site that showcases the city's architectural charm and government history.", image: require("../../../assets/images/heritage_building.jpg") },
    { title: "Coco Mall Lucena", description: "A cozy place for shopping, coffee breaks, and small events.", image: require("../../../assets/images/coco_mall.jpg") },
    { title: "Red V Mango Farm (Barangay Ibabang Talim)", description: "A local gem known for its peaceful farm ambiance and mango trees.", image: require("../../../assets/images/red_v_farm.jpg") },
    { title: "Lucena City Convention Center", description: "A venue for city-wide events, expos, and community activities.", image: require("../../../assets/images/convention_center.jpg") },
    { title: "TwoStar Resort", description: "A family-friendly swimming resort within Lucena for weekend getaways.", image: require("../../../assets/images/twostar_resort.webp") },
    { title: "St. Ferdinand Parish Cathedral Plaza", description: "A peaceful public area right in front of the cathedral, perfect for quiet reflection.", image: require("../../../assets/images/cathedral_plaza.jpg") },
  ];

  const loadReadBenefits = async () => {
    const stored = await AsyncStorage.getItem("readBenefits");
    if (stored) setReadBenefits(JSON.parse(stored));
  };

  const saveReadBenefit = async (id: string) => {
    const updated = [...new Set([...readBenefits, id])];
    setReadBenefits(updated);
    await AsyncStorage.setItem("readBenefits", JSON.stringify(updated));
  };

  const fetchBenefits = async () => {
    try {
      const benefitsQuery = query(collection(db, "benefits"), orderBy("timestamp", "desc"));
      const snapshot = await getDocs(benefitsQuery);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBenefits(data);
    } catch (err) {
      console.error("Error fetching benefits:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBenefits();
    loadReadBenefits();
  }, []);

  const openBenefit = (item: any) => {
    setSelectedBenefit(item);
    saveReadBenefit(item.id);
    setModalVisible(true); // ✅ FIX: Open modal when benefit clicked
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#DAA520" />
        <Text style={{ marginTop: 8, color: "#444" }}>Loading benefits...</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header Image */}
        <View style={styles.fullWidthWrapper}>
          <View style={styles.headerImageFullWidth}>
            <Image source={require("../../../assets/images/lucenaarialview.png")} style={styles.headerImage} resizeMode="cover" />
            <LinearGradient colors={["transparent", "#FFF9E4"]} style={styles.fadeEffect} />
          </View>
        </View>

        {/* Officials */}
        <Text style={styles.sectionTitle}>Lucena City {"\n"} Officials</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {officials.map((official, index) => (
            <View key={index} style={styles.officialCard}>
              <Image source={official.image} style={styles.officialImage} />
              <Text style={styles.officialName}>{official.name}</Text>
              <Text style={styles.officialPosition}>{official.position}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Sceneries */}
        <Text style={styles.sectionTitle}>The Beauty of {"\n"} Lucena</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {sceneries.map((scene, index) => (
            <View key={index} style={styles.sceneryCard}>
              <Image source={scene.image} style={styles.sceneryImage} />
              <Text style={styles.sceneryTitle}>{scene.title}</Text>
              <Text style={styles.sceneryDesc}>{scene.description}</Text>
            </View>
          ))}
        </ScrollView>

        {/* FAQ */}
        <View style={styles.faqContainer}>
          <Text style={styles.faqTitle}>FAQ’s</Text>
          <Text style={styles.faqSubtitle}>Yellow Card Program</Text>
          <Text style={styles.faqText}>
            The government initiative is the “Womb to Tomb” Yellow Card Program,
            which provides health and hospitalization assistance to indigent
            residents and other benefits it offers.
          </Text>
          <TouchableOpacity style={styles.faqButton} onPress={() => Linking.openURL("https://quezon.gov.ph/")}>
            <Text style={styles.faqButtonText}>View</Text>
          </TouchableOpacity>
          <Text style={styles.sourceLink} onPress={() => Linking.openURL("https://quezon.gov.ph/")}>
            • City Government of Lucena • https://quezon.gov.ph/
          </Text>

     </View>

<View style={styles.faqContainer}>
  <Text style={styles.faqTitle}>Lucena City</Text>
  <Text style={styles.faqSubtitle}>About Lucena City</Text>
  <Text style={styles.faqText}>
    Lucena City, the capital of Quezon Province, is known as the "Cocopalm
    City of the South" for its rich coconut industry. It serves as a major
    commercial hub in Southern Luzon, offering a blend of urban conveniences
    and cultural heritage, including the vibrant Pasayahan sa Lucena
    festival.
  </Text>
  <TouchableOpacity
    style={styles.faqButton}
    onPress={() => Linking.openURL("https://lgu.lucenacity.gov.ph/")}
  >
    <Text style={styles.faqButtonText}>View</Text>
  </TouchableOpacity>
  <Text
    style={styles.sourceLink}
    onPress={() =>
      Linking.openURL("https://lgu.lucenacity.gov.ph/")
    }
  >
    • City Government of Lucena • https://lgu.lucenacity.gov.ph/
  </Text>
</View>

        {/* Latest Benefits */}
        <Text style={styles.sectionTitle}>Latest Benefits</Text>
        {benefits.length === 0 ? (
          <Text style={styles.noPostsText}>No benefit posts available.</Text>
        ) : (
          benefits.map((item) => {
            const isRead = readBenefits.includes(item.id);
            return (
              <View key={item.id} style={styles.benefitCard}>
                <View style={styles.benefitCardHeader}>
                  <Text style={styles.benefitTitleText}>
                    {item.title || "No Title"}
                  </Text>
                  <TouchableOpacity onPress={() => openBenefit(item)}>
                    <Text style={styles.viewLink}>View</Text>
                  </TouchableOpacity>
                </View>
                {item.category && (
                  <Text style={styles.benefitCategoryText}>
                    Category: {item.category}
                  </Text>
                )}
                {item.content && (
                  <Text
                    style={styles.benefitPreview}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {item.content}
                  </Text>
                )}
                <Text style={isRead ? styles.readLink : styles.unreadLink}>
                  {isRead ? "Read" : "Unread"}
                </Text>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedBenefit?.title || "No Title"}
            </Text>
            {selectedBenefit?.category && (
              <Text style={styles.modalCategory}>
                Category: {selectedBenefit.category}
              </Text>
            )}
            <ScrollView style={styles.modalBody}>
              <Text style={styles.modalText}>
                {selectedBenefit?.content || "No Content"}
              </Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF9E4", paddingHorizontal: 16 },
  fullWidthWrapper: { marginHorizontal: -16 },
  headerImageFullWidth: { width: "100%", height: 220, overflow: "hidden" },
  headerImage: { width: "100%", height: "100%" },
  
  fadeEffect: {
    position: "absolute",
    width: "100%",
    height: "100%",
    bottom: 0,
  },
  
  sectionTitle: { fontSize: 40, fontWeight: "bold", color: "#DDA231", textAlign: "center", marginVertical: 16, marginBottom: 35 },
  officialCard: { width: 180, marginRight: 12, alignItems: "center", backgroundColor: "#fff", padding: 12, borderRadius: 12, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  officialImage: { width: 100, height: 120, borderRadius: 8, resizeMode: "cover" },
  officialName: { marginTop: 10, fontWeight: "600", fontSize: 14, textAlign: "center", color: "#222" },
  officialPosition: { fontSize: 12, color: "#666", textAlign: "center" },
  sceneryCard: { width: 200, marginRight: 12, backgroundColor: "#fff", borderRadius: 12, padding: 10, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  sceneryImage: { width: "100%", height: 100, borderRadius: 8, resizeMode: "cover" },
  sceneryTitle: { marginTop: 8, fontWeight: "bold", fontSize: 14, color: "#000" },
  sceneryDesc: { fontSize: 12, color: "#555", marginTop: 4, lineHeight: 18 },
  faqContainer: { backgroundColor: "#fff", borderRadius: 12, padding: 16, marginTop: 20, marginBottom: 28, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 6, elevation: 3 },
  faqTitle: { fontSize: 18, fontWeight: "bold", color: "#000" },
  faqSubtitle: { fontSize: 15, color: "#555", marginTop: 6, fontWeight: "600" },
  faqText: { fontSize: 14, color: "#444", marginTop: 10, lineHeight: 20 },
  faqButton: { borderColor: "#007BFF", borderWidth: 1, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16, alignSelf: "flex-end", marginTop: 12 },
  faqButtonText: { color: "#007BFF", fontWeight: "600", fontSize: 14 },
  sourceLink: { color: "#007AFF", fontSize: 13, marginTop: 10, textDecorationLine: "underline" },
  benefitCard: { backgroundColor: "#fff", borderRadius: 12, padding: 12, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  benefitCardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  benefitTitleText: { fontWeight: "bold", fontSize: 16, color: "#000" },
  viewLink: { color: "#007BFF", fontWeight: "600" },
  benefitCategoryText: { fontSize: 13, color: "#555", marginTop: 4 },
  benefitPreview: { fontSize: 13, color: "#333", marginTop: 6, marginBottom: 8 },
  readLink: { color: "green", fontWeight: "bold", fontSize: 13 },
  
  unreadLink: {
    color: "red",
    fontWeight: "bold",
    fontSize: 13,
  },modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.5)",
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 20, // gives breathing room on smaller screens
},
modalContent: {
  backgroundColor: "#fff",
  borderRadius: 16, // smoother corners
  paddingHorizontal: 20,
  paddingVertical: 24, // slightly more vertical padding for balance
  width: "90%",
  maxHeight: "75%",
  elevation: 6,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
},
modalTitle: {
  fontWeight: "bold",
  fontSize: 20,
  marginBottom: 12,
  textAlign: "left", // makes it look cleaner
  color: "#333",
},
modalCategory: {
  fontSize: 15,
  color: "#777",
  marginBottom: 14,
  textAlign: "left",
},
modalBody: {
  marginBottom: 16,
},
modalText: {
  fontSize: 17,
  color: "#161616ff",
  lineHeight: 25,

  //textAlign: "justify", // makes paragraph text look cleaner
},
closeButton: {
  backgroundColor: "#DDA231",
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 10,
  alignItems: "center",
  marginTop: 8,
},
closeButtonText: {
  color: "#fff",
  fontWeight: "600",
  fontSize: 16,
},
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  noPostsText: { textAlign: "center", marginTop: 20, fontStyle: "italic", color: "#888" },
});

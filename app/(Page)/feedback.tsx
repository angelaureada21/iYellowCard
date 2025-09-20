import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { auth, db } from '../../firebase.client';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';

export default function Feedback() {
  const [feedback, setFeedback] = useState('');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fullName, setFullName] = useState('');
  const [loadingUser, setLoadingUser] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoadingUser(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFullName(userData.fullName || '');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUserData();
  }, []);

  const openSubmitModal = () => {
    if (!feedback.trim()) {
      return alert('Please enter your comments.');
    }
    setShowSubmitModal(true);
  };

  const confirmSubmit = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert('You must be logged in to send feedback.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'feedbacks'), {
        uid: user.uid,
        email: user.email || '',
        fullName: fullName,
        message: feedback,
        createdAt: serverTimestamp(),
      });

      setFeedback('');
      setShowSubmitModal(false);
      alert('Feedback sent successfully!');
      router.back();
    } catch (error) {
      console.error('Error sending feedback:', error);
      alert('Could not send feedback.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelSubmit = () => setShowSubmitModal(false);

  const openCancelModal = () => {
    if (!feedback.trim()) {
      return alert('There is no feedback to cancel.');
    }
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    setFeedback('');
    setShowCancelModal(false);
  };

  const cancelCancel = () => setShowCancelModal(false);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.header}>Feedback Form</Text>

        {loadingUser ? (
          <ActivityIndicator size="large" color="#000" />
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={fullName}
              onChangeText={setFullName}
              editable={true}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={auth.currentUser?.email || ''}
              editable={false}
            />
          </>
        )}

        <TextInput
          style={[styles.input, { height: 120 }]}
          placeholder="Add your comments..."
          value={feedback}
          onChangeText={setFeedback}
          multiline
          textAlignVertical="top"
        />

        <View style={styles.buttonRow}>
          <Button title="Cancel" color="gray" onPress={openCancelModal} />
          <Button title="Submit" onPress={openSubmitModal} disabled={isSubmitting} />
        </View>

        {/* Submit Modal */}
        <Modal transparent visible={showSubmitModal} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalText}>Do you want to submit this feedback?</Text>
              <View style={styles.modalButtons}>
                <Button title="Yes" onPress={confirmSubmit} disabled={isSubmitting} />
                <Button title="No" onPress={cancelSubmit} color="gray" />
              </View>
            </View>
          </View>
        </Modal>

        {/* Cancel Modal */}
        <Modal transparent visible={showCancelModal} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalText}>Do you want to cancel your feedback?</Text>
              <View style={styles.modalButtons}>
                <Button title="Yes" onPress={confirmCancel} />
                <Button title="No" onPress={cancelCancel} color="gray" />
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFF6E5',
    flexGrow: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 10,
    width: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

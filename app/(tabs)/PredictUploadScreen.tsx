import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import apiClient from '../services/api';

const PredictUploadScreen: React.FC = () => {
  const [siteName, setSiteName] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    // Request permission if not already granted
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'You need to enable permissions to select an image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImage(result.assets[0].uri); // Safely access the URI
    }
  };

  const uploadPrediction = async () => {
    if (!image || !siteName || !location) {
      Alert.alert('Error', 'Please fill in all fields and select an image.');
      return;
    }

    const formData = new FormData();
    formData.append('image', {
      uri: image,
      name: 'prediction.jpg',
      type: 'image/jpeg',
    } as any); // Explicitly cast to resolve TypeScript issues
    formData.append('site_name', siteName);
    formData.append('location', location);

    try {
      const response = await apiClient.post('predict/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Prediction uploaded successfully!');
        setSiteName('');
        setLocation('');
        setImage(null);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to upload prediction.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Site Name</Text>
      <TextInput
        style={styles.input}
        value={siteName}
        onChangeText={setSiteName}
        placeholder="Enter site name"
      />

      <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        placeholder="Enter location"
      />

      <TouchableOpacity onPress={pickImage} style={styles.button}>
        <Text style={styles.buttonText}>Pick an Image</Text>
      </TouchableOpacity>

      {image && (
        <Image
          source={{ uri: image }}
          style={styles.imagePreview}
        />
      )}

      <TouchableOpacity onPress={uploadPrediction} style={styles.uploadButton}>
        <Text style={styles.uploadButtonText}>Upload Prediction</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontWeight: 'bold', marginVertical: 10 },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    padding: 10, 
    borderRadius: 5, 
    marginBottom: 10 
  },
  button: { 
    backgroundColor: '#007bff', 
    padding: 10, 
    borderRadius: 5, 
    marginVertical: 10 
  },
  buttonText: { color: '#fff', textAlign: 'center' },
  imagePreview: { 
    width: '100%', 
    height: 200, 
    borderRadius: 10, 
    marginVertical: 10 
  },
  uploadButton: { 
    backgroundColor: '#28a745', 
    padding: 10, 
    borderRadius: 5, 
    marginTop: 20 
  },
  uploadButtonText: { 
    color: '#fff', 
    textAlign: 'center', 
    fontWeight: 'bold' 
  },
});

export default PredictUploadScreen;

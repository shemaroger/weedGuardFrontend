import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import apiClient from '../services/api';

const PredictUploadScreen = () => {
  const [siteName, setSiteName] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri);
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
    });
    formData.append('site_name', siteName);
    formData.append('location', location);

    try {
      const response = await apiClient.post('predict/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      Alert.alert('Success', 'Prediction uploaded successfully!');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to upload prediction.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Site Name</Text>
      <TextInput style={styles.input} value={siteName} onChangeText={setSiteName} placeholder="Enter site name" />
      
      <Text style={styles.label}>Location</Text>
      <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="Enter location" />

      <TouchableOpacity onPress={pickImage} style={styles.button}>
        <Text style={styles.buttonText}>Pick an Image</Text>
      </TouchableOpacity>

      {image && <Text style={styles.preview}>Image Selected</Text>}

      <Button title="Upload Prediction" onPress={uploadPrediction} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontWeight: 'bold', marginVertical: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5 },
  button: { backgroundColor: '#007bff', padding: 10, borderRadius: 5, marginVertical: 10 },
  buttonText: { color: '#fff', textAlign: 'center' },
  preview: { marginVertical: 10, fontStyle: 'italic' },
});

export default PredictUploadScreen;

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator'; // Import image manipulator
import apiClient from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PredictUploadScreen: React.FC<{ farmerId: string }> = ({ farmerId }) => {
  const [siteName, setSiteName] = useState<string>('');
  const [location, setLocation] = useState<string>('Fetching location...');
  const [image, setImage] = useState<string | null>(null);
  const [imageSource, setImageSource] = useState<'camera' | 'gallery' | null>(null); // New state for image source
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [predictionResult, setPredictionResult] = useState<string | null>(null);

  // Fetch location on initial load
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission Denied',
            'Location permission is required to set your current location.'
          );
          setLocation('Permission denied');
          return;
        }

        const { coords } = await Location.getCurrentPositionAsync({});
        setLatitude(coords.latitude);
        setLongitude(coords.longitude);
        setLocation(`Lat: ${coords.latitude}, Lon: ${coords.longitude}`);
      } catch (error) {
        console.error('Error fetching location:', error);
        setLocation('Unable to fetch location');
      }
    };

    fetchLocation();
  }, []);

  // Handle image picker (gallery)
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        'Permission Denied',
        'You need to enable permissions to select an image.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const resizedImage = await resizeImage(result.assets[0].uri);
      setImage(resizedImage);
      setImageSource('gallery'); // Set the image source to gallery
    }
  };

  // Handle camera input
  const takePicture = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'You need to enable permissions to use the camera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const resizedImage = await resizeImage(result.assets[0].uri);
      setImage(resizedImage);
      setImageSource('camera'); // Set the image source to camera
    }
  };

  // Function to resize the image
  const resizeImage = async (uri: string) => {
    try {
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }], // Resize image to width of 800px, height will adjust proportionally
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      return manipResult.uri;
    } catch (error) {
      console.error('Error resizing image:', error);
      return uri; // Return the original URI if resizing fails
    }
  };

  // Handle map press to set custom coordinates
  const handleMapPress = (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setLatitude(latitude);
    setLongitude(longitude);
    setLocation(`Lat: ${latitude}, Lon: ${longitude}`);
  };

  // Upload prediction to backend
  const uploadPrediction = async () => {
    if (!image || !siteName || !location || location === 'Fetching location...') {
      Alert.alert('Error', 'Please fill in all fields and select an image.');
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('image', {
      uri: image,
      name: 'prediction.jpg',
      type: 'image/jpeg',
    } as any);
    formData.append('site_name', siteName);
    formData.append('location', location);
    formData.append('farmer_id', farmerId);

    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await apiClient.post('predict/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: token ? `Bearer ${token}` : '',
        },
      });

      if (response.status === 201) {
        const data = response.data;
        // Set the prediction result to state
        setPredictionResult(data.result);

        // Display success message with prediction details
        Alert.alert(
          'Success',
          `Prediction uploaded successfully!\nResult: ${data.result}\nLocation: ${data.location}\nSite Name: ${data.site_name}`
        );

        // Reset form fields
        setSiteName('');
        setLocation('Fetching location...');
        setImage(null);
      } else {
        throw new Error(response.data.error || 'Unknown error occurred');
      }
    } catch (error: any) {
      console.error('Upload Error:', error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to upload prediction.');
    } finally {
      setIsLoading(false);
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
      <Text style={styles.locationText}>{location}</Text>

      <MapView
        style={styles.map}
        region={{
          latitude: latitude || 37.78825,
          longitude: longitude || -122.4324,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onPress={handleMapPress}
      >
        {latitude && longitude && <Marker coordinate={{ latitude, longitude }} />}
      </MapView>

      <TouchableOpacity onPress={pickImage} style={styles.button}>
        <Text style={styles.buttonText}>Pick an Image</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={takePicture} style={styles.button}>
        <Text style={styles.buttonText}>Take a Picture</Text>
      </TouchableOpacity>

      {image && (
        <View
          style={[
            styles.filePreview,
            imageSource === 'camera' || imageSource === 'gallery' ? styles.greenBorder : {},
          ]}
        >
          <Text style={styles.fileText}>File: {image.split('/').pop()}</Text>
        </View>
      )}

      <TouchableOpacity
        onPress={uploadPrediction}
        style={[styles.uploadButton, isLoading && styles.disabledButton]}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.uploadButtonText}>Upload Prediction</Text>
        )}
      </TouchableOpacity>

      {predictionResult && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Prediction Result:</Text>
          <Text style={styles.resultText}>{predictionResult}</Text>
        </View>
      )}
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
    marginBottom: 10,
  },
  locationText: {
    marginVertical: 10,
    color: '#555',
    fontSize: 16,
  },
  map: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16 },
  filePreview: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  fileText: { fontSize: 16 },
  greenBorder: {
    borderColor: 'green',
    borderWidth: 3,
  },
  uploadButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  disabledButton: { backgroundColor: '#ddd' },
  uploadButtonText: { color: '#fff', fontSize: 16 },
  resultContainer: {
    marginTop: 20,
    backgroundColor: '#f4f4f4',
    padding: 10,
    borderRadius: 5,
  },
  resultTitle: { fontWeight: 'bold', fontSize: 18 },
  resultText: { fontSize: 16, color: '#333' },
});

export default PredictUploadScreen;

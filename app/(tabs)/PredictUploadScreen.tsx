import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Image } from 'react-native';
import apiClient from '../services/api';

interface PredictUploadScreenProps {
  farmerId: string;
  onPredictionComplete?: (result: string) => void;
  onAuthError?: () => void;
}

const PredictUploadScreen: React.FC<PredictUploadScreenProps> = ({
  farmerId,
  onPredictionComplete,
  onAuthError,
}) => {
  const [siteName, setSiteName] = useState<string>('');
  const [location, setLocation] = useState<{
    latitude: number | null;
    longitude: number | null;
    description: string;
  }>({
    latitude: null,
    longitude: null,
    description: 'Fetching location...',
  });
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [predictionResult, setPredictionResult] = useState<string | null>(null);

  // Fetch current location
  const fetchCurrentLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocation((prev) => ({
          ...prev,
          description: 'Location permission denied',
        }));
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      const locationDescription =
        reverseGeocode.length > 0
          ? `${reverseGeocode[0].city}, ${reverseGeocode[0].region}`
          : `Lat: ${coords.latitude.toFixed(4)}, Lon: ${coords.longitude.toFixed(4)}`;

      setLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
        description: locationDescription,
      });
    } catch (error) {
      console.error('Location fetch error:', error);
      setLocation((prev) => ({
        ...prev,
        description: 'Unable to fetch location',
      }));
    }
  }, []);

  useEffect(() => {
    fetchCurrentLocation();
  }, [fetchCurrentLocation]);

  // Request media library permission
  const requestMediaPermission = useCallback(async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      return status === 'granted';
    }
    return true;
  }, []);

  // Request camera permission
  const requestCameraPermission = useCallback(async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      return status === 'granted';
    }
    return true;
  }, []);

  // Resize the selected image
  const resizeImage = useCallback(async (uri: string) => {
    try {
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      return manipResult.uri;
    } catch (error) {
      console.error('Image resize error:', error);
      return uri;
    }
  }, []);

  // Pick an image from the gallery
  const pickImage = useCallback(async () => {
    const hasPermission = await requestMediaPermission();
    if (!hasPermission) {
      Alert.alert('Permission', 'Gallery access is required to select an image.');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Corrected
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const resizedImage = await resizeImage(result.assets[0].uri);
        setImage(resizedImage);
      }
    } catch (error) {
      console.error('Image pick error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  }, [requestMediaPermission, resizeImage]);

  // Take a picture using the camera
  const takePicture = useCallback(async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Permission', 'Camera access is required to take a picture.');
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Corrected
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const resizedImage = await resizeImage(result.assets[0].uri);
        setImage(resizedImage);
      }
    } catch (error) {
      console.error('Camera capture error:', error);
      Alert.alert('Error', 'Failed to capture image');
    }
  }, [requestCameraPermission, resizeImage]);

  // Upload the prediction
  const uploadPrediction = useCallback(async () => {
    if (!image || !siteName || !location.description) {
      Alert.alert('Validation', 'Please complete all fields and select an image.');
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', {
        uri: image,
        name: 'prediction.jpg',
        type: 'image/jpeg',
      } as any);
      formData.append('site_name', siteName);
      formData.append('location', location.description);
      formData.append('latitude', location.latitude?.toString() || '');
      formData.append('longitude', location.longitude?.toString() || '');
      formData.append('farmer_id', farmerId);

      const response = await apiClient.post('predict/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const data = response.data;
      setPredictionResult(data.result);
      onPredictionComplete?.(data.result);

      Alert.alert(
        'Prediction Success',
        `Result: ${data.result}\nLocation: ${data.location}\nSite: ${data.site_name}`
      );

      // Reset form
      setSiteName('');
      setImage(null);
    } catch (error: any) {
      console.error('Upload Error:', error);

      if (error.response) {
        switch (error.response.status) {
          case 401:
            Alert.alert(
              'Authentication Error',
              'Your session has expired. Please log in again.',
              [{ text: 'OK', onPress: () => onAuthError?.() }]
            );
            break;
          case 400:
            Alert.alert('Upload Failed', error.response.data.detail || 'Invalid request');
            break;
          case 500:
            Alert.alert('Server Error', 'An internal server error occurred');
            break;
          default:
            Alert.alert('Error', `Server responded with status: ${error.response.status}`);
        }
      } else if (error.request) {
        Alert.alert('Network Error', 'No response from server. Check your connection.');
      } else {
        Alert.alert('Error', error.message || 'An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  }, [image, siteName, location, farmerId, onPredictionComplete, onAuthError]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Plant Detection</Text>

      <TextInput
        style={styles.input}
        value={siteName}
        onChangeText={setSiteName}
        placeholder="Site Name"
      />

      <Text style={styles.locationLabel}>Current Location</Text>
      <Text style={styles.locationText}>{location.description}</Text>

      <MapView
        style={styles.map}
        region={{
          latitude: location.latitude || 37.78825,
          longitude: location.longitude || -122.4324,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {location.latitude && location.longitude && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
          />
        )}
      </MapView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
          <Text style={styles.buttonText}>Select Image</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={takePicture}>
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>
      </View>

      {image && (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: image }} style={styles.imagePreview} />
        </View>
      )}

      <TouchableOpacity
        style={[styles.uploadButton, (isLoading || !image) && styles.disabledButton]}
        onPress={uploadPrediction}
        disabled={isLoading || !image}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.uploadButtonText}>Upload Prediction</Text>
        )}
      </TouchableOpacity>

      {predictionResult && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Prediction Result</Text>
          <Text style={styles.resultText}>{predictionResult}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: 'white',
  },
  locationLabel: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  locationText: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  map: {
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  actionButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    flex: 0.48,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  imagePreviewContainer: {
    marginBottom: 15,
    alignItems: 'center',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  uploadButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  uploadButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e0ffe0',
    borderRadius: 10,
  },
  resultTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 16,
  },
  resultText: {
    fontSize: 14,
  },
});

export default PredictUploadScreen;
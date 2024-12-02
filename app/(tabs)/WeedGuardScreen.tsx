import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  ScrollView 
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { Camera } from 'expo-camera';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

interface LocationState extends Region {
  latitude: number;
  longitude: number;
}

const WeedGuardScreen: React.FC = () => {
  const [location, setLocation] = useState<LocationState | null>(null);
  const [siteName, setSiteName] = useState<string>('');
  const [farmerName, setFarmerName] = useState<string>('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [submitDisabled, setSubmitDisabled] = useState<boolean>(true);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  
  const cameraRef = useRef<typeof Camera | null>(null);

  // Request permissions and fetch location
  useEffect(() => {
    (async () => {
      // Camera permission
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus === 'granted');

      // Location permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMessage('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  // Capture image
  const captureImage = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      const manipulatedImage = await manipulateAsync(
        photo.uri,
        [{ resize: { width: 800 } }], 
        { compress: 1, format: SaveFormat.PNG }
      );
      setImageUri(manipulatedImage.uri);
      await validateGreenColor(manipulatedImage.uri);
    }
  };

  // Validate green color 
  const validateGreenColor = async (uri: string): Promise<void> => {
    try {
      const result = await validateImageGreenness(uri);
      if (result) {
        setErrorMessage('');
        setSubmitDisabled(false);
      } else {
        setErrorMessage('Image lacks sufficient green color!');
        setSubmitDisabled(true);
      }
    } catch (error) {
      setErrorMessage('Image validation failed');
      setSubmitDisabled(true);
    }
  };

  // Simplified green color validation
  const validateImageGreenness = async (uri: string): Promise<boolean> => {
    // Placeholder for more advanced image processing
    try {
      const manipulatedImage = await manipulateAsync(
        uri,
        [{ resize: { width: 100, height: 100 } }],
        { compress: 1, format: SaveFormat.PNG }
      );
      
      // More sophisticated green detection would go here
      return true; // Modify this with actual validation logic
    } catch (error) {
      console.error('Green validation error:', error);
      return false;
    }
  };

  const handleSubmit = () => {
    if (!submitDisabled && location) {
      // Implement submission logic
      console.log('Submitting:', {
        location: {
          latitude: location.latitude,
          longitude: location.longitude
        },
        siteName,
        farmerName,
        imageUri
      });
    }
  };

  if (!location) {
    return (
      <View style={styles.container}>
        <Text>Loading location...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>WeedGuard - Location and Image Analysis</Text>

      {/* Map View */}
      <MapView
        style={styles.map}
        initialRegion={location}
      >
        <Marker coordinate={location} />
      </MapView>

      {/* Form */}
      <View style={styles.formContainer}>
        <Text style={styles.label}>Coordinates:</Text>
        <TextInput
          style={styles.input}
          value={`${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`}
          editable={false}
        />

        <Text style={styles.label}>Site Name:</Text>
        <TextInput
          style={styles.input}
          value={siteName}
          onChangeText={setSiteName}
          placeholder="Enter site name"
        />

        <Text style={styles.label}>Farmer Name:</Text>
        <TextInput
          style={styles.input}
          value={farmerName}
          onChangeText={setFarmerName}
          placeholder="Enter farmer's name"
        />

        {/* Camera Component */}
        {hasCameraPermission ? (
          <View style={styles.cameraContainer}>
            <Camera 
              style={styles.camera} 
              ref={cameraRef}
              type={Camera.Constants.Type.back}
            />
            <TouchableOpacity 
              style={styles.captureButton} 
              onPress={captureImage}
            >
              <Text style={styles.captureButtonText}>Capture Image</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text>No camera access</Text>
        )}

        {/* Captured Image Preview */}
        {imageUri && (
          <Image 
            source={{ uri: imageUri }} 
            style={styles.imagePreview} 
          />
        )}

        {/* Error Message */}
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, submitDisabled && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={submitDisabled}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>© 2024 WeedGuard. All Rights Reserved.</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#0056b3',
  },
  map: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
  formContainer: {
    width: '100%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingLeft: 8,
    marginBottom: 20,
    fontSize: 14,
    color: '#333',
  },
  cameraContainer: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    position: 'relative',
  },
  camera: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  captureButton: {
    position: 'absolute',
    bottom: 10,
    left: '50%',
    transform: [{ translateX: -40 }],
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
  },
  captureButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    marginTop: 20,
    fontSize: 12,
    color: '#555',
  },
});

export default WeedGuardScreen;

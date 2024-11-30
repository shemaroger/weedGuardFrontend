import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';

const WeedGuardScreen = () => {
  const [cameraPermission, setCameraPermission] = useState<string>('Unknown');
  const [locationPermission, setLocationPermission] = useState<string>('Unknown');

  // Function to check camera permission
  const checkCameraPermission = async () => {
    const result = await check(PERMISSIONS.ANDROID.CAMERA); // Adjust for iOS if needed
    handlePermissionResult(result, setCameraPermission);
  };

  // Function to check location permission
  const checkLocationPermission = async () => {
    const result = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION); // Adjust for iOS if needed
    handlePermissionResult(result, setLocationPermission);
  };

  // Function to request a specific permission
  const requestPermission = async (permission: string, setPermission: React.Dispatch<React.SetStateAction<string>>) => {
    const result = await request(permission as any); // Typecast required
    handlePermissionResult(result, setPermission);
  };

  // Handle permission results
  const handlePermissionResult = (result: string, setPermission: React.Dispatch<React.SetStateAction<string>>) => {
    switch (result) {
      case RESULTS.UNAVAILABLE:
        setPermission('Unavailable');
        Alert.alert('Permission unavailable on this device');
        break;
      case RESULTS.DENIED:
        setPermission('Denied');
        Alert.alert('Permission denied');
        break;
      case RESULTS.LIMITED:
        setPermission('Limited');
        Alert.alert('Permission limited');
        break;
      case RESULTS.GRANTED:
        setPermission('Granted');
        Alert.alert('Permission granted');
        break;
      case RESULTS.BLOCKED:
        setPermission('Blocked');
        Alert.alert('Permission blocked. Please enable it in settings.');
        break;
      default:
        setPermission('Unknown');
        Alert.alert('Unknown permission status');
        break;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>WeedGuard Permissions</Text>

      {/* Camera Permission */}
      <View style={styles.section}>
        <Text>Camera Permission: {cameraPermission}</Text>
        <Button
          title="Check Camera Permission"
          onPress={checkCameraPermission}
        />
        <Button
          title="Request Camera Permission"
          onPress={() =>
            requestPermission(PERMISSIONS.ANDROID.CAMERA, setCameraPermission)
          }
        />
      </View>

      {/* Location Permission */}
      <View style={styles.section}>
        <Text>Location Permission: {locationPermission}</Text>
        <Button
          title="Check Location Permission"
          onPress={checkLocationPermission}
        />
        <Button
          title="Request Location Permission"
          onPress={() =>
            requestPermission(
              PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
              setLocationPermission
            )
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
    width: '100%',
  },
});

export default WeedGuardScreen;

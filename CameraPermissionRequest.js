// CameraPermissionRequest.js

import React, { useEffect } from 'react';
import { PermissionsAndroid, Text, Button, View } from 'react-native';
import { request, PERMISSIONS } from 'react-native-permissions';

const CameraPermissionRequest = () => {
  // Function to request permission
  const requestPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'We need access to your camera',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission granted');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  // Request permission when component mounts
  useEffect(() => {
    requestPermission();
  }, []);

  return (
    <View>
      <Text>Request Camera Permission</Text>
      <Button title="Request Permission" onPress={requestPermission} />
    </View>
  );
};

export default CameraPermissionRequest;
